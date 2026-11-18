import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, ShieldCheck, ArrowUpRight } from 'lucide-react';
import Logo from '../ui/Logo';

export const Footer = () => {
  return (
    <footer className="bg-iem-navy text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Accreditation */}
          <div className="lg:col-span-2 space-y-4">
            <Logo light linkTo="/" />
            <p className="text-xs leading-relaxed text-slate-300 max-w-sm pt-2">
              Institute of Engineering & Management (IEM), Kolkata. Established in 1989 as Eastern India's pioneer in private technical and management education. Dedicated to intellectual rigor and technological innovation.
            </p>
            <div className="flex items-center gap-2 text-xs text-iem-sky font-semibold bg-white/5 px-3 py-2 rounded-lg border border-white/10 w-fit">
              <ShieldCheck className="w-4 h-4 text-iem-sky" />
              <span>Autonomous Institute • NAAC Grade A+ Accredited</span>
            </div>
          </div>

          {/* Col 2: Academic Programs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Departments
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/academics" className="hover:text-white transition-colors">Computer Science & Engg.</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors">CSE (AI & ML)</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors">CSE (IoT & Cyber Security)</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors">Information Technology</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors">Electronics & Communication</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors">Electrical Engineering</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors">Mechanical Engineering</Link></li>
            </ul>
          </div>

          {/* Col 3: Portals & Admissions */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/admissions" className="hover:text-white transition-colors flex items-center gap-1">Admissions 2026 <ArrowUpRight className="w-3 h-3 text-iem-sky" /></Link></li>
              <li><Link to="/auth/login" className="hover:text-white transition-colors">Applicant Login</Link></li>
              <li><Link to="/auth/register" className="hover:text-white transition-colors">New Registration</Link></li>
              <li><Link to="/research" className="hover:text-white transition-colors">Research & Patents</Link></li>
              <li><Link to="/global" className="hover:text-white transition-colors">Global Alliances</Link></li>
              <li><Link to="/campus-life" className="hover:text-white transition-colors">Campus Life & Fests</Link></li>
              <li><Link to="/auth/admin/login" className="text-slate-400 hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Campus Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Campus Location
            </h4>
            <div className="space-y-3 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-iem-sky shrink-0 mt-0.5" />
                <span>Sector V, Salt Lake Electronics Complex, Kolkata, West Bengal 700091</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-iem-sky shrink-0" />
                <span>Admissions: 033-2357-2059</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-iem-sky shrink-0" />
                <span>admissions@iemcal.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-iem-sky shrink-0" />
                <span>www.iem.edu.in</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 1989 – {new Date().getFullYear()} Institute of Engineering & Management (IEM), Kolkata. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Centralized Admissions Platform</span>
            <span>Security Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
