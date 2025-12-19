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
  Snowflake,
  Landmark
} from '../utils/faceFilters';

export const useFaceMesh = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  currentSticker: string
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const faceMeshRef = useRef<any>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const requestRef = useRef<number | null>(null);
  
  // Ref to hold current sticker for use within callbacks without re-binding
  const stickerRef = useRef(currentSticker);
  useEffect(() => {
    stickerRef.current = currentSticker;
    
    // Clear canvas if filter is turned off
    if (currentSticker === 'none' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
    // The 'image' property in results is the input video/image
    const image = results.image;
    if (image && (canvas.width !== image.width || canvas.height !== image.height)) {
        canvas.width = image.width;
        canvas.height = image.height;
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
        }
      });
    } else {
      setIsFaceDetected(false);
    }
    
    ctx.restore();
  }, []);

  // Initialize FaceMesh
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      try {
        // Load Script if needed
        if (!(window as any).FaceMesh) {
            await new Promise<void>((resolve, reject) => {
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
                script.crossOrigin = "anonymous";
                script.onload = () => resolve();
                script.onerror = () => reject(new Error("Failed to load MediaPipe"));
                document.head.appendChild(script);
            });
        }

        if (!isMounted) return;

        const FaceMeshClass = (window as any).FaceMesh;
        if (FaceMeshClass) {
            const faceMesh = new FaceMeshClass({
                locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
            });

            faceMesh.setOptions({
                maxNumFaces: 4,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            faceMesh.onResults((results: any) => {
                if (isMounted) onResults(results);
            });

            faceMeshRef.current = faceMesh;
        }

        // Start Loop
        const loop = async () => {
            if (!isMounted) return;
            
            const video = videoRef.current;
            if (video && video.readyState >= 2 && faceMeshRef.current) {
                if (stickerRef.current !== 'none') {
                    await faceMeshRef.current.send({ image: video });
                } else if (canvasRef.current) {
                     // Clear canvas if no sticker (optional, mostly handled by effect)
                }
            }
            
            requestRef.current = requestAnimationFrame(loop);
        };
        
        loop();

      } catch (e) {
        console.error("FaceMesh initialization failed", e);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (faceMeshRef.current) faceMeshRef.current.close();
    };
  }, [videoRef, onResults]);

  return {
    canvasRef,
    isFaceDetected
  };
};
