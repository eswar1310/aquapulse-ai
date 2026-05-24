from services.openrouter_service import chat_completion


def build_report_analysis(structured_json: dict):
    prompt = f"""
You are Mithrama, an aquaculture advisor.

Analyze this structured pond water report JSON.

Return STRICT JSON only.

Format:
{{
  "risk_score": number,
  "severity": "Safe | Monitor | Caution | Critical",
  "alerts": [],
  "action_plan": [],
  "mithrama_explanation": ""
}}

Report:
{structured_json}
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

    import json

    cleaned = raw.strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.replace("```json", "")
        cleaned = cleaned.replace("```", "")
        cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except Exception:
        return {
            "risk_score": 50,
            "severity": "Monitor",
            "alerts": [],
            "action_plan": [],
            "mithrama_explanation": raw,
        }