import uuid
from db.supabase_client import supabase


def create_conversation(session_id: str, language: str = "en"):
    row = (
        supabase.table("conversations")
        .insert({
            "session_id": session_id,
            "language": language
        })
        .execute()
    )

    return row.data[0]


def get_or_create_conversation(session_id: str, language: str = "en"):
    existing = (
        supabase.table("conversations")
        .select("*")
        .eq("session_id", session_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if existing.data:
        return existing.data[0]

    return create_conversation(session_id, language)


def save_message(conversation_id: str, role: str, content: str, metadata=None):
    metadata = metadata or {}

    row = (
        supabase.table("messages")
        .insert({
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "metadata": metadata
        })
        .execute()
    )

    return row.data[0]


def get_recent_messages(conversation_id: str, limit: int = 10):
    rows = (
        supabase.table("messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .limit(limit)
        .execute()
    )

    return rows.data