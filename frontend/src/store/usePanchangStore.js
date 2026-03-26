import { create } from 'zustand';

import { API_BASE_URL, DEFAULT_SPEED_DAYS_PER_SECOND } from '../lib/config';

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatDateTimeLocal(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const nowIso = formatDateTimeLocal(new Date());

export const usePanchangStore = create((set, get) => ({
  dateTimeInput: nowIso,
  mode: 'true',
  speedDaysPerSecond: DEFAULT_SPEED_DAYS_PER_SECOND,
  playing: false,
  visualizationMode: '2d',
  locale: 'en',
  zoom: 1,
  rotation: 0,
  showFormulas: false,
  data: null,
  formulas: {},
  loading: false,
  error: '',

  setDateTimeInput: (dateTimeInput) => set({ dateTimeInput }),
  setMode: (mode) => set({ mode }),
  setSpeedDaysPerSecond: (speedDaysPerSecond) => set({ speedDaysPerSecond }),
  setPlaying: (playing) => set({ playing }),
  setVisualizationMode: (visualizationMode) => set({ visualizationMode }),
  setLocale: (locale) => set({ locale }),
  setZoom: (zoom) => set({ zoom }),
  setRotation: (rotation) => set({ rotation }),
  setShowFormulas: (showFormulas) => set({ showFormulas }),

  stepDays: (days) => {
    const date = new Date(get().dateTimeInput);
    date.setTime(date.getTime() + days * 24 * 3600 * 1000);
    set({ dateTimeInput: formatDateTimeLocal(date) });
  },

  fetchFormulas: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/formulas`);
      if (!response.ok) {
        throw new Error('Unable to fetch formulas.');
      }
      const body = await response.json();
      set({ formulas: body.formulas || {} });
    } catch (error) {
      set({ error: error.message || 'Formula request failed.' });
    }
  },

  fetchPanchang: async () => {
    const { dateTimeInput, mode } = get();
    const dtIso = new Date(dateTimeInput).toISOString();
    set({ loading: true, error: '' });

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/panchang?dt=${encodeURIComponent(dtIso)}&mode=${mode}`,
      );
      if (!response.ok) {
        throw new Error('Unable to fetch Panchang data.');
      }
      const body = await response.json();
      set({ data: body, loading: false });
    } catch (error) {
      set({ error: error.message || 'Request failed.', loading: false });
    }
  },
}));
