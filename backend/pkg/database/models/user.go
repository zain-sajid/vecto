package models

import "time"

type User struct {
	UserId          uint      `gorm:"primaryKey;autoIncrement;not null;"`
	FirebaseUid     string    `gorm:"type:varchar(255);not null;"`
	Name            string    `gorm:"type:varchar(255);not null;"`
	Email           string    `gorm:"type:varchar(255);not null;"`
	EmailVerifiedAt time.Time `gorm:"type:datetime;"`
	Password        string    `gorm:"type:varchar(255);"`
	RememberToken   string    `gorm:"type:varchar(100);"`
	Model
}
