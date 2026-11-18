import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Award,
  Globe,
  Sparkles,
  Building2,
  Users,
  Briefcase,
  CheckCircle2,
  Cpu,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Search,
  X,
} from 'lucide-react';
import HistoryHero from '../../features/timeline/HistoryHero';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { PROGRAMS_DATA } from '../../data/programs';
import { RESEARCH_PIPELINE, RESEARCH_CENTERS } from '../../data/research';
import { GLOBAL_COLLABORATIONS } from '../../data/global';
import { CAMPUS_ACTIVITIES, GALLERY_ITEMS } from '../../data/campusLife';
import { CAREER_PATHWAY, PLACEMENT_PARTNERS } from '../../data/careers';
import { NEWS_ITEMS } from '../../data/news';
import { ALUMNI_STORIES } from '../../data/alumni';
import { ADMISSIONS_STEPS } from '../../data/admissions';

// Campus Images
import imgAbout from '@/assets/images/campus/about.jpg';
import imgTeaching from '@/assets/images/campus/why_teaching.jpg';
import imgIndustry from '@/assets/images/campus/why_industry.jpg';
import imgInnovation from '@/assets/images/campus/why_innovation.jpg';
import imgCampus from '@/assets/images/campus/why_campus.jpg';

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [programSearchTerm, setProgramSearchTerm] = useState('');
  const [activeGlobalPin, setActiveGlobalPin] = useState(GLOBAL_COLLABORATIONS[0]);

  const filteredPrograms = PROGRAMS_DATA.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!programSearchTerm.trim()) return true;
    const term = programSearchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.code?.toLowerCase().includes(term) ||
      p.degree?.toLowerCase().includes(term) ||
      p.overview?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-0 text-slate-800">
      {/* 1. SIGNATURE DOCUMENTARY TIMELINE HERO */}
      <HistoryHero />

      {/* 2. ABOUT IEM SECTION (Matching Reference Mockup) */}
      <section id="about-iem" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Photographic Feature Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
                <img
                  src={imgAbout}
                  alt="IEM Center for Advanced Learning and Research"
                  className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-iem-navy/90 via-iem-navy/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-iem-sky bg-iem-sky/20 px-2.5 py-1 rounded-md border border-iem-sky/30 backdrop-blur-sm inline-block mb-2">
                    Salt Lake Electronics Complex
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    Center for Advanced Learning & Research
                  </h3>
                </div>
              </div>

              {/* Floating Quality Badge */}
              <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 max-w-[280px] hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-iem-blue shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Autonomous Institute</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Institutional Quality Audit with Grade A+</p>
                </div>
              </div>
            </div>

            {/* Right Col: Editorial Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-iem-blue text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Institutional Legacy
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Cultivating Intellectual Rigor and Technological Innovation
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Established in 1989 as Eastern India's first private engineering and management institution, IEM has consistently anchored academic distinction in Kolkata's high-technology ecosystem. Nestled inside Sector V—the digital epicenter of the region—we bridge deep scholarly inquiry with dynamic industrial integration.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Our campus brings together students from diverse geographies, guided by nationally and globally recognized faculty across computing, microelectronics, strategic leadership, and multidisciplinary research domains.
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-iem-blue hover:text-iem-blue-dark group"
                >
                  <span>Read the full founding story</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IEM AT A GLANCE (Animated Counters / Placeholders) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Institutional Metrics
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                IEM at a Glance
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md mt-2 md:mt-0">
              Transparent metrics reflecting pedagogical continuity, scholarly outputs, and educational expeditions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: 37+ Years */}
            <Card className="p-6 relative overflow-hidden group hover:border-iem-blue/40">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-blue-50 text-iem-blue flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  Est. 1989
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1">
                37+
              </h3>
              <p className="text-xs font-bold text-slate-700 mb-2">
                Years of Academic Excellence
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Continuous pedagogical leadership and engineering education since inception.
              </p>
            </Card>

            {/* Card 2: Students [CONTENT TO BE VERIFIED] */}
            <Card className="p-6 relative overflow-hidden group hover:border-iem-blue/40">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  Annual AY
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-1 font-mono">
                [CONTENT TO BE VERIFIED]
              </h3>
              <p className="text-xs font-bold text-slate-700 mb-2">
                Active Scholars & Students
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enrolled across undergraduate, postgraduate, and doctoral degree programs.
              </p>
            </Card>

            {/* Card 3: Patents [CONTENT TO BE VERIFIED] */}
            <Card className="p-6 relative overflow-hidden group hover:border-iem-blue/40">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  Scholarly Index
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-1 font-mono">
                [CONTENT TO BE VERIFIED]
              </h3>
              <p className="text-xs font-bold text-slate-700 mb-2">
                Patents & Publications
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Indexed peer-reviewed journal papers, conference proceedings, and active patents.
              </p>
            </Card>

            {/* Card 4: Global MOUs [CONTENT TO BE VERIFIED] */}
            <Card className="p-6 relative overflow-hidden group hover:border-iem-blue/40">
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  Global Reach
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-1 font-mono">
                [CONTENT TO BE VERIFIED]
              </h3>
              <p className="text-xs font-bold text-slate-700 mb-2">
                International MOUs
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Active academic exchange treaties, dual-degree opportunities, and joint research initiatives.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE IEM (4 Photography Columns matching Reference Image) */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-iem-blue">
              The IEM Advantage
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-3">
              Why Choose IEM
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              An intentional ecosystem designed to transform high-aptitude learners into globally competitive problem solvers and ethical entrepreneurs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Column 1: Teaching */}
            <div className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={imgTeaching}
                  alt="Excellence in Teaching"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  Scholarly Pedagogy
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Excellence in Teaching
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Faculty holding doctorates from premier national institutions deliver outcome-based education anchored in modern laboratory experiments.
                  </p>
                </div>
                <Link to="/academics" className="mt-4 text-xs font-bold text-iem-blue flex items-center gap-1 hover:gap-1.5 transition-all">
                  Academic Framework <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Column 2: Industry */}
            <div className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={imgIndustry}
                  alt="Industry Immersion"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  Sector V Proximity
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Industry Immersion
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct geographic and curriculum synergy with Salt Lake Sector V’s leading development, consulting, and telecommunication giants.
                  </p>
                </div>
                <Link to="/careers" className="mt-4 text-xs font-bold text-iem-blue flex items-center gap-1 hover:gap-1.5 transition-all">
                  Corporate Tie-ups <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Column 3: Innovation */}
            <div className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={imgInnovation}
                  alt="Innovation & Incubation"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  Venture Incubation
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Innovation & Incubation
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dedicated prototyping facilities, patent filing support, seed funding opportunities, and structured entrepreneurial mentoring.
                  </p>
                </div>
                <Link to="/research" className="mt-4 text-xs font-bold text-iem-blue flex items-center gap-1 hover:gap-1.5 transition-all">
                  Innovation Cell <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Column 4: Campus Life */}
            <div className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={imgCampus}
                  alt="Vibrant Campus Life"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  Collegiate Culture
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Vibrant Campus Life
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Over 20 student chapters, competitive coding leagues, sports tournaments, literary symposia, and annual cultural conclaves.
                  </p>
                </div>
                <Link to="/campus-life" className="mt-4 text-xs font-bold text-iem-blue flex items-center gap-1 hover:gap-1.5 transition-all">
                  Student Activities <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ACADEMICS & PROGRAM EXPLORER */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-iem-blue">
                Academic Curriculum
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                Explore Programs
              </h2>
            </div>

            {/* Course Search Box & Category Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 md:mt-0">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={programSearchTerm}
                  onChange={(e) => setProgramSearchTerm(e.target.value)}
                  placeholder="Search courses (e.g. CSE, AI)..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-iem-blue focus:ring-1 focus:ring-iem-blue shadow-xs"
                />
                {programSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setProgramSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {['All', 'Engineering', 'Computer Applications'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-iem-blue text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-sm font-semibold text-slate-700">No academic courses found matching "{programSearchTerm}".</p>
              <button
                type="button"
                onClick={() => {
                  setProgramSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-3 text-xs font-bold text-iem-blue hover:underline"
              >
                Clear all search filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((prog) => (
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

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-iem-blue transition-colors">
                    {prog.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {prog.overview}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {prog.highlights.slice(0, 2).map((h, i) => (
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
                      Explore Syllabus <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>

                  <Link to={`/admissions?dept=${prog.departmentId}`}>
                    <Button variant="primary" size="sm" className="text-xs font-bold">
                      Apply
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* 6. RESEARCH & INNOVATION ("Where Ideas Become Impact") */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-iem-blue">
              Scholarly Endeavors
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-3">
              Where Ideas Become Impact
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our 6-phase innovation lifecycle empowers student ideas from initial hypothesis to defended patents and deployed industrial solutions.
            </p>
          </div>

          {/* 6-Step Pipeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-16">
            {RESEARCH_PIPELINE.map((step) => (
              <div
                key={step.step}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between hover:border-iem-blue/40 transition-all hover:bg-white hover:shadow-card"
              >
                <div>
                  <span className="text-2xl font-black text-iem-blue/40 block mb-2 font-mono">
                    {step.step}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-iem-blue mb-2">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Research Centers Showcase */}
          <div className="bg-iem-navy rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-iem-sky bg-iem-sky/10 px-3 py-1 rounded-full border border-iem-sky/20 inline-block">
                  Dedicated R&D Hubs
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  State-of-the-Art Research Centers
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Interdisciplinary laboratories outfitted with high-performance computing, FPGA synthesis tools, robotics bays, and cybersecurity sandboxes.
                </p>
                <Link to="/research">
                  <Button variant="white" size="sm" className="font-bold text-xs mt-2">
                    View Research Publications <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RESEARCH_CENTERS.map((center) => (
                  <div key={center.name} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <h4 className="text-sm font-bold text-white mb-1">{center.name}</h4>
                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">{center.focus}</p>
                    <span className="text-[10px] text-iem-sky font-semibold">{center.lead}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GLOBAL IEM ("IEM Beyond Borders") */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-iem-blue">
              Global Perspectives
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-3">
              IEM Beyond Borders
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Originating in Kolkata, extending worldwide through academic symposia, research workshops, and cross-continental scholar exchanges.
            </p>
          </div>

          {/* Interactive Map & Collaboration Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* World Map Container */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm relative min-h-[380px] flex items-center justify-center overflow-hidden">
              {/* Elegant minimal light map graphic */}
              <div className="w-full max-w-2xl aspect-[2/1] relative bg-slate-100/80 rounded-2xl border border-slate-200 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
                  Global Alliance Network Map
                </span>

                {/* Kolkata Origin Node */}
                <div className="absolute top-[52%] left-[68%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-iem-blue border-2 border-white ring-4 ring-iem-blue/30 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-iem-blue bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200 mt-1 whitespace-nowrap">
                    ★ Kolkata (HQ)
                  </span>
                </div>

                {/* Interactive Partner Pins */}
                {GLOBAL_COLLABORATIONS.map((collab) => {
                  const isSelected = activeGlobalPin.id === collab.id;
                  return (
                    <button
                      key={collab.id}
                      onClick={() => setActiveGlobalPin(collab)}
                      style={{ top: `${collab.y}%`, left: `${collab.x}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-10"
                      title={collab.country}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                          isSelected
                            ? 'bg-iem-sky border-iem-navy scale-150 ring-4 ring-sky-200'
                            : 'bg-iem-blue border-white hover:scale-125'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Country Details Card */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-iem-blue" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Collaboration Focus
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {activeGlobalPin.country}
              </h3>
              <p className="text-xs font-semibold text-iem-blue mb-4">
                {activeGlobalPin.institution}
              </p>
              <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">Engagement Type:</span>
                  <p>{activeGlobalPin.collaborationType}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">Key Focus:</span>
                  <p>{activeGlobalPin.highlight}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LIFE AT IEM (Masonry Gallery & Activities) */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-iem-blue">
                Collegiate Environment
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                Life at IEM Kolkata
              </h2>
            </div>
            <Link to="/campus-life">
              <Button variant="ghost" size="sm" className="font-bold text-xs text-iem-blue">
                Explore Clubs & Culture <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {CAMPUS_ACTIVITIES.map((act) => (
              <Card key={act.title} className="p-5 flex flex-col justify-between hover:border-slate-300">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-iem-blue bg-blue-50 px-2 py-0.5 rounded mb-3 inline-block">
                    {act.tag}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{act.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CLASSROOM TO CAREER (6-Step Journey & Recruiters) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-iem-blue">
              Career Trajectory
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-3">
              Classroom to Career
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A structured six-stage student development roadmap ensuring seamless transformation from first-year entrant to recruited corporate engineer.
            </p>
          </div>

          {/* Pathway Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-16">
            {CAREER_PATHWAY.map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xl font-black text-iem-blue font-mono">{item.step}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recruiter Partners Grid */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-6">
              Major Corporate Recruiters & Technology Partners
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PLACEMENT_PARTNERS.map((partner) => (
                <div key={partner.name} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-xs font-bold text-slate-900">{partner.name}</p>
                  <span className="text-[10px] text-slate-500">{partner.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. NEWS & EVENTS */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-iem-blue">
                Announcements
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                News & Events
              </h2>
            </div>
            <Link to="/news">
              <Button variant="ghost" size="sm" className="font-bold text-xs text-iem-blue">
                All Announcements <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEWS_ITEMS.slice(0, 3).map((item) => (
              <Card key={item.id} className="p-6 flex flex-col justify-between hover:border-slate-300">
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                    <span className="font-bold text-iem-blue bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                      {item.category}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                  {item.readTime}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 11. ALUMNI STORIES */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-iem-blue">
              Global Impact
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-3">
              Alumni Spotlight
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              IEM graduates driving technological breakthroughs and leadership across the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ALUMNI_STORIES.map((alumnus) => (
              <Card key={alumnus.id} className="p-6 bg-white flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 italic leading-relaxed mb-6">
                    "{alumnus.quote}"
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-bold text-slate-900">{alumnus.name}</h4>
                  <p className="text-xs font-semibold text-iem-blue">{alumnus.role}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{alumnus.company} • {alumnus.location}</p>
                  <span className="inline-block mt-2 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">
                    {alumnus.batch}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 12. ADMISSIONS 7-STEP CTA BANNER */}
      <section className="py-20 bg-iem-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-iem-sky bg-iem-sky/10 px-3 py-1 rounded-full border border-iem-sky/20 inline-block mb-3">
              Admissions 2026-2027
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Begin Your Engineering Journey at IEM
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Applications are officially open across all undergraduate and postgraduate engineering disciplines. Follow our streamlined 7-step process to secure your seat.
            </p>
          </div>

          {/* 7-Step Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-12">
            {ADMISSIONS_STEPS.map((s) => (
              <div key={s.step} className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs text-center flex flex-col justify-between">
                <span className="w-6 h-6 rounded-full bg-iem-sky text-iem-navy font-black text-xs flex items-center justify-center mx-auto mb-2">
                  {s.step}
                </span>
                <h4 className="text-xs font-bold text-white mb-1 leading-snug">{s.title}</h4>
                <p className="text-[10px] text-slate-300 leading-tight line-clamp-3">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button size="xl" variant="primary" className="bg-iem-blue hover:bg-iem-blue-dark text-white shadow-xl">
                Start Online Application <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/admissions">
              <Button size="xl" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                View Eligibility & Cutoffs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
