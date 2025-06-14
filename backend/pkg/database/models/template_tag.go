package models

type TemplateTag struct {
	TemplatesTemplateID uint `gorm:"primaryKey;autoIncrement:false;not null"`
	TagsTagID           uint `gorm:"primaryKey;autoIncrement:false;not null"`
}
