package vulnerabilitites

import (
	"context"
	"github.com/chromedp/chromedp"
	"log"
)

func IsPrototypePollutionDetected(url string) (err error, found bool) {

	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	// concatenate `__proto__[randomword]=randomvalue` to url string value

	var res string
	err = chromedp.Run(ctx,
		chromedp.Navigate(url+`&__proto__[randomword]=randomvalue`),
		chromedp.Evaluate(`window.randomword`, &res),
	)
	if err != nil {
		log.Fatal(err)
	}
	//check if window.randomword exist or not (if it exist, it means prototype pollution is detected)
	if res != "" {
		return nil, true
	}
	return nil, false
}
