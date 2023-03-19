package api

import (
	"net/http"
	"time"

	"scrabble/config"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	jwtware "github.com/gofiber/jwt/v3"
	"github.com/golang-jwt/jwt/v4"
)

func (api *API) setupRoutes(cfg *config.Config) {
	api.App.Use(
		cors.New(),
		limiter.New(
			limiter.Config{
				Max:        500,
				Expiration: 30 * time.Second,
			},
		),
		logger.New(
			logger.Config{
				Format:     "${time} | ${ip}:${port} | ${latency} | ${method} | ${status} | ${path}\n",
				TimeFormat: "2006/01/02 15:04:05",
			},
		),
	)
	api.App.Get("/metrics", monitor.New(monitor.Config{Title: "Scrabble Server Metrics"}))

	ws := api.App.Group("/ws")
	ws.Get("/", func(c *fiber.Ctx) error {
		ID := c.Query("id")
		if ID == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Missing id"})
		}
		return api.Ctrls.WebSocketManager.Accept(ID)(c)
	})

	r := api.App.Group("/api")
	// Public routes
	r.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello api")
	})
	r.Post("/signup", api.Ctrls.UserCtrl.SignUp)
	r.Post("/login", api.Ctrls.UserCtrl.Login)
	r.Get("/avatar/defaults", api.Ctrls.UserCtrl.GetDefaultAvatars)

	// Proctected routes
	r.Use(
		jwtware.New(
			jwtware.Config{
				SigningKey: []byte(cfg.JWT_SIGN_KEY),
				ContextKey: "token",
			},
		),
		func(c *fiber.Ctx) error {
			token := c.Locals("token").(*jwt.Token)
			c.Locals("token", token)
			c.Locals("userId", token.Claims.(jwt.MapClaims)["userId"])
			return c.Next()
		},
	)
	r.Patch("/user/:id/config", api.Ctrls.UserCtrl.UpdatePreferences)
	r.Get("/user/:id", api.Ctrls.UserCtrl.GetUser)
	r.Get("/user/:name", api.Ctrls.UserCtrl.GetUserByName)

	r.Get("/user/friends/:id", api.Ctrls.UserCtrl.GetFriends)
	r.Get("/user/friends/:id/:friendId", api.Ctrls.UserCtrl.GetFriendById)
	r.Delete("/user/friends/:id/:friendId", api.Ctrls.UserCtrl.RemoveFriend)

	r.Get("/user/friends/requests/:id", api.Ctrls.UserCtrl.GetPendingFriendRequests)

	r.Post("/user/friends/request/:id/:friendId", api.Ctrls.UserCtrl.SendFriendRequest)
	r.Patch("/user/friends/accept/:id/:friendId", api.Ctrls.UserCtrl.AcceptFriendRequest)
	r.Delete("/user/friends/accept/:id/:friendId", api.Ctrls.UserCtrl.RejectFriendRequest)

	r.Post("/avatar", api.Ctrls.UserCtrl.UploadAvatar)

	// r.Post("/room/join", api.Ctrls.WebSocketManager.JoinRoom)
	// r.Post("/room/joindm", api.Ctrls.WebSocketManager.JoinDMRoom)
	// r.Post("/room/leave", api.Ctrls.WebSocketManager.LeaveRoom)
	r.Get("/room/:id/messages", api.Ctrls.WebSocketManager.GetMessages)
	r.Patch("/room/:id/protectGame", api.Ctrls.WebSocketManager.ProtectRoom)
	r.Patch("/room/:id/unprotectGame", api.Ctrls.WebSocketManager.UnprotectRoom)
}
