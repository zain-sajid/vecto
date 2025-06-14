package crawler

import (
	"bufio"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type UrlInput struct {
	Url string `json:"url"`
}

func Crawl(context *gin.Context) {
	var input UrlInput

	if err := context.ShouldBindJSON(&input); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//waybackurls code from here
	var crawledUrls []string

	var splitUrls []string
	//old code
	var domains []string

	dates := false
	// var dates bool
	// flag.BoolVar(&dates, "dates", false, "show date of fetch in the first column")

	noSubs := false
	// var noSubs bool
	// flag.BoolVar(&noSubs, "no-subs", false, "don't include subdomains of the target domain")

	getVersionsFlag := false
	// var getVersionsFlag bool
	// flag.BoolVar(&getVersionsFlag, "get-versions", false, "list URLs for crawled versions of input URL(s)")

	flag.Parse()

	domains = []string{input.Url}

	// get-versions mode
	if getVersionsFlag {

		for _, u := range domains {
			versions, err := getVersions(u)
			if err != nil {
				continue
			}
			fmt.Println(strings.Join(versions, "\n"))
		}

		return
	}

	fetchFns := []fetchFn{
		getWaybackURLs,
		getCommonCrawlURLs,
	}

	for _, domain := range domains {

		var wg sync.WaitGroup
		wurls := make(chan wurl)

		for _, fn := range fetchFns {
			wg.Add(1)
			fetch := fn
			go func() {
				defer wg.Done()
				resp, err := fetch(domain, noSubs)
				if err != nil {
					return
				}
				for _, r := range resp {
					if noSubs && isSubdomain(r.url, domain) {
						continue
					}
					wurls <- r
				}
			}()
		}

		go func() {
			wg.Wait()
			close(wurls)
		}()

		seen := make(map[string]bool)
		for w := range wurls {
			if _, ok := seen[w.url]; ok {
				continue
			}
			seen[w.url] = true

			if dates {

				d, err := time.Parse("20060102150405", w.date)
				if err != nil {
					fmt.Fprintf(os.Stderr, "failed to parse date [%s] for URL [%s]\n", w.date, w.url)
				}

				fmt.Printf("%s %s\n", d.Format(time.RFC3339), w.url)

			} else {
				fmt.Println(w.url)
				crawledUrls = append(crawledUrls, w.url)
			}
		}
	}

	for _, u := range crawledUrls {
		splitUrl := strings.Split(u, "?")

		if len(splitUrl) > 1 {
			fmt.Println(u)
			splitUrls = append(splitUrls, u)
		}
	}

	f, err := os.Create("urls.txt")
	if err != nil {
		fmt.Println(err)
		return
	}

	defer func(f *os.File) {
		err := f.Close()
		if err != nil {
			fmt.Println(err)
			return
		}
	}(f)

	for _, url := range splitUrls {
		_, err := f.WriteString(url + "\n")
		if err != nil {
			fmt.Println(err)
			err := f.Close()
			if err != nil {
				return
			}
			return
		}
	}

	fmt.Println("URLs written to file successfully!")

	context.JSON(http.StatusOK, gin.H{"urls": splitUrls})
}

type wurl struct {
	date string
	url  string
}

type fetchFn func(string, bool) ([]wurl, error)

func getWaybackURLs(domain string, noSubs bool) ([]wurl, error) {
	subsWildcard := "*."
	if noSubs {
		subsWildcard = ""
	}

	res, err := http.Get(
		fmt.Sprintf("http://web.archive.org/cdx/search/cdx?url=%s%s/*&output=json&collapse=urlkey", subsWildcard, domain),
	)
	if err != nil {
		return []wurl{}, err
	}

	raw, err := ioutil.ReadAll(res.Body)

	res.Body.Close()
	if err != nil {
		return []wurl{}, err
	}

	var wrapper [][]string
	err = json.Unmarshal(raw, &wrapper)

	out := make([]wurl, 0, len(wrapper))

	skip := true
	for _, urls := range wrapper {
		// The first item is always just the string "original",
		// so we should skip the first item
		if skip {
			skip = false
			continue
		}
		out = append(out, wurl{date: urls[1], url: urls[2]})
	}

	return out, nil

}

func getCommonCrawlURLs(domain string, noSubs bool) ([]wurl, error) {
	subsWildcard := "*."
	if noSubs {
		subsWildcard = ""
	}

	res, err := http.Get(
		fmt.Sprintf("http://index.commoncrawl.org/CC-MAIN-2018-22-index?url=%s%s/*&output=json", subsWildcard, domain),
	)
	if err != nil {
		return []wurl{}, err
	}

	defer res.Body.Close()
	sc := bufio.NewScanner(res.Body)

	out := make([]wurl, 0)

	for sc.Scan() {

		wrapper := struct {
			URL       string `json:"url"`
			Timestamp string `json:"timestamp"`
		}{}
		err = json.Unmarshal([]byte(sc.Text()), &wrapper)

		if err != nil {
			continue
		}

		out = append(out, wurl{date: wrapper.Timestamp, url: wrapper.URL})
	}

	return out, nil

}

func isSubdomain(rawUrl, domain string) bool {
	u, err := url.Parse(rawUrl)

	if err != nil {
		// we can't parse the URL so just
		// err on the side of including it in output
		return false
	}

	return strings.ToLower(u.Hostname()) != strings.ToLower(domain)
}

func getVersions(u string) ([]string, error) {
	out := make([]string, 0)

	resp, err := http.Get(fmt.Sprintf(
		"http://web.archive.org/cdx/search/cdx?url=%s&output=json", u,
	))

	if err != nil {
		return out, err
	}

	defer resp.Body.Close()

	var r [][]string

	dec := json.NewDecoder(resp.Body)

	err = dec.Decode(&r)
	if err != nil {
		return out, err
	}

	first := true
	seen := make(map[string]bool)

	for _, s := range r {

		// skip the first element, it's the field names
		if first {
			first = false
			continue
		}

		// fields: "urlkey", "timestamp", "original", "mimetype", "statuscode", "digest", "length"
		if seen[s[5]] {
			continue
		}
		seen[s[5]] = true
		out = append(out, fmt.Sprintf("https://web.archive.org/web/%sif_/%s", s[1], s[2]))
	}

	return out, nil
}
