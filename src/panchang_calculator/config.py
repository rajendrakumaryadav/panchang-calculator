from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="PANCHANG_",
        extra="ignore",
    )

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_reload: bool = True
    api_cors_origins: str = "*"

    sidereal_offset: float = 24.0
    sun_daily_motion: float = 0.9856
    moon_daily_motion: float = 13.176
    sun_mean_at_epoch: float = 280.147
    moon_mean_at_epoch: float = 218.316
    sun_apogee: float = 77.0
    moon_apogee: float = 90.0
    sun_manda_coeff: float = 1.9
    moon_manda_coeff: float = 6.3
    epoch_iso: str = "2000-01-01T00:00:00+00:00"

    @property
    def cors_origins(self) -> list[str]:
        if self.api_cors_origins.strip() == "*":
            return ["*"]
        return [item.strip() for item in self.api_cors_origins.split(",") if item.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
