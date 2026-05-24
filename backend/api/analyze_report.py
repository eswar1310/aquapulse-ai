import os
import uuid

from fastapi import APIRouter, UploadFile, File, Form

from services.ocr_service import extract_text_from_image
from services.report_parser_service import extract_report_json
from tools.report_reasoner import build_report_analysis
from tools.report_tool import (
    pdf_to_image_bytes,
    save_report_analysis,
)
from db.supabase_client import upload_report_file

router = APIRouter(
    prefix="/analyze-report",
    tags=["report"],
)


@router.post("")
async def analyze_report(
    session_id: str = Form(...),
    file: UploadFile = File(...),
):
    ext = file.filename.split(".")[-1].lower()

    unique_name = f"{uuid.uuid4()}_{file.filename}"
    temp_path = os.path.join("uploads", unique_name)

    content = await file.read()

    with open(temp_path, "wb") as f:
        f.write(content)

    storage_path = upload_report_file(
        unique_name,
        content,
    )

    if ext == "pdf":
        image_bytes = pdf_to_image_bytes(temp_path)
    else:
        image_bytes = content

    extracted_text = extract_text_from_image(
        image_bytes
    )

    structured_json = extract_report_json(
        extracted_text
    )

    analysis = build_report_analysis(
        structured_json
    )

    save_report_analysis(
        session_id=session_id,
        file_name=file.filename,
        file_path=storage_path,
        extracted_text=extracted_text,
        parsed_json=structured_json,
        explanation=analysis["mithrama_explanation"],
    )

    os.remove(temp_path)

    return {
        "file_name": file.filename,
        "file_path": storage_path,
        "structured_json": structured_json,
        "analysis": analysis,
    }