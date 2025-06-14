package main

import (
	"github.com/gin-gonic/gin"
	"github.com/sharryy/vecto-backend/pkg/api/controllers/crawler"
	"github.com/sharryy/vecto-backend/pkg/api/controllers/scans"
	"github.com/sharryy/vecto-backend/pkg/api/controllers/templates"
	"github.com/sharryy/vecto-backend/pkg/database"
)

func main() {
	database.Connect()

	InitRouter()
}

func InitRouter() {
	router := gin.Default()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.GET("/", test)
	router.GET("template/:id", templates.GetTemplateByID)
	router.PUT("template/:id", templates.EditTemplate)
	router.GET("templates", templates.GetTemplates)
	router.GET("templates/user/:id", templates.GetUserTemplates)
	router.POST("template", templates.CreateTemplate)
	router.POST("scan", scans.RunScan)
	router.GET("scan/results/:id", scans.GetScanResults)
	router.POST("crawl", crawler.Crawl)

	err := router.Run(":8001")

	if err != nil {
		return
	}
}

func test(c *gin.Context) {
	c.JSON(200, "Health Check - Vecto")
}
