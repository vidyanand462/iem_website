import React from 'react';
import { Briefcase, TrendingUp, Building2, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import { CAREER_PATHWAY, PLACEMENT_PARTNERS } from '../../data/careers';

export const Careers = () => {
  return (
    <div className="space-y-16 pb-20 pt-28">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-iem-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-4">
            Corporate Placements & Internships
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Classroom to Career Pathways
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Positioned in Kolkata's high-technology corridor, IEM delivers continuous industry interactions, structured soft skill drills, and sustained recruitment opportunities with global technology firms.
          </p>
        </div>
      </section>

      {/* 6-Stage Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">The 6-Stage Placement Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_PATHWAY.map((item) => (
            <Card key={item.step} className="p-6 bg-white border-slate-200">
              <span className="text-2xl font-black text-iem-blue font-mono mb-2 block">{item.step}</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Recruiter Partners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Corporate Recruitment Ecosystem</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PLACEMENT_PARTNERS.map((p) => (
            <div key={p.name} className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
              <p className="text-sm font-bold text-slate-900">{p.name}</p>
              <span className="text-[11px] text-slate-500">{p.category}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Careers;
