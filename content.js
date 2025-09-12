const DEFAULT_SCALE = { tonic: 'C', mode: 'major' };

const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];
const WHITE_KEY_HEIGHT = 0.8;
const BLACK_KEY_HEIGHT = 0.4;

// const TEXT_COLOR = '#FFD700'; // golden
const BLACK_KEY_TEXT_COLOR = '#ffA500'; // orange
const WHITE_KEY_TEXT_COLOR = '#e8630a'; // dark orange
const TEXT_FONT = 'bold 24px Roboto';
const MODES = {
  major: '1 2 3 4 5 6 7',
  minor: '6 7 1 2 3 4 5',
  dorian: '6 7 1 2 3 #4 5',
  phrygian: '6 b2 b3 4 5 b6 b7',
  lydian: '1 2 3 #4 5 6 7',
  mixolydian: '1 2 3 4 5 6 b7',
  locrian: '1 b2 b3 4 b5 b6 b7',
  blues_minor: '6 1 2 b3 3 5',
};

const WHITE_KEYS_PATTERN = [0, 2, 4, 5, 7, 9, 11]; // for white key check
const FIRST_MIDI = 21;
const KEY_COUNT = 88;

function noteToSemitone(note) {
  return NOTE_NAMES.indexOf(note.toUpperCase());
}

function isWhiteKey(semitone) {
  return WHITE_KEYS_PATTERN.includes(semitone % 12);
}

function buildScale(tonic, mode) {
  const tonicSemitone = noteToSemitone(tonic);
  const modeStr = MODES[mode.toLowerCase()];
  if (!modeStr) throw new Error(`Unsupported mode: ${mode}`);

  const scaleSteps = modeStr.split(' '); // e.g. ['6', '7', '1', '2', '3', '#4', '5']
  const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];

  // Find what degree is labeled for tonic（主音位置的简谱标号）
  const tonicDegree = scaleSteps[0]; // e.g. '6' for dorian

  // Use this to align calculated semitones so that tonic is aligned with first label
  // e.g. 6 -> index 5
  const tonicIndex = parseInt(tonicDegree.replace(/[b#]/g, ''));
  const tonicOffset = MAJOR_SCALE[(tonicIndex - 1) % 7];

  const semitoneMap = [];
  const labelMap = {};

  for (const label of scaleSteps) {
    const baseDegree = parseInt(label.replace(/[b#]/g, '')); // 1~7
    if (isNaN(baseDegree) || baseDegree < 1 || baseDegree > 7) continue;

    let semitone = MAJOR_SCALE[(baseDegree - 1) % 7];

    // Apply accidental
    if (label.includes('b')) semitone -= 1;
    if (label.includes('#')) semitone += 1;

    // Align so that first degree matches tonic
    const relativeSemitone = (semitone - tonicOffset + 12) % 12;

    const finalSemitone = (tonicSemitone + relativeSemitone) % 12;

    semitoneMap.push(finalSemitone);
    labelMap[finalSemitone] = label;
  }

  return { semitones: semitoneMap, labels: labelMap };
}

function renderNotes(ctx, canvasWidth, canvasHeight, tonic, mode) {
  const { labels } = buildScale(tonic, mode);

  // Count white keys
  let whiteKeyCount = 0;
  for (
    let midiNote = FIRST_MIDI;
    midiNote < FIRST_MIDI + KEY_COUNT;
    midiNote++
  ) {
    if (isWhiteKey(midiNote % 12)) whiteKeyCount++;
  }

  const whiteKeyWidth = canvasWidth / whiteKeyCount;
  const WHITE_KEY_TEXT_Y = canvasHeight * WHITE_KEY_HEIGHT;
  const BLACK_KEY_TEXT_Y = canvasHeight * BLACK_KEY_HEIGHT;

  let whiteKeyIndex = 0;
  ctx.font = TEXT_FONT;
  ctx.textAlign = 'center';

  for (
    let midiNote = FIRST_MIDI;
    midiNote < FIRST_MIDI + KEY_COUNT;
    midiNote++
  ) {
    const semitone = midiNote % 12;
    const isWhite = isWhiteKey(semitone);
    const label = labels[semitone]; // undefined if not in scale

    if (label) {
      if (isWhite) {
        ctx.fillStyle = WHITE_KEY_TEXT_COLOR;
        const x = whiteKeyIndex * whiteKeyWidth + whiteKeyWidth / 2;
        ctx.fillText(label, x, WHITE_KEY_TEXT_Y);
      } else {
        ctx.fillStyle = BLACK_KEY_TEXT_COLOR;
        const x = (whiteKeyIndex - 1) * whiteKeyWidth + whiteKeyWidth * 1;
        ctx.fillText(label, x, BLACK_KEY_TEXT_Y);
      }
    }

    if (isWhite) whiteKeyIndex++;
  }
}

function addScaleOverlayToVideo(videoElement, tonic, mode) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Make video container relative for absolute positioning
  const container = videoElement.parentElement;
  container.style.position = 'relative';

  // Style the canvas overlay
  canvas.style.position = 'absolute';
  canvas.style.bottom = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '10';

  // Add canvas to DOM
  container.appendChild(canvas);

  // Resize function (called on init and on resize)
  function resizeAndRender() {
    canvas.width = videoElement.clientWidth;
    // canvas 高度 = video 高度的 1/4
    canvas.height = videoElement.clientHeight * 0.25;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 传入 canvas 高度
    renderNotes(ctx, canvas.width, canvas.height, tonic, mode);
  }

  // Watch for video resizing
  const resizeObserver = new ResizeObserver(resizeAndRender);
  resizeObserver.observe(videoElement);

  // Initial render
  resizeAndRender();

  return canvas;
}

function getBVIdFromUrl(url) {
  const match = url.match(/(BV[0-9A-Za-z]+)/);
  if (match) {
    return match[1];
  }
}

function getScaleForTime(scaleList, currentTime) {
  const toSeconds = (timeStr) => {
    const [min, sec] = timeStr.split(':').map(Number);
    return min * 60 + sec;
  };

  const currentSec = toSeconds(currentTime);

  // Find the latest scale change whose time <= current time
  let active = DEFAULT_SCALE;
  for (const entry of scaleList) {
    if (toSeconds(entry.time) <= currentSec) {
      active = entry;
    } else {
      break; // assume list is sorted
    }
  }
  return active;
}

async function fetchScaleMap() {
  // 1. Try custom URL from settings
  let customUrl = '';
  try {
    const items = await chrome.storage.sync.get({ customJsonUrl: '' });
    if (items) {
      customUrl = items.customJsonUrl;
    }
  } catch (e) {
    console.error(
      'Bilibili-Doremi: Could not access storage. Custom URL will not be used.',
      e,
    );
  }

  if (customUrl) {
    try {
      console.log(
        `Bilibili-Doremi: Loading custom scale map from ${customUrl}`,
      );
      const response = await fetch(customUrl);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error(
        `Bilibili-Doremi: Failed to load custom scale map from ${customUrl}. Will try default.`,
        e,
      );
    }
  }

  // 2. Try the default GitHub URL
  const defaultGitHubUrl =
    'https://raw.githubusercontent.com/bilibili-doremi/bilibili-doremi-data/main/scales.json';
  try {
    console.log(
      `Bilibili-Doremi: Loading default scale map from ${defaultGitHubUrl}`,
    );
    const response = await fetch(defaultGitHubUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (e) {
    console.error(
      `Bilibili-Doremi: Failed to load any scale map. The extension may not work.`,
      e,
    );
  }

  return {}; // Return an empty map if all sources fail
}

async function setup() {
  const SCALE_MAP = await fetchScaleMap();

  let currentOverlay = null;
  let currentKey = null;

  function checkAndUpdateScale() {
    const BV_ID = getBVIdFromUrl(location.href);
    console.log(`BV ID: ${BV_ID}`);
    if (!BV_ID) return;

    const scaleChanges = SCALE_MAP[BV_ID];

    if (!scaleChanges) {
      if (currentOverlay) {
        currentOverlay.remove();
        currentOverlay = null;
        currentKey = null;
      }
      return; // No scale config for this video
    }

    const videoElement = document.querySelector('#bilibili-player video');
    const currentTimeSpan = document.querySelector(
      '.bpx-player-ctrl-time-current',
    );

    if (!videoElement || !currentTimeSpan) return;

    const currentTime = currentTimeSpan.textContent.trim();
    const nextScale = getScaleForTime(scaleChanges, currentTime);

    if (nextScale && `${nextScale.tonic}_${nextScale.mode}` !== currentKey) {
      currentKey = `${nextScale.tonic}_${nextScale.mode}`;
      if (currentOverlay) {
        currentOverlay.remove();
        currentOverlay = null;
      }
      currentOverlay = addScaleOverlayToVideo(
        videoElement,
        nextScale.tonic,
        nextScale.mode,
      );
    }
  }

  function check() {
    checkAndUpdateScale();
  }

  // Run check every second
  setInterval(check, 1000);
}

setup();
