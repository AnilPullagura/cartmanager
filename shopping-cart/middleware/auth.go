package middleware

import (
	"shopping-cart/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuthMiddleware(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")

        var user models.User
        if err := db.Where("token = ?", token).First(&user).Error; err != nil {
            c.JSON(401, gin.H{"error": "Unauthorized"})
            c.Abort()
            return
        }

        c.Set("user", user)
        c.Next()
    }
}
