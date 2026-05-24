import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials in .env")

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY,
)


def upload_report_file(
    file_name: str,
    file_bytes: bytes,
):
    path = file_name

    supabase.storage.from_("reports").upload(
        path=path,
        file=file_bytes,
        file_options={
            "content-type": "application/octet-stream",
            "upsert": "true",
        },
    )

    return path


def upload_disease_scan_file(
    file_name: str,
    file_bytes: bytes,
):
    path = file_name

    supabase.storage.from_("disease-scans").upload(
        path=path,
        file=file_bytes,
        file_options={
            "content-type": "application/octet-stream",
            "upsert": "true",
        },
    )

    return path