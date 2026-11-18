import React from 'react';
import { Lightbulb, Cpu, FileText, Globe, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { RESEARCH_PIPELINE, RESEARCH_CENTERS } from '../../data/research';

export const Research = () => {
  return (
    <div className="space-y-16 pb-20 pt-28">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-iem-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-4">
            Research & Innovation
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Where Ideas Become Impact
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            IEM's vibrant research ecosystem bridges fundamental theoretical inquiry with patent-defended technologies and real-world industrial deployments.
          </p>
        </div>
      </section>

      {/* 6-Step Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Our 6-Phase Innovation Lifecycle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESEARCH_PIPELINE.map((p) => (
            <Card key={p.step} className="p-6 bg-white border-slate-200">
              <span className="text-2xl font-black text-iem-blue/50 font-mono mb-2 block">{p.step}</span>
              <h3 className="text-base font-bold text-slate-900 mb-1">{p.title}</h3>
              <p className="text-xs font-semibold text-iem-blue mb-3">{p.subtitle}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Research Centers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Flagship Research Centers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESEARCH_CENTERS.map((center) => (
            <Card key={center.name} className="p-6 bg-slate-50 border-slate-200">
              <span className="text-[11px] font-bold text-iem-blue uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded inline-block mb-3">
                {center.lead}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{center.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{center.focus}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Research;
