from tools.market_tool import get_price_for_count, get_yesterday_delta, get_latest_market_snapshot
from tools.market_pulse_tool import get_latest_weather_signal, get_latest_news_signals, get_latest_market_pulse
from tools.memory_tool import (
    get_or_create_conversation,
    save_message,
    get_recent_messages,
)
from services.openrouter_service import chat_completion


def build_complete_context():
    # 1. Market prices snapshot
    snapshot = get_latest_market_snapshot()
    price_lines = []
    if snapshot and "prices" in snapshot:
        price_lines.append(f"Latest Market Date: {snapshot['market_date']}")
        for row in snapshot["prices"]:
            count = row.get("count_size", "Unknown")
            price = row.get("price")
            delta = get_yesterday_delta(count)
            delta_text = ""
            if delta:
                d = delta["delta"]
                if d > 0:
                    delta_text = f" (Up ₹{d} vs yesterday)"
                elif d < 0:
                    delta_text = f" (Down ₹{abs(d)} vs yesterday)"
                else:
                    delta_text = " (No change)"
            price_lines.append(f"- {count}: ₹{price}{delta_text}")
    else:
        price_lines.append("Market prices unavailable.")

    # 2. Weather signals
    weather = get_latest_weather_signal()
    weather_text = "Weather signals unavailable."
    if weather and "signal" in weather:
        sig = weather["signal"]
        weather_text = (
            f"Location: {weather.get('location', 'Bhimavaram')}\n"
            f"Type: {sig.get('signal_type', 'General')}\n"
            f"Severity: {sig.get('severity', 'Low')}\n"
            f"Impact: {sig.get('impact', '')}\n"
            f"Recommendations: {', '.join(sig.get('recommendations', []))}"
        )

    # 3. News signals
    news_rows = get_latest_news_signals()
    news_lines = []
    if news_rows:
        for idx, item in enumerate(news_rows[:5]):
            title = item.get("title", "")
            impact = item.get("signal", {}).get("impact", "Neutral")
            reason = item.get("signal", {}).get("reason", "")
            news_lines.append(f"{idx+1}. {title} [Impact: {impact}] - {reason}")
    else:
        news_lines.append("News signals unavailable.")

    # 4. Market Pulse
    pulse_row = get_latest_market_pulse()
    pulse_text = "Market pulse analysis unavailable."
    if pulse_row and "pulse" in pulse_row:
        p = pulse_row["pulse"]
        pulse_text = (
            f"Market Bias: {p.get('market_bias', 'Neutral')}\n"
            f"Confidence: {p.get('confidence', 0.5)}\n"
            f"Price Pressure: {p.get('price_pressure', 'Stable')}\n"
            f"Drivers: {', '.join(p.get('drivers', []))}\n"
            f"Risks: {', '.join(p.get('risks', []))}\n"
            f"Summary: {p.get('mithrama_summary', '')}"
        )

    price_str = "\n".join(price_lines)
    news_str = "\n".join(news_lines)

    complete_context = f"""### LIVE FARM INTELLIGENCE CONTEXT ###

[SHRIMP RATES / PRICES (Bhimavaram)]
{price_str}

[WEATHER ADVISORY & WATER CONDITIONS]
{weather_text}

[AQUACULTURE NEWS SIGNALS]
{news_str}

[MARKET PULSE SUMMARY]
{pulse_text}
"""
    return complete_context


def ask_mithrama(session_id: str, user_message: str, language: str = "en"):
    conversation = get_or_create_conversation(session_id, language)

    save_message(conversation["id"], "user", user_message)

    history = get_recent_messages(conversation["id"], limit=8)

    complete_context = build_complete_context()

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

Context & Knowledge:
In addition to general shrimp farming knowledge, you have access to live farm intelligence. Always refer to this context when answering the user's questions about prices, forecasts, weather, news, or farming decisions.

Shrimp Count Estimation:
If the farmer asks to estimate or guess their shrimp count size based on Days of Culture (DOC), use this standard Vannamei growth estimation table:
- DOC 30: ~150 to 200 count
- DOC 45: ~100 to 120 count
- DOC 50: ~90 to 100 count
- DOC 53-55: ~80 to 90 count
- DOC 60: ~70 to 80 count
- DOC 70: ~60 to 70 count
- DOC 80: ~50 to 60 count
- DOC 90: ~45 to 50 count
- DOC 100: ~35 to 40 count
- DOC 110-120: ~25 to 30 count
Always clarify that this is a general benchmark estimate, and the actual count depends on stocking density, feed conversion ratio (FCR), water temperature, and dissolved oxygen (DO) levels.

Live Intel:
{complete_context}

Answer the farmer's query directly, accurately, and practically using the above information.
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