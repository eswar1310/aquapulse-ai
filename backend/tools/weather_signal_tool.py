import json

from db.supabase_client import supabase
from services.openrouter_service import (
    chat_completion,
)


def interpret_weather_signal(
    weather_data: dict,
):
    prompt = f"""
You are an aquaculture weather analyst.

Interpret this weather data for shrimp farming.

Return STRICT JSON ONLY:

{{
  "signal_type": "",
  "severity": "Low | Medium | High",
  "impact": "",
  "recommendations": []
}}

Weather:
{weather_data}
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
            "signal_type": "general",
            "severity": "Medium",
            "impact": raw,
            "recommendations": [],
        }


def save_weather_signal(
    location: str,
    weather_data: dict,
    signal: dict,
):
    row = (
        supabase.table("weather_signals")
        .insert(
            {
                "location": location,
                "weather_data": weather_data,
                "signal": signal,
            }
        )
        .execute()
    )

    return row.data[0]


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