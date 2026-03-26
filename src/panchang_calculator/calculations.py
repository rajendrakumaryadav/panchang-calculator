from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from math import floor, sin, tau

from dateutil import parser

from panchang_calculator.config import get_settings
from panchang_calculator.localization import (
    NAKSHATRA_NAMES,
    PAKSHA_NAMES,
    TITHI_NAMES,
    VAAR_NAMES,
    YOGA_NAMES,
    karana_name,
    tri_name,
)

@dataclass
class LongitudeResult:
    ahargana: float
    sun_mean: float
    moon_mean: float
    sun_true: float
    moon_true: float


def normalize_angle(angle: float) -> float:
    return angle % 360.0


def _to_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def calculate_ahargana(moment: datetime) -> float:
    settings = get_settings()
    epoch = parser.isoparse(settings.epoch_iso)
    if epoch.tzinfo is None:
        epoch = epoch.replace(tzinfo=timezone.utc)

    moment_utc = _to_utc(moment)
    delta_days = (moment_utc - epoch.astimezone(timezone.utc)).total_seconds() / 86400.0
    return delta_days


def mean_longitude(base_deg: float, daily_motion_deg: float, ahargana: float, sidereal_offset: float) -> float:
    return normalize_angle(base_deg + daily_motion_deg * ahargana - sidereal_offset)


def manda_correction(mean_longitude_deg: float, apogee_deg: float, coefficient_deg: float) -> float:
    anomaly = normalize_angle(mean_longitude_deg - apogee_deg)
    return coefficient_deg * sin((anomaly / 360.0) * tau)


def compute_longitudes(moment: datetime) -> LongitudeResult:
    settings = get_settings()
    ahargana = calculate_ahargana(moment)

    sun_mean = mean_longitude(
        settings.sun_mean_at_epoch,
        settings.sun_daily_motion,
        ahargana,
        settings.sidereal_offset,
    )
    moon_mean = mean_longitude(
        settings.moon_mean_at_epoch,
        settings.moon_daily_motion,
        ahargana,
        settings.sidereal_offset,
    )

    sun_manda = manda_correction(sun_mean, settings.sun_apogee, settings.sun_manda_coeff)
    moon_manda = manda_correction(moon_mean, settings.moon_apogee, settings.moon_manda_coeff)

    sun_true = normalize_angle(sun_mean + sun_manda)
    moon_true = normalize_angle(moon_mean + moon_manda)

    return LongitudeResult(
        ahargana=ahargana,
        sun_mean=sun_mean,
        moon_mean=moon_mean,
        sun_true=sun_true,
        moon_true=moon_true,
    )


def _remaining_in_segment(value_deg: float, segment_deg: float, rate_deg_per_day: float) -> float:
    elapsed_in_segment = value_deg % segment_deg
    remaining_deg = segment_deg - elapsed_in_segment
    return (remaining_deg / rate_deg_per_day) * 24.0


def _index_name(angle: float, segment: float, names: list[str]) -> tuple[int, float]:
    idx = int(floor(normalize_angle(angle) / segment))
    return idx + 1, angle % segment


def compute_panchang(moment: datetime, use_true_positions: bool = True) -> dict:
    settings = get_settings()
    longitudes = compute_longitudes(moment)
    sun = longitudes.sun_true if use_true_positions else longitudes.sun_mean
    moon = longitudes.moon_true if use_true_positions else longitudes.moon_mean

    tithi_angle = normalize_angle(moon - sun)
    tithi_index = int(floor(tithi_angle / 12.0))
    tithi_names = tri_name(TITHI_NAMES, tithi_index)

    nakshatra_segment = 360.0 / 27.0
    nakshatra_index, _ = _index_name(moon, nakshatra_segment, NAKSHATRA_NAMES["en"])
    nakshatra_names = tri_name(NAKSHATRA_NAMES, nakshatra_index - 1)

    yoga_angle = normalize_angle(sun + moon)
    yoga_index, _ = _index_name(yoga_angle, nakshatra_segment, YOGA_NAMES["en"])
    yoga_names = tri_name(YOGA_NAMES, yoga_index - 1)

    karana_index = int(floor(tithi_angle / 6.0))
    karana_names = karana_name(karana_index)

    weekday_names = tri_name(VAAR_NAMES, moment.weekday())
    paksha = "Shukla" if tithi_index < 15 else "Krishna"
    paksha_names = PAKSHA_NAMES[paksha]

    tithi_hours = _remaining_in_segment(tithi_angle, 12.0, settings.moon_daily_motion - settings.sun_daily_motion)
    nakshatra_hours = _remaining_in_segment(moon, nakshatra_segment, settings.moon_daily_motion)
    yoga_hours = _remaining_in_segment(
        yoga_angle,
        nakshatra_segment,
        settings.moon_daily_motion + settings.sun_daily_motion,
    )
    karana_hours = _remaining_in_segment(tithi_angle, 6.0, settings.moon_daily_motion - settings.sun_daily_motion)

    return {
        "ahargana": longitudes.ahargana,
        "positions": {
            "sun": {
                "meanLongitude": longitudes.sun_mean,
                "trueLongitude": longitudes.sun_true,
                "selectedLongitude": sun,
            },
            "moon": {
                "meanLongitude": longitudes.moon_mean,
                "trueLongitude": longitudes.moon_true,
                "selectedLongitude": moon,
            },
        },
        "elements": {
            "tithi": {
                "index": tithi_index + 1,
                "name": tithi_names["en"],
                "names": tithi_names,
                "remainingHours": tithi_hours,
            },
            "nakshatra": {
                "index": nakshatra_index,
                "name": nakshatra_names["en"],
                "names": nakshatra_names,
                "remainingHours": nakshatra_hours,
            },
            "yoga": {
                "index": yoga_index,
                "name": yoga_names["en"],
                "names": yoga_names,
                "remainingHours": yoga_hours,
            },
            "karana": {
                "index": karana_index + 1,
                "name": karana_names["en"],
                "names": karana_names,
                "remainingHours": karana_hours,
            },
            "vaar": {
                "index": moment.weekday() + 1,
                "name": weekday_names["en"],
                "names": weekday_names,
            },
            "paksha": {
                "name": paksha,
                "names": paksha_names,
            },
        },
    }


def formulas() -> dict[str, dict[str, str]]:
    return {
        "ahargana": {
            "en": "Ahargana = (UTC datetime - epoch) in days",
            "hi": "अहर्गण = (UTC समय - epoch) दिनों में",
            "sa": "अहर्गणः = (UTC समय - epoch) दिनेभ्यः",
        },
        "mean_sun": {
            "en": "Mean Sun = normalize(Sun_epoch + Sun_daily * Ahargana - sidereal_offset)",
            "hi": "मध्यम सूर्य = normalize(Sun_epoch + Sun_daily * Ahargana - sidereal_offset)",
            "sa": "मध्यमसूर्यः = normalize(Sun_epoch + Sun_daily * Ahargana - sidereal_offset)",
        },
        "mean_moon": {
            "en": "Mean Moon = normalize(Moon_epoch + Moon_daily * Ahargana - sidereal_offset)",
            "hi": "मध्यम चन्द्र = normalize(Moon_epoch + Moon_daily * Ahargana - sidereal_offset)",
            "sa": "मध्यमचन्द्रः = normalize(Moon_epoch + Moon_daily * Ahargana - sidereal_offset)",
        },
        "manda": {
            "en": "True longitude = normalize(mean + C * sin(mean - apogee))",
            "hi": "स्पष्ट देशांतर = normalize(मध्यम + C * sin(मध्यम - अपसौर))",
            "sa": "स्फुटदीर्घता = normalize(मध्यम + C * sin(मध्यम - अपसौर))",
        },
        "tithi": {
            "en": "Tithi index = floor(normalize(Moon - Sun) / 12)",
            "hi": "तिथि क्रमांक = floor(normalize(चन्द्र - सूर्य) / 12)",
            "sa": "तिथ्यङ्कः = floor(normalize(चन्द्र - सूर्य) / 12)",
        },
        "nakshatra": {
            "en": "Nakshatra index = floor(Moon / (360/27))",
            "hi": "नक्षत्र क्रमांक = floor(चन्द्र / (360/27))",
            "sa": "नक्षत्राङ्कः = floor(चन्द्र / (360/27))",
        },
        "yoga": {
            "en": "Yoga index = floor(normalize(Sun + Moon) / (360/27))",
            "hi": "योग क्रमांक = floor(normalize(सूर्य + चन्द्र) / (360/27))",
            "sa": "योगाङ्कः = floor(normalize(सूर्य + चन्द्र) / (360/27))",
        },
        "karana": {
            "en": "Karana index = floor(normalize(Moon - Sun) / 6)",
            "hi": "करण क्रमांक = floor(normalize(चन्द्र - सूर्य) / 6)",
            "sa": "करणाङ्कः = floor(normalize(चन्द्र - सूर्य) / 6)",
        },
    }
