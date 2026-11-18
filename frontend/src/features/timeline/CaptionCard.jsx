import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Info } from 'lucide-react';

export const CaptionCard = ({ activeScene }) => {
  return (
    <div className="relative z-20 max-w-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScene.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-iem-navy-dark/80 backdrop-blur-md border border-white/15 rounded-xl p-4 sm:p-5 shadow-2xl text-white"
        >
          {/* Header Tag / Era Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-iem-sky/20 text-iem-sky border border-iem-sky/30">
                <Sparkles className="w-3 h-3" />
                {activeScene.eraBadge}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                <MapPin className="w-3 h-3 text-iem-sky" />
                {activeScene.location}
              </span>
            </div>

            {activeScene.isAiIllustrative && (
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                <Info className="w-2.5 h-2.5 text-slate-400" />
                Illustrative imagery
              </span>
            )}
          </div>

          {/* Subtitle & Description */}
          <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
            {activeScene.subtitle}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeScene.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CaptionCard;
