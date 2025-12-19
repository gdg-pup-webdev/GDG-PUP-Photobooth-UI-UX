"use client";

import { useState } from "react";
import {
  FloatingShapes,
  FilterModal,
  PreviewModal,
  GDGFooter,
} from "../ui";
import { CAMERA_ANIMATIONS } from "./constants";
import { useCamera, useCapture, useEmail } from "./hooks";
import {
  Decorations,
  CameraPreview,
  SidePanel,
  ReviewSection,
  Instructions,
  Header,
} from "./components";

interface CameraBoothProps {
  // Future props can be added here
}

/**
 * CameraBooth Component
 * Main photobooth component with modular architecture
 */
export default function CameraBooth(_props: CameraBoothProps) {
  // State for filter selection
  const [currentFilter, setCurrentFilter] = useState<string>("");
  
  // Modal states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

  // Custom hooks
  const { videoRef, playVideo } = useCamera();
  
  const {
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
  } = useCapture({
    videoRef,
    currentFilter,
    playVideo,
  });

  const {
    email,
    sending,
    sent,
    emailError,
    setEmail,
    sendEmail,
    resetEmailState,
  } = useEmail();

  // Preview modal functions
  const openPreview = (index: number) => {
    setPreviewImageIndex(index);
    setShowPreviewModal(true);
  };

  // Handle retake all with email reset
  const handleRetakeAll = () => {
    retakeAll();
    resetEmailState();
  };

  // Handle single retake
  const handleRetake = (index: number) => {
    retake(index);
  };

  // Handle email send
  const handleSendEmail = () => {
    sendEmail(shots);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #0D1F12 0%, #1A2F1E 40%, #0D3B1F 70%, #1F1515 100%)`,
      }}
    >
      {/* CSS Animations */}
      <style jsx global>{CAMERA_ANIMATIONS}</style>

      <Decorations />
      <FloatingShapes />

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        currentFilter={currentFilter}
        onSelectFilter={setCurrentFilter}
      />

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        images={shots}
        initialIndex={previewImageIndex}
        onRetake={handleRetake}
      />

      <div className="w-full max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-[1fr,420px] gap-8">
          {/* Camera Body - Preview + Controls Side Panel */}
          <div className="flex gap-0">
            <CameraPreview
              videoRef={videoRef}
              currentFilter={currentFilter}
              countdown={countdown}
              shots={shots}
              currentShotIndex={currentShotIndex}
              showReview={showReview}
              allShotsTaken={allShotsTaken}
            />

            <SidePanel
              currentFilter={currentFilter}
              shots={shots}
              showReview={showReview}
              reshootIndex={reshootIndex}
              countdown={countdown}
              onFilterClick={() => setShowFilterModal(true)}
              onStartSequence={startSequence}
              onSnap={snap}
              onRetakeAll={handleRetakeAll}
              onOpenPreview={openPreview}
            />
          </div>

          {/* Sidebar - Info & Actions */}
          <div className="space-y-6">
            <Header
              currentFilter={currentFilter}
              currentShotIndex={currentShotIndex}
              onFilterClick={() => setShowFilterModal(true)}
            />

            {/* Review Section */}
            {showReview && (
              <ReviewSection
                shots={shots}
                email={email}
                sending={sending}
                sent={sent}
                emailError={emailError}
                onEmailChange={setEmail}
                onSendEmail={handleSendEmail}
                onRetake={handleRetake}
                onRetakeAll={handleRetakeAll}
                onOpenPreview={openPreview}
              />
            )}

            {/* Instructions when not in review */}
            {!showReview && <Instructions />}

            <GDGFooter />
          </div>
        </div>

        {/* Hidden canvas for snapshots */}
        <canvas ref={snapCanvasRef} className="hidden" />
      </div>
    </div>
  );
}
