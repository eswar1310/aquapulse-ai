import feedparser

RSS_FEEDS = [
    "https://news.google.com/rss/search?q=India+shrimp+export",
    "https://news.google.com/rss/search?q=Indian+aquaculture",
    "https://news.google.com/rss/search?q=vannamei+shrimp+India",
    "https://news.google.com/rss/search?q=MPEDA+shrimp",
    "https://news.google.com/rss/search?q=US+shrimp+imports+India",
]

KEYWORDS = [
    "shrimp",
    "aquaculture",
    "vannamei",
    "india",
    "export",
    "mpeda",
    "farmed shrimp",
    "ecuador",
    "us shrimp",
]


def is_keyword_relevant(text: str):
    text = text.lower()

    return any(
        keyword.lower() in text
        for keyword in KEYWORDS
    )


def fetch_news_entries():
    entries = []

    for url in RSS_FEEDS:
        try:
            feed = feedparser.parse(url)

            if not feed.entries:
                continue

            for item in feed.entries[:10]:
                title = item.get(
                    "title", ""
                )

                summary = item.get(
                    "summary", ""
                )

                combined = (
                    f"{title} {summary}"
                )

                if not is_keyword_relevant(
                    combined
                ):
                    continue

                entries.append(
                    {
                        "source": url,
                        "title": title,
                        "link": item.get(
                            "link", ""
                        ),
                        "published": item.get(
                            "published", ""
                        ),
                        "summary": summary,
                    }
                )

        except Exception as e:
            print(
                f"RSS fetch error: {e}"
            )

    return entries