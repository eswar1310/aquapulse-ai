from fastapi import APIRouter
from services.price_scraper_service import scrape_date, save_to_supabase
from datetime import datetime

from tools.market_pulse_tool import (
    generate_market_pulse,
    save_market_pulse,
    get_latest_market_pulse,
)

router = APIRouter(
    prefix="/market-pulse",
    tags=["market-pulse"],
)


@router.post("/scrape-prices")
def scrape_prices(date: str = None):
    if not date:
        date = datetime.today().strftime("%Y-%m-%d")
    rows = scrape_date(date)
    if rows:
        save_to_supabase(rows)
    return {"status": "success", "date": date, "scraped_count": len(rows) if rows else 0}


@router.post("/refresh")
def refresh_market_pulse():
    pulse = generate_market_pulse()

    saved = save_market_pulse(
        pulse
    )

    return saved


@router.get("/latest")
def latest_market_pulse():
    return get_latest_market_pulse()