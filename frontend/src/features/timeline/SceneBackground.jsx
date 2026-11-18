import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SceneBackground = ({ activeScene }) => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-iem-navy z-0">
      <AnimatePresence mode="sync">
        <motion.div
          key={activeScene.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={activeScene.src}
            alt={activeScene.title}
            className={`w-full h-full object-cover object-center animate-ken-burns transition-all duration-700 ${activeScene.filterClass}`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Vignette & Text Backdrop Overlay: Left-sided gradient so imagery stays vivid */}
      <div className="absolute inset-0 bg-gradient-to-r from-iem-navy/90 via-iem-navy/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-iem-navy/90 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
};

export default SceneBackground;
