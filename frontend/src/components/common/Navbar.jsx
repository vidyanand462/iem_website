import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, UserCheck, Shield } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import useAuth from '../../hooks/useAuth';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'About IEM', href: '/about' },
    { label: 'Academics', href: '/academics' },
    { label: 'Research & Innovation', href: '/research' },
    { label: 'Global IEM', href: '/global' },
    { label: 'Campus Life', href: '/campus-life' },
    { label: 'Careers', href: '/careers' },
    { label: 'News & Events', href: '/news' },
    { label: 'Admissions', href: '/admissions' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-200/80'
          : 'bg-white py-4 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Official Logo */}
          <Logo />

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-xs font-semibold tracking-wide transition-colors py-1 ${
                    isActive
                      ? 'text-iem-blue border-b-2 border-iem-blue'
                      : 'text-slate-700 hover:text-iem-blue'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Portal Link & Apply Now */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={isAdmin ? '/admin/dashboard' : '/applicant/dashboard'}>
                <Button size="sm" variant="outline" className="text-xs font-bold gap-1.5">
                  {isAdmin ? <Shield className="w-3.5 h-3.5 text-iem-blue" /> : <UserCheck className="w-3.5 h-3.5 text-iem-blue" />}
                  {isAdmin ? 'Admin Portal' : 'My Dashboard'}
                </Button>
              </Link>
            ) : (
              <Link to="/auth/login">
                <Button size="sm" variant="ghost" className="text-xs font-semibold">
                  Sign In
                </Button>
              </Link>
            )}

            <Link to="/admissions">
              <Button size="sm" variant="primary" className="bg-iem-blue hover:bg-iem-blue-dark text-xs font-bold gap-1.5 shadow-sm">
                Apply Now <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-iem-blue rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-fade-in">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-iem-blue"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <Link to={isAdmin ? '/admin/dashboard' : '/applicant/dashboard'}>
                  <Button variant="outline" className="w-full justify-center">
                    Go to {isAdmin ? 'Admin Portal' : 'Applicant Dashboard'}
                  </Button>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/auth/login">
                    <Button variant="outline" className="w-full justify-center text-xs">
                      Candidate Login
                    </Button>
                  </Link>
                  <Link to="/auth/admin/login">
                    <Button variant="ghost" className="w-full justify-center text-xs">
                      Admin Login
                    </Button>
                  </Link>
                </div>
              )}
              <Link to="/admissions">
                <Button variant="primary" className="w-full justify-center">
                  Apply Now Online
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
