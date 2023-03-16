package ws

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/alphadose/haxmap"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"golang.org/x/exp/slog"
)

var (
	ErrLeavingOwnRoom     = errors.New("trying to leave own room")
	ErrLeavingGloabalRoom = errors.New("client trying to leave global room")
)

type Client struct {
	ID        string
	Manager   *Manager
	Conn      *websocket.Conn
	Rooms     *haxmap.Map[string, *Room]
	logger    *slog.Logger
	sendCh    chan *Packet
	receiveCh chan *Packet
	quitCh    chan struct{}
}

func NewClient(conn *websocket.Conn, cID string, m *Manager) *Client {
	c := &Client{
		ID:        cID,
		Manager:   m,
		Conn:      conn,
		Rooms:     haxmap.New[string, *Room](),
		logger:    slog.With("client", cID),
		sendCh:    make(chan *Packet, 10),
		receiveCh: make(chan *Packet, 10),
		quitCh:    make(chan struct{}),
	}

	go c.write()
	go c.read()

	return c
}

func (c *Client) write() {
	for p := range c.sendCh {
		if err := c.Conn.WriteJSON(p); err != nil {
			c.logger.Error("write packet", err)
		}
	}
}

func (c *Client) send(p *Packet) {
	c.sendCh <- p
}

func (c *Client) read() {
	go c.receive()

	for {
		p := &Packet{}
		err := c.Conn.ReadJSON(p)
		if err != nil {
			var syntaxError *json.SyntaxError
			if errors.As(err, &syntaxError) {
				c.logger.Info("json syntax error in packet", syntaxError)
				continue
			}
			c.quitCh <- struct{}{}
			return
		}

		c.receiveCh <- p
	}
}

func (c *Client) receive() {
	for p := range c.receiveCh {
		c.logger.Info("received packet", "event", p.Event)
		if err := c.handlePacket(p); err != nil {
			c.logger.Error("handlePacket", err)
			errPacket, err := NewErrorPacket(err)
			if err != nil {
				c.logger.Error("new error packet", err)
			}
			c.send(errPacket)
		}
		c.Manager.logger.Info("rooms remaining", "rooms", c.Manager.Rooms.Len())
	}
}

func (c *Client) handlePacket(p *Packet) error {
	switch p.Event {
	case ClientEventNoEvent:
		c.logger.Info("received packet with no action")
	case ClientEventChatMessage:
		return c.HandleChatMessage(p)
	case ClientEventJoinRoom:
		return c.HandleJoinRoomRequest(p)
	case ClientEventJoinDMRoom:
		return c.HandleJoinDMRoomRequest(p)
	case ClientEventJoinGameRoom:
		return c.HandleJoinGameRoomRequest(p)
	case ClientEventCreateRoom:
		return c.HandleCreateRoomRequest(p)
	case ClientEventCreateGameRoom:
		return c.HandleCreateGameRequest(p)
	case ClientEventLeaveRoom:
		return c.HandleLeaveRoomRequest(p)
	case ClientEventStartGame:
		return c.HandleStartGameRequest(p)
	case ClientEventPlayMove:
		return c.PlayMove(p)
	case ClientEventIndice:
		return c.HandleIndiceRequest(p)
	}

	return nil
}

func (c *Client) BroadcastToRoom(rID string, p *Packet) (*Room, error) {
	r, err := c.Manager.GetRoom(rID)
	if err != nil {
		return nil, fmt.Errorf("failed to get room: %w", err)
	}

	if !r.has(c.ID) {
		return nil, fmt.Errorf("%w %s", ErrNotInRoom, rID)
	}

	r.Broadcast(p)

	return r, nil
}

func (c *Client) HandleChatMessage(p *Packet) error {
	payload := ChatMessage{}
	if err := json.Unmarshal(p.Payload, &payload); err != nil {
		return fmt.Errorf("failed to unmarshal ChatMessage: %w", err)
	}
	payload.Timestamp = time.Now().UTC()
	slog.Info("room-message", "payload", payload)
	if err := p.setPayload(payload); err != nil {
		return err
	}

	r, err := c.BroadcastToRoom(payload.RoomID, p)
	if err != nil {
		return err
	}

	if err := r.Manager.MessageRepo.InsertOne(r.ID, &payload); err != nil {
		slog.Error("failed to insert message in db", err)
	}

	return nil
}

func (c *Client) HandleJoinRoomRequest(p *Packet) error {
	payload := JoinRoomPayload{}
	if err := json.Unmarshal(p.Payload, &payload); err != nil {
		return err
	}

	r, err := c.Manager.GetRoom(payload.RoomID)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if err := c.Manager.RoomSvc.Repo.AddUser(payload.RoomID, c.ID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to join room: "+err.Error())
	}
	if err := c.Manager.UserSvc.Repo.AddJoinedRoom(payload.RoomID, c.ID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to add user to room"+err.Error())
	}

	if err := r.AddClient(c.ID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return nil
}

func (c *Client) HandleJoinDMRoomRequest(p *Packet) error {
	payload := JoinDMPayload{}
	if err := json.Unmarshal(p.Payload, &payload); err != nil {
		return err
	}

	// Create room with both users in it
	roomName := fmt.Sprintf("%s/%s", payload.Username, payload.ToUsername)
	return createRoomWithUsers(c, roomName, payload.ToID)
}

func (c *Client) HandleJoinGameRoomRequest(p *Packet) error {
	payload := JoinRoomPayload{}
	if err := json.Unmarshal(p.Payload, &payload); err != nil {
		return err
	}

	r, err := c.Manager.GetRoom(payload.RoomID)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	// dbRoom, err := c.Manager.RoomSvc.Repo.Find(payload.RoomID)
	// if err != nil {
	// 	return fiber.NewError(fiber.StatusBadRequest, err.Error())
	// }

	// if dbRoom.IsProtected && !auth.PasswordsMatch(payload.Password, dbRoom.HashPassword) {
	// 	return fiber.NewError(fiber.StatusBadRequest, "wrong password")
	// }

	if err := c.Manager.RoomSvc.Repo.AddUser(payload.RoomID, c.ID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to join room: "+err.Error())
	}
	if err := r.AddClient(c.ID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return nil
}

func (c *Client) HandleCreateRoomRequest(p *Packet) error {
	payload := CreateRoomPayload{}
	if err := json.Unmarshal(p.Payload, &payload); err != nil {
		return err
	}

	err := createRoomWithUsers(c, payload.RoomName, payload.UserIDs...)
	if err != nil {
		return err
	}

	if err := c.Manager.UpdateChatRooms(); err != nil {
		slog.Error("send joinable games update:", err)
	}

	return nil
}

func (c *Client) HandleCreateGameRequest(p *Packet) error {
	payload := CreateGamePayload{}
	if err := json.Unmarshal(p.Payload, &payload); err != nil {
		return err
	}

	var err error
	if payload.Password != "" {
		_, err = c.Manager.GameSvc.NewProtected(c.ID, payload.Password)
	} else {
		_, err = c.Manager.GameSvc.New(c.ID)
	}
	if err != nil {
		return err
	}

	if err := c.Manager.UpdateJoinableGames(); err != nil {
		slog.Error("send joinable games update:", err)
	}

	return nil
}

func (c *Client) HandleLeaveRoomRequest(p *Packet) error {
	payload := LeaveRoomPayload{}
	if err := json.Unmarshal(p.Payload, &payload); err != nil {
		return err
	}

	if payload.RoomID == c.ID {
		return fiber.NewError(fiber.StatusBadRequest, "You cannot leave your own room")
	}
	if payload.RoomID == c.Manager.GlobalRoom.ID {
		return fiber.NewError(fiber.StatusBadRequest, "You cannot leave the global room")
	}

	r, err := c.Manager.GetRoom(payload.RoomID)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if err := c.Manager.RoomSvc.Repo.RemoveUser(payload.RoomID, c.ID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if err := c.Manager.UserSvc.LeaveRoom(payload.RoomID, c.ID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.Manager.RemoveClientFromRoom(c, r)
}

func (c *Client) HandleStartGameRequest(p *Packet) error {
	payload := StartGamePayload{}
	if err := json.Unmarshal(p.Payload, &payload); err != nil {
		return fiber.NewError(fiber.StatusUnprocessableEntity, "parse request: "+err.Error())
	}
	g, err := c.Manager.GameSvc.Repo.Find(payload.RoomID)
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Room not found")
	}
	if c.ID != g.CreatorID {
		return fiber.NewError(fiber.StatusForbidden, "You are not the room creator")
	}
	if g.ScrabbleGame != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Game already started")
	}

	err = c.Manager.GameSvc.StartGame(g)
	if err != nil {
		return err
	}

	r, err := c.Manager.GetRoom(g.ID)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "ws room not found: "+err.Error())
	}
	// Start game timer
	g.ScrabbleGame.Timer.OnTick(func() {
		timerPacket, err := NewTimerUpdatePacket(TimerUpdatePayload{
			Timer: g.ScrabbleGame.Timer.TimeRemaining(),
		})
		if err != nil {
			slog.Error("failed to create timer update packet:", err)
			return
		}
		r.Broadcast(timerPacket)
	})
	g.ScrabbleGame.Timer.OnDone(func() {
		g.ScrabbleGame.SkipTurn()
		gamePacket, err := NewGameUpdatePacket(GameUpdatePayload{
			Game: makeGamePayload(g),
		})
		if err != nil {
			slog.Error("failed to create game update packet:", err)
			return
		}
		r.Broadcast(gamePacket)

		// Make bots move if applicable
		go c.Manager.MakeBotMoves(g.ID)
	})
	g.ScrabbleGame.Timer.Start()

	gamePacket, err := NewGameUpdatePacket(GameUpdatePayload{
		Game: makeGamePayload(g),
	})
	if err != nil {
		return err
	}

	r.Broadcast(gamePacket)

	return nil
}

func (c *Client) PlayMove(p *Packet) error {
	payload := PlayMovePayload{}
	if err := json.Unmarshal(p.Payload, &payload); err != nil {
		return fmt.Errorf("failed to unmarshal PlayMovePayload: %w", err)
	}
	slog.Info("playMove", "payload", payload)

	g, err := c.Manager.GameSvc.ApplyPlayerMove(payload.GameID, c.ID, payload.MoveInfo)
	if err != nil {
		return err
	}

	gamePacket, err := NewGameUpdatePacket(GameUpdatePayload{
		Game: makeGamePayload(g),
	})
	if err != nil {
		return err
	}

	_, err = c.BroadcastToRoom(payload.GameID, gamePacket)
	if err != nil {
		return err
	}

	if g.ScrabbleGame.IsOver() {
		return c.Manager.HandleGameOver(g)
	}

	// Make bots move if applicable
	go c.Manager.MakeBotMoves(payload.GameID)

	return nil
}

func (c *Client) HandleIndiceRequest(p *Packet) error {
	payload := IndicePayload{}
	if err := json.Unmarshal(p.Payload, &payload); err != nil {
		return err
	}

	moves, err := c.Manager.GameSvc.GetIndices(payload.GameID)
	if err != nil {
		return err
	}

	response, err := NewServerIndicePacket(ServerIndicePayload{
		Moves: moves,
	})
	if err != nil {
		return err
	}

	c.send(response)

	return nil
}
