package game

import (
	"errors"
	"fmt"
	"strconv"

	"scrabble/pkg/api/room"
	"scrabble/pkg/api/user"
	"scrabble/pkg/scrabble"

	"github.com/google/uuid"
	"golang.org/x/exp/slog"
)

var (
	ErrNotPlayerTurn   = errors.New("not player's turn")
	ErrInvalidMove     = errors.New("invalid move")
	ErrInvalidPosition = errors.New("invalid position")
)

type Service struct {
	repo    *Repository
	UserSvc *user.Service
	Dict    *scrabble.Dictionary
	DAWG    *scrabble.DAWG
}

type Game struct {
	ID           string
	Players      []*scrabble.Player
	Board        *scrabble.Board
	Bag          *scrabble.Bag
	Finished     bool
	NumPassMoves int
}

func NewService(repo *Repository, userSvc *user.Service) *Service {
	dict := scrabble.NewDictionary()
	dawg := scrabble.NewDawg(dict)

	s := &Service{
		repo:    repo,
		UserSvc: userSvc,
		Dict:    dict,
		DAWG:    dawg,
	}

	return s
}

func (s *Service) StartGame(room *room.Room) (*Game, error) {
	humanPlayers := len(room.UserIDs)
	if humanPlayers < 2 {
		return nil, errors.New("must have at least 2 players")
	}
	botPlayers := 4 - humanPlayers
	slog.Info("Starting game", "room", room.ID, "human", humanPlayers, "ai", botPlayers)

	botNames := []string{"Bot1", "Bot2"}

	g := scrabble.NewGame(room.ID, s.DAWG, &scrabble.HighScore{})
	for _, uID := range room.UserIDs {
		u, err := s.UserSvc.GetUser(uID)
		if err != nil {
			return nil, err
		}
		g.AddPlayer(scrabble.NewPlayer(u.ID, u.Username, g.Bag))
	}
	for i := 0; i < botPlayers; i++ {
		g.AddPlayer(scrabble.NewPlayer(uuid.NewString(), botNames[i], g.Bag))
	}

	err := s.repo.Insert(g)
	if err != nil {
		return nil, err
	}

	return &Game{
		ID:           g.ID,
		Players:      g.Players,
		Board:        g.Board,
		Bag:          g.Bag,
		Finished:     g.Finished,
		NumPassMoves: g.NumPassMoves,
	}, nil
}

func (s *Service) ApplyPlayerMove(gID string, req PlayMoveRequest) error {
	g, err := s.repo.GetGame(gID)
	if err != nil {
		return err
	}
	player := g.PlayerToMove()
	if player.ID != req.PlayerID {
		return ErrNotPlayerTurn
	}

	var move scrabble.Move
	switch req.Type {
	case "tileMove":
		for _, letter := range req.Letters {
			if !player.Rack.Contains(letter) {
				return ErrInvalidMove
			}
		}
		covers := make(scrabble.Covers)
		for pos, c := range req.Covers {
			row, err := strconv.Atoi(string(pos[0]))
			if err != nil {
				return fmt.Errorf("invalid row: %w", err)
			}
			col, err := strconv.Atoi(string(pos[1]))
			if err != nil {
				return fmt.Errorf("invalid col: %w", err)
			}
			covers[scrabble.Position{Row: row, Col: col}] = c
		}
		move = scrabble.NewTileMove(g.Board, covers)
	case "pass":
		move = scrabble.NewPassMove()
	case "exchange":
		move = scrabble.NewExchangeMove(req.Letters)
	default:
		return fmt.Errorf("invalid move type: %s", req.Type)
	}

	if !move.IsValid(g) {
		return ErrInvalidMove
	}

	err = g.ApplyValid(move)
	if err != nil {
		// Should not happen because move is valid
		return fmt.Errorf("should not have ended up here. cannot apply move that was validated: %v", err)
	}

	// if g.IsOver() {
	// 	// Send end game results by ws
	// }

	return nil
}

// Not used, just for testing
// func (s *Service) simulateGame() {
// 	numGames := 10
// 	start := time.Now()

// 	var winsA, winsB int

// 	wg := &sync.WaitGroup{}
// 	for i := 0; i < numGames; i++ {
// 		wg.Add(1)
// 		go func() {
// 			g := scrabble.NewGame(s.DAWG, &scrabble.HighScore{})
// 			p1 := scrabble.NewPlayer(uuid.NewString(), "Alphonse", g.Bag)
// 			p2 := scrabble.NewPlayer(uuid.NewString(), "Sylvestre", g.Bag)
// 			g.Players[0], g.Players[1] = p1, p2

// 			for i := 0; ; i++ {
// 				state := g.State()
// 				move := g.Engine.GenerateMove(state)
// 				err := g.ApplyValid(move)
// 				if err != nil {
// 					fmt.Println(err)
// 				}
// 				if g.IsOver() {
// 					break
// 				}
// 			}
// 			scoreA, scoreB := g.Players[0].Score, g.Players[1].Score
// 			if scoreA > scoreB {
// 				fmt.Println("Robot A won")
// 				winsA++
// 			} else if scoreB > scoreA {
// 				fmt.Println("Robot B won")
// 				winsB++
// 			} else {
// 				fmt.Println("Draw")
// 			}
// 			wg.Done()
// 		}()
// 	}
// 	wg.Wait()

// 	elapsed := time.Since(start)
// 	fmt.Printf("%v games were played\nRobot A won %v games, and Robot B won %v games; %v games were draws.\n",
// 		numGames,
// 		winsA,
// 		winsB,
// 		numGames-winsA-winsB,
// 	)
// 	fmt.Println("Took", elapsed)
// }
