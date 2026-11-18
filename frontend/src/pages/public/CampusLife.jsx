import React from 'react';
import { Sparkles, Trophy, Users, Music } from 'lucide-react';
import Card from '../../components/ui/Card';
import { CAMPUS_ACTIVITIES } from '../../data/campusLife';
import imgCampus from '@/assets/images/campus/why_campus.jpg';

export const CampusLife = () => {
  return (
    <div className="space-y-16 pb-20 pt-28">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-iem-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-4">
            Student Life & Culture
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Vibrant Collegiate Experience
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Beyond the lecture halls and laboratories, IEM pulsates with energy across hackathons, robotics arenas, performing arts societies, and sports tournaments.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-100">
          <img src={imgCampus} alt="Campus Life and Fest" className="w-full h-[400px] object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CAMPUS_ACTIVITIES.map((act) => (
            <Card key={act.title} className="p-6 bg-white border-slate-200">
              <span className="text-xs font-bold text-iem-blue uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded inline-block mb-3">
                {act.tag}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{act.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CampusLife;
