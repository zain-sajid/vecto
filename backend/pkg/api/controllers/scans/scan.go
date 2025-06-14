package scans

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptrace"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/sharryy/vecto-backend/pkg/api/controllers/scans/vulnerabilitites"

	"github.com/gin-gonic/gin"
	"github.com/sharryy/vecto-backend/pkg/core"
	"github.com/sharryy/vecto-backend/pkg/database"
	"github.com/sharryy/vecto-backend/pkg/database/models"
)

type ScanInput struct {
	TemplateID  []uint `json:"template_id" binding:"required"`
	Url         string `json:"url" binding:"required"`
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
	UserID      string `json:"user_id" binding:"required"`
}

func RunScan(c *gin.Context) {
	var body ScanInput

	bytes, err := io.ReadAll(c.Request.Body)

	if err != nil {
		c.JSON(500, err.Error())
		return
	}

	err = json.Unmarshal(bytes, &body)

	if err != nil {
		c.JSON(500, err.Error())
		return
	}

	templateIDs := body.TemplateID

	if len(templateIDs) == 0 {
		c.JSON(400, "Invalid input")
		return
	}

	// create scan for first template only - temporary fix
	scan := models.Scan{
		TemplatesTemplateId: templateIDs[0],
		Name:                body.Name,
		Description:         body.Description,
		UsersUserId:         body.UserID,
	}

	database.DB.Create(&scan)

	for _, templateID := range templateIDs {
		var template models.Template

		err = database.DB.Where("template_id = ?", templateID).First(&template).Error

		if err != nil {
			c.JSON(500, "Template not found in database")
			return
		}

		data, err := core.ParseTemplate(template.FilePath)

		if err != nil {
			c.JSON(500, "Something went wrong")
			return
		}

		urls := CreateURLs(data, body.Url)

		err = GenerateRequests(data, urls, scan.ScanId)

		if err != nil {
			c.JSON(500, "Something went wrong")
			return
		}
	}

	c.JSON(200, gin.H{
		"message": "Scan Completed",
		"scan_id": scan.ScanId,
		"URL":     body.Url,
	})
}

func CreateURLs(template *core.Template, urlStr string) (returnedurls []string) {
	var urls []string
	u, err := url.Parse(urlStr)

	if err != nil {
		return nil
	}

	q := u.Query()

	if len(q) > 0 {
		if len(template.Payloads) > 0 {
			for _, payloads := range template.Payloads {
				for key := range q {
					q.Set(key, payloads)
				}
				u.RawQuery = q.Encode()

				urls = append(urls, u.String())
			}
			return urls
		} else {
			u, err := url.Parse(urlStr)

			if err != nil {
				return nil
			}

			q := u.Query()
			u.RawQuery = q.Encode()
			urls = append(urls, u.String())

			return urls
		}

	} else {
		if (len(template.Variables) > 0) && (len(template.Payloads) > 0) {
			for _, variables := range template.Variables {
				for _, payloads := range template.Payloads {
					u, err := url.Parse(urlStr)

					if err != nil {
						return nil
					}

					q := u.Query()

					q.Add(variables, payloads)

					u.RawQuery = q.Encode()

					urls = append(urls, u.String())
				}
			}
			return urls
		}
	}
	return urls
}

func GenerateRequests(template *core.Template, urls []string, scanID uint) (err error) {
	for _, url := range urls {
		variables, payloads := ExtractVariablesAndPayloads(url)

		req, err3 := http.NewRequest("GET", url, nil)
		req.Header.Set("Content-Type", "application/json")

		if err3 != nil {
			panic(err3)
		}

		fmt.Printf("[INFO]")

		q := req.URL.Query()

		req.URL.RawQuery = q.Encode()

		fmt.Printf("[INFO] %s\n", req.URL.String())
		fmt.Printf("[INFO]")

		var start time.Time

		trace := &httptrace.ClientTrace{}

		req = req.WithContext(httptrace.WithClientTrace(req.Context(), trace))
		start = time.Now()

		response, _ := http.DefaultTransport.RoundTrip(req)

		fmt.Println("Response Time:", time.Since(start))

		var responseTime = time.Since(start)

		for _, request := range template.Requests {
			for _, value := range request {
				for _, detection := range value.([]interface{}) {

					if detection == "isXSSDetected()" {
						err, xssFound := vulnerabilitites.IsXSSDetected(url)

						if err != nil {
							fmt.Println(err)
							return err
						}

						if xssFound {
							DumpRecordInDB(req, response, start, xssFound, scanID, variables, payloads, "XSS")
						}
					}

					if detection == "isVulnerableToPathTraversal()" {
						err, pathFound := vulnerabilitites.IsVulnerableToPathTraversal(response)

						if err != nil {
							fmt.Println(err)
							return err
						}

						if pathFound {
							DumpRecordInDB(req, response, start, pathFound, scanID, variables, payloads, "Path Traversal")
						}
					}

					if detection == "isVulnerableToSQLInjection()" {
						err, sqlFound := vulnerabilitites.IsVulnerableToSQLInjection(responseTime)

						if err != nil {
							fmt.Println(err)
							return err
						}

						if sqlFound {
							DumpRecordInDB(req, response, start, sqlFound, scanID, variables, payloads, "SQL Injection")
						}
					}

					if detection == "isVulnerableToPrototypePollution()" {
						err, isFound := vulnerabilitites.IsPrototypePollutionDetected(url)

						if err != nil {
							fmt.Println(err)
							return err
						}

						if isFound {
							DumpRecordInDB(req, response, start, isFound, scanID, variables, payloads, "Prototype Pollution")
						}
					}
				}
			}
		}

		if template.IfApplyMatchers() {
			isDetected, err := applyMatchers(template, req, response, start, scanID, variables, payloads)

			if err != nil {
				fmt.Println(err)
				return err
			}

			if isDetected {
				DumpRecordInDB(req, response, start, isDetected, scanID, variables, payloads, "Custom Detection")
			}
		}
	}
	return nil
}

//goland:noinspection HttpUrlsUsage
func ExtractVariablesAndPayloads(u string) (variable string, payload string) {
	if !strings.HasPrefix(u, "http://") && !strings.HasPrefix(u, "https://") {
		return "", ""
	}

	u = strings.TrimPrefix(u, "http://")
	u = strings.TrimPrefix(u, "https://")
	parts := strings.SplitN(u, "?", 2)

	if len(parts) != 2 {
		return "", ""
	}

	params := strings.Split(parts[1], "&")

	if len(params) == 0 {
		return "", ""
	}

	variable = strings.SplitN(params[0], "=", 2)[0]
	payload = strings.SplitN(params[0], "=", 2)[1]

	variable, _ = url.QueryUnescape(variable)
	payload, _ = url.QueryUnescape(payload)

	return variable, payload
}

func DumpRecordInDB(req *http.Request, response *http.Response, start time.Time, isDetected bool, scanID uint, variables string, payloads string, vulnerabilityType string) {
	requestHeader, _ := json.Marshal(req.Header)
	responseBody, _ := json.Marshal(response.Body)
	responseTime := time.Since(start)

	record := models.Record{
		ScansScanId:        scanID,
		Payload:            payloads,
		Variable:           variables,
		RequestUrl:         req.URL.String(),
		RequestMethod:      req.Method,
		RequestHeader:      requestHeader,
		ResponseStatusCode: response.StatusCode,
		RequestProtocol:    req.Proto,
		ResponseBody:       responseBody,
		ResponseTime:       float64(responseTime),
		ResponseLength:     float64(response.ContentLength),
		Severity:           "High",
		IsDetected:         isDetected,
		VulnerabilityType:  vulnerabilityType,
	}

	database.DB.Create(&record)
}

func GetScanResults(c *gin.Context) {
	var scan models.Scan

	id, _ := c.Params.Get("id")

	err := database.DB.Where("scan_id = ?", id).Preload("Records", "is_detected = ?", true).First(&scan).Error

	if err != nil {
		c.JSON(500, err.Error())
		return
	}

	c.JSON(200, scan)
}

func applyMatchers(template *core.Template, req *http.Request, response *http.Response, start time.Time, scanID uint, variables string, payloads string) (isDetected bool, err error) {
	matcherCondition := template.MatchersCondition

	var isStatusMatched = false
	var isRegexMatched = false
	var isWordMatched = false

	for _, matcher := range template.Matchers {
		if matcher.Type == "status" {
			responseCodes := matcher.Status

			for _, code := range responseCodes {
				codeInt, err := strconv.Atoi(code)

				if err != nil {
					panic(err)
				}

				if codeInt == response.StatusCode {
					DumpRecordInDB(req, response, start, true, scanID, variables, payloads, "Status Code Matcher Found")
					isStatusMatched = true
				}
			}

		}

		if matcher.Type == "regex" {
			if matcher.Part == "body" {
				regex := matcher.Regex

				body, err := ioutil.ReadAll(response.Body)

				if err != nil {
					panic(err)
				}

				matched, err := regexp.MatchString(regex, string(body))

				if err != nil {
					panic(err)
				}

				if matched {
					DumpRecordInDB(req, response, start, true, scanID, variables, payloads, "Regex Matcher Found in Body")
					isRegexMatched = true
				}
			}

			if matcher.Part == "header" {
				regex := matcher.Regex

				var headerString string

				for _, header := range response.Header {
					headerString += header[0]
				}

				matched, err := regexp.MatchString(regex, headerString)

				if err != nil {
					panic(err)
				}

				if matched {
					DumpRecordInDB(req, response, start, true, scanID, variables, payloads, "Regex Matcher Found in Header")
					isRegexMatched = true
				}
			}
		}

		if matcher.Type == "word" {
			if matcher.Part == "body" {
				words := matcher.Words

				body, err := ioutil.ReadAll(response.Body)

				if err != nil {
					panic(err)
				}

				for _, word := range words {
					if strings.Contains(string(body), word) {
						DumpRecordInDB(req, response, start, true, scanID, variables, payloads, "Word Matcher Found in Body")
						isWordMatched = true
					}
				}
			}

			if matcher.Part == "header" {
				words := matcher.Words

				var headerString string

				for _, header := range response.Header {
					headerString += header[0]
				}

				for _, word := range words {
					if strings.Contains(headerString, word) {
						DumpRecordInDB(req, response, start, true, scanID, variables, payloads, "Word Matcher Found in Header")
						isWordMatched = true
					}
				}
			}
		}
	}

	if matcherCondition == "or" {
		if isStatusMatched || isRegexMatched || isWordMatched {
			return true, nil
		}
	}

	if matcherCondition == "and" {
		if isStatusMatched && isRegexMatched && isWordMatched {
			return true, nil
		}
	}

	return false, nil
}
