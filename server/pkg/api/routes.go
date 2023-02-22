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

	r := api.App.Group("/api")

	// Public routes
	r.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello api")
	})
	r.Post("/signup", api.UserCtrl.SignUp)
	r.Post("/login", api.UserCtrl.Login)
	r.Post("/logout", api.UserCtrl.Logout(api.WebSocketManager))

	// Proctected routes
	r.Use(
		jwtware.New(
			jwtware.Config{
				SigningKey: []byte(cfg.JWT_SIGN_KEY),
				ContextKey: "token",
			},
		),
	)
	ws := api.App.Group("/ws")
	ws.Get("/", func(c *fiber.Ctx) error {
		ID := c.Query("id")
		if ID == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Missing id"})
		}
		return api.WebSocketManager.Accept(ID)(c)
	})
	ws.Post("/room/join", api.WebSocketManager.JoinRoom)
	ws.Get("/room/messages/:roomId", api.WebSocketManager.GetMessages)
	r.Post("/avatar", api.UserCtrl.UploadAvatar)
	r.Get("/user/:id", api.UserCtrl.GetUser)
}
