import { motion } from "framer-motion";
import { Play, Square, Upload } from "lucide-react";
import { useRef } from "react";

interface RecordingControlsProps {
  isRecording: boolean;
  isUploading: boolean;
  onStart: () => void;
  onStop: () => void;
  onFileSelect: (file: File) => void;
  countdown: number | null;
}

export default function RecordingControls({
  isRecording,
  isUploading,
  onStart,
  onStop,
  onFileSelect,
  countdown,
}: RecordingControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-center gap-8 mt-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
        onChange={handleFileChange}
        className="hidden"
      />
      {/* Start Button */}
      <motion.button
        onClick={onStart}
        disabled={isRecording || isUploading || countdown !== null}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative w-24 h-24 rounded-2xl font-display font-bold text-sm uppercase tracking-wider
          transition-all duration-300 
          ${isRecording || isUploading || countdown !== null
            ? "bg-magic-charcoal/50 text-gray-600 cursor-not-allowed border-2 border-gray-700"
            : "bg-gradient-to-b from-magic-charcoal to-black text-magic-gold border-2 border-magic-gold/50 shadow-[0_4px_20px_rgba(212,175,55,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-magic-gold/80"
          }
        `}
      >
        {/* Button surface texture */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        
        {/* Icon */}
        <div className="relative flex flex-col items-center justify-center h-full">
          <Play className={`w-8 h-8 mb-1 ${isRecording || isUploading || countdown !== null ? "text-gray-600" : "text-magic-gold"}`} />
          <span className="text-xs">Start</span>
        </div>
        
        {/* Glow effect when enabled */}
        {!isRecording && !isUploading && countdown === null && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-magic-gold/10 blur-xl -z-10"
          />
        )}
      </motion.button>

      {/* Stop Button */}
      <motion.button
        onClick={onStop}
        disabled={!isRecording || isUploading}
        whileHover={isRecording ? { scale: 1.05 } : {}}
        whileTap={isRecording ? { scale: 0.95 } : {}}
        className={`
          relative w-24 h-24 rounded-2xl font-display font-bold text-sm uppercase tracking-wider
          transition-all duration-300
          ${!isRecording || isUploading
            ? "bg-magic-charcoal/50 text-gray-600 cursor-not-allowed border-2 border-gray-700"
            : "bg-gradient-to-b from-magic-crimson/80 to-magic-crimson text-white border-2 border-red-500/50 shadow-[0_4px_20px_rgba(139,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_4px_30px_rgba(139,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
          }
        `}
      >
        {/* Button surface texture */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Icon */}
        <div className="relative flex flex-col items-center justify-center h-full">
          <Square className={`w-7 h-7 mb-1 ${!isRecording || isUploading ? "text-gray-600" : "text-white"}`} fill="currentColor" />
          <span className="text-xs">Stop</span>
        </div>

        {/* Recording pulse effect */}
        {isRecording && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl border-2 border-red-500"
          />
        )}
      </motion.button>

      {/* Upload Button */}
      <motion.button
        onClick={handleUploadClick}
        disabled={isRecording || isUploading || countdown !== null}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative w-24 h-24 rounded-2xl font-display font-bold text-sm uppercase tracking-wider
          transition-all duration-300
          ${isRecording || isUploading || countdown !== null
            ? "bg-magic-charcoal/50 text-gray-600 cursor-not-allowed border-2 border-gray-700"
            : "bg-gradient-to-b from-purple-900 to-purple-950 text-purple-300 border-2 border-purple-500/50 shadow-[0_4px_20px_rgba(168,85,247,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-purple-400/80"
          }
        `}
      >
        {/* Button surface texture */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Icon */}
        <div className="relative flex flex-col items-center justify-center h-full">
          <Upload className={`w-8 h-8 mb-1 ${isRecording || isUploading || countdown !== null ? "text-gray-600" : "text-purple-300"}`} />
          <span className="text-xs">Upload</span>
        </div>

        {/* Glow effect when enabled */}
        {!isRecording && !isUploading && countdown === null && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl -z-10"
          />
        )}
      </motion.button>
    </div>
  );
}
