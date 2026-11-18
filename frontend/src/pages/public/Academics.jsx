import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, ChevronRight, Layers, Award, ArrowRight, Search, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PROGRAMS_DATA } from '../../data/programs';

export const Academics = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = PROGRAMS_DATA.filter((p) => {
    const matchesFilter = filter === 'All' || p.category === filter;
    if (!matchesFilter) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.code?.toLowerCase().includes(term) ||
      p.degree?.toLowerCase().includes(term) ||
      p.overview?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-16 pb-20 pt-28">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-iem-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-4">
            Curriculum & Pedagogy
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Academic Programs & Disciplines
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Our autonomous curriculum integrates core engineering principles with emerging technologies, applied laboratory investigations, and multidisciplinary problem-solving.
          </p>
        </div>
      </section>

      {/* Program Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses by name or code (e.g. Computer Science, AI, ECE)..."
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-iem-blue focus:ring-1 focus:ring-iem-blue shadow-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', 'Engineering', 'Computer Applications'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === f
                    ? 'bg-iem-blue text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-sm font-semibold text-slate-700">No academic courses found matching "{searchTerm}".</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilter('All');
              }}
              className="mt-3 text-xs font-bold text-iem-blue hover:underline"
            >
              Clear search and show all courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((prog) => (
            <Card key={prog.id} className="p-6 flex flex-col justify-between hover:border-iem-blue/40 group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-iem-blue border border-blue-100">
                    {prog.degree} • {prog.code}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {prog.duration}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-iem-blue transition-colors">
                  {prog.name}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {prog.overview}
                </p>

                <div className="space-y-1.5 mb-6">
                  {prog.highlights.slice(0, 3).map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link to={`/academics/${prog.id}`}>
                  <Button variant="ghost" size="sm" className="text-xs font-semibold px-0 text-slate-600 hover:text-iem-blue">
                    View Full Syllabus <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>

                <Link to={`/admissions?dept=${prog.departmentId}`}>
                  <Button variant="primary" size="sm" className="text-xs font-bold">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        )}
      </section>
    </div>
  );
};

export default Academics;
