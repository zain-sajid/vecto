package core

import (
	"errors"
	"gopkg.in/yaml.v3"
	"io"
	"net/http"
	"os"
	"strings"
)

func ParseTemplate(path string) (template *Template, err error) {
	data, err := readFromPathOrUrl(path)

	err = ValidateKeys(data)

	if err != nil {
		return nil, err
	}

	return data, nil
}

func IsUrl(url string) bool {
	if strings.HasPrefix(url, "http://") || strings.HasPrefix(url, "https://") {
		return true
	}
	return false
}

func readFromPathOrUrl(url string) (template *Template, err error) {
	template = &Template{}

	if IsUrl(url) {
		resp, err := http.Get(url)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()
		file, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, err
		}
		err = yaml.Unmarshal(file, &template)
		if err != nil {
			return nil, err
		}

		return template, nil
	} else {
		file, err := os.ReadFile(url)
		if err != nil {
			return nil, err
		}
		err = yaml.Unmarshal(file, &template)
		if err != nil {
			return nil, err
		}

		return template, nil
	}
}

func ValidateKeys(template *Template) (err error) {
	if template.Id == "" {
		return errors.New("template ID is missing")
	}

	if template.Info.Name == "" {
		return errors.New("template's name is missing")
	}

	if template.Info.Author == "" {
		return errors.New("template's author name is missing")
	}

	if template.Info.Severity == "" {
		return errors.New("template's severity is missing")
	}

	return nil
}
