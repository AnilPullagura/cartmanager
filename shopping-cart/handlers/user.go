package handlers

import (
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateUser(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var user models.User
        c.BindJSON(&user)
        db.Create(&user)
        c.JSON(200, user)
    }
}

func ListUsers(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var users []models.User
        db.Find(&users)
        c.JSON(200, users)
    }
}

func Login(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var input models.User
        c.BindJSON(&input)

        var user models.User
        if err := db.Where("username=? AND password=?", input.Username, input.Password).First(&user).Error; err != nil {
            c.JSON(401, gin.H{"error": "Invalid credentials"})
            return
        }

        user.Token = uuid.New().String()
        db.Save(&user)

        c.JSON(200, gin.H{"token": user.Token})
    }
}
