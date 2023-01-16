package handlers

import (
	"github.com/gofiber/fiber/v2"
)

type AccountHandler struct {
	// service *services.GameService
	// repo    *repository.GameRepository
}

func (ah *AccountHandler) UploadAvatar() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("vous avez televerser votre avatar")
	}
}
