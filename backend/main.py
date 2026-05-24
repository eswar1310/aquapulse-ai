from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.analyze_report import router as report_router
from api.chat import router as chat_router
from api.market_pulse import (
    router as market_pulse_router
)
from api.disease_scan import router as disease_router
from api.news_signals import (
    router as news_router
)
from api.weather_signals import (
    router as weather_router
)
from contextlib import asynccontextmanager
from scheduler import start_scheduler, scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    scheduler.shutdown()

app = FastAPI(title="AquaPulse Backend", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(news_router)
app.include_router(weather_router)
app.include_router(report_router)
app.include_router(chat_router)
app.include_router(disease_router)
app.include_router(market_pulse_router)


@app.get("/")
def root():
    return {"message": "AquaPulse backend running"}