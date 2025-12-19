import { CountdownOverlay, ShotProgress, colors } from "../../ui";

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  faceMeshCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  currentFilter: string;
  countdown: number | null;
  shots: (string | null)[];
  currentShotIndex: number;
  showReview: boolean;
  allShotsTaken: boolean;
}

/**
 * CameraPreview Component
 * Video preview with countdown overlay and shot progress
 */
export default function CameraPreview({
  videoRef,
  faceMeshCanvasRef,
  currentFilter,
  countdown,
  shots,
  currentShotIndex,
  showReview,
  allShotsTaken,
}: CameraPreviewProps) {
  return (
    <div className="relative flex-1 aspect-[3/4] max-h-[85vh]">
      {/* Decorative Wreath - positioned outside the clipped area */}
      <img
        src="/assets/Wreath.webp"
        alt="Christmas Wreath"
        className="absolute -top-12 -left-12 w-32 h-32 md:w-40 md:h-40 object-contain z-30 pointer-events-none rotate-[-30deg]"
      />

      {/* Inner container that clips content */}
      <div
        className="relative w-full h-full rounded-l-3xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1a1a2e, #0f0f0f)",
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          animation: "glow 8s ease-in-out infinite",
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{
            filter: currentFilter,
            transform: "scaleX(-1)", // Mirror the video like a selfie camera
          }}
          muted
          playsInline
        />

        {/* Sticker Canvas (Face Mesh) - Apply filter to match photo output */}
        <canvas
          ref={faceMeshCanvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ 
            transform: "scaleX(-1)",
            filter: currentFilter 
          }}
        />

        {/* Decorative border gradient */}
        <div
          className="absolute inset-0 rounded-l-3xl pointer-events-none z-10"
          style={{
            background: `linear-gradient(135deg, ${colors.green}30, ${colors.red}30, ${colors.gold}30, ${colors.white}30)`,
            padding: "2px",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {countdown !== null && <CountdownOverlay countdown={countdown} />}

        <ShotProgress shots={shots} currentIndex={currentShotIndex} />

        {showReview && allShotsTaken && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none backdrop-blur-sm z-5">
            <div
              className="flex items-center gap-3 px-6 py-3 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${colors.green}, ${colors.red})`,
                boxShadow: `0 10px 30px ${colors.green}50`,
              }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white font-bold text-lg">
                All shots captured!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
