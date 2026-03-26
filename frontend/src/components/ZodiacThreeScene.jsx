import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { NAKSHATRA_NAMES_BY_LOCALE, RASHI_NAMES_BY_LOCALE } from '../lib/constants';
import { localizeName, t } from '../lib/i18n';

function degToRad(value) {
  return (value * Math.PI) / 180;
}

function makeTextSprite(text, color = '#f7e9c8', size = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = `${size}px Space Grotesk`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.7, 0.42, 1);
  return sprite;
}

function makeLine(angleRad, innerRadius, outerRadius, color, opacity = 1) {
  const points = [
    new THREE.Vector3(Math.cos(angleRad) * innerRadius, Math.sin(angleRad) * innerRadius, 0.03),
    new THREE.Vector3(Math.cos(angleRad) * outerRadius, Math.sin(angleRad) * outerRadius, 0.03),
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geometry, material);
}

export default function ZodiacThreeScene({
  sunLongitude,
  moonLongitude,
  moonNakshatraIndex,
  moonNakshatraNames,
  locale,
  rotation,
  zoom,
  onRotationChange,
}) {
  const containerRef = useRef(null);
  const sceneStateRef = useRef(null);
  const targetRef = useRef({
    rotation,
    zoom,
    sunLongitude,
    moonLongitude,
    moonNakshatraIndex,
  });
  const dragRef = useRef({ dragging: false, startX: 0, baseRotation: 0 });

  useEffect(() => {
    targetRef.current = {
      rotation,
      zoom,
      sunLongitude,
      moonLongitude,
      moonNakshatraIndex,
    };
  }, [moonLongitude, moonNakshatraIndex, rotation, sunLongitude, zoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const testCanvas = document.createElement('canvas');
    const hasWebGL = !!(
      testCanvas.getContext('webgl') ||
      testCanvas.getContext('experimental-webgl')
    );
    if (!hasWebGL) {
      container.innerHTML = '<p class="hint">WebGL is not available in this browser/device. Switch to 2D mode.</p>';
      return undefined;
    }

    const initialWidth = Math.max(320, container.clientWidth || 680);
    const initialHeight = Math.max(320, container.clientHeight || initialWidth);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#09131f');

    const camera = new THREE.PerspectiveCamera(46, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 0, 10 / zoom);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(initialWidth, initialHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight('#d3ddff', 1.1);
    const directional = new THREE.DirectionalLight('#fff5cf', 1.6);
    directional.position.set(5, 7, 10);
    scene.add(ambient);
    scene.add(directional);

    const wheelGroup = new THREE.Group();
    wheelGroup.rotation.x = degToRad(62);
    scene.add(wheelGroup);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(4, 0.18, 20, 180),
      new THREE.MeshStandardMaterial({ color: '#d2ac72', roughness: 0.56, metalness: 0.24 }),
    );
    wheelGroup.add(ring);

    const rim = new THREE.Mesh(
      new THREE.RingGeometry(3.45, 4.55, 128),
      new THREE.MeshBasicMaterial({ color: '#2b4256', side: THREE.DoubleSide, transparent: true, opacity: 0.42 }),
    );
    rim.position.z = -0.04;
    wheelGroup.add(rim);

    const rashiNames = RASHI_NAMES_BY_LOCALE[locale] || RASHI_NAMES_BY_LOCALE.en;
    const nakshatraNames = NAKSHATRA_NAMES_BY_LOCALE[locale] || NAKSHATRA_NAMES_BY_LOCALE.en;
    const nakSegment = 360 / 27;

    for (let i = 0; i < 12; i += 1) {
      const a = degToRad(i * 30 - 90);
      wheelGroup.add(makeLine(a, 2.9, 4.65, '#f2bc62', 0.95));

      const labelAngle = degToRad(i * 30 + 15 - 90);
      const label = makeTextSprite(rashiNames[i], '#ffeac4', 58);
      label.position.set(Math.cos(labelAngle) * 5.2, Math.sin(labelAngle) * 5.2, 0.12);
      wheelGroup.add(label);
    }

    for (let i = 0; i < 27; i += 1) {
      const a = degToRad(i * nakSegment - 90);
      const emph = i % 3 === 0;
      wheelGroup.add(makeLine(a, 3.25, 4.2, emph ? '#91dbbf' : '#4e7286', emph ? 0.95 : 0.7));

      const labelAngle = degToRad(i * nakSegment + nakSegment * 0.5 - 90);
      const label = makeTextSprite(nakshatraNames[i], '#9ce6cb', 36);
      label.scale.set(1.45, 0.32, 1);
      label.position.set(Math.cos(labelAngle) * 3.1, Math.sin(labelAngle) * 3.1, 0.1);
      wheelGroup.add(label);
    }

    const highlightStartDeg = (Math.max(1, moonNakshatraIndex || 1) - 1) * nakSegment - 90;
    const sector = new THREE.Mesh(
      new THREE.RingGeometry(3.26, 4.18, 32, 1, degToRad(highlightStartDeg), degToRad(nakSegment)),
      new THREE.MeshBasicMaterial({ color: '#5dd6ad', transparent: true, opacity: 0.32, side: THREE.DoubleSide }),
    );
    sector.position.z = 0.06;
    wheelGroup.add(sector);

    const sunAngle = degToRad(sunLongitude - 90);
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 24, 24),
      new THREE.MeshStandardMaterial({ color: '#ffc45a', emissive: '#7d5324', emissiveIntensity: 0.8 }),
    );
    sun.position.set(Math.cos(sunAngle) * 3.95, Math.sin(sunAngle) * 3.95, 0.22);
    wheelGroup.add(sun);

    const moonAngle = degToRad(moonLongitude - 90);
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 24, 24),
      new THREE.MeshStandardMaterial({ color: '#d7eeff', emissive: '#274259', emissiveIntensity: 0.7 }),
    );
    moon.position.set(Math.cos(moonAngle) * 4.22, Math.sin(moonAngle) * 4.22, 0.2);
    wheelGroup.add(moon);

    const sunLabel = makeTextSprite('SUN', '#ffd58a', 44);
    sunLabel.scale.set(0.88, 0.28, 1);
    sunLabel.position.set(Math.cos(sunAngle) * 4.4, Math.sin(sunAngle) * 4.4, 0.35);
    wheelGroup.add(sunLabel);

    const moonLabel = makeTextSprite('MOON', '#d2edff', 44);
    moonLabel.scale.set(0.98, 0.28, 1);
    moonLabel.position.set(Math.cos(moonAngle) * 4.72, Math.sin(moonAngle) * 4.72, 0.35);
    wheelGroup.add(moonLabel);

    wheelGroup.rotation.z = degToRad(rotation);

    const startTime = performance.now();
    let frameId = 0;

    sceneStateRef.current = {
      renderer,
      camera,
      scene,
      wheelGroup,
      sector,
      sun,
      moon,
      sunLabel,
      moonLabel,
      currentRotation: rotation,
      currentZoom: zoom,
      lastNakshatraIndex: -1,
    };

    const updateBodies = () => {
      const state = sceneStateRef.current;
      if (!state) {
        return;
      }

      const nextSunAngle = degToRad(targetRef.current.sunLongitude - 90);
      const nextMoonAngle = degToRad(targetRef.current.moonLongitude - 90);

      state.sun.position.set(Math.cos(nextSunAngle) * 3.95, Math.sin(nextSunAngle) * 3.95, 0.22);
      state.moon.position.set(Math.cos(nextMoonAngle) * 4.22, Math.sin(nextMoonAngle) * 4.22, 0.2);
      state.sunLabel.position.set(Math.cos(nextSunAngle) * 4.4, Math.sin(nextSunAngle) * 4.4, 0.35);
      state.moonLabel.position.set(Math.cos(nextMoonAngle) * 4.72, Math.sin(nextMoonAngle) * 4.72, 0.35);

      const currentNakshatraIndex = Math.max(1, targetRef.current.moonNakshatraIndex || 1);
      if (currentNakshatraIndex !== state.lastNakshatraIndex) {
        const startDeg = (currentNakshatraIndex - 1) * nakSegment - 90;
        state.sector.geometry.dispose();
        state.sector.geometry = new THREE.RingGeometry(3.26, 4.18, 32, 1, degToRad(startDeg), degToRad(nakSegment));
        state.lastNakshatraIndex = currentNakshatraIndex;
      }
    };

    updateBodies();

    const animate = () => {
      const state = sceneStateRef.current;
      if (!state) {
        return;
      }

      const t = (performance.now() - startTime) * 0.001;
      state.currentRotation += (targetRef.current.rotation - state.currentRotation) * 0.12;
      state.currentZoom += (targetRef.current.zoom - state.currentZoom) * 0.12;

      state.wheelGroup.rotation.y = Math.sin(t * 0.9) * 0.08;
      state.wheelGroup.rotation.z = degToRad(state.currentRotation);
      state.camera.position.z = 10 / Math.max(0.65, state.currentZoom);

      updateBodies();

      state.renderer.render(state.scene, state.camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      const nextWidth = Math.max(320, container.clientWidth || 680);
      const nextHeight = Math.max(320, container.clientHeight || nextWidth);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    const onPointerDown = (event) => {
      dragRef.current.dragging = true;
      dragRef.current.startX = event.clientX;
      dragRef.current.baseRotation = targetRef.current.rotation;
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (event) => {
      if (!dragRef.current.dragging) {
        return;
      }
      const delta = event.clientX - dragRef.current.startX;
      const nextRotation = (dragRef.current.baseRotation + delta * 0.35) % 360;
      targetRef.current.rotation = nextRotation;
      if (onRotationChange) {
        onRotationChange(nextRotation);
      }
    };

    const onPointerUp = () => {
      dragRef.current.dragging = false;
      container.style.cursor = 'grab';
    };

    container.style.cursor = 'grab';
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      sceneStateRef.current = null;
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [locale, onRotationChange]);

  return (
    <div className="zodiac-wrapper">
      <div ref={containerRef} className="zodiac-three" />
      <p className="hint">
        {t(locale, 'threeDHint')} {t(locale, 'highlightedNakshatra')}: {localizeName(moonNakshatraNames, locale)}
      </p>
    </div>
  );
}
