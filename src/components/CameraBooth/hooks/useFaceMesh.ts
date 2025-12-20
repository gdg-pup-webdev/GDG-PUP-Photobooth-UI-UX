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

// ===== PERFORMANCE OPTIMIZATION CONSTANTS =====
// Dynamic FPS based on face count for smooth performance
const getFPSForFaceCount = (faceCount: number): number => {
  if (faceCount >= 4) return 12;  // 4+ faces: lowest FPS
  if (faceCount >= 3) return 15;  // 3 faces: low FPS
  if (faceCount >= 2) return 20;  // 2 faces: medium FPS
  return 30;                       // 1 face: full FPS
};

// Frame skip configuration for detection vs rendering
const DETECTION_SKIP_FRAMES = 2; // Only run ML detection every N frames
const RENDER_EVERY_FRAME = true; // Always render cached results

// Debounce configuration for state updates
const STATE_UPDATE_DEBOUNCE_MS = 100;

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

  // ===== PERFORMANCE: Cached results for frame reuse =====
  const cachedResultsRef = useRef<any>(null);
  const frameCountRef = useRef<number>(0);
  const currentFPSRef = useRef<number>(30);
  const lastStateUpdateRef = useRef<number>(0);
  const faceCountRef = useRef<number>(0);

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

  // Initialize snowflakes with reduced count for performance
  useEffect(() => {
    const flakes: Snowflake[] = [];
    // Reduced from 50 to 30 for better performance
    const flakeCount = 30;
    for (let i = 0; i < flakeCount; i++) {
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

  // ===== OPTIMIZED: Render function using cached results =====
  const renderCachedResults = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const results = cachedResultsRef.current;
    const filter = stickerRef.current;
    const faceCount = faceCountRef.current;

    // Performance mode: simplify rendering when many faces
    const isPerformanceMode = faceCount >= 2;

    // Always draw snowflakes if selected (even without face)
    if (filter === "snowflakes") {
      drawSnowflakes(ctx, snowflakesRef.current, canvas.width, canvas.height);
    }

    if (results?.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      // Loop through ALL detected faces
      results.multiFaceLandmarks.forEach((faceLandmarks: Landmark[]) => {
        const landmarks = faceLandmarks;

        // In performance mode, skip expensive effects
        if (isPerformanceMode) {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

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
    }
  }, []);

  const onResults = useCallback((results: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ===== PERFORMANCE: Cache results for frame reuse =====
    cachedResultsRef.current = results;

    // Update face count and dynamic FPS
    const newFaceCount = results.multiFaceLandmarks?.length || 0;
    if (newFaceCount !== faceCountRef.current) {
      faceCountRef.current = newFaceCount;
      currentFPSRef.current = getFPSForFaceCount(newFaceCount);
      console.log(`🎯 Faces: ${newFaceCount}, FPS: ${currentFPSRef.current}`);
    }

    // Ensure canvas dimensions match the video
    const image = results.image;
    if (image) {
      if ('videoWidth' in image && 'videoHeight' in image) {
        const videoEl = image as unknown as HTMLVideoElement;
        if (canvas.width !== videoEl.videoWidth || canvas.height !== videoEl.videoHeight) {
          canvas.width = videoEl.videoWidth;
          canvas.height = videoEl.videoHeight;
        }
      } else if ('width' in image && 'height' in image) {
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

    // Render using cached results
    renderCachedResults(ctx, canvas);

    // ===== PERFORMANCE: Debounced state update =====
    const now = performance.now();
    const hasFaces = results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0;
    if (now - lastStateUpdateRef.current > STATE_UPDATE_DEBOUNCE_MS) {
      setIsFaceDetected(hasFaces);
      lastStateUpdateRef.current = now;
    }

    ctx.restore();
  }, [renderCachedResults]);

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
    const newScale = sparkyStateRef.current.scale;
    let isGrabbing = sparkyStateRef.current.isGrabbing;

    // Initialize default position if not set (center-bottom)
    if (newX === undefined || newY === undefined) {
      newX = 0.5;
      newY = 0.85;
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const hand = results.multiHandLandmarks[0];
      const isHandOpen = isHandOpenDetection(hand);

      const palmCenter = hand[9];
      const targetX = palmCenter.x;
      const targetY = palmCenter.y;

      if (isHandOpen) {
        newX = newX + (targetX - newX) * 0.2;
        newY = newY + (targetY - newY) * 0.2;
        isGrabbing = true;
      } else {
        isGrabbing = false;
      }
    } else {
      isGrabbing = false;
    }

    sparkyStateRef.current = {
      x: newX,
      y: newY,
      scale: newScale,
      isGrabbing
    };

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
    const palmBase = hand[0];

    const fingers = [
      { tip: hand[8], pip: hand[6] },
      { tip: hand[12], pip: hand[10] },
      { tip: hand[16], pip: hand[14] },
      { tip: hand[20], pip: hand[18] }
    ];

    let extendedCount = 0;
    fingers.forEach(finger => {
      const tipDist = Math.hypot(finger.tip.x - palmBase.x, finger.tip.y - palmBase.y);
      const pipDist = Math.hypot(finger.pip.x - palmBase.x, finger.pip.y - palmBase.y);

      if (tipDist > pipDist * 1.1) {
        extendedCount++;
      }
    });

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
                modelComplexity: 0, // 🔥 PERFORMANCE: Reduced from 1 to 0
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
              });

              hands.onResults((results: any) => {
                if (isMountedRef.current) onHandResults(results);
              });

              handsRef.current = hands;
              console.log("✅ Hands initialized (optimized mode)");
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

              // 🔥 PERFORMANCE: Optimized settings
              faceMesh.setOptions({
                maxNumFaces: 4,
                refineLandmarks: false,  // 🔥 DISABLED: Reduces landmarks from 478 to 468
                minDetectionConfidence: 0.4,  // Slightly lower for speed
                minTrackingConfidence: 0.4,   // Slightly lower for speed
              });

              faceMesh.onResults((results: any) => {
                if (isMountedRef.current) onResults(results);
              });

              faceMeshRef.current = faceMesh;
              console.log("✅ FaceMesh initialized (optimized mode - refineLandmarks: false)");
            }
          }
        }

        // ===== PERFORMANCE: Optimized detection loop with frame skipping =====
        const loop = async () => {
          if (!isMountedRef.current) return;

          const now = performance.now();
          const dynamicFrameInterval = 1000 / currentFPSRef.current;
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
              if (sparkyImageRef.current) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.save();
                  ctx.clearRect(0, 0, canvas.width, canvas.height);

                  let { x, y, scale } = sparkyStateRef.current;
                  if (x === undefined || y === undefined) {
                    x = 0.5; y = 0.85;
                  }

                  drawSparky(ctx, sparkyImageRef.current, canvas.width, canvas.height, x, y, scale);
                  ctx.restore();
                }
              }
            }

            if (stickerRef.current !== 'none') {
              frameCountRef.current++;

              // 🔥 PERFORMANCE: Only run ML detection every N frames
              const shouldRunDetection = frameCountRef.current % DETECTION_SKIP_FRAMES === 0;

              if (elapsed >= dynamicFrameInterval) {
                lastFrameTimeRef.current = now;

                if (shouldRunDetection) {
                  try {
                    // Route to correct detector
                    if (stickerRef.current === 'sparky' && handsRef.current) {
                      await handsRef.current.send({ image: video });
                    } else if (faceMeshRef.current) {
                      await faceMeshRef.current.send({ image: video });
                    }
                  } catch (err) { }
                } else if (RENDER_EVERY_FRAME && cachedResultsRef.current) {
                  // 🔥 PERFORMANCE: Render cached results on skipped frames
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.save();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    renderCachedResults(ctx, canvas);
                    ctx.restore();
                  }
                }
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
  }, [videoRef, onResults, onHandResults, currentSticker, renderCachedResults]);

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
