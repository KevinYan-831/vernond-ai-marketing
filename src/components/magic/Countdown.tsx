import { motion, AnimatePresence } from "framer-motion";

interface CountdownProps {
  count: number | null;
}

export default function Countdown({ count }: CountdownProps) {
  return (
    <AnimatePresence>
      {count !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 1.5, opacity: 0, rotateX: -90 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Flip card container */}
            <div className="relative perspective-1000">
              {/* Card background */}
              <div className="w-40 h-56 rounded-2xl bg-gradient-to-b from-magic-charcoal to-black border-2 border-magic-gold/50 shadow-[0_0_60px_rgba(212,175,55,0.3)] flex items-center justify-center">
                {/* Card pattern */}
                <div className="absolute inset-4 border border-magic-gold/20 rounded-lg" />
                <div className="absolute top-6 left-6 text-magic-gold/30 text-lg">♠</div>
                <div className="absolute top-6 right-6 text-magic-gold/30 text-lg">♥</div>
                <div className="absolute bottom-6 left-6 text-magic-gold/30 text-lg">♦</div>
                <div className="absolute bottom-6 right-6 text-magic-gold/30 text-lg">♣</div>
                
                {/* Number */}
                <span className="font-display text-9xl font-bold text-magic-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                  {count}
                </span>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-magic-gold/20 blur-3xl -z-10" />
            </div>
          </motion.div>
          
          {/* Preparing text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-32 font-accent italic text-magic-gold/80 text-xl"
          >
            Prepare your magic...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
