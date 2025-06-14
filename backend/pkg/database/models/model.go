package models

import (
	"gorm.io/gorm"
	"time"
)

type Model struct {
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty"`
	CreatedAt time.Time      `json:"created_at,omitempty"`
	UpdatedAt time.Time      `json:"updated_at,omitempty"`
}
