import React from 'react';
import { Globe, Plane, Award, Sparkles, BookOpen } from 'lucide-react';
import Card from '../../components/ui/Card';
import { GLOBAL_COLLABORATIONS } from '../../data/global';

export const GlobalIEM = () => {
  return (
    <div className="space-y-16 pb-20 pt-28">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-iem-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-4">
            International Linkages
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            IEM Beyond Borders: Global Partnerships
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Fostering cross-border academic excellence through international conferences, collaborative faculty research, and student exchange immersions across premier universities globally.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GLOBAL_COLLABORATIONS.map((c) => (
            <Card key={c.id} className="p-6 bg-white border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-iem-blue" />
                <h3 className="text-base font-bold text-slate-900">{c.country}</h3>
              </div>
              <h4 className="text-sm font-semibold text-iem-blue mb-2">{c.institution}</h4>
              <p className="text-xs text-slate-700 font-medium mb-2">{c.collaborationType}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{c.highlight}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GlobalIEM;
