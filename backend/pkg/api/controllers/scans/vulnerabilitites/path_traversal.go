package vulnerabilitites

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"regexp"
)

func IsVulnerableToPathTraversal(response *http.Response) (err error, found bool) {
	body, err := ioutil.ReadAll(response.Body)

	var isDetected bool

	if err != nil {
		return err, false
	}

	re := regexp.MustCompile(`root:.+:0:0:`)

	if re.MatchString(string(body)) {
		fmt.Println("The URL may be vulnerable to path traversal")
		isDetected = true
	} else {
		fmt.Println("The URL does not appear to be vulnerable to path traversal")
	}

	if isDetected {
		return nil, true
	}

	return nil, false
}
