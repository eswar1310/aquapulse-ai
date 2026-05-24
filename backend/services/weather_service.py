import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv(
    "OPENWEATHER_API_KEY"
)


def fetch_weather(
    city: str = "Bhimavaram",
):
    url = (
        "https://api.openweathermap.org/data/2.5/weather"
    )

    params = {
        "q": city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
    }

    response = requests.get(
        url,
        params=params,
        timeout=30,
    )

    response.raise_for_status()

    return response.json()