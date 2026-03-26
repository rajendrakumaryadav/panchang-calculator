# Panchang Astronomy Visualizer

Interactive educational tool that visualizes Sun and Moon motion in a 360-degree sidereal zodiac and computes Panchang elements using simplified Surya Siddhanta-inspired formulas.

## Features

- Circular 360-degree zodiac visualization with:
	- 12 Rashis (30 degrees each)
	- 27 Nakshatras (13 degrees 20 minutes each)
- Sun and Moon longitude display with animation controls (play/pause/step)
- Datetime input and simulation speed control
- Mean vs True longitude mode toggle
- Panchang elements:
	- Tithi
	- Nakshatra
	- Yoga
	- Karana
	- Vaar
	- Paksha
- Remaining-time estimates for next element changes
- Formula layer with explanations
- Multilingual output for core Panchang values (English + Hindi + Sanskrit)

## Tech Stack

- Backend: FastAPI (Python)
- Frontend: React + Vite + Canvas API
- State management: Zustand

## Project Structure

- `src/panchang_calculator/calculations.py`: core astronomy + Panchang math
- `src/panchang_calculator/api.py`: HTTP API
- `frontend/`: React visualization app

## Mathematical Model

The current implementation is a simplified educational model:

- Ahargana = days elapsed from epoch (UTC, 2000-01-01)
- Mean motion:
	- Sun approximately 0.9856 degrees/day
	- Moon approximately 13.176 degrees/day
- Basic Manda correction:
	- True longitude = Mean longitude + C * sin(anomaly)
- Panchang formulas:
	- Tithi = floor(normalize(Moon - Sun) / 12)
	- Nakshatra = floor(Moon / (360/27))
	- Yoga = floor(normalize(Sun + Moon) / (360/27))
	- Karana = floor(normalize(Moon - Sun) / 6)

## Run Backend

Install dependencies and start the API:

```bash
cp .env.example .env
uv sync
uv run panchang-api
```

API endpoints:

- `GET /health`
- `GET /api/formulas`
- `GET /api/panchang?dt=2026-03-26T12:00:00Z&mode=true`
- `GET /api/settings`

Parameters:

- `dt`: ISO-8601 datetime (optional; defaults to now in UTC)
- `mode`: `true` or `mean`

## Run Frontend

In a separate terminal:

```bash
cd frontend
cp .env.example .env
bun install
bun run dev
```

Open http://localhost:5173.

The frontend expects backend at http://localhost:8000.

Frontend env:

- `VITE_API_BASE_URL`
- `VITE_DEFAULT_SPEED_DAYS_PER_SEC`

Backend env (root `.env`):

- API runtime: host, port, reload, CORS
- Astronomy constants: epoch, sidereal offset, mean motions, apogees, manda coefficients

## Notes

- This project focuses on clarity and learning rather than strict traditional accuracy.
- You can extend the backend with high-precision ephemeris (for example JPL/Swiss Ephemeris) behind the same API shape.
