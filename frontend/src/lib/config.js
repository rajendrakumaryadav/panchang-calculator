const DEFAULT_API_BASE_URL = 'http://localhost:8000';
const DEFAULT_SPEED = 0.25;

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

const parsedSpeed = Number(import.meta.env.VITE_DEFAULT_SPEED_DAYS_PER_SEC);
export const DEFAULT_SPEED_DAYS_PER_SECOND = Number.isFinite(parsedSpeed) && parsedSpeed > 0
  ? parsedSpeed
  : DEFAULT_SPEED;
