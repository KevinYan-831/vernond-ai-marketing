import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-magic-charcoal/50 backdrop-blur-sm rounded-full p-1 border border-magic-gold/20">
      <motion.button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
          language === 'en'
            ? 'bg-magic-gold text-magic-charcoal font-medium'
            : 'text-gray-400 hover:text-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        EN
      </motion.button>
      <motion.button
        onClick={() => setLanguage('zh')}
        className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
          language === 'zh'
            ? 'bg-magic-gold text-magic-charcoal font-medium'
            : 'text-gray-400 hover:text-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        中文
      </motion.button>
    </div>
  );
}
