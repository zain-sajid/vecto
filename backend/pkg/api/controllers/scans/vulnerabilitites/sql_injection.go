package vulnerabilitites

import (
	"fmt"
	"time"
)

func IsVulnerableToSQLInjection(duration time.Duration) (err error, found bool) {
	var isDetected bool

	if duration > 9*time.Second {
		isDetected = true
		fmt.Printf("\033[31m%s\033[0m", "[CRITICAL]")
		fmt.Printf(" %s %s\n", "SQL Injection Vulnerability Detected Using Payload:")
	}

	if isDetected {
		return nil, true
	}

	return nil, false
}
