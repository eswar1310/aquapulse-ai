import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

URL = "https://abgains.com/pr.php"


def scrape_date(date_value: str):
    payload = {
        "date": date_value,
        "cety": "bhimavaram",
        "type": "Vannamei"
    }

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/136.0 Safari/537.36"
        ),
        "Referer": "https://abgains.com/",
        "Origin": "https://abgains.com",
        "Accept": (
            "text/html,application/xhtml+xml,"
            "application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        ),
        "Accept-Language": "en-US,en;q=0.9",
    }

    session = requests.Session()

    response = session.post(
        URL,
        data=payload,
        headers=headers,
        timeout=30
    )

    print("Status:", response.status_code)

    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    rows = soup.select("table tbody tr")

    data = []

    for row in rows:
        cols = row.find_all("td")
        if len(cols) < 2:
            continue

        count_size = cols[0].get_text(strip=True)
        price_text = cols[1].get_text(strip=True).replace("₹", "").strip()

        try:
            price = float(price_text)
        except:
            continue

        data.append({
            "market_date": date_value,
            "city": "Bhimavaram",
            "shrimp_type": "Vannamei",
            "count_size": count_size,
            "price": price
        })

    return data


def save_to_supabase(rows):
    if rows:
        supabase.table("shrimp_prices").upsert(
            rows,
            on_conflict="market_date,city,shrimp_type,count_size"
        ).execute()

if __name__ == "__main__":
    date_to_scrape = "2026-05-08"

    rows = scrape_date(date_to_scrape)

    print(rows)

    save_to_supabase(rows)

    print("Saved successfully.")