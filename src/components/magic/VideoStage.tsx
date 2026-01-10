import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoStageProps {
  isRecording: boolean;
  videoBlob: Blob | null;
  onStreamReady: (stream: MediaStream) => void;
  shouldReinitialize?: boolean;
}

export default function VideoStage({ isRecording, videoBlob, onStreamReady, shouldReinitialize }: VideoStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frozenVideoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamInitialized = useRef(false);
  const currentStreamRef = useRef<MediaStream | null>(null);

  const initCamera = useCallback(async (forceReinit = false) => {
    if (streamInitialized.current && !forceReinit) return;

    setCameraError(null);
    setHasCamera(false);

    // Stop any existing stream first
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach(track => track.stop());
      currentStreamRef.current = null;
    }

    try {
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      console.log("Camera access granted, stream received:", stream);
      currentStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        try {
          await videoRef.current.play();
          console.log("Video playing successfully");
          setHasCamera(true);
          setCameraError(null);
          streamInitialized.current = true;
          onStreamReady(stream);
        } catch (playErr) {
          console.error("Video play error:", playErr);
          setCameraError("Could not start video playback. Please refresh and try again.");
          setHasCamera(false);
        }
      }
    } catch (err) {
      console.error("Camera error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error details:", errorMessage);

      if (errorMessage.includes("Permission denied") || errorMessage.includes("NotAllowedError")) {
        setCameraError("Camera permission denied. Please allow camera access and refresh the page.");
      } else if (errorMessage.includes("NotFoundError")) {
        setCameraError("No camera found. Please connect a camera and try again.");
      } else {
        setCameraError("Unable to access camera. Please check your browser settings and try again.");
      }
      setHasCamera(false);
      streamInitialized.current = false;
    }
  }, [onStreamReady]);

  // Initial camera setup
  useEffect(() => {
    initCamera();

    return () => {
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach(track => track.stop());
        currentStreamRef.current = null;
      }
      streamInitialized.current = false;
    };
  }, []);

  // Handle camera reset for retry functionality
  useEffect(() => {
    if (shouldReinitialize && !videoBlob) {
      console.log("Reinitializing camera for retry...");
      streamInitialized.current = false;
      initCamera(true);
    }
  }, [shouldReinitialize, videoBlob, initCamera]);

  useEffect(() => {
    if (videoBlob && frozenVideoRef.current) {
      const url = URL.createObjectURL(videoBlob);
      frozenVideoRef.current.src = url;
      frozenVideoRef.current.load();
      // Auto-play the recorded video on loop for preview
      frozenVideoRef.current.play().catch(() => {
        // Autoplay may be blocked, that's okay
      });
      return () => URL.revokeObjectURL(url);
    }
  }, [videoBlob]);

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-video">
      {/* Outer frame with vintage TV effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-magic-charcoal/80 to-magic-charcoal border border-magic-gold/20 shadow-[inset_0_2px_20px_rgba(0,0,0,0.8),0_0_60px_rgba(212,175,55,0.1)]" />
      
      {/* Inner video area with spotlight effect */}
      <div className="absolute inset-4 rounded-xl overflow-hidden bg-black">
        {/* Vignette overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
        
        {/* Spotlight glow */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isRecording ? 0.3 : 0.15 }}
          style={{
            background: isRecording 
              ? "radial-gradient(circle at 50% 30%, rgba(255,215,0,0.2) 0%, transparent 60%)"
              : "radial-gradient(circle at 50% 30%, rgba(212,175,55,0.15) 0%, transparent 50%)"
          }}
        />
        
        {cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-magic-charcoal">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-magic-crimson/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-magic-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-body text-gray-400 text-sm max-w-xs">{cameraError}</p>
              <button
                onClick={() => {
                  streamInitialized.current = false;
                  initCamera();
                }}
                className="mt-4 px-4 py-2 bg-magic-gold/20 text-magic-gold rounded-lg font-body text-sm hover:bg-magic-gold/30 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Live video feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${videoBlob ? 'hidden' : 'block'}`}
              style={{ transform: 'scaleX(-1)' }}
            />
            
            {/* Frozen video after recording */}
            <AnimatePresence>
              {videoBlob && (
                <motion.video
                  ref={frozenVideoRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                  muted
                  playsInline
                  loop
                />
              )}
            </AnimatePresence>
          </>
        )}
        
        {/* Recording indicator */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 z-30 flex items-center gap-2"
            >
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
              />
              <span className="font-body text-xs text-white/80">REC</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-magic-gold/30 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-magic-gold/30 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-magic-gold/30 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-magic-gold/30 rounded-br-lg" />
      </div>
      
      {/* Stage base reflection */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-b from-magic-gold/5 to-transparent rounded-full blur-xl" />
    </div>
  );
}
