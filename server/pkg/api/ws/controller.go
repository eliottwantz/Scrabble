package ws

import (
	"strconv"
	"strings"

	"scrabble/pkg/api/user"

	"github.com/gofiber/fiber/v2"
)

type GetMessagesResponse struct {
	NextSkip int           `json:"nextSkip,omitempty"`
	HasMore  bool          `json:"hasMore"`
	Messages []ChatMessage `json:"messages,omitempty"`
}

func (m *Manager) GetMessages(c *fiber.Ctx) error {
	roomID := c.Params("id")
	if roomID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Room ID is required")
	}
	skip, err := strconv.Atoi(c.Query("skip", "0"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid bucket skip value")
	}

	hasMore := true
	msgs, err := m.MessageRepo.LatestMessage(roomID, skip)
	if err != nil {
		skip--
		hasMore = false
		msgs, err = m.MessageRepo.LatestMessage(roomID, skip)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Failed to get messages: "+err.Error())
		}
	}

	skip++
	return c.Status(fiber.StatusOK).JSON(GetMessagesResponse{
		NextSkip: skip,
		HasMore:  hasMore,
		Messages: msgs,
	})
}

type ProtectedGameRequest struct {
	Password string `json:"password,omitempty"`
}

func (m *Manager) ProtectGame(c *fiber.Ctx) error {
	req := ProtectedGameRequest{}
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "decode req: "+err.Error())
	}

	gameID := c.Params("id")
	if gameID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Game ID is required")
	}

	_, err := m.GameSvc.ProtectGame(gameID, req.Password)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if err := m.BroadcastJoinableGames(); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.SendStatus(fiber.StatusOK)
}

func (m *Manager) UnprotectGame(c *fiber.Ctx) error {
	gameID := c.Params("id")
	if gameID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Game ID is required")
	}

	if _, err := m.GameSvc.UnprotectGame(gameID); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	if err := m.BroadcastJoinableGames(); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	return c.SendStatus(fiber.StatusOK)
}

func (m *Manager) SendFriendRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	friendId := c.Params("friendId")

	err := m.sendFriendRequest(id, friendId)
	if err != nil {
		return err
	}
	user, _ := m.UserSvc.GetUser(id)
	friendRequestPayload := FriendRequestPayload{
		FromID:       id,
		FromUsername: user.Username,
	}
	p, err := NewFriendRequestPacket(friendRequestPayload)
	if err != nil {
		m.logger.Error("failed to create friend request packet", err)
	}
	client, err := m.getClientByUserID(friendId)
	if err != nil {
		m.logger.Info("Client with id %s is not connected", friendId)
		return c.SendStatus(fiber.StatusAccepted)
	}
	client.send(p)
	return c.SendStatus(fiber.StatusOK)
}

func (m *Manager) AcceptFriendRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	friendId := c.Params("friendId")

	err := m.acceptFriendRequest(id, friendId)
	if err != nil {
		return err
	}
	user, _ := m.UserSvc.GetUser(friendId)
	friendRequestPayload := FriendRequestPayload{
		FromID:       friendId,
		FromUsername: user.Username,
	}
	p, err := AcceptFRiendRequestPacket(friendRequestPayload)
	if err != nil {
		m.logger.Error("failed to create friend request packet", err)
	}
	client, err := m.getClientByUserID(friendId)
	if err != nil {

		m.logger.Info("Client with id %s is not connected", friendId)
		return c.SendStatus(fiber.StatusAccepted)
	}
	client.send(p)
	return c.SendStatus(fiber.StatusOK)
}

func (m *Manager) RejectFriendRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	friendId := c.Params("friendId")

	err := m.rejectFriendRequest(id, friendId)
	if err != nil {
		return err
	}
	user, _ := m.UserSvc.GetUser(id)
	friendRequestPayload := FriendRequestPayload{
		FromID:       friendId,
		FromUsername: user.Username,
	}
	p, err := DeclineFriendRequestPacket(friendRequestPayload)
	if err != nil {
		m.logger.Error("failed to create friend request packet", err)
	}
	client, err := m.getClientByUserID(friendId)
	if err != nil {
		m.logger.Info("Client with id %s is not connected", friendId)
		return c.SendStatus(fiber.StatusAccepted)
	}
	client.send(p)
	return c.SendStatus(fiber.StatusOK)
}

type GetFriendsResponse struct {
	Friends []*user.User `json:"friends,omitempty"`
}

func (m *Manager) GetFriends(c *fiber.Ctx) error {
	id := c.Params("id")
	friends, err := m.GetFriendsList(id)
	if err != nil {
		return err
	}
	return c.JSON(GetFriendsResponse{
		Friends: friends,
	})
}

type GetUserResponse struct {
	User *user.User `json:"user,omitempty"`
}

func (m *Manager) GetFriendById(c *fiber.Ctx) error {
	id := c.Params("id")
	friendId := c.Params("friendId")
	friend, err := m.GetFriendlistById(id, friendId)
	if err != nil {
		return err
	}
	return c.JSON(GetUserResponse{
		User: friend,
	})
}

func (m *Manager) RemoveFriend(c *fiber.Ctx) error {
	id := c.Params("id")
	friendId := c.Params("friendId")

	err := m.RemoveFriendFromList(id, friendId)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}

type GetFriendRequestsResponse struct {
	FriendRequests []*user.User `json:"friendRequests,omitempty"`
}

func (m *Manager) GetPendingFriendRequests(c *fiber.Ctx) error {
	id := c.Params("id")
	friendRequests, err := m.GetPendingFriendlistRequests(id)
	if err != nil {
		return err
	}
	return c.JSON(GetFriendRequestsResponse{
		FriendRequests: friendRequests,
	})
}
func (m *Manager) AcceptJoinGameRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	requestorId := c.Params("requestorId")
	gId := c.Params("gameId")
	g, err := m.GameSvc.Repo.FindGame(gId)
	g.UserIDs = append(g.UserIDs, requestorId)
	if strings.Contains(strings.Join(g.JoinGameRequestUserIds, ""), requestorId) == false {
		return fiber.NewError(fiber.StatusBadRequest, "The user revoked is request to join the game")
	}

	if g.CreatorID != id {
		return fiber.NewError(fiber.StatusBadRequest, "You are not the creator of the game")
	}
	r, err := m.GetRoom(gId)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	client, err := m.getClientByUserID(requestorId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if err := r.AddClient(client.ID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if err := m.UserSvc.Repo.SetJoinedGame(g.ID, requestorId); err != nil {
		return err
	}

	r.SendVerdictJoinGameRequest(client, g, Accepted)
	return r.BroadcastJoinGamePackets(client, g)
}

func (m *Manager) RevokeRequestToJoinGame(c *fiber.Ctx) error {
	id := c.Params("id")
	gId := c.Params("gameId")
	g, err := m.GameSvc.Repo.FindGame(gId)
	for i, pendingJoinGameRequestId := range g.JoinGameRequestUserIds {
		if pendingJoinGameRequestId == id {
			g.JoinGameRequestUserIds = append(g.JoinGameRequestUserIds[:i], g.JoinGameRequestUserIds[i+1:]...)
		}
	}

	r, err := m.GetRoom(gId)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	client, err := m.getClientByUserID(g.CreatorID)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	r.RevokeRequestToJoinGameRequest(client, g, id)
	return nil
}

func (m *Manager) RejectJoinGameRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	requestorId := c.Params("requestorId")
	gId := c.Params("gameId")
	g, err := m.GameSvc.Repo.FindGame(gId)

	if strings.Contains(strings.Join(g.JoinGameRequestUserIds, ""), requestorId) == false {
		return fiber.NewError(fiber.StatusBadRequest, "The user revoked is request to join the game")
	}

	if g.CreatorID != id {
		return fiber.NewError(fiber.StatusBadRequest, "You are not the creator of the game")
	}
	r, err := m.GetRoom(gId)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	client, err := m.getClientByUserID(requestorId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	r.SendVerdictJoinGameRequest(client, g, Declined)
	return nil
}

func (m *Manager) AcceptJoinTournamentRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	requestorId := c.Params("requestorId")
	tId := c.Params("tournamentId")
	t, err := m.GameSvc.Repo.FindTournament(tId)
	t.UserIDs = append(t.UserIDs, requestorId)
	if strings.Contains(strings.Join(t.JoinTournamentRequestUserIds, ""), requestorId) == false {
		return fiber.NewError(fiber.StatusBadRequest, "The user revoked is request to join the game")
	}
	if t.CreatorID != id {
		return fiber.NewError(fiber.StatusBadRequest, "You are not the creator of the tournament")
	}
	r, err := m.GetRoom(tId)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	client, err := m.getClientByUserID(requestorId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if err := r.AddClient(client.ID); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	if err := m.UserSvc.Repo.SetJoinedTournament(t.ID, requestorId); err != nil {
		return err
	}

	r.SendVerdictJoinTournamentRequest(client, t, Accepted)
	return r.BroadcastJoinTournamentPackets(client, t)
}
func (m *Manager) RevokeRequestToJoinTournament(c *fiber.Ctx) error {
	id := c.Params("id")
	tId := c.Params("tournamentId")
	t, err := m.GameSvc.Repo.FindTournament(tId)

	for i, pendingJoinTournamentRequestId := range t.JoinTournamentRequestUserIds {
		if pendingJoinTournamentRequestId == id {
			t.JoinTournamentRequestUserIds = append(t.JoinTournamentRequestUserIds[:i], t.JoinTournamentRequestUserIds[i+1:]...)
		}
	}

	r, err := m.GetRoom(tId)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	client, err := m.getClientByUserID(t.CreatorID)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	r.RevokeRequestToJoinTournamentRequest(client, t, id)
	return nil
}

func (m *Manager) RejectJoinTournamentRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	tId := c.Params("tournamentId")
	requestorId := c.Params("requestorId")
	t, err := m.GameSvc.Repo.FindTournament(tId)
	if strings.Contains(strings.Join(t.JoinTournamentRequestUserIds, ""), id) == false {
		return fiber.NewError(fiber.StatusBadRequest, "The user revoked is request to join the Tournament")
	}
	if t.CreatorID != id {
		return fiber.NewError(fiber.StatusBadRequest, "You are not the creator of the tournament")
	}
	r, err := m.GetRoom(tId)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	client, err := m.getClientByUserID(requestorId)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	r.SendVerdictJoinTournamentRequest(client, t, Declined)
	return nil
}
