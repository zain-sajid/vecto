package models

import "gorm.io/datatypes"

type Tag struct {
	TagId    uint   `gorm:"primaryKey;autoIncrement;not null"`
	Name     string `gorm:"type:varchar(255);not null"`
	Metadata datatypes.JSON
	Model
}
