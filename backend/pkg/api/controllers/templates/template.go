package templates

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sharryy/vecto-backend/pkg/database"
	"github.com/sharryy/vecto-backend/pkg/database/models"
	"io/ioutil"
	"strconv"
)

func GetTemplateByID(c *gin.Context) {
	var templates []models.Template

	id := c.Param("id")

	database.DB.Where("template_id = ?", id).First(&templates)
	c.JSON(200, templates)
}

func EditTemplate(c *gin.Context) {
	var template models.Template

	fmt.Println(c)

	if err := c.ShouldBind(&template); err != nil {
		c.JSON(400, gin.H{"errors": err.Error()})
		return
	}

	database.DB.Save(&template)

	c.JSON(200, template)
}

func GetTemplates(c *gin.Context) {
	var templates []models.Template
	database.DB.Find(&templates)
	c.JSON(200, templates)
}

func GetUserTemplates(c *gin.Context) {
	var templates []models.Template

	id := c.Param("id")

	database.DB.Where("users_user_id = ?", id).Find(&templates)
	c.JSON(200, templates)
}

func CreateTemplate(c *gin.Context) {
	var template models.Template

	requestBody, _ := ioutil.ReadAll(c.Request.Body)
	var requestBodyMap map[string]interface{}
	err := json.Unmarshal(requestBody, &requestBodyMap)

	if err != nil {
		return
	}

	if userId, ok := requestBodyMap["user_id"].(float64); ok {
		requestBodyMap["user_id"] = strconv.Itoa(int(userId))
		updatedRequestBody, _ := json.Marshal(requestBodyMap)
		c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(updatedRequestBody))
	}

	if err := c.ShouldBindJSON(&template); err != nil {
		c.JSON(400, gin.H{"errors": err.Error()})
		return
	}

	database.DB.Create(&template)

	c.JSON(200, template)
}
