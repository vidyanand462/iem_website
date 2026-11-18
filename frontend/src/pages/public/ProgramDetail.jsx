import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FlaskConical, Briefcase, GraduationCap, ArrowRight, BookOpen, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { PROGRAMS_DATA } from '../../data/programs';

export const ProgramDetail = () => {
  const { id } = useParams();
  const program = PROGRAMS_DATA.find((p) => p.id === id || p.code.toLowerCase() === id?.toLowerCase());

  if (!program) {
    return <Navigate to="/academics" replace />;
  }

  return (
    <div className="space-y-16 pb-20 pt-28">
      {/* Back Link & Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/academics" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-iem-blue mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to all programs
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-iem-blue border border-blue-200">
                {program.degree} • {program.code}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {program.duration}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {program.name}
            </h1>
          </div>

          <Link to={`/admissions?dept=${program.departmentId}`}>
            <Button size="lg" variant="primary" className="font-bold shadow-md">
              Apply for this Program <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Program Highlights & Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Program Overview</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{program.overview}</p>
            </div>

            {/* Semester / Year Curriculum */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-iem-blue" />
                Curriculum Structure
              </h2>
              <div className="space-y-3">
                {program.curriculum.map((curr) => (
                  <Card key={curr.year} className="p-4 bg-slate-50 border-slate-200">
                    <h3 className="text-sm font-bold text-iem-blue mb-1">{curr.year}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{curr.topics}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Specialized Labs */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-iem-blue" />
                Dedicated Department Laboratories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {program.labs.map((lab, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                    <FlaskConical className="w-4 h-4 text-iem-blue shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">{lab}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Eligibility & Careers */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 bg-slate-50 border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-iem-blue" /> Eligibility Criteria
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{program.eligibility}</p>
              <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 font-semibold">
                Total Seat Intake: <span className="text-slate-900 font-bold">{program.totalSeats} Seats</span>
              </div>
            </Card>

            <Card className="p-6 bg-slate-50 border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-iem-blue" /> Career Trajectories
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {program.careers.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramDetail;
