"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "./GDGColors";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: (string | null)[];
  initialIndex?: number;
  onRetake?: (index: number) => void;
}

export default function PreviewModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  onRetake,
}: PreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Filter out null images
  const validImages = images.filter(Boolean) as string[];

  // Color for current image
  const shotColors = [colors.green, colors.red, colors.gold];
  const currentColor = shotColors[currentIndex % 3];

  // Reset index when modal opens with new initialIndex
  const handleOpen = () => {
    setCurrentIndex(initialIndex);
  };

  const nextImage = () => {
    if (validImages.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }
  };

  const prevImage = () => {
    if (validImages.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    }
  };

  // Keyboard navigation for accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
          break;
        case "ArrowRight":
          e.preventDefault();
          setCurrentIndex((prev) => (prev + 1) % validImages.length);
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, validImages.length, onClose]);

  return (
    <AnimatePresence onExitComplete={() => setCurrentIndex(initialIndex)}>
      {isOpen && validImages.length > 0 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          onAnimationStart={handleOpen}
        >
          {/* Backdrop with blur and opacity */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal content */}
          <motion.div
            className="relative max-w-4xl w-full z-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">Close</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>

            {/* Image container */}
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #1a1a2e, #0f0f0f)",
                border: `3px solid ${currentColor}`,
                boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${currentColor}30`,
              }}
            >
              <AnimatePresence mode="wait">
                {validImages[currentIndex] && (
                  <motion.img
                    key={currentIndex}
                    src={validImages[currentIndex]}
                    alt={`Shot ${currentIndex + 1}`}
                    className="w-full h-auto max-h-[70vh] object-contain"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>

              {/* Navigation arrows - inside image container */}
              {validImages.length > 1 && (
                <>
                  <motion.button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm"
                    style={{ border: `2px solid ${colors.white}30` }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </motion.button>
                  <motion.button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm"
                    style={{ border: `2px solid ${colors.white}30` }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                </>
              )}
            </motion.div>

            {/* Image counter & dots */}
            <motion.div
              className="flex flex-col items-center gap-3 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex gap-2">
                {validImages.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className="w-3 h-3 rounded-full transition-all"
                    style={{
                      background:
                        i === currentIndex
                          ? shotColors[i % 3]
                          : "rgba(255,255,255,0.3)",
                      boxShadow:
                        i === currentIndex
                          ? `0 0 10px ${shotColors[i % 3]}`
                          : "none",
                    }}
                    whileHover={{ scale: 1.3 }}
                    animate={{ scale: i === currentIndex ? 1.3 : 1 }}
                  />
                ))}
              </div>
              <p className="text-white/60 text-sm">
                Shot {currentIndex + 1} of {validImages.length}
              </p>
              
              {/* Retake button */}
              {onRetake && (
                <motion.button
                  onClick={() => {
                    onRetake(currentIndex);
                    onClose();
                  }}
                  className="mt-2 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(255, 255, 255, 0.15)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Retake This Shot
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
