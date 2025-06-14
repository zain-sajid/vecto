package models

import "gorm.io/datatypes"

type Record struct {
	RecordId           uint   `gorm:"primaryKey;autoIncrement;not null"`
	ScansScanId        uint   `gorm:"type:integer;not null"`
	Payload            string `gorm:"type:varchar(1024);not null"`
	Variable           string `gorm:"type:varchar(255);not null"`
	RequestUrl         string `gorm:"type:varchar(1024);not null"`
	RequestMethod      string `gorm:"type:varchar(255);not null"`
	RequestHeader      datatypes.JSON
	RequestBody        datatypes.JSON
	RequestRaw         datatypes.JSON
	RequestProtocol    string `gorm:"type:varchar(255);not null"`
	ResponseStatusCode int    `gorm:"type:integer;not null"`
	ResponseBody       datatypes.JSON
	ResponseTime       float64 `gorm:"type:float;not null"`
	ResponseLength     float64 `gorm:"type:float;not null"`
	ResponseRaw        datatypes.JSON
	Severity           string `gorm:"type:varchar(255);not null"`
	Metadata           datatypes.JSON
	IsDetected         bool `gorm:"type:boolean;not null;default:false"`
	VulnerabilityType  string
	Model
}
