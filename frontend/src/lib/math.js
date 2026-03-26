export const SEGMENT_27 = 360 / 27;

export function normalizeAngle(value) {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function longitudeToRadian(longitude, rotationDeg) {
  const angleDeg = normalizeAngle(longitude + rotationDeg - 90);
  return (angleDeg * Math.PI) / 180;
}

export function formatDegrees(value) {
  const normalized = normalizeAngle(value);
  return `${normalized.toFixed(2)} deg`;
}

export function remainingTimeLabel(hours) {
  if (!Number.isFinite(hours) || hours < 0) {
    return 'n/a';
  }

  const totalMinutes = Math.round(hours * 60);
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  return `${hh}h ${mm}m`;
}

export function moonPhaseFraction(moonLongitude, sunLongitude) {
  const diff = normalizeAngle(moonLongitude - sunLongitude);
  return diff / 360;
}
