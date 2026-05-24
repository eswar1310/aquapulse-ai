from fastapi import APIRouter
from models.chat_models import ChatRequest, ChatResponse
from agents.mithrama_agent import ask_mithrama

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def chat(req: ChatRequest):
    reply = ask_mithrama(
        session_id=req.session_id,
        user_message=req.message,
        language=req.language,
    )

    return ChatResponse(
        reply=reply,
        session_id=req.session_id,
    )