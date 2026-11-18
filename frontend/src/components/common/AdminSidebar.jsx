import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck2,
  Building2,
  CalendarClock,
  Users,
  BarChart3,
  Settings,
  Shield,
  Layers,
} from 'lucide-react';
import Logo from '../ui/Logo';

export const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const navItems = [
    { label: 'Overview Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Applications', to: '/admin/applications', icon: FileCheck2 },
    { label: 'Departments & Seats', to: '/admin/departments', icon: Building2 },
    { label: 'Admission Deadlines', to: '/admin/deadlines', icon: CalendarClock },
    { label: 'Registered Applicants', to: '/admin/applicants', icon: Users },
    { label: 'Analytics & Reports', to: '/admin/reports', icon: BarChart3 },
    { label: 'System Settings', to: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-iem-navy text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Logo light linkTo="/admin/dashboard" />
        </div>

        {/* Administrative Badge */}
        <div className="px-5 py-3 bg-white/5 border-b border-white/5 flex items-center gap-2">
          <Shield className="w-4 h-4 text-iem-sky" />
          <span className="text-[11px] font-bold text-white tracking-wider uppercase">
            Admissions Admin Suite
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-iem-blue text-white shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 text-[11px] text-slate-400 bg-iem-navy-dark">
          <p className="font-semibold text-slate-300">IEM Central Admissions</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Build v1.0 • Enterprise Mode</p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
