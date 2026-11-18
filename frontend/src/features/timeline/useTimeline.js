import { useState, useEffect, useCallback } from 'react';
import { TIMELINE_SCENES } from '../../data/timeline';

export const useTimeline = (autoplayDuration = 2800) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalScenes = TIMELINE_SCENES.length;

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalScenes);
    setProgress(0);
  }, [totalScenes]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalScenes) % totalScenes);
    setProgress(0);
  }, [totalScenes]);

  const goTo = useCallback((index) => {
    if (index >= 0 && index < totalScenes) {
      setActiveIndex(index);
      setProgress(0);
    }
  }, [totalScenes]);

  // Autoplay ticker with progress percentage
  useEffect(() => {
    if (isPaused) return;

    const intervalStep = 25; // update every 25ms for high smoothness
    const stepIncrement = (intervalStep / autoplayDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          next();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPaused, autoplayDuration, next]);

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  return {
    scenes: TIMELINE_SCENES,
    activeScene: TIMELINE_SCENES[activeIndex],
    activeIndex,
    progress,
    isPaused,
    setIsPaused,
    next,
    prev,
    goTo,
  };
};

export default useTimeline;
