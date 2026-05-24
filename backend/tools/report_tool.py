import fitz
from db.supabase_client import supabase


def pdf_to_image_bytes(pdf_path: str):
    doc = fitz.open(pdf_path)

    page = doc.load_page(0)

    pix = page.get_pixmap(
        matrix=fitz.Matrix(2, 2),
        alpha=False,
    )

    image_bytes = pix.tobytes("png")

    doc.close()

    return image_bytes


def save_report_analysis(
    session_id: str,
    file_name: str,
    file_path: str,
    extracted_text: str,
    parsed_json: dict,
    explanation: str,
):
    row = (
        supabase.table("report_analyses")
        .insert(
            {
                "session_id": session_id,
                "file_name": file_name,
                "file_path": file_path,
                "extracted_text": extracted_text,
                "parsed_json": parsed_json,
                "explanation": explanation,
            }
        )
        .execute()
    )

    return row.data[0]
def save_disease_scan(
    session_id: str,
    file_name: str,
    file_path: str,
    image_paths: list,
    doc: int,
    feeding_response: str,
    mortality_percent: float,
    symptoms: str,
    observations: dict,
    explanation: str,
):
    row = (
        supabase.table("disease_scans")
        .insert(
            {
                "session_id": session_id,
                "file_name": file_name,
                "file_path": file_path,
                "image_paths": image_paths,
                "doc": doc,
                "feeding_response": feeding_response,
                "mortality_percent": mortality_percent,
                "symptoms": symptoms,
                "observations": observations,
                "explanation": explanation,
            }
        )
        .execute()
    )

    return row.data[0]

