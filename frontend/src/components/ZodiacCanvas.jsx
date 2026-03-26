import { useEffect, useMemo, useRef, useState } from 'react';

import { NAKSHATRA_NAMES, RASHI_NAMES } from '../lib/constants';
import { longitudeToRadian, SEGMENT_27 } from '../lib/math';

function drawLabel(ctx, text, x, y, color, font = '12px Space Grotesk') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

export default function ZodiacCanvas({
  sunLongitude,
  moonLongitude,
  moonNakshatraIndex,
  moonNakshatraNames,
  rotation,
  zoom,
  onRotationChange,
}) {
  const canvasRef = useRef(null);
  const [dragState, setDragState] = useState(null);

  const moonNakshatraStart = useMemo(() => {
    if (!moonNakshatraIndex) {
      return 0;
    }
    return (moonNakshatraIndex - 1) * SEGMENT_27;
  }, [moonNakshatraIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const cx = width / 2;
    const cy = height / 2;

    ctx.clearRect(0, 0, width, height);

    const baseRadius = Math.min(width, height) * 0.38;
    const radius = baseRadius * zoom;

    const bgGrad = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius * 1.3);
    bgGrad.addColorStop(0, '#193659');
    bgGrad.addColorStop(1, '#09121f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(cx, cy);

    ctx.strokeStyle = '#f2e8c6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 12; i += 1) {
      const angle = longitudeToRadian(i * 30, rotation);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      ctx.strokeStyle = '#f4b860';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
      ctx.stroke();

      const labelR = radius + 18;
      const lx = Math.cos(angle + (15 * Math.PI) / 180) * labelR;
      const ly = Math.sin(angle + (15 * Math.PI) / 180) * labelR;
      drawLabel(ctx, RASHI_NAMES[i], lx, ly, '#ffe7b0', '11px Spectral');
    }

    for (let i = 0; i < 27; i += 1) {
      const start = longitudeToRadian(i * SEGMENT_27, rotation);
      const x = Math.cos(start) * radius;
      const y = Math.sin(start) * radius;
      ctx.strokeStyle = i % 3 === 0 ? '#8ad9b7' : '#3d6b7a';
      ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    const sectorStart = longitudeToRadian(moonNakshatraStart, rotation);
    const sectorEnd = longitudeToRadian(moonNakshatraStart + SEGMENT_27, rotation);
    ctx.fillStyle = 'rgba(103, 219, 185, 0.2)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, sectorStart, sectorEnd);
    ctx.closePath();
    ctx.fill();

    const sunAngle = longitudeToRadian(sunLongitude, rotation);
    const sunX = Math.cos(sunAngle) * (radius * 0.82);
    const sunY = Math.sin(sunAngle) * (radius * 0.82);
    ctx.fillStyle = '#ffc14f';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
    ctx.fill();
    drawLabel(ctx, 'SUN', sunX, sunY - 16, '#ffd67f');

    const moonAngle = longitudeToRadian(moonLongitude, rotation);
    const moonX = Math.cos(moonAngle) * (radius * 0.92);
    const moonY = Math.sin(moonAngle) * (radius * 0.92);
    ctx.fillStyle = '#d4edff';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 7, 0, Math.PI * 2);
    ctx.fill();
    drawLabel(ctx, 'MOON', moonX, moonY - 16, '#d4edff');

    ctx.restore();

    drawLabel(
      ctx,
      `Highlighted Nakshatra: ${moonNakshatraNames?.en || NAKSHATRA_NAMES[(moonNakshatraIndex || 1) - 1]} | ${moonNakshatraNames?.hi || ''} | ${moonNakshatraNames?.sa || ''}`,
      width / 2,
      height - 20,
      '#bbf5de',
      '12px Space Grotesk',
    );
  }, [moonNakshatraIndex, moonNakshatraNames, moonNakshatraStart, moonLongitude, rotation, sunLongitude, zoom]);

  function onMouseDown(event) {
    setDragState({ x: event.clientX, baseRotation: rotation });
  }

  function onMouseMove(event) {
    if (!dragState) {
      return;
    }
    const delta = event.clientX - dragState.x;
    onRotationChange((dragState.baseRotation + delta * 0.35) % 360);
  }

  function onMouseUp() {
    setDragState(null);
  }

  return (
    <div className="zodiac-wrapper">
      <canvas
        ref={canvasRef}
        width={680}
        height={680}
        className="zodiac-canvas"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
      />
      <p className="hint">Drag horizontally to rotate the wheel. Use zoom slider for scale.</p>
    </div>
  );
}
