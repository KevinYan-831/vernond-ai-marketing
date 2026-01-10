import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import VideoStage from "@/components/magic/VideoStage";
import RecordingControls from "@/components/magic/RecordingControls";
import Countdown from "@/components/magic/Countdown";
import AnalysisOverlay from "@/components/magic/AnalysisOverlay";
import VerdictDisplay, { VerdictType } from "@/components/magic/VerdictDisplay";
import BackgroundEffects from "@/components/magic/BackgroundEffects";
import LanguageSwitcher from "@/components/magic/LanguageSwitcher";
import { supabase } from "../../../supabase/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { soundEffects } from "@/utils/sounds";

type AppState = "idle" | "countdown" | "recording" | "uploading" | "analyzing";

export default function MagicAnalyzer() {
  const { t, language } = useLanguage();
  const [appState, setAppState] = useState<AppState>("idle");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [verdict, setVerdict] = useState<VerdictType>(null);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [analysisText, setAnalysisText] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleStreamReady = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
    setIsCameraReady(true);
    setIsResetting(false);
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) {
      console.error("No stream available");
      alert("Camera not ready. Please wait for the camera to initialize.");
      return;
    }

    console.log("Starting recording with stream:", streamRef.current);
    chunksRef.current = [];

    try {
      // Check codec support and use fallback
      let options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options = { mimeType: "video/webm;codecs=vp9" };
        console.log("Using VP9 codec");
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options = { mimeType: "video/webm;codecs=vp8" };
        console.log("Using VP8 codec");
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options = { mimeType: "video/webm" };
        console.log("Using default WebM codec");
      } else {
        console.log("Using browser default codec");
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      console.log("MediaRecorder created successfully");

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("Data chunk received:", event.data.size, "bytes");
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("Recording stopped, chunks:", chunksRef.current.length);
        const blob = new Blob(chunksRef.current, { type: options.mimeType || "video/webm" });
        console.log("Created blob:", blob.size, "bytes");
        setVideoBlob(blob);
        uploadAndAnalyze(blob);
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        alert("Recording error occurred. Please try again.");
        setAppState("idle");
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setAppState("recording");
      console.log("Recording started, state:", mediaRecorder.state);
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert(`Failed to start recording: ${err instanceof Error ? err.message : "Unknown error"}`);
      setAppState("idle");
    }
  }, []);

  const startCountdown = useCallback(() => {
    setAppState("countdown");
    setCountdown(3);
  }, []);

  // Handle countdown
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      startRecording();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, startRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      // Play shutter sound for stopping recording
      soundEffects.playShutter();
    }
  }, []);

  const uploadAndAnalyze = useCallback(async (blob: Blob) => {
    console.log("Starting upload and analysis...");
    setAppState("uploading");
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      await new Promise(resolve => setTimeout(resolve, 1000));
      clearInterval(uploadInterval);
      setUploadProgress(100);
      console.log("Upload progress complete");

      // Start analysis
      setAppState("analyzing");
      setAnalysisProgress(0);
      console.log("Starting AI analysis...");

      // Simulate analysis progress with artificial delay for dramatic effect
      const totalDuration = 8000 + Math.random() * 4000; // 8-12 seconds
      const startTime = Date.now();

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / totalDuration) * 100, 95);
        setAnalysisProgress(progress);

        if (progress >= 95) {
          clearInterval(progressInterval);
        }
      }, 100);

      // Make actual API call
      console.log("Preparing video for upload, size:", blob.size, "bytes");
      const formData = new FormData();
      formData.append("video", blob, "magic-trick.webm");
      formData.append("language", language);

      console.log("Calling Supabase function: supabase-functions-analyze-magic-trick with language:", language);
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-analyze-magic-trick",
        {
          body: formData,
        }
      );
      console.log("Supabase function returned. Data:", data, "Error:", error);

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Wait a moment before showing verdict
      await new Promise(resolve => setTimeout(resolve, 500));

      if (error) {
        console.error("Analysis error:", error);
        // Show error to user - reset to idle state
        setAppState("idle");
        const errorDetails = data?.details || error.message || '';
        alert(language === 'zh'
          ? `分析失败：${errorDetails}`
          : `Analysis failed: ${errorDetails}`);
        return;
      }

      // Successfully received AI analysis
      setVerdict(data.verdict);
      setTimestamps(data.timestamps || []);
      setAnalysisText(data.analysis || "");

    } catch (err) {
      console.error("Upload/Analysis failed:", err);
      // Show error to user - reset to idle state
      setAppState("idle");
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(language === 'zh'
        ? `上传或分析失败：${errorMessage}`
        : `Upload or analysis failed: ${errorMessage}`);
    }
  }, [language]);

  const handleRetry = useCallback(() => {
    // Stop any existing recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // Mark as resetting - this disables controls while camera reinitializes
    setIsResetting(true);
    setIsCameraReady(false);

    // Reset all state
    setAppState("idle");
    setVideoBlob(null);
    setVerdict(null);
    setTimestamps([]);
    setAnalysisText("");
    setAnalysisProgress(0);
    setUploadProgress(0);
    chunksRef.current = [];

    // Clear the stream ref - camera will reinit via VideoStage
    streamRef.current = null;
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    console.log("File selected:", file.name, file.size, file.type);

    // Always reset state for new upload
    setVerdict(null);
    setTimestamps([]);
    setAnalysisText("");
    setAnalysisProgress(0);
    setUploadProgress(0);
    setAppState("idle");

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi'];
    if (!allowedTypes.some(type => file.type.startsWith(type.split('/')[0] + '/'))) {
      alert(language === 'zh'
        ? '无效的视频格式。请上传 MP4、WebM、MOV 或 AVI 文件。'
        : 'Invalid video format. Please upload MP4, WebM, MOV, or AVI files.');
      return;
    }

    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      alert(language === 'zh'
        ? '文件太大。最大文件大小为 100MB。'
        : 'File too large. Maximum file size is 100MB.');
      return;
    }

    // Check minimum file size (at least 100KB)
    const minSize = 100 * 1024; // 100KB
    if (file.size < minSize) {
      alert(language === 'zh'
        ? '文件太小。请上传至少 100KB 的视频。'
        : 'File too small. Please upload a video at least 100KB in size.');
      return;
    }

    // Convert File to Blob and process
    const blob = new Blob([file], { type: file.type });
    setVideoBlob(blob);

    // Immediately start upload and analysis
    uploadAndAnalyze(blob);
  }, [language, uploadAndAnalyze]);

  return (
    <div className="min-h-screen bg-magic-charcoal overflow-hidden relative">
      {/* Background effects */}
      <BackgroundEffects />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-8 pb-4 text-center relative">
          {/* Language Switcher */}
          <div className="absolute top-8 right-8">
            <LanguageSwitcher />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-magic-gold" />
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                {language === 'zh' ? (
                  <>大暴龙 <span className="text-magic-gold">AI</span></>
                ) : (
                  <>Vernond <span className="text-magic-gold">AI</span></>
                )}
              </h1>
              <Sparkles className="w-6 h-6 text-magic-gold" />
            </div>
            <p className="font-accent italic text-magic-gold/70 text-lg">
              {t('app.tagline')}
            </p>
          </motion.div>
        </header>

        {/* Stage area */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-2xl relative"
          >
            <VideoStage
              isRecording={appState === "recording"}
              videoBlob={videoBlob}
              onStreamReady={handleStreamReady}
              shouldReinitialize={isResetting}
            />
            
            {/* Analysis overlay on the video */}
            <AnalysisOverlay
              isAnalyzing={appState === "analyzing"}
              progress={analysisProgress}
            />
            
            {/* Upload progress overlay */}
            <AnimatePresence>
              {appState === "uploading" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-4 z-30 rounded-xl overflow-hidden flex items-center justify-center bg-black/60"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 mx-auto mb-4 border-4 border-magic-gold/30 border-t-magic-gold rounded-full"
                    />
                    <p className="font-body text-magic-gold text-sm">
                      {language === 'zh' ? '正在上传视频...' : 'Uploading video...'}
                    </p>
                    <div className="mt-3 w-32 mx-auto h-1 bg-magic-charcoal rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-magic-gold"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <RecordingControls
              isRecording={appState === "recording"}
              isUploading={appState === "uploading" || appState === "analyzing"}
              isCameraReady={isCameraReady}
              onStart={startCountdown}
              onStop={stopRecording}
              onFileSelect={handleFileSelect}
              countdown={countdown}
            />
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-center max-w-md"
          >
            <p className="font-body text-gray-400 text-sm leading-relaxed">
              {appState === "idle" && !isCameraReady && (language === 'zh' ? '正在初始化摄像头...' : 'Initializing camera...')}
              {appState === "idle" && isCameraReady && t('instructions.idle')}
              {appState === "countdown" && (language === 'zh' ? '准备好...即将开始录制！' : 'Get ready... recording starts soon!')}
              {appState === "recording" && t('instructions.recording')}
              {appState === "uploading" && t('instructions.uploading')}
              {appState === "analyzing" && t('instructions.analyzing')}
            </p>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="pb-6 text-center">
          <p className="font-body text-gray-600 text-xs">
            {t('footer.copyright')}
          </p>
        </footer>
      </div>

      {/* Countdown overlay */}
      <Countdown count={countdown} />

      {/* Verdict display */}
      <VerdictDisplay
        verdict={verdict}
        timestamps={timestamps}
        analysis={analysisText}
        onRetry={handleRetry}
      />
    </div>
  );
}
