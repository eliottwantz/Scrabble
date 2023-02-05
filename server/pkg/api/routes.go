package api

import (
	"time"

	"scrabble/config"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	jwtware "github.com/gofiber/jwt/v3"
)

func (api *API) setupMiddleware() {
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
}

func (api *API) setupRoutes(cfg *config.Config) {
	api.App.Get("/ws", api.WebSocketManager.Accept())

	// Public routes
	router := api.App.Group("/api")
	router.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello api")
	})
	router.Post("/signup", api.UserCtrl.SignUp)
	router.Post("/login", api.UserCtrl.Login)

	// Proctected routes
	router.Use(
		jwtware.New(
			jwtware.Config{
				SigningKey: []byte(cfg.JWT_SIGN_KEY),
				ContextKey: "token",
			},
		),
	)
	router.Post("/avatar", api.UserCtrl.UploadAvatar)
	router.Post("/revalidate", api.UserCtrl.Revalidate)
	router.Get("/user/:id", api.UserCtrl.GetUser)
}
