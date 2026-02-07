package handlers

import (
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateOrder(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        user := c.MustGet("user").(models.User)

        var cart models.Cart
        db.Preload("Items").Where("user_id = ?", user.ID).First(&cart)

        order := models.Order{
            UserID: user.ID,
            Items:  cart.Items,
        }

        db.Create(&order)
        db.Delete(&cart)

        c.JSON(200, order)
    }
}

func ListOrders(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var orders []models.Order
        db.Preload("Items").Find(&orders)
        c.JSON(200, orders)
    }
}
