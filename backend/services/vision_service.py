import os
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
SITE_URL = os.getenv("SITE_URL", "http://localhost:3000")
SITE_NAME = os.getenv("SITE_NAME", "AquaPulse")
VISION_MODEL = os.getenv(
    "VISION_MODEL",
    "google/gemma-4-31b-it:free",
)


def analyze_disease_images(
    image_bytes_list: list[bytes],
    doc: int,
    feeding_response: str,
    mortality_percent: float,
    symptoms: str,
):
    content = [
        {
            "type": "text",
            "text": f"""
You are an aquaculture health screening assistant.

Analyze the uploaded images + farmer notes.

Farmer context:
DOC: {doc}
Feeding response: {feeding_response}
Mortality %: {mortality_percent}
Symptoms: {symptoms}

Return STRICT JSON ONLY:

{{
  "observations": [],
  "possible_causes": [],
  "confidence": 0,
  "urgency": "Low | Medium | High",
  "recommended_checks": [],
  "action_plan": []
}}

Do not claim definitive diagnosis.
Use screening/advisory language.
""",
        }
    ]

    for image_bytes in image_bytes_list:
        image_b64 = base64.b64encode(
            image_bytes
        ).decode("utf-8")

        content.append(
            {
                "type": "image_url",
                "image_url": {
                    "url": (
                        f"data:image/png;base64,{image_b64}"
                    )
                },
            }
        )

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": (
                f"Bearer {OPENROUTER_API_KEY}"
            ),
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
            "Content-Type": "application/json",
        },
        json={
            "model": VISION_MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": content,
                }
            ],
        },
        timeout=180,
    )

    response.raise_for_status()

    data = response.json()

    return data["choices"][0]["message"]["content"]