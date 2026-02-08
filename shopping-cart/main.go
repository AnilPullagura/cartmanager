package main

import (
	"os"
	"shopping-cart/handlers"
	"shopping-cart/middleware"
	"shopping-cart/models"

	"time"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)


func main() {
	db, err := gorm.Open(sqlite.Open("/tmp/shop.db"), &gorm.Config{})

if err != nil {
	panic(err)
}




    db.AutoMigrate(&models.User{}, &models.Item{}, &models.Cart{}, &models.Order{})

    r := gin.Default()
    r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://cartmanager.vercel.app","http://localhost:3000"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
}))


    // Public routes
    r.POST("/users", handlers.CreateUser(db))
    r.GET("/users", handlers.ListUsers(db))
    r.POST("/users/login", handlers.Login(db))
    r.POST("/items", handlers.CreateItem(db))
    r.GET("/items", handlers.ListItems(db))

    // Auth routes
    auth := r.Group("/")
    auth.Use(middleware.AuthMiddleware(db))
    {
        auth.POST("/carts", handlers.AddToCart(db))
        auth.GET("/carts", handlers.ListCarts(db))
        auth.POST("/orders", handlers.CreateOrder(db))
        auth.GET("/orders", handlers.ListOrders(db))
    }
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    r.Run(":" + port)
}
