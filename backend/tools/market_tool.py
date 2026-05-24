from datetime import datetime, timedelta
from db.supabase_client import supabase


def get_latest_market_snapshot():
    latest_row = (
        supabase.table("shrimp_prices")
        .select("market_date")
        .order("market_date", desc=True)
        .limit(1)
        .execute()
    )

    if not latest_row.data:
        return None

    latest_date = latest_row.data[0]["market_date"]

    rows = (
        supabase.table("shrimp_prices")
        .select("*")
        .eq("market_date", latest_date)
        .eq("city", "Bhimavaram")
        .eq("shrimp_type", "Vannamei")
        .order("count_size")
        .execute()
    )

    return {
        "market_date": latest_date,
        "prices": rows.data
    }


def get_price_for_count(count_size="40 C"):
    snapshot = get_latest_market_snapshot()

    if not snapshot:
        return None

    for row in snapshot["prices"]:
        if row["count_size"] == count_size:
            return row

    return None


def get_yesterday_delta(count_size="40 C"):
    latest = (
        supabase.table("shrimp_prices")
        .select("market_date")
        .order("market_date", desc=True)
        .limit(2)
        .execute()
    )

    if len(latest.data) < 2:
        return None

    latest_date = latest.data[0]["market_date"]
    prev_date = latest.data[1]["market_date"]

    latest_price = (
        supabase.table("shrimp_prices")
        .select("price")
        .eq("market_date", latest_date)
        .eq("count_size", count_size)
        .single()
        .execute()
    )

    prev_price = (
        supabase.table("shrimp_prices")
        .select("price")
        .eq("market_date", prev_date)
        .eq("count_size", count_size)
        .single()
        .execute()
    )

    if not latest_price.data or not prev_price.data:
        return None

    delta = latest_price.data["price"] - prev_price.data["price"]

    return {
        "latest": latest_price.data["price"],
        "previous": prev_price.data["price"],
        "delta": delta
    }