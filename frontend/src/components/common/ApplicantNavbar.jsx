import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, FileText, CheckCircle2, Home } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import useAuth from '../../hooks/useAuth';

export const ApplicantNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const applicantName = user?.applicant
    ? `${user.applicant.first_name} ${user.applicant.last_name}`
    : user?.email;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-4">
            <Logo linkTo="/applicant/dashboard" />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-iem-blue text-xs font-bold border border-blue-200">
              Applicant Portal
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-4">
            <Link
              to="/applicant/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-iem-blue hover:bg-slate-50 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4 text-iem-blue" />
              <span>Applications</span>
            </Link>

            <Link
              to="/applicant/profile"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-iem-blue hover:bg-slate-50 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">{applicantName}</span>
            </Link>

            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Website</span>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs font-medium text-slate-600 hover:text-rose-600 hover:border-rose-200 gap-1.5 ml-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default ApplicantNavbar;
