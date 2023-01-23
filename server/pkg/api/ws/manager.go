package ws

import (
	"errors"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

var ErrInvalidUUID = errors.New("uuid is invalid")

type Manager struct {
	Clients map[string]*client
	Rooms   map[string]*room
}

func NewManager() *Manager {
	m := &Manager{
		Clients: make(map[string]*client),
		Rooms:   make(map[string]*room),
	}

	return m
}

func (m *Manager) Accept() fiber.Handler {
	return websocket.New(func(conn *websocket.Conn) {
		c, err := NewClient(conn, m)
		if err != nil {
			return
		}

		defer m.removeClient(c)

		m.addClient(c)

		c.read() // Infinite for loop that reads incoming packets
	})
}

func (m *Manager) getClient(cID string) (*client, error) {
	c, ok := m.Clients[cID]
	if !ok {
		return c, fmt.Errorf("%s: client %s not registered", ErrInvalidUUID, cID)
	}
	return c, nil
}

func (m *Manager) getRoom(rID string) (*room, error) {
	r, ok := m.Rooms[rID]
	if !ok {
		return r, fmt.Errorf("%s: room %s doesn't exist", ErrInvalidUUID, rID)
	}
	return r, nil
}

func (m *Manager) addClient(c *client) {
	if c == nil {
		return
	}
	r, err := NewRoom(m)
	if err != nil {
		log.Println(err)
		return
	}

	m.Rooms[r.ID] = r

	c.ID = r.ID
	m.Clients[c.ID] = c

	r.addClient(c.ID)

	log.Printf("client %s registered", c.ID)
}

func (m *Manager) removeClient(c *client) {
	for _, r := range c.Rooms {
		r.removeClient(c.ID)
	}

	delete(m.Clients, c.ID)
	log.Printf("client %s disconnected", c.ID)
	c.Conn.Close()
}

func (m *Manager) removeRoom(rID string) {
	r, err := m.getRoom(rID)
	if err != nil {
		log.Printf("removeRoom: %s", err)
		return
	}

	delete(m.Rooms, r.ID)
	log.Printf("room %s removed", r.ID)
}

func (m *Manager) broadcast(a Action, p *packet, senderID string) {
	r, err := m.getRoom(p.RoomID)
	if err != nil {
		log.Println(err)
		return
	}

	for _, client := range r.Clients {
		// Don't send packet to the sender
		if client.ID == senderID {
			continue
		}

		err := client.sendPacket(p)
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func (m *Manager) Shutdown() {
	log.Println("Shutting down manager")
	for _, c := range m.Clients {
		m.removeClient(c)
	}
}
