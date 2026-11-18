import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, Sparkles, BookOpen, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { TIMELINE_SCENES } from '../../data/timeline';
import imgAbout from '@/assets/images/campus/about.jpg';

export const About = () => {
  return (
    <div className="space-y-16 pb-20 pt-28">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-iem-blue text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Our Institutional Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Pioneering Technical & Management Education in Eastern India
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Since our founding in 1989 at Kolkata's Salt Lake Electronics Complex (Sector V), IEM has spearheaded a paradigm shift in engineering discipline, applied research, and corporate readiness.
          </p>
        </div>
      </section>

      {/* Heritage & Campus Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-xl border border-slate-100">
            <img src={imgAbout} alt="IEM Campus" className="w-full h-[400px] object-cover" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Anchored in Values, Driven by Innovation
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We believe engineering education should not merely transmit formulas, but cultivate high-order analytical inquiry, ethical citizenship, and an entrepreneurial mindset capable of confronting 21st-century complexities.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-iem-blue shrink-0 mt-0.5" />
                <span>Autonomous status granting syllabus autonomy aligned directly with emerging industry demands.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-iem-blue shrink-0 mt-0.5" />
                <span>NAAC Grade A+ institutional accreditation reflecting continuous benchmark compliance.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-iem-blue shrink-0 mt-0.5" />
                <span>Located in Kolkata's high-tech Sector V, affording unprecedented industrial immersion.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded History Timeline */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-iem-blue">Chronological Journey</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Four Decades of Educational Leadership</h2>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {TIMELINE_SCENES.map((era) => (
              <Card key={era.id} className="p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                  <img src={era.src} alt={era.title} className={`w-full h-full object-cover ${era.filterClass}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-iem-blue font-mono">
                      {era.year}
                    </span>
                    <span className="text-xs text-slate-400">• {era.eraBadge}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{era.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">{era.subtitle}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{era.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
