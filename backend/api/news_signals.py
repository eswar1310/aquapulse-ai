from fastapi import APIRouter

from services.news_service import (
    fetch_news_entries,
)

from tools.news_signal_tool import (
    classify_news_signal,
    save_news_signal,
    get_latest_news_signals,
)

router = APIRouter(
    prefix="/news-signals",
    tags=["news"],
)


@router.post("/refresh")
def refresh_news():
    entries = fetch_news_entries()

    saved_rows = []

    from tools.news_signal_tool import (
        score_relevance,
        is_duplicate_article,
    )

    for article in entries:
        if is_duplicate_article(
            article["link"]
        ):
            continue

        relevance = score_relevance(
            article
        )

        if (
            not relevance.get(
                "relevant", False
            )
            or relevance.get(
                "relevance_score", 0
            ) < 0.7
        ):
            continue

        signal = classify_news_signal(
            article
        )

        signal["relevance_score"] = (
            relevance[
                "relevance_score"
            ]
        )

        saved = save_news_signal(
            article,
            signal,
        )

        saved_rows.append(saved)

    return {
        "processed": len(saved_rows),
        "rows": saved_rows,
    }


@router.get("/latest")
def latest_news():
    return get_latest_news_signals()