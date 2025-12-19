import { useEffect, useRef, useState, useCallback } from 'react';
import {
  drawSantaHat,
  drawMustache,
  drawReindeer,
  drawElfEars,
  drawCurvedText,
  drawSnowflakes,
  drawHeadband,
  drawGlasses,
  drawSparky,
  drawDebugMesh,
  Snowflake,
  Landmark
} from '../utils/faceFilters';

// Performance: Frame rate throttling
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export const useFaceMesh = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  currentSticker: string
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const faceMeshRef = useRef<any>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const handsRef = useRef<any>(null);
  const sparkyImageRef = useRef<HTMLImageElement | null>(null);

  // Sparky interaction state
  const sparkyStateRef = useRef({
    x: undefined as number | undefined,
    y: undefined as number | undefined,
    scale: 0.8, // Fixed default scale
    isGrabbing: false // Track if hand is currently grabbing
  });

  const requestRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // Track mount status with ref to be accessible in cleanup and across effects
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Ref to hold current sticker for use within callbacks without re-binding
  const stickerRef = useRef(currentSticker);
  useEffect(() => {
    stickerRef.current = currentSticker;

    // Clear canvas if filter is turned off
    if (currentSticker === 'none' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    // Load Sparky image if selected
    if (currentSticker === 'sparky' && !sparkyImageRef.current) {
      const img = new Image();
      img.src = '/assets/Sparky Christmas 2.webp';
      img.onload = () => {
        sparkyImageRef.current = img;
        console.log('✅ Sparky image loaded successfully!', img.width, 'x', img.height);
      };
      img.onerror = (e) => {
        console.error('❌ Failed to load Sparky image:', e);
        console.error('Attempted path:', img.src);
      };
    }
  }, [currentSticker]);

  // Initialize snowflakes
  useEffect(() => {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 50; i++) {
      flakes.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 10 + 6,
        speed: Math.random() * 0.002 + 0.001,
        opacity: Math.random() * 0.5 + 0.3,
        angle: Math.random() * Math.PI * 2,
      });
    }
    snowflakesRef.current = flakes;
  }, []);

  const onResults = useCallback((results: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure canvas dimensions match the video
    // MediaPipe results.image can be HTMLVideoElement, ImageBitmap, or other types
    const image = results.image;
    if (image) {
      // Check if it's a video element
      if ('videoWidth' in image && 'videoHeight' in image) {
        const videoEl = image as unknown as HTMLVideoElement;
        if (canvas.width !== videoEl.videoWidth || canvas.height !== videoEl.videoHeight) {
          canvas.width = videoEl.videoWidth;
          canvas.height = videoEl.videoHeight;
        }
      } else if ('width' in image && 'height' in image) {
        // ImageBitmap or HTMLImageElement
        const imgEl = image as { width: number; height: number };
        if (canvas.width !== imgEl.width || canvas.height !== imgEl.height) {
          canvas.width = imgEl.width;
          canvas.height = imgEl.height;
        }
      }
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const filter = stickerRef.current;

    // Always draw snowflakes if selected (even without face)
    if (filter === "snowflakes") {
      drawSnowflakes(ctx, snowflakesRef.current, canvas.width, canvas.height);
    }

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      setIsFaceDetected(true);

      // Loop through ALL detected faces
      results.multiFaceLandmarks.forEach((faceLandmarks: Landmark[]) => {
        const landmarks = faceLandmarks;

        switch (filter) {
          case "santa_hat":
            drawSantaHat(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "mustache":
            drawMustache(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "reindeer":
            drawReindeer(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "elf":
            drawElfEars(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "santa_text":
            drawCurvedText(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "headband":
            drawHeadband(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "glasses":
            drawGlasses(ctx, landmarks, canvas.width, canvas.height);
            break;
          case "debug":
            drawDebugMesh(ctx, landmarks, canvas.width, canvas.height);
            break;
        }
      });
    } else {
      setIsFaceDetected(false);
    }

    ctx.restore();
  }, []);

  // Handle Hand Results (for Sparky)
  const onHandResults = useCallback((results: any) => {
    const canvas = canvasRef.current;
    if (!canvas || !sparkyImageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Snowflakes if active (shared)
    if (stickerRef.current === "snowflakes") {
      drawSnowflakes(ctx, snowflakesRef.current, canvas.width, canvas.height);
    }

    // --- Hand Gesture Logic ---
    let newX = sparkyStateRef.current.x;
    let newY = sparkyStateRef.current.y;
    const newScale = sparkyStateRef.current.scale; // Fixed scale, no longer variable
    let isGrabbing = sparkyStateRef.current.isGrabbing;

    // Initialize default position if not set (center-bottom)
    if (newX === undefined || newY === undefined) {
      newX = 0.5; // Center horizontally
      newY = 0.85; // Near bottom (85% down from top)
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const hand = results.multiHandLandmarks[0];

      // Detect if hand is open or closed
      // Hand landmarks: 0=wrist, 4=thumb tip, 8=index tip, 12=middle tip, 16=ring tip, 20=pinky tip
      // PIP joints: 6=index PIP, 10=middle PIP, 14=ring PIP, 18=pinky PIP
      const isHandOpen = isHandOpenDetection(hand);

      const palmCenter = hand[9]; // Palm center landmark
      const targetX = palmCenter.x;
      const targetY = palmCenter.y;

      if (isHandOpen) {
        // Open hand: Track and update position
        // Smooth interpolation for natural movement
        newX = newX + (targetX - newX) * 0.2;
        newY = newY + (targetY - newY) * 0.2;
        isGrabbing = true; // Hand is actively grabbing
      } else {
        // Closed hand: Lock position (don't update newX, newY)
        isGrabbing = false;
      }
    } else {
      // No hand detected: Keep Sparky at current position (or default if first time)
      isGrabbing = false;
    }

    // Update Ref
    sparkyStateRef.current = {
      x: newX,
      y: newY,
      scale: newScale,
      isGrabbing
    };

    // Draw Sparky
    drawSparky(
      ctx,
      sparkyImageRef.current,
      canvas.width,
      canvas.height,
      newX,
      newY,
      newScale
    );

    ctx.restore();
  }, []);

  // Helper function to detect if hand is open
  const isHandOpenDetection = (hand: any[]): boolean => {
    // Check if fingers are extended by comparing fingertip to knuckle distances from palm
    const palmBase = hand[0]; // Wrist

    // For each finger (index, middle, ring, pinky), check if tip is farther from wrist than PIP joint
    const fingers = [
      { tip: hand[8], pip: hand[6] },   // Index finger
      { tip: hand[12], pip: hand[10] }, // Middle finger
      { tip: hand[16], pip: hand[14] }, // Ring finger
      { tip: hand[20], pip: hand[18] }  // Pinky finger
    ];

    let extendedCount = 0;
    fingers.forEach(finger => {
      const tipDist = Math.hypot(finger.tip.x - palmBase.x, finger.tip.y - palmBase.y);
      const pipDist = Math.hypot(finger.pip.x - palmBase.x, finger.pip.y - palmBase.y);

      // If tip is farther than PIP, finger is extended
      if (tipDist > pipDist * 1.1) { // 1.1 threshold for some tolerance
        extendedCount++;
      }
    });

    // Hand is open if at least 3 fingers are extended
    return extendedCount >= 3;
  };

  // Initialize FaceMesh or Hands based on sticker
  useEffect(() => {
    const init = async () => {
      try {
        if (!isMountedRef.current) return;

        const isSparkyMode = stickerRef.current === 'sparky';

        // 1. Initialize Hands for Sparky
        if (isSparkyMode) {
          if (!handsRef.current) {
            let attempts = 0;
            while (!(window as any).Hands && attempts < 100) {
              await new Promise(r => setTimeout(r, 100));
              attempts++;
            }

            if ((window as any).Hands) {
              const HandsClass = (window as any).Hands;
              const hands = new HandsClass({
                locateFile: (file: string) => {
                  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
              });

              hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
              });

              hands.onResults((results: any) => {
                if (isMountedRef.current) onHandResults(results);
              });

              handsRef.current = hands;
              console.log("Hands initialized");
            }
          }
        }
        // 2. Initialize FaceMesh for others
        else {
          if (!faceMeshRef.current) {
            let attempts = 0;
            while (!(window as any).FaceMesh && attempts < 100) {
              await new Promise(r => setTimeout(r, 100));
              attempts++;
            }

            if ((window as any).FaceMesh) {
              const FaceMeshClass = (window as any).FaceMesh;
              const faceMesh = new FaceMeshClass({
                locateFile: (file: string) => {
                  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                },
              });

              faceMesh.setOptions({
                maxNumFaces: 4,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
              });

              faceMesh.onResults((results: any) => {
                if (isMountedRef.current) onResults(results);
              });

              faceMeshRef.current = faceMesh;
              console.log("FaceMesh initialized");
            }
          }
        }

        // Performance: Frame-throttled detection loop
        const loop = async () => {
          if (!isMountedRef.current) return;

          const now = performance.now();
          const elapsed = now - lastFrameTimeRef.current;
          const video = videoRef.current;
          const canvas = canvasRef.current;

          if (video && video.readyState >= 2 && canvas) {
            // Ensure canvas matches video dimensions
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
            }

            // Fallback: If Sparky is selected but Hands not ready yet, draw Sparky anyway
            if (stickerRef.current === 'sparky' && !handsRef.current) {
              // IF NOT initialized, we must draw manually to avoid blank screen.
              // If initialized, the 'send' below will trigger onResults which clears/draws.
              if (sparkyImageRef.current) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.save();
                  ctx.clearRect(0, 0, canvas.width, canvas.height);

                  // Draw Sparky at default/last known pos
                  let { x, y, scale } = sparkyStateRef.current;
                  if (x === undefined || y === undefined) {
                    x = 0.5; y = 0.85; // Default center-bottom
                  }

                  drawSparky(ctx, sparkyImageRef.current, canvas.width, canvas.height, x, y, scale);
                  ctx.restore();
                }
              }
            }

            if (stickerRef.current !== 'none') {
              if (elapsed >= FRAME_INTERVAL) {
                lastFrameTimeRef.current = now;
                try {
                  // Route to correct detector
                  if (stickerRef.current === 'sparky' && handsRef.current) {
                    await handsRef.current.send({ image: video });
                  } else if (faceMeshRef.current) {
                    await faceMeshRef.current.send({ image: video });
                  }
                } catch (err) { }
              }
            }
          }

          requestRef.current = requestAnimationFrame(loop);
        };

        loop();

      } catch (e) {
        console.error("Initialization failed", e);
      }
    };

    init();

    return () => {
    };
  }, [videoRef, onResults, onHandResults, currentSticker]); // Added currentSticker to deps

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
        faceMeshRef.current = null;
      }
      if (handsRef.current) {
        handsRef.current.close();
        handsRef.current = null;
      }
    };
  }, []);

  return {
    canvasRef,
    isFaceDetected
  };
};
