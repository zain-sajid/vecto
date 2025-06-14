package controllers

import (
	"context"
	"fmt"
	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
	"github.com/sharryy/vecto-backend/pkg/core"
	"net/http"
	"net/http/httptrace"
	"time"
)

func GenerateTestFuck(template *core.Template, url string) {
	for _, variables := range template.Variables {
		for _, payloads := range template.Payloads {

			req, err3 := http.NewRequest("GET", url, nil)
			req.Header.Set("Content-Type", "application/json")

			if err3 != nil {
				panic(err3)
			}

			q := req.URL.Query()
			q.Add(variables, payloads)
			req.URL.RawQuery = q.Encode()

			fmt.Printf("[INFO] %s\n", req.URL.String())

			var start time.Time

			trace := &httptrace.ClientTrace{}

			req = req.WithContext(httptrace.WithClientTrace(req.Context(), trace))
			start = time.Now()

			fmt.Println("Response Time:", time.Since(start))

			if time.Since(start) > 9*time.Second {
				fmt.Printf("\033[31m%s\033[0m", "[CRITICAL]")
				fmt.Printf(" %s %s\n", "SQL Injection Vulnerability Detected Using Payload:", payloads)
			}

			checkForXSS(req, err3)
		}
	}
}

func checkForXSS(req *http.Request, err3 error) {
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	// Set a timeout for the context
	timeoutCtx, cancelTimeout := context.WithTimeout(ctx, 10*time.Second)
	defer cancelTimeout()

	// Listen for alerts
	chromedp.ListenTarget(timeoutCtx, func(ev interface{}) {
		if ev, ok := ev.(*page.EventJavascriptDialogOpening); ok {
			fmt.Printf("Alert detected on %s: %s\n", req.URL.String(), ev.Message)
			cancelTimeout()
		}
	})

	// Navigate to the URL and wait for an iframe to be visible
	err3 = chromedp.Run(timeoutCtx,
		chromedp.Navigate(req.URL.String()),
		chromedp.WaitVisible("iframe"),
	)
}
