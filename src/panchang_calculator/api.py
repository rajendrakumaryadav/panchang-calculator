from __future__ import annotations

from datetime import datetime, timezone

import uvicorn
from dateutil import parser
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from panchang_calculator.calculations import compute_panchang, formulas
from panchang_calculator.config import get_settings

settings = get_settings()

app = FastAPI(title="Panchang Astronomy API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _parse_dt(raw: str | None) -> datetime:
    if not raw:
        return datetime.now(timezone.utc)
    try:
        parsed = parser.isoparse(raw)
    except (TypeError, ValueError) as exc:
        raise HTTPException(status_code=400, detail="Invalid datetime format. Use ISO-8601.") from exc

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/formulas")
def get_formulas() -> dict[str, dict[str, dict[str, str]]]:
    return {"formulas": formulas()}


@app.get("/api/panchang")
def get_panchang(
    dt: str | None = Query(default=None, description="ISO datetime in UTC or local with offset"),
    mode: str = Query(default="true", pattern="^(true|mean)$"),
) -> dict:
    moment = _parse_dt(dt)
    use_true = mode == "true"
    data = compute_panchang(moment, use_true_positions=use_true)
    data["meta"] = {
        "datetimeUtc": moment.isoformat(),
        "mode": mode,
        "languages": ["en", "hi", "sa"],
    }
    return data


@app.get("/api/settings")
def get_runtime_settings() -> dict[str, str | int | float]:
    return {
        "apiHost": settings.api_host,
        "apiPort": settings.api_port,
        "epochIso": settings.epoch_iso,
        "siderealOffset": settings.sidereal_offset,
    }


def run() -> None:
    uvicorn.run(
        "panchang_calculator.api:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_reload,
    )
