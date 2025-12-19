import { useState, useRef, useCallback } from "react";
import { COUNTDOWN_CONFIG, TOTAL_SHOTS } from "../constants";

type Shot = string | null;

interface UseCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentFilter: string;
  playVideo: () => void;
}

interface UseCaptureResult {
  shots: Shot[];
  countdown: number | null;
  showReview: boolean;
  reshootIndex: number | null;
  snapCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  currentShotIndex: number;
  allShotsTaken: boolean;
  snap: (index: number) => void;
  startSequence: () => Promise<void>;
  retake: (index: number) => void;
  retakeAll: () => void;
  setShowReview: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Custom hook for capture sequence and shot management
 */
export function useCapture({
  videoRef,
  currentFilter,
  playVideo,
}: UseCaptureProps): UseCaptureResult {
  const snapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  const [shots, setShots] = useState<Shot[]>(Array(TOTAL_SHOTS).fill(null));
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [reshootIndex, setReshootIndex] = useState<number | null>(null);

  const takeSnapshot = useCallback((): string | null => {
    if (!videoRef.current || !snapCanvasRef.current) return null;
    
    const canvas = snapCanvasRef.current;
    const v = videoRef.current;
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    
    ctx.filter = currentFilter || "";
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL("image/png");
  }, [currentFilter, videoRef]);

  const snap = useCallback((index: number) => {
    if (countdown !== null) return;

    let n = COUNTDOWN_CONFIG.duration;
    setCountdown(n);

    countdownInterval.current = setInterval(() => {
      n -= 1;
      setCountdown(n > 0 ? n : null);
      if (n <= 0 && countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    }, COUNTDOWN_CONFIG.intervalMs);

    setTimeout(() => {
      const data = takeSnapshot();
      setShots((prev) => {
        const next = [...prev];
        const targetIndex = reshootIndex !== null ? reshootIndex : index;
        next[targetIndex] = data;
        return next;
      });
      setCountdown(null);
      setReshootIndex(null);

      setShowReview((prev) => {
        const allTaken = shots
          .map((s, i) => (reshootIndex === i ? data : s))
          .every((s) => s !== null);
        return allTaken;
      });
    }, COUNTDOWN_CONFIG.duration * COUNTDOWN_CONFIG.intervalMs);
  }, [countdown, reshootIndex, shots, takeSnapshot]);

  const startSequence = useCallback(async () => {
    setShots(Array(TOTAL_SHOTS).fill(null));
    setShowReview(false);
    setReshootIndex(null);

    for (let i = 0; i < TOTAL_SHOTS; i++) {
      await new Promise<void>((resolve) => {
        let n = COUNTDOWN_CONFIG.duration;
        setCountdown(n);
        
        const t = setInterval(() => {
          n -= 1;
          setCountdown(n > 0 ? n : null);
          
          if (n <= 0) {
            clearInterval(t);
            const data = takeSnapshot();
            setShots((prev) => {
              const next = [...prev];
              next[i] = data;
              return next;
            });
            setCountdown(null);
            resolve();
          }
        }, COUNTDOWN_CONFIG.intervalMs);
      });
      
      await new Promise((r) => setTimeout(r, COUNTDOWN_CONFIG.delayBetweenShots));
    }
    
    setShowReview(true);
  }, [takeSnapshot]);

  const retake = useCallback((i: number) => {
    setShots((prev) => {
      const next = [...prev];
      next[i] = null;
      return next;
    });
    setShowReview(false);
    setCountdown(null);
    setReshootIndex(i);
    playVideo();
  }, [playVideo]);

  const retakeAll = useCallback(() => {
    setShots(Array(TOTAL_SHOTS).fill(null));
    setShowReview(false);
    setCountdown(null);
    setReshootIndex(null);
    playVideo();
  }, [playVideo]);

  const currentShotIndex = shots.findIndex((s) => s === null);
  const allShotsTaken = shots.every((s) => s !== null);

  return {
    shots,
    countdown,
    showReview,
    reshootIndex,
    snapCanvasRef,
    currentShotIndex,
    allShotsTaken,
    snap,
    startSequence,
    retake,
    retakeAll,
    setShowReview,
  };
}
