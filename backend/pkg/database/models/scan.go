package models

import "gorm.io/datatypes"

type Scan struct {
	ScanId              uint   `gorm:"primaryKey;autoIncrement;not null" json:"scan_id"`
	TemplatesTemplateId uint   `gorm:"type:integer;not null" json:"template_id"`
	Name                string `gorm:"type:varchar(255);not null" json:"name"`
	Description         string `gorm:"type:varchar(255);not null" json:"description"`
	Metadata            datatypes.JSON
	Model
	Records     []Record `gorm:"foreignKey:ScansScanId" json:"records"`
	UsersUserId string   `gorm:"type:varchar(255);not null" json:"user_id"`
	Users       User     `gorm:"foreignKey:UsersUserId" json:"user"`
}
