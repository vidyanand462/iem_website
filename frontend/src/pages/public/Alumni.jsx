import React from 'react';
import { Users, GraduationCap, MapPin, Quote } from 'lucide-react';
import Card from '../../components/ui/Card';
import { ALUMNI_STORIES } from '../../data/alumni';

export const Alumni = () => {
  return (
    <div className="space-y-16 pb-20 pt-28">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-iem-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-4">
            Alumni Network
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Global Alumni Footprint
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Over three decades of graduates pioneering engineering architectures, leading multinational research laboratories, and founding high-growth technology enterprises.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ALUMNI_STORIES.map((alumnus) => (
            <Card key={alumnus.id} className="p-6 bg-white border-slate-200 flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-blue-100 mb-3" />
                <p className="text-xs text-slate-600 italic leading-relaxed mb-6">
                  "{alumnus.quote}"
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-bold text-slate-900">{alumnus.name}</h3>
                <p className="text-xs font-semibold text-iem-blue">{alumnus.role}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{alumnus.company} • {alumnus.location}</p>
                <span className="inline-block mt-2 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">
                  {alumnus.batch}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Alumni;
