import json

from db.supabase_client import supabase
from services.openrouter_service import (
    chat_completion,
)


def is_duplicate_article(
    link: str,
):
    row = (
        supabase.table("news_signals")
        .select("id")
        .eq("link", link)
        .limit(1)
        .execute()
    )

    return len(row.data) > 0


def score_relevance(
    article: dict,
):
    prompt = f"""
You are an Indian shrimp market analyst.

Determine whether this article is relevant
to Indian shrimp/aquaculture markets.

Return STRICT JSON ONLY:

{{
  "relevant": true,
  "relevance_score": 0.0,
  "reason": ""
}}

Article:
Title: {article.get("title")}
Summary: {article.get("summary")}
"""

    raw = chat_completion(
        [
            {
                "role": "system",
                "content": (
                    "Return strict JSON only."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        model="openai/gpt-4o-mini",
    )

    cleaned = raw.strip()

    if cleaned.startswith("```"):
        cleaned = (
            cleaned.replace("```json", "")
            .replace("```", "")
            .strip()
        )

    try:
        return json.loads(cleaned)
    except Exception:
        return {
            "relevant": False,
            "relevance_score": 0.0,
            "reason": raw,
        }


def classify_news_signal(
    article: dict,
):
    prompt = f"""
You are an Indian shrimp market analyst.

Analyze this article for impact on:
- Indian shrimp prices
- exports
- aquaculture demand
- farming economics

Return STRICT JSON ONLY:

{{
  "impact": "Bullish | Bearish | Neutral",
  "confidence": 0.0,
  "reason": ""
}}

Article:
Title: {article.get("title")}
Summary: {article.get("summary")}
"""

    raw = chat_completion(
        [
            {
                "role": "system",
                "content": (
                    "Return strict JSON only."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        model="openai/gpt-4o-mini",
    )

    cleaned = raw.strip()

    if cleaned.startswith("```"):
        cleaned = (
            cleaned.replace("```json", "")
            .replace("```", "")
            .strip()
        )

    try:
        return json.loads(cleaned)
    except Exception:
        return {
            "impact": "Neutral",
            "confidence": 0.5,
            "reason": raw,
        }


def save_news_signal(
    article: dict,
    signal: dict,
):
    row = (
        supabase.table("news_signals")
        .insert(
            {
                "source": article[
                    "source"
                ],
                "title": article[
                    "title"
                ],
                "link": article[
                    "link"
                ],
                "published": article[
                    "published"
                ],
                "signal": signal,
            }
        )
        .execute()
    )

    return row.data[0]


def get_latest_news_signals():
    row = (
        supabase.table("news_signals")
        .select("*")
        .order("created_at", desc=True)
        .limit(10)
        .execute()
    )

    return row.data