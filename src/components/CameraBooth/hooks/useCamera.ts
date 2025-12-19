import { useEffect, useRef } from "react";
import { CAMERA_CONFIG } from "../constants";

interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  streamRef: React.RefObject<MediaStream | null>;
  playVideo: () => void;
}

/**
 * Custom hook for camera initialization and stream management
 */
export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG);
        
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        videoRef.current?.play().catch(() => {});
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    initCamera();

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const playVideo = () => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  };

  return {
    videoRef,
    streamRef,
    playVideo,
  };
}
