package handlers

import (
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateItem(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var item models.Item
        c.BindJSON(&item)
        db.Create(&item)
        c.JSON(200, item)
    }
}

func ListItems(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var items []models.Item
        db.Find(&items)
        c.JSON(200, items)
    }
}
