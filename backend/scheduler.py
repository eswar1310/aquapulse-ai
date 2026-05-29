from apscheduler.schedulers.background import (
    BackgroundScheduler,
)

from services.weather_service import (
    fetch_weather,
)

from tools.weather_signal_tool import (
    interpret_weather_signal,
    save_weather_signal,
)
from services.news_service import (
    fetch_news_entries,
)

from tools.news_signal_tool import (
    score_relevance,
    classify_news_signal,
    save_news_signal,
    is_duplicate_article,
)
import time
from tools.market_pulse_tool import (
    generate_market_pulse,
    save_market_pulse,
)
from services.cleanup_service import run_cleanup
from services.price_scraper_service import scrape_date, save_to_supabase
from datetime import datetime, timedelta

def refresh_prices_job():
    try:
        print("[INFO] Starting scheduled Price Scraper job...")
        today = datetime.today()
        # Scrape last 3 days to catch any delayed uploads
        for i in range(3):
            date_str = (today - timedelta(days=i)).strftime("%Y-%m-%d")
            print(f"Fetching prices for date: {date_str}")
            rows = scrape_date(date_str)
            if rows:
                save_to_supabase(rows)
                print(f"[OK] Saved {len(rows)} rows for {date_str}")
            else:
                print(f"[INFO] No rows returned for {date_str}")
    except Exception as e:
        print(f"[ERROR] Price scheduler error: {e}")


def refresh_weather_job():
    try:
        weather_data = fetch_weather(
            "Bhimavaram"
        )

        signal = interpret_weather_signal(
            weather_data
        )

        save_weather_signal(
            location="Bhimavaram",
            weather_data=weather_data,
            signal=signal,
        )

        print(
            "[OK] Weather signal updated"
        )

    except Exception as e:
        print(
            f"[ERROR] Weather scheduler error: {e}"
        )


scheduler = BackgroundScheduler()

scheduler.add_job(
    refresh_weather_job,
    "interval",
    hours=3,
)
def refresh_news_job():
    try:
        entries = fetch_news_entries()

        processed = 0

        for article in entries:
            if is_duplicate_article(
                article["link"]
            ):
                continue

            relevance = score_relevance(
                article
            )

            if (
                not relevance.get(
                    "relevant", False
                )
                or relevance.get(
                    "relevance_score", 0
                ) < 0.7
            ):
                continue

            signal = classify_news_signal(
                article
            )

            signal[
                "relevance_score"
            ] = relevance[
                "relevance_score"
            ]

            save_news_signal(
                article,
                signal,
            )

            processed += 1

        print(
            f"[OK] News signals updated: {processed}"
        )

    except Exception as e:
        print(
            f"[ERROR] News scheduler error: {e}"
        )

def refresh_market_pulse_job():
    try:
        print("[INFO] Starting Market Pulse generation...")
        start_time = time.time()

        pulse = generate_market_pulse()
        save_market_pulse(pulse)

        elapsed = time.time() - start_time
        print(f"[OK] Market Pulse updated successfully in {elapsed:.2f}s")

    except Exception as e:
        print(f"[ERROR] Market Pulse scheduler error: {e}")

def start_scheduler():
    scheduler.start()

    print(
        "[STARTUP] AquaPulse Autonomous Intelligence Scheduler Online"
    )
    # Trigger update jobs immediately on startup in the background
    scheduler.add_job(refresh_prices_job)
    scheduler.add_job(refresh_weather_job)
    scheduler.add_job(refresh_news_job)
    scheduler.add_job(refresh_market_pulse_job)

scheduler.add_job(
    refresh_news_job,
    "interval",
    hours=3,
)

scheduler.add_job(
    refresh_market_pulse_job,
    "interval",
    hours=6,
)

scheduler.add_job(
    refresh_prices_job,
    "interval",
    hours=6,
)

scheduler.add_job(
    run_cleanup,
    "interval",
    hours=24,
)