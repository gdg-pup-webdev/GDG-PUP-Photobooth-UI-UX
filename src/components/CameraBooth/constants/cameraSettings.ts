// Camera configuration settings
export const CAMERA_CONFIG = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user",
  },
  audio: false,
} as const;

// Photostrip canvas settings
export const PHOTOSTRIP_CONFIG = {
  width: 1666,
  height: 3000,
  quality: 0.7,
  frameImage: "/polaroid.png",
  slots: [
    { x: 130, y: 134, w: 1395, h: 801 },
    { x: 130, y: 951, w: 1395, h: 801 },
    { x: 130, y: 1769, w: 1395, h: 801 },
  ],
  padding: 40,
  borderRadius: 30,
} as const;

// Countdown settings
export const COUNTDOWN_CONFIG = {
  duration: 3,
  intervalMs: 1000,
  delayBetweenShots: 400,
} as const;

// Total shots in a session
export const TOTAL_SHOTS = 3;
