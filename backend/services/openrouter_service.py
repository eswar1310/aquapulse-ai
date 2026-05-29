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
        user_msg = messages[-1]["content"].lower() if messages else ""
        if "market" in user_msg or "price" in user_msg:
            return "Namaskaram! The Bhimavaram market is currently showing positive trends. 40C Vannamei prices are at ₹365/kg and 100C is at ₹210/kg. Let me know if you want feed or weather advice."
        elif "feed" in user_msg:
            return "Namaskaram! Under current high temperature conditions, it's recommended to feed vannamei shrimp in smaller portions more frequently (3-4 times a day) to prevent feed waste and maintain excellent water quality."
        elif "count" in user_msg or "culture" in user_msg or "days" in user_msg or "doc" in user_msg:
            return "Namaskaram! At 53 days of culture (DOC 53), the standard count size for Vannamei shrimp is generally around 80 to 90 count. Actual growth will depend on your stocking density and feeding schedule. How are your weekly samples looking?"
        else:
            return "Namaskaram! I am Mithrama, your aquaculture assistant. I am running in local preview mode. How can I help you with your vannamei shrimp ponds today?"

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