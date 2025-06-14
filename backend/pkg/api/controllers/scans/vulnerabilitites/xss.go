package vulnerabilitites

import (
	"context"
	"fmt"
	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
	"time"
)

func IsXSSDetected(url string) (err error, found bool) {
	var isDetected = false

	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	timeoutCtx, cancelTimeout := context.WithTimeout(ctx, 10*time.Second)
	defer cancelTimeout()

	chromedp.ListenTarget(timeoutCtx, func(ev interface{}) {
		if ev, ok := ev.(*page.EventJavascriptDialogOpening); ok {
			fmt.Printf("Alert detected on %s: %s\n", url, ev.Message)
			isDetected = true
			cancelTimeout()
		}
	})

	err = chromedp.Run(timeoutCtx,
		chromedp.Navigate(url),
		chromedp.WaitVisible("iframe"),
	)

	if err != nil {
		//log.Printf("Error navigating to %s: %v", url, err)
		//return err, false
	}

	if isDetected {
		return nil, true
	}

	return nil, false
}
