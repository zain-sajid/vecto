package utils

import (
	"os"

	"github.com/joho/godotenv"
)

func GetEnvValue(key string) (value string) {
	if os.Getenv("APP_ENV") == "production" {
		return os.Getenv(key)
	}

	err := godotenv.Load(".env")
	if err != nil {
		return ""
	}

	return os.Getenv(key)
}
