import { motion } from "framer-motion";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-magic-purple/30 via-magic-charcoal to-magic-charcoal" />
      
      {/* Noise texture overlay */}
      <div className="noise-overlay absolute inset-0" />
      
      {/* Floating card suits - very subtle */}
      {['♠', '♥', '♦', '♣'].map((suit, i) => (
        <motion.span
          key={suit}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.03, 0.06, 0.03],
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 8 + i * 2, 
            repeat: Infinity,
            delay: i * 2
          }}
          className={`
            absolute text-magic-gold font-serif
            ${i === 0 ? 'top-[15%] left-[10%] text-6xl' : ''}
            ${i === 1 ? 'top-[25%] right-[15%] text-5xl' : ''}
            ${i === 2 ? 'bottom-[20%] left-[8%] text-4xl' : ''}
            ${i === 3 ? 'bottom-[30%] right-[12%] text-5xl' : ''}
          `}
          style={{ filter: 'blur(1px)' }}
        >
          {suit}
        </motion.span>
      ))}
      
      {/* Ambient spotlight sweep - initial animation */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "200%", opacity: [0, 0.3, 0] }}
        transition={{ duration: 3, delay: 0.5 }}
        className="absolute top-0 w-32 h-full bg-gradient-to-r from-transparent via-magic-gold/20 to-transparent -rotate-12"
      />
      
      {/* Ambient glow spots */}
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-magic-purple/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-magic-gold/5 rounded-full blur-3xl"
      />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
