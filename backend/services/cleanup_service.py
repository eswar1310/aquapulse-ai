from datetime import datetime, timedelta, timezone
from db.supabase_client import supabase

RETENTION_POLICIES = {
    "weather_signals": 30,
    "news_signals": 60,
    "market_pulse": 90,
    "disease_scans": 90,
    "analyzed_reports": 90,
    "mithrama_chat_logs": 30,
}

STORAGE_RETENTION_POLICIES = {
    "reports": 30,
    "disease-scans": 30,
}

def clean_database_tables():
    print("🧹 Starting database cleanup...")
    total_deleted = 0

    for table, days in RETENTION_POLICIES.items():
        try:
            threshold_date = datetime.now(timezone.utc) - timedelta(days=days)
            iso_threshold = threshold_date.isoformat()

            # Using supabase-py, we delete rows where created_at < threshold
            response = supabase.table(table).delete().lt("created_at", iso_threshold).execute()
            
            deleted_count = len(response.data) if response.data else 0
            total_deleted += deleted_count
            
            print(f"✅ Cleaned table '{table}': {deleted_count} rows deleted (older than {days} days)")
        except Exception as e:
            if "relation" in str(e) and "does not exist" in str(e):
                print(f"⚠️ Table '{table}' does not exist, skipping.")
            else:
                print(f"❌ Error cleaning table '{table}': {e}")

    return total_deleted


def clean_storage_buckets():
    print("🗂️ Starting storage cleanup...")
    total_deleted = 0

    for bucket, days in STORAGE_RETENTION_POLICIES.items():
        try:
            threshold_date = datetime.now(timezone.utc) - timedelta(days=days)
            
            # List all files in the bucket
            files = supabase.storage.from_(bucket).list(options={"limit": 1000})
            
            files_to_delete = []
            for file_info in files:
                # file_info usually contains name, created_at, updated_at
                file_name = file_info.get("name")
                # Skip the placeholder .emptyFolder if it exists
                if not file_name or file_name == ".emptyFolder":
                    continue

                created_at_str = file_info.get("created_at")
                if created_at_str:
                    # Parse the ISO format string from Supabase (e.g., '2023-10-12T10:00:00.000Z')
                    try:
                        # Replace Z with +00:00 for python fromisoformat
                        created_at_str = created_at_str.replace("Z", "+00:00")
                        created_at = datetime.fromisoformat(created_at_str)
                        if created_at < threshold_date:
                            files_to_delete.append(file_name)
                    except ValueError:
                        print(f"⚠️ Could not parse date {created_at_str} for file {file_name}")

            if files_to_delete:
                batch_size = 50
                for i in range(0, len(files_to_delete), batch_size):
                    batch = files_to_delete[i:i + batch_size]
                    supabase.storage.from_(bucket).remove(batch)
                
                total_deleted += len(files_to_delete)
                print(f"✅ Cleaned bucket '{bucket}': {len(files_to_delete)} files deleted (older than {days} days)")
            else:
                print(f"✅ Cleaned bucket '{bucket}': 0 files deleted")
                
        except Exception as e:
            print(f"❌ Error cleaning bucket '{bucket}': {e}")

    return total_deleted


def run_cleanup():
    print("🚀 Starting AquaPulse Autonomous Cleanup Job")
    start_time = datetime.now()
    
    try:
        rows_deleted = clean_database_tables()
        files_deleted = clean_storage_buckets()
        
        duration = (datetime.now() - start_time).total_seconds()
        print(
            f"🎉 Cleanup completed in {duration:.2f}s | "
            f"Deleted {rows_deleted} rows | "
            f"Deleted {files_deleted} files."
        )
    except Exception as e:
        print(f"❌ Fatal error in cleanup job: {e}")
