import base64
import requests
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
SITE_URL = os.getenv("SITE_URL", "http://localhost:3000")
SITE_NAME = os.getenv("SITE_NAME", "AquaPulse")


def extract_text_from_image(image_bytes: bytes):
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
            "Content-Type": "application/json",
        },
        json={
            "model": "baidu/qianfan-ocr-fast:free",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Extract ALL visible text exactly "
                                "from this report image."
                            ),
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{image_b64}"
                            },
                        },
                    ],
                }
            ],
        },
        timeout=120,
    )

    response.raise_for_status()

    data = response.json()

    return data["choices"][0]["message"]["content"]