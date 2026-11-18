import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText, Calendar, AlertCircle, HelpCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { ADMISSIONS_STEPS } from '../../data/admissions';
import { PROGRAMS_DATA } from '../../data/programs';

export const Admissions = () => {
  return (
    <div className="space-y-16 pb-20 pt-28">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-iem-navy text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-iem-sky bg-iem-sky/10 px-3 py-1 rounded-full border border-iem-sky/20 inline-block">
              Admissions Cycle 2026-2027
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Centralized Online Admission Gateway
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Welcome to the official digital admission portal for the Institute of Engineering & Management (IEM), Kolkata. Register once to apply, submit verification documents, and track admission offers in real-time.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link to="/auth/register">
                <Button size="lg" variant="primary" className="bg-iem-blue hover:bg-iem-blue-dark text-white font-bold shadow-lg">
                  Register & Apply Online <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  Existing Applicant Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Process Walkthrough */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-iem-blue">Admissions Roadmap</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">7-Step Application Procedure</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ADMISSIONS_STEPS.map((step) => (
            <Card key={step.step} className="p-6 bg-white border-slate-200 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-blue-50 text-iem-blue font-black text-sm flex items-center justify-center mb-4">
                  0{step.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Mandatory Documents Checklist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 bg-slate-50 border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-iem-blue" />
            Mandatory Documents for Verification
          </h2>
          <p className="text-xs text-slate-600 mb-6">
            Please keep scanned copies (PDF or JPG/PNG, max 5MB each) ready prior to beginning your multi-step application form:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-700">
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Recent Passport Photograph</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Government Photo ID (Aadhaar / Passport)</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Class 10th Admit Card / Birth Certificate</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Class 10th Marksheet & Pass Certificate</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Class 12th Marksheet / Diploma Certificate</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>WBJEE / JEE Main / IEMJEE Rank Card</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Admissions;
