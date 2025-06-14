package core

import (
	"testing"
)

func TestIsUrl(t *testing.T) {
	tests := []struct {
		url  string
		want bool
	}{
		{"http://example.com", true},
		{"https://example.com", true},
		{"example.com", false},
		{"", false},
		{"ftp://example.com", false},
		{"http://", true},
		{"https://", true},
	}

	for _, tt := range tests {
		t.Run(tt.url, func(t *testing.T) {
			got := IsUrl(tt.url)
			if got != tt.want {
				t.Errorf("IsUrl(%q) = %v, want %v", tt.url, got, tt.want)
			}
		})
	}
}
