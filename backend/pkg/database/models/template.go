package models

import "gorm.io/datatypes"

type Template struct {
	TemplateId  uint           `gorm:"primaryKey;autoIncrement;not null;" json:"template_id,omitempty"`
	UsersUserId string         `gorm:"type:varchar(255);not null" json:"user_id" binding:"required"`
	Name        string         `gorm:"type:varchar(255);not null" json:"name" binding:"required"`
	Category    string         `gorm:"type:varchar(255);not null" json:"category" binding:"required"`
	Description string         `gorm:"type:varchar(512);not null" json:"description" binding:"required"`
	Severity    string         `gorm:"type:varchar(255);not null" json:"severity"`
	Metadata    datatypes.JSON `json:"metadata,omitempty"`
	FilePath    string         `gorm:"type:varchar(255);not null" json:"file_path" binding:"required"`
	FileName    string         `gorm:"type:varchar(255);not null" json:"file_name" binding:"required"`
	Model
}
