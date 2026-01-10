import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Trophy, AlertTriangle, RotateCcw, Copy, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { soundEffects } from "@/utils/sounds";

export type VerdictType = "caught" | "fooled" | null;

interface VerdictDisplayProps {
  verdict: VerdictType;
  timestamps?: string[];
  analysis?: string;
  onRetry: () => void;
}

// Particle component for confetti/sparkles
function Particle({ color, delay, isCaught }: { color: string; delay: number; isCaught: boolean }) {
  const randomX = 20 + Math.random() * 60; // More centered
  const randomDrift = (Math.random() - 0.5) * 30; // Horizontal drift for champagne effect
  const randomDuration = isCaught ? 3 + Math.random() * 2 : 4 + Math.random() * 3; // Slower for fooled

  return (
    <motion.div
      initial={{
        x: `${randomX}vw`,
        y: "100vh",
        opacity: 0,
        rotate: 0,
        scale: 0.5
      }}
      animate={{
        x: [`${randomX}vw`, `${randomX + randomDrift}vw`],
        y: "-20vh",
        opacity: isCaught ? [0, 1, 1, 0] : [0, 0.8, 1, 0.8, 0],
        rotate: isCaught ? [0, 180] : [0, 45, -45, 180],
        scale: isCaught ? [0.5, 1, 0.8] : [0.3, 0.8, 1, 0.9, 0.6]
      }}
      transition={{
        duration: randomDuration,
        delay,
        ease: isCaught ? "easeOut" : "easeInOut",
        x: { ease: "easeInOut" }
      }}
      className="absolute pointer-events-none"
      style={{
        width: isCaught ? "4px" : "6px",
        height: isCaught ? "16px" : "6px",
        backgroundColor: color,
        borderRadius: isCaught ? "0" : "50%",
        boxShadow: `0 0 ${isCaught ? "8px" : "16px"} ${color}`,
        filter: isCaught ? "none" : "blur(0.5px)"
      }}
    />
  );
}

// QR Code with ornate frame
function WeChatQRCode({ isFooled }: { isFooled: boolean }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("VERNOND_AI");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 5 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="mt-8 perspective-1000"
    >
      {/* Ornate frame */}
      <motion.div
        whileHover={{ rotateX: 0, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative p-6 bg-gradient-to-b from-magic-charcoal to-black rounded-xl border-2 border-magic-gold/40"
      >
        {/* Corner ornaments */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-magic-gold" />
        <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-magic-gold" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-magic-gold" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-magic-gold" />

        {/* Inner ornate border */}
        <div className="absolute inset-3 border border-magic-gold/20 rounded-lg pointer-events-none" />

        {/* Pulsing glow */}
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 rounded-xl bg-magic-gold/10 blur-xl -z-10"
        />

        <div className="text-center max-w-sm mx-auto">
          <h3 className="font-display text-xl font-bold text-magic-gold mb-3">
            {t('wechat.title')}
          </h3>

          <p className="font-body text-gray-300 text-sm mb-6 leading-relaxed">
            {t('wechat.description')}
          </p>

          {/* QR Code */}
          <div className="w-48 h-48 mx-auto bg-white rounded-lg p-3 mb-4 shadow-2xl">
            <img
              src="/wechat-qr.jpg"
              alt="WeChat QR Code"
              className="w-full h-full object-contain"
            />
          </div>

          <p className="font-accent italic text-magic-gold/70 text-xs mb-4">
            {t('wechat.scan')}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VerdictDisplay({ verdict, timestamps = [], analysis, onRetry }: VerdictDisplayProps) {
  const { t } = useLanguage();
  const [showParticles, setShowParticles] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);

  useEffect(() => {
    if (verdict) {
      setFlashVisible(true);
      setTimeout(() => setFlashVisible(false), 200);
      setTimeout(() => {
        setShowParticles(true);
        // Play sound effects based on verdict
        if (verdict === "fooled") {
          soundEffects.playApplause();
          soundEffects.playSparkle();
        } else {
          soundEffects.playWhoosh();
        }
      }, 300);
    } else {
      setShowParticles(false);
    }
  }, [verdict]);

  const isCaught = verdict === "caught";
  const particleColors = isCaught
    ? ["#8B0000", "#FF4444", "#AA0000", "#660000"]
    : ["#D4AF37", "#FFD700", "#FFA500", "#FFEC8B"];

  return (
    <AnimatePresence>
      {verdict && (
        <>
          {/* Flash effect */}
          <AnimatePresence>
            {flashVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="fixed inset-0 z-50 bg-white"
              />
            )}
          </AnimatePresence>
          
          {/* Particles */}
          {showParticles && (
            <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <Particle
                  key={i}
                  color={particleColors[i % particleColors.length]}
                  delay={i * 0.1}
                  isCaught={isCaught}
                />
              ))}
            </div>
          )}
          
          {/* Verdict card */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
              delay: 0.3,
              exit: { duration: 0.6, ease: "easeInOut" }
            }}
            style={{ transformOrigin: "top" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-y-auto py-8"
          >
            <div className="w-full max-w-md mx-auto px-4">
              {/* Spotlight effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isCaught
                    ? "radial-gradient(circle at 50% 30%, rgba(139,0,0,0.3) 0%, transparent 50%)"
                    : "radial-gradient(circle at 50% 30%, rgba(212,175,55,0.3) 0%, transparent 50%)"
                }}
              />
              
              <motion.div
                initial={{ scale: 0.8, rotateY: -30 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ type: "spring", damping: 20, delay: 0.4 }}
                className="relative"
              >
                {/* Main verdict card */}
                <div className={`
                  relative p-8 rounded-2xl border-2
                  ${isCaught 
                    ? "bg-gradient-to-b from-magic-crimson/20 to-magic-charcoal border-magic-crimson/50" 
                    : "bg-gradient-to-b from-magic-gold/10 to-magic-charcoal border-magic-gold/50"
                  }
                `}>
                  {/* Card glow */}
                  <div className={`absolute inset-0 rounded-2xl blur-2xl -z-10 ${isCaught ? "bg-magic-crimson/20" : "bg-magic-gold/20"}`} />
                  
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.5 }}
                    className="flex justify-center mb-6"
                  >
                    <div className={`
                      w-20 h-20 rounded-full flex items-center justify-center
                      ${isCaught 
                        ? "bg-magic-crimson/30 border-2 border-magic-crimson" 
                        : "bg-magic-gold/30 border-2 border-magic-gold"
                      }
                    `}>
                      {isCaught ? (
                        <AlertTriangle className="w-10 h-10 text-magic-crimson" />
                      ) : (
                        <Trophy className="w-10 h-10 text-magic-gold" />
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Verdict text */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className={`
                      font-display text-5xl font-extrabold text-center mb-2 tracking-wider
                      ${isCaught ? "text-magic-crimson" : "text-magic-gold"}
                    `}
                    style={{
                      textShadow: isCaught 
                        ? "0 0 40px rgba(139,0,0,0.6)"
                        : "0 0 40px rgba(212,175,55,0.6)"
                    }}
                  >
                    {t(isCaught ? 'verdict.caught' : 'verdict.fooled')}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="font-accent italic text-center text-gray-400 mb-6"
                  >
                    {t(isCaught ? 'verdict.caught.subtitle' : 'verdict.fooled.subtitle')}
                  </motion.p>

                  {/* Timestamps for caught verdict */}
                  {isCaught && timestamps.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mb-6 p-4 bg-black/30 rounded-lg border border-magic-crimson/30"
                    >
                      <p className="font-body text-xs text-gray-500 uppercase tracking-wider mb-2">
                        {t('verdict.timestamps')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {timestamps.map((time, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 bg-magic-crimson/20 text-magic-crimson rounded-full font-body text-sm"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* AI Analysis */}
                  {analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="mb-6 p-4 bg-black/30 rounded-lg border border-magic-gold/30 max-h-48 overflow-y-auto"
                    >
                      <p className="font-body text-xs text-gray-500 uppercase tracking-wider mb-2">
                        {t('verdict.analysis')}
                      </p>
                      <div className="font-body text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {analysis}
                      </div>
                    </motion.div>
                  )}

                  {/* Skill badge for fooled verdict */}
                  {!isCaught && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="mb-6 flex justify-center"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-magic-gold/20 rounded-full border border-magic-gold/40">
                        <span className="font-display text-magic-gold text-sm font-bold">
                          {t('verdict.badge')}
                        </span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => (
                            <motion.svg
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.9 + i * 0.1 }}
                              className="w-4 h-4 text-magic-gold"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </motion.svg>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* WeChat CTA */}
                  <WeChatQRCode isFooled={!isCaught} />
                  
                  {/* Retry button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={onRetry}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full mt-6 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider
                      flex items-center justify-center gap-2 transition-all
                      ${isCaught
                        ? "bg-magic-charcoal border border-magic-gold/30 text-magic-gold hover:bg-magic-gold/10"
                        : "bg-magic-gold/20 border border-magic-gold/50 text-magic-gold hover:bg-magic-gold/30"
                      }
                    `}
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t('verdict.tryagain')}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
