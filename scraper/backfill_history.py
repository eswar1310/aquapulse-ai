from datetime import datetime, timedelta
from abgains_scraper import scrape_date, save_to_supabase

START_DATE = datetime(2024, 9, 1)
END_DATE = datetime.today()

current = START_DATE

while current <= END_DATE:
    date_str = current.strftime("%Y-%m-%d")

    print(f"Fetching {date_str} ...")

    try:
        rows = scrape_date(date_str)

        if rows:
            save_to_supabase(rows)
            print(f"Saved {len(rows)} rows")
        else:
            print("No rows")

    except Exception as e:
        print("Error:", e)

    current += timedelta(days=1)

print("Historical backfill complete.")