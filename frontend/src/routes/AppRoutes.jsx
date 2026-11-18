import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import ApplicantLayout from '../layouts/ApplicantLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Public Pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Academics from '../pages/public/Academics';
import ProgramDetail from '../pages/public/ProgramDetail';
import Research from '../pages/public/Research';
import GlobalIEM from '../pages/public/GlobalIEM';
import CampusLife from '../pages/public/CampusLife';
import Careers from '../pages/public/Careers';
import News from '../pages/public/News';
import Alumni from '../pages/public/Alumni';
import Admissions from '../pages/public/Admissions';

// Auth Pages
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import AdminLogin from '../pages/auth/AdminLogin';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Applicant Pages
import ApplicantDashboard from '../pages/applicant/Dashboard';
import ApplicationForm from '../pages/applicant/ApplicationForm';
import ApplicationStatus from '../pages/applicant/Status';
import ApplicationAcknowledgement from '../pages/applicant/Acknowledgement';
import ApplicantProfile from '../pages/applicant/Profile';
import NotEligible from '../pages/applicant/NotEligible';
import AdmissionLetter from '../pages/applicant/AdmissionLetter';
import PaymentProof from '../pages/applicant/PaymentProof';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminApplications from '../pages/admin/Applications';
import AdminApplicationReview from '../pages/admin/ApplicationReview';
import AdminDepartments from '../pages/admin/Departments';
import AdminDeadlines from '../pages/admin/Deadlines';
import AdminApplicants from '../pages/admin/Applicants';
import AdminReports from '../pages/admin/Reports';
import AdminSettings from '../pages/admin/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/academics/:id" element={<ProgramDetail />} />
        <Route path="/research" element={<Research />} />
        <Route path="/global" element={<GlobalIEM />} />
        <Route path="/campus-life" element={<CampusLife />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/news" element={<News />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/admissions" element={<Admissions />} />
      </Route>

      {/* 2. Authentication Routes */}
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/admin/login" element={<AdminLogin />} />

      {/* 3. Applicant Portal Routes (Protected) */}
      <Route
        path="/applicant"
        element={
          <RoleRoute role="APPLICANT">
            <ApplicantLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/applicant/dashboard" replace />} />
        <Route path="dashboard" element={<ApplicantDashboard />} />
        <Route path="applications/:id/form" element={<ApplicationForm />} />
        <Route path="applications/:id/status" element={<ApplicationStatus />} />
        <Route path="applications/:id/acknowledgement" element={<ApplicationAcknowledgement />} />
        <Route path="applications/:id/admission-letter" element={<AdmissionLetter />} />
        <Route path="applications/:id/admission_letter" element={<AdmissionLetter />} />
        <Route path="applications/:id/payment-proof" element={<PaymentProof />} />
        <Route path="applications/:id/payment_proof" element={<PaymentProof />} />
        <Route path="applications/:id/not-eligible" element={<NotEligible />} />
        <Route path="not-eligible" element={<NotEligible />} />
        <Route path="profile" element={<ApplicantProfile />} />
      </Route>

      {/* 4. Admin Portal Routes (Protected) */}
      <Route
        path="/admin"
        element={
          <RoleRoute role="ADMIN">
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="applications/:id/review" element={<AdminApplicationReview />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="deadlines" element={<AdminDeadlines />} />
        <Route path="applicants" element={<AdminApplicants />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 5. Fallback 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
