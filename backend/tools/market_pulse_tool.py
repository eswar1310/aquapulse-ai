import json

from db.supabase_client import supabase

from services.openrouter_service import (
    chat_completion,
)


def get_latest_weather_signal():
    row = (
        supabase.table("weather_signals")
        .select("*")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if row.data:
        return row.data[0]

    return None


def get_latest_news_signals():
    row = (
        supabase.table("news_signals")
        .select("*")
        .order("created_at", desc=True)
        .limit(5)
        .execute()
    )

    return row.data


def get_latest_market_prices():
    row = (
        supabase.table("shrimp_prices")
        .select("*")
        .order("market_date", desc=True)
        .limit(10)
        .execute()
    )

    return row.data


def generate_market_pulse():
    weather = get_latest_weather_signal()

    news = get_latest_news_signals()

    prices = get_latest_market_prices()

    prompt = f"""
You are Mithrama,
an Indian shrimp market intelligence analyst.

Analyze:
1. Weather conditions
2. Shrimp/aquaculture news
3. Recent shrimp prices

Generate a unified market pulse.

Return STRICT JSON ONLY:

{{
  "market_bias": "Bullish | Bearish | Neutral",
  "confidence": 0.0,
  "price_pressure": "Upward | Downward | Stable",
  "drivers": [],
  "risks": [],
  "mithrama_summary": ""
}}

Weather:
{weather}

News:
{news}

Prices:
{prices}
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
            "market_bias": "Neutral",
            "confidence": 0.5,
            "price_pressure": "Stable",
            "drivers": [],
            "risks": [],
            "mithrama_summary": raw,
        }


def save_market_pulse(
    pulse: dict,
):
    row = (
        supabase.table("market_pulse")
        .insert(
            {
                "pulse": pulse,
            }
        )
        .execute()
    )

    return row.data[0]


def get_latest_market_pulse():
    row = (
        supabase.table("market_pulse")
        .select("*")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if row.data:
        return row.data[0]

    return None