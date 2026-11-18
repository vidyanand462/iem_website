import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Pause } from 'lucide-react';
import useTimeline from './useTimeline';
import SceneBackground from './SceneBackground';
import TimelineBar from './TimelineBar';
import CaptionCard from './CaptionCard';
import Button from '../../components/ui/Button';

export const HistoryHero = () => {
  const {
    scenes,
    activeScene,
    activeIndex,
    progress,
    isPaused,
    setIsPaused,
    goTo,
  } = useTimeline(2800);

  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-iem-navy pt-24 pb-8"
      aria-label="Interactive IEM History Timeline"
    >
      {/* Background Animated Scene Layer */}
      <SceneBackground activeScene={activeScene} />

      {/* Main Hero Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8">
        <div className="max-w-2xl text-left">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-5">
            <span className="w-2 h-2 rounded-full bg-iem-sky animate-pulse" />
            ENGINEERING THE FUTURE SINCE 1989
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-5 drop-shadow-md">
            Shape Your <span className="text-white underline decoration-iem-sky decoration-4 underline-offset-4">Future.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal mb-8 max-w-xl drop-shadow">
            A legacy of engineering education, technological innovation, and ethical leadership in Kolkata's vibrant tech corridor. Empowering future engineers and management pioneers for over three decades.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link to="/admissions">
              <Button size="lg" variant="primary" className="bg-iem-blue hover:bg-iem-blue-dark text-white shadow-lg">
                Apply Now <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>

            <a href="#about-iem">
              <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 hover:text-white hover:border-white">
                Explore IEM
              </Button>
            </a>

            {/* Play / Pause Toggle Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-sm border border-white/20 transition-colors"
              title={isPaused ? 'Resume autoplay' : 'Pause timeline'}
              aria-label={isPaused ? 'Resume autoplay' : 'Pause timeline'}
            >
              {isPaused ? <Play className="w-4 h-4 text-iem-sky" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>

          {/* Animated Caption Card for Current Era */}
          <CaptionCard activeScene={activeScene} />
        </div>
      </div>

      {/* Bottom Timeline Interactive Bar */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto">
        <TimelineBar
          scenes={scenes}
          activeIndex={activeIndex}
          progress={progress}
          onSelectScene={goTo}
        />
      </div>
    </section>
  );
};

export default HistoryHero;
