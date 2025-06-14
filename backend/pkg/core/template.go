package core

type Info struct {
	Name        string `yaml:"name"`
	Author      string `yaml:"author"`
	Severity    string `yaml:"severity"`
	Tags        string `yaml:"tags,omitempty"`
	Category    string `yaml:"category,omitempty"`
	Remediation string `yaml:"remediation,omitempty"`
	Description string `yaml:"description,omitempty"`
}

type Matcher struct {
	Type      string   `yaml:"type"`
	Part      string   `yaml:"part"`
	Words     []string `yaml:"words,omitempty"`
	Regex     string   `yaml:"regex,omitempty"`
	Condition string   `yaml:"condition,omitempty"`
	Status    []string `yaml:"status,omitempty"`
}

type Template struct {
	Id                string                   `yaml:"id"`
	AttackType        string                   `yaml:"attack-type"`
	Level             string                   `yaml:"level"`
	Info              Info                     `yaml:"info"`
	Variables         []string                 `yaml:"variables"`
	Payloads          []string                 `yaml:"payloads"`
	Requests          []map[string]interface{} `yaml:"requests"`
	MatchersCondition string                   `yaml:"matchers-condition,omitempty"`
	Matchers          []Matcher                `yaml:"matchers,omitempty"`
}

func (template *Template) NumberOfPayloads() int {
	return len(template.Payloads)
}

func (template *Template) NumberOfVariables() int {
	return len(template.Variables)
}

func (template *Template) IfApplyMatchers() bool {
	return template.MatchersCondition != "" && len(template.Matchers) != 0
}
