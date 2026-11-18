import React from 'react';
import { Outlet } from 'react-router-dom';
import ApplicantNavbar from '../components/common/ApplicantNavbar';
import { ApplicationProvider } from '../context/ApplicationContext';

export const ApplicantLayout = () => {
  return (
    <ApplicationProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <ApplicantNavbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Institute of Engineering & Management (IEM), Kolkata. Applicant Admission Gateway.</p>
        </footer>
      </div>
    </ApplicationProvider>
  );
};

export default ApplicantLayout;
