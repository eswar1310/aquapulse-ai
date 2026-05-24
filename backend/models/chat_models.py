from typing import Optional
from pydantic import BaseModel


class ChatRequest(BaseModel):
    session_id: str
    message: str
    language: Optional[str] = "en"


class ChatResponse(BaseModel):
    reply: str
    session_id: str