package handlers

import (
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddToCart(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        user := c.MustGet("user").(models.User)

        var body struct {
            ItemID uint
        }
        c.BindJSON(&body)

        var cart models.Cart
        db.Where("user_id = ?", user.ID).FirstOrCreate(&cart, models.Cart{UserID: user.ID})

        var item models.Item
        db.First(&item, body.ItemID)

        db.Model(&cart).Association("Items").Append(&item)

        c.JSON(200, cart)
    }
}

func ListCarts(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var carts []models.Cart
        db.Preload("Items").Find(&carts)
        c.JSON(200, carts)
    }
}
