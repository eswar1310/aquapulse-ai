from fastapi import APIRouter

from services.weather_service import (
    fetch_weather,
)
from tools.weather_signal_tool import (
    interpret_weather_signal,
    save_weather_signal,
    get_latest_weather_signal,
)

router = APIRouter(
    prefix="/weather-signals",
    tags=["weather"],
)


@router.post("/refresh")
def refresh_weather():
    weather_data = fetch_weather(
        "Bhimavaram"
    )

    signal = interpret_weather_signal(
        weather_data
    )

    saved = save_weather_signal(
        location="Bhimavaram",
        weather_data=weather_data,
        signal=signal,
    )

    return saved


@router.get("/latest")
def latest_weather():
    return get_latest_weather_signal()