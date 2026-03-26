export const LOCALES = ['en', 'hi', 'sa'];

const UI_STRINGS = {
  appTitle: {
    en: 'Sidereal Zodiac Panchang Visualizer',
    hi: 'सिडेरियल राशि पंचांग विज़ुअलाइज़र',
    sa: 'सिडेरियल-राशि-पञ्चाङ्ग-दृश्यकारः',
  },
  appSubtitle: {
    en: 'Interactive Surya Siddhanta-inspired model for Sun/Moon motion in a 360-degree sidereal zodiac.',
    hi: 'सूर्य सिद्धांत प्रेरित 360-डिग्री सिडेरियल राशि में सूर्य-चन्द्र गति का इंटरैक्टिव मॉडल।',
    sa: 'सूर्यसिद्धान्तप्रेरिते 360-अंश-निरयण-राशिचक्रे सूर्यचन्द्रयोः गतिमानं परस्परक्रियात्मकं रूपम्।',
  },
  simulationControls: {
    en: 'Simulation Controls',
    hi: 'सिमुलेशन नियंत्रण',
    sa: 'अनुकरण-नियन्त्रणानि',
  },
  language: {
    en: 'Language',
    hi: 'भाषा',
    sa: 'भाषा',
  },
  dateTime: {
    en: 'Date / Time (Local)',
    hi: 'दिनांक / समय (लोकल)',
    sa: 'दिनाङ्क / समय (स्थानीय)',
  },
  positionMode: {
    en: 'Position Mode',
    hi: 'स्थिति मोड',
    sa: 'स्थिति-प्रकारः',
  },
  modeTrue: {
    en: 'True (Manda corrected)',
    hi: 'स्पष्ट (मन्द संशोधित)',
    sa: 'स्फुटः (मन्द-संशोधितः)',
  },
  modeMean: {
    en: 'Mean longitude',
    hi: 'मध्यम देशांतर',
    sa: 'मध्यम-दीर्घता',
  },
  visualizationMode: {
    en: 'Visualization Mode',
    hi: 'विज़ुअलाइज़ेशन मोड',
    sa: 'दृश्य-प्रकारः',
  },
  wheel2d: {
    en: '2D Wheel',
    hi: '2D चक्र',
    sa: '2D चक्रम्',
  },
  wheel3d: {
    en: '3D Wheel',
    hi: '3D चक्र',
    sa: '3D चक्रम्',
  },
  speed: {
    en: 'Speed (days per second)',
    hi: 'गति (दिन प्रति सेकंड)',
    sa: 'वेगः (दिनानि प्रति सेकण्डम्)',
  },
  play: { en: 'Play', hi: 'चलाएं', sa: 'चालय' },
  pause: { en: 'Pause', hi: 'रोकें', sa: 'विरामः' },
  stepMinus: { en: 'Step -1 day', hi: 'एक कदम -1 दिन', sa: 'एकपदम् -1 दिनम्' },
  stepPlus: { en: 'Step +1 day', hi: 'एक कदम +1 दिन', sa: 'एकपदम् +1 दिनम्' },
  zoom: { en: 'Zoom', hi: 'ज़ूम', sa: 'विस्तारः' },
  rotation: { en: 'Rotation', hi: 'घूर्णन', sa: 'भ्रमणम्' },
  showFormulas: {
    en: 'Show formulas and explanations',
    hi: 'सूत्र और व्याख्या दिखाएं',
    sa: 'सूत्राणि व्याख्याश्च दर्शय',
  },
  panchangDetails: { en: 'Panchang Details', hi: 'पंचांग विवरण', sa: 'पञ्चाङ्ग-विवरणम्' },
  waitingData: { en: 'Waiting for calculation data...', hi: 'गणना डेटा की प्रतीक्षा...', sa: 'गणना-दत्तांशस्य प्रतीक्षा...' },
  ahargana: { en: 'Ahargana', hi: 'अहर्गण', sa: 'अहर्गणः' },
  sunLongitude: { en: 'Sun Longitude', hi: 'सूर्य देशांतर', sa: 'सूर्यदीर्घता' },
  moonLongitude: { en: 'Moon Longitude', hi: 'चन्द्र देशांतर', sa: 'चन्द्रदीर्घता' },
  tithi: { en: 'Tithi', hi: 'तिथि', sa: 'तिथिः' },
  nakshatra: { en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्' },
  yoga: { en: 'Yoga', hi: 'योग', sa: 'योगः' },
  karana: { en: 'Karana', hi: 'करण', sa: 'करणम्' },
  vaar: { en: 'Vaar', hi: 'वार', sa: 'वारः' },
  paksha: { en: 'Paksha', hi: 'पक्ष', sa: 'पक्षः' },
  nextChange: { en: 'Time Until Next Change', hi: 'अगले परिवर्तन तक समय', sa: 'अग्रिम-परिवर्तन-पर्यन्तः कालः' },
  moonPhase: { en: 'Moon Phase Fraction', hi: 'चन्द्र कला अनुपात', sa: 'चन्द्रकलायाः अनुपातः' },
  cyclePercent: { en: 'of synodic cycle', hi: 'सिनोडिक चक्र का', sa: 'सिनोडिक-चक्रस्य' },
  formulaLayer: { en: 'Formula Layer', hi: 'सूत्र परत', sa: 'सूत्र-स्तरः' },
  calculating: { en: 'Calculating...', hi: 'गणना हो रही है...', sa: 'गणना प्रवर्तते...' },
  dragHint: { en: 'Drag horizontally to rotate the wheel. Use zoom slider for scale.', hi: 'चक्र घुमाने के लिए क्षैतिज दिशा में ड्रैग करें। आकार हेतु ज़ूम स्लाइडर उपयोग करें।', sa: 'चक्रं परिवर्तयितुं क्षैतिजदिशि आकर्षय। परिमाणार्थं विस्तार-स्लाइडरम् उपयुज्यताम्।' },
  highlightedNakshatra: { en: 'Highlighted Nakshatra', hi: 'हाइलाइट नक्षत्र', sa: 'प्रकाशितं नक्षत्रम्' },
  threeDHint: {
    en: '3D view: Rashis and Nakshatras are both rendered on the wheel.',
    hi: '3D दृश्य: चक्र पर राशि और नक्षत्र दोनों प्रदर्शित हैं।',
    sa: '3D दृश्ये चक्रे राशयः नक्षत्राणि च उभयं दर्श्यते।',
  },
};

export function t(locale, key) {
  const bucket = UI_STRINGS[key];
  if (!bucket) {
    return key;
  }
  return bucket[locale] || bucket.en;
}

export function localizeName(names, locale) {
  if (!names) {
    return '-';
  }
  if (typeof names === 'string') {
    return names;
  }
  return names[locale] || names.en || '-';
}
