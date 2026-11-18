import React from 'react';
import { motion } from 'framer-motion';

export const TimelineBar = ({
  scenes,
  activeIndex,
  progress,
  onSelectScene,
}) => {
  return (
    <div className="w-full relative z-20 py-4">
      {/* Horizontal scrollable wrapper for mobile responsiveness */}
      <div className="overflow-x-auto no-scrollbar pb-2">
        <div className="min-w-[640px] md:min-w-0 relative px-4">
          {/* Base background line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-[2px] bg-white/20" />

          {/* Animated active progress line up to active index + current step progress */}
          <div
            className="absolute top-1/2 left-8 -translate-y-1/2 h-[2px] bg-iem-sky transition-all duration-150"
            style={{
              width: `calc(${(activeIndex / (scenes.length - 1)) * 100}% * (1 - 0.08) + ${
                (progress / 100) * (100 / (scenes.length - 1)) * 0.8
              }%)`,
              maxWidth: 'calc(100% - 4rem)',
            }}
          />

          {/* Year stops */}
          <div className="relative flex justify-between items-center">
            {scenes.map((scene, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;

              return (
                <button
                  key={scene.id}
                  onClick={() => onSelectScene(idx)}
                  className="group flex flex-col items-center focus:outline-none transition-transform active:scale-95"
                  aria-label={`Jump to era ${scene.label}`}
                >
                  {/* Stop Node */}
                  <div className="relative flex items-center justify-center p-2">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-iem-sky border-white scale-125 shadow-[0_0_12px_rgba(56,189,248,0.8)]'
                          : isPast
                          ? 'bg-white border-white/80'
                          : 'bg-iem-navy-dark border-white/40 group-hover:border-white/80'
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="activeGlow"
                        className="absolute w-7 h-7 rounded-full bg-iem-sky/25 animate-ping pointer-events-none"
                      />
                    )}
                  </div>

                  {/* Year Label */}
                  <span
                    className={`mt-1.5 text-xs font-bold tracking-wider uppercase transition-colors duration-200 ${
                      isActive
                        ? 'text-iem-sky text-sm scale-105'
                        : isPast
                        ? 'text-white/90'
                        : 'text-white/50 group-hover:text-white/80'
                    }`}
                  >
                    {scene.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineBar;
