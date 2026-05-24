import json
import uuid

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
)
from typing import List

from services.vision_service import (
    analyze_disease_images,
)
from db.supabase_client import (
    upload_disease_scan_file,
)
from tools.disease_reasoner import (
    build_disease_explanation,
)
from tools.report_tool import (
    save_disease_scan,
)

router = APIRouter(
    prefix="/disease-scan",
    tags=["disease"],
)


@router.post("")
async def disease_scan(
    session_id: str = Form(...),
    doc: int = Form(...),
    feeding_response: str = Form(...),
    mortality_percent: float = Form(...),
    symptoms: str = Form(...),
    files: List[UploadFile] = File(...),
):
    files = files[:4]

    image_bytes_list = []
    stored_paths = []
    first_file = None

    for file in files:
        content = await file.read()

        unique_name = (
            f"{uuid.uuid4()}_{file.filename}"
        )

        path = upload_disease_scan_file(
            unique_name,
            content,
        )

        if first_file is None:
            first_file = unique_name

        stored_paths.append(path)
        image_bytes_list.append(content)

    raw = analyze_disease_images(
        image_bytes_list=image_bytes_list,
        doc=doc,
        feeding_response=feeding_response,
        mortality_percent=mortality_percent,
        symptoms=symptoms,
    )

    cleaned = raw.strip()

    if cleaned.startswith("```"):
        cleaned = (
            cleaned.replace("```json", "")
            .replace("```", "")
            .strip()
        )

    try:
        analysis = json.loads(cleaned)
    except Exception:
        analysis = {
            "raw_output": raw,
            "parse_error": True,
        }

    explanation = build_disease_explanation(
        analysis
    )

    save_disease_scan(
        session_id=session_id,
        file_name=first_file,
        file_path=first_file,
        image_paths=stored_paths,
        doc=doc,
        feeding_response=feeding_response,
        mortality_percent=mortality_percent,
        symptoms=symptoms,
        observations=analysis,
        explanation=explanation[
            "mithrama_explanation"
        ],
    )

    return {
        "stored_paths": stored_paths,
        "analysis": analysis,
        "explanation": explanation,
    }