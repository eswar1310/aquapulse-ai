import json

from services.openrouter_service import chat_completion


def extract_report_json(extracted_text: str):
    prompt = f"""
Convert this aquaculture water report text into valid JSON.

Rules:
- return JSON only
- no markdown
- no explanation
- keep numeric values as numbers
- use null if missing

Structure:

{{
  "pond_info": {{}},
  "water_quality": {{}},
  "minerals": {{}},
  "vibrio": {{}},
  "plankton": {{}},
  "remarks": ""
}}

Text:
{extracted_text}
"""

    raw = chat_completion(
        [
            {
                "role": "system",
                "content": (
                    "You convert aquaculture reports "
                    "into strict JSON."
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
        cleaned = cleaned.replace("```json", "")
        cleaned = cleaned.replace("```", "")
        cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except Exception:
        return {
            "raw_text": extracted_text,
            "parse_error": True,
            "llm_output": raw,
        }