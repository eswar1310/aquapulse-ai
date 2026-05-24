from tools.market_tool import get_price_for_count, get_yesterday_delta
from tools.memory_tool import (
    get_or_create_conversation,
    save_message,
    get_recent_messages,
)
from services.openrouter_service import chat_completion


def build_market_context():
    price_40 = get_price_for_count("40 C")
    delta = get_yesterday_delta("40 C")

    if not price_40:
        return "Market data unavailable."

    delta_text = "No change"
    if delta:
        d = delta["delta"]
        if d > 0:
            delta_text = f"Up ₹{d}"
        elif d < 0:
            delta_text = f"Down ₹{abs(d)}"

    return (
        f"Bhimavaram Vannamei 40C price: ₹{price_40['price']}. "
        f"Daily movement: {delta_text}."
    )


def ask_mithrama(session_id: str, user_message: str, language: str = "en"):
    conversation = get_or_create_conversation(session_id, language)

    save_message(conversation["id"], "user", user_message)

    history = get_recent_messages(conversation["id"], limit=8)

    market_context = build_market_context()

    system_prompt = f"""
You are Mithrama, AquaPulse's aquaculture companion.

Tone:
- warm
- practical
- respectful
- concise
- never robotic

Language:
- Reply in {language}
- If language is 'te', reply naturally in Telugu
- If language is 'en', reply in English only

Market context:
{market_context}

Help farmers clearly and practically.
"""

    messages = [{"role": "system", "content": system_prompt}]

    for msg in history:
        role = "assistant" if msg["role"] == "assistant" else "user"
        messages.append({
            "role": role,
            "content": msg["content"]
        })

    reply = chat_completion(messages)

    save_message(conversation["id"], "assistant", reply)

    return reply