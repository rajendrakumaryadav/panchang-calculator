import { useEffect, useMemo, useRef } from 'react';

import ControlPanel from './components/ControlPanel';
import FormulaPanel from './components/FormulaPanel';
import PanchangPanel from './components/PanchangPanel';
import ZodiacCanvas from './components/ZodiacCanvas';
import ZodiacThreeScene from './components/ZodiacThreeScene';
import { usePanchangStore } from './store/usePanchangStore';

export default function App() {
  const {
    dateTimeInput,
    mode,
    speedDaysPerSecond,
    playing,
    visualizationMode,
    zoom,
    rotation,
    showFormulas,
    data,
    formulas,
    loading,
    error,
    setDateTimeInput,
    setMode,
    setSpeedDaysPerSecond,
    setPlaying,
    setVisualizationMode,
    setZoom,
    setRotation,
    setShowFormulas,
    stepDays,
    fetchPanchang,
    fetchFormulas,
  } = usePanchangStore();

  const rafRef = useRef(null);
  const lastTickRef = useRef(performance.now());

  useEffect(() => {
    fetchFormulas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (playing) {
      return undefined;
    }

    const timer = setTimeout(() => {
      fetchPanchang();
    }, 120);
    return () => clearTimeout(timer);
  }, [playing, dateTimeInput, mode, fetchPanchang]);

  useEffect(() => {
    if (!playing) {
      return undefined;
    }

    fetchPanchang();
    const intervalId = setInterval(() => {
      fetchPanchang();
    }, 250);

    return () => clearInterval(intervalId);
  }, [playing, mode, fetchPanchang]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      return;
    }

    const tick = (now) => {
      const elapsed = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      stepDays(elapsed * speedDaysPerSecond);
      rafRef.current = requestAnimationFrame(tick);
    };

    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [playing, speedDaysPerSecond, stepDays]);

  const longitudes = useMemo(() => {
    if (!data) {
      return { sun: 0, moon: 0, moonNakshatraIndex: 1, moonNakshatraNames: null };
    }

    return {
      sun: data.positions.sun.selectedLongitude,
      moon: data.positions.moon.selectedLongitude,
      moonNakshatraIndex: data.elements.nakshatra.index,
      moonNakshatraNames: data.elements.nakshatra.names,
    };
  }, [data]);

  return (
    <main className="layout">
      <section className="visual-pane">
        <h1>Sidereal Zodiac Panchang Visualizer</h1>
        <p className="subtitle">
          Interactive Surya Siddhanta-inspired model for Sun/Moon motion in a 360-degree sidereal zodiac.
        </p>

        {visualizationMode === '3d' ? (
          <ZodiacThreeScene
            sunLongitude={longitudes.sun}
            moonLongitude={longitudes.moon}
            moonNakshatraIndex={longitudes.moonNakshatraIndex}
            moonNakshatraNames={longitudes.moonNakshatraNames}
            rotation={rotation}
            zoom={zoom}
            onRotationChange={setRotation}
          />
        ) : (
          <ZodiacCanvas
            sunLongitude={longitudes.sun}
            moonLongitude={longitudes.moon}
            moonNakshatraIndex={longitudes.moonNakshatraIndex}
            moonNakshatraNames={longitudes.moonNakshatraNames}
            rotation={rotation}
            zoom={zoom}
            onRotationChange={setRotation}
          />
        )}
      </section>

      <aside className="panel-pane">
        <ControlPanel
          dateTimeInput={dateTimeInput}
          setDateTimeInput={setDateTimeInput}
          mode={mode}
          setMode={setMode}
          speedDaysPerSecond={speedDaysPerSecond}
          setSpeedDaysPerSecond={setSpeedDaysPerSecond}
          playing={playing}
          setPlaying={setPlaying}
          visualizationMode={visualizationMode}
          setVisualizationMode={setVisualizationMode}
          stepDays={stepDays}
          zoom={zoom}
          setZoom={setZoom}
          rotation={rotation}
          setRotation={setRotation}
          showFormulas={showFormulas}
          setShowFormulas={setShowFormulas}
        />

        {loading ? <p className="status">Calculating...</p> : null}
        {error ? <p className="status error">{error}</p> : null}

        <PanchangPanel data={data} />
        {showFormulas ? <FormulaPanel formulas={formulas} /> : null}
      </aside>
    </main>
  );
}
