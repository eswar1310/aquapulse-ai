import json
from services.openrouter_service import chat_completion


def build_disease_explanation(analysis: dict):
    prompt = f"""
You are Mithrama, AquaPulse's aquaculture advisor.

Given this disease screening JSON:

{analysis}

Return STRICT JSON only:

{{
  "mithrama_explanation": "",
  "next_steps": [],
  "urgency_message": ""
}}

Use:
- practical farm language
- no definitive diagnosis
- advisory tone only
"""

    raw = chat_completion(
        [
            {
                "role": "system",
                "content": "Return strict JSON only."
            },
            {
                "role": "user",
                "content": prompt
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
            "mithrama_explanation": raw,
            "next_steps": [],
            "urgency_message": "",
        }