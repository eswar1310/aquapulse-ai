import uuid

from tools.market_tool import (
    get_latest_market_snapshot,
    get_price_for_count,
    get_yesterday_delta,
)

from tools.memory_tool import (
    get_or_create_conversation,
    save_message,
    get_recent_messages,
)

print("=== MARKET TOOL ===")
print(get_price_for_count("40 C"))
print(get_yesterday_delta("40 C"))

print("\n=== MEMORY TOOL ===")
session_id = str(uuid.uuid4())

conversation = get_or_create_conversation(session_id, "en")
print("Conversation:", conversation["id"])

save_message(conversation["id"], "user", "Hello Mithrama")
save_message(conversation["id"], "assistant", "Hello farmer 👋")

history = get_recent_messages(conversation["id"])
print(history)