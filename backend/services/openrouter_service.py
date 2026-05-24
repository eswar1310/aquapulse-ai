import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
SITE_URL = os.getenv("SITE_URL", "http://localhost:3000")
SITE_NAME = os.getenv("SITE_NAME", "AquaPulse")


def chat_completion(
    messages,
    model: str = "openai/gpt-4o-mini"
):
    if isinstance(messages, str):
        messages = [{"role": "user", "content": messages}]

    if not OPENROUTER_API_KEY:
        raise ValueError("Missing OPENROUTER_API_KEY")

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
            "Content-Type": "application/json",
        },
        json={
            "model": model,
            "messages": messages,
        },
        timeout=60,
    )

    response.raise_for_status()

    data = response.json()

    return data["choices"][0]["message"]["content"]