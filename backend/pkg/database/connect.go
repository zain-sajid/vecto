package database

import (
	"fmt"
	"github.com/sharryy/vecto-backend/pkg/database/models"
	"github.com/sharryy/vecto-backend/pkg/utils"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {

	dbUser := utils.GetEnvValue("DB_USERNAME")
	dbPass := utils.GetEnvValue("DB_PASSWORD")
	dbHost := utils.GetEnvValue("DB_HOST")
	dbPort := utils.GetEnvValue("DB_PORT")
	dbName := utils.GetEnvValue("DB_DATABASE")

	db, err := gorm.Open(mysql.Open(fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbPort, dbName)), &gorm.Config{})

	if err != nil {
		fmt.Println("DB Connection Error", err)
		return
	}

	fmt.Println("DB Connected")

	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.Record{})
	db.AutoMigrate(&models.Scan{})
	db.AutoMigrate(&models.Template{})
	db.AutoMigrate(&models.TemplateTag{})
	db.AutoMigrate(&models.Tag{})

	DB = db
}
