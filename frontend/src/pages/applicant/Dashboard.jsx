import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  FilePlus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Printer,
  ChevronRight,
  Sparkles,
  Search,
  X,
  AlertCircle,
  Edit3,
  GraduationCap,
  FileCheck,
  CreditCard,
} from 'lucide-react';
import PaymentGatewayModal from '../../components/payment/PaymentGatewayModal';
import applicationService from '../../services/application.service';
import adminService from '../../services/admin.service';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import useAuth from '../../hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Application Modal State
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [creating, setCreating] = useState(false);
  const [deptSearchTerm, setDeptSearchTerm] = useState('');

  // Admission Fee Payment Modal State
  const [admissionPaymentModal, setAdmissionPaymentModal] = useState({ open: false, app: null });

  const handleAdmissionPaymentSuccess = () => {
    setAdmissionPaymentModal({ open: false, app: null });
    loadData();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const filteredDepartments = departments.filter((dept) => {
    if (!deptSearchTerm.trim()) return true;
    const term = deptSearchTerm.toLowerCase();
    return (
      dept.name?.toLowerCase().includes(term) ||
      dept.code?.toLowerCase().includes(term) ||
      dept.degree?.toLowerCase().includes(term) ||
      dept.description?.toLowerCase().includes(term)
    );
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsRes, deptsRes] = await Promise.all([
        applicationService.getMyApplications(),
        adminService.getDepartments(),
      ]);
      setApplications(appsRes.data || []);
      setDepartments(deptsRes.data || []);

      // If any accepted application, fire confetti celebration
      const hasAccepted = (appsRes.data || []).some((a) => a.status === 'ACCEPTED');
      if (hasAccepted) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load application data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateApplication = async () => {
    if (!selectedDept) return;
    setCreating(true);
    try {
      const res = await applicationService.createApplication(selectedDept);
      setNewModalOpen(false);
      navigate(`/applicant/applications/${res.data.id || res.data.application_id}/form`);
    } catch (err) {
      alert(err.message || 'Failed to create application.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Loading candidate dashboard..." className="py-24" />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-iem-blue uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded">
            Applicant Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Welcome, {user?.applicant?.first_name || 'Candidate'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your centralized admissions, upload verification credentials, and monitor evaluation decisions.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setNewModalOpen(true)}
          className="font-bold shrink-0 shadow-sm"
        >
          <FilePlus className="w-4 h-4 mr-2" /> Start New Application
        </Button>
      </div>

      {error && <Alert type="danger">{error}</Alert>}

      {/* Applications List */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-iem-blue" />
          My Applications ({applications.length})
        </h2>

        {applications.length === 0 ? (
          <Card className="p-12 text-center bg-white border-dashed border-2">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No Active Applications</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              You haven't initiated any application for the 2026-2027 academic session yet.
            </p>
            <Button variant="primary" onClick={() => setNewModalOpen(true)} className="font-bold">
              Start Application Now
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications.map((app) => {
              const isAdmissionFeePaid = app.payments?.some(
                (p) => p.payment_type === 'ADMISSION_FEE' && p.status === 'SUCCESS'
              );

              return (
              <Card key={app.id} className="p-6 bg-white border-slate-200 overflow-hidden relative">
                {/* Status Bar Indicator */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {app.application_id}
                      </span>
                      <Badge variant={app.status}>{app.status.replace('_', ' ')}</Badge>
                      {isAdmissionFeePaid && (
                        <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Seat Confirmed (₹1,20,000 Paid)
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {app.department?.name} ({app.department?.code})
                    </h3>
                  </div>

                  <div className="text-xs text-slate-500">
                    Created on {new Date(app.created_at).toLocaleDateString()}
                    {app.submitted_at && ` • Submitted on ${new Date(app.submitted_at).toLocaleDateString()}`}
                  </div>
                </div>

                {/* Status Alert Panels for ACCEPTED, REJECTED, or FLAGGED */}
                {app.status === 'FLAGGED' && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-2xs">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-amber-950">Action Required: Application Flagged for Corrections</h4>
                      <p className="text-xs text-amber-900">
                        The Admissions Committee has unlocked your application to allow corrections and document re-uploads.
                      </p>
                      {app.decision?.rejection_reason && (
                        <p className="text-xs mt-1.5 p-2 bg-white/90 rounded border border-amber-200 text-slate-800">
                          <span className="font-bold">Required Corrections:</span> {app.decision.rejection_reason}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {app.status === 'ACCEPTED' && !isAdmissionFeePaid && (
                  <div className="mt-4 p-5 rounded-2xl bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 text-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-black text-emerald-950">Congratulations! Provisional Admission Offer Granted</h4>
                        <p className="text-xs text-emerald-900 mt-0.5 max-w-xl leading-relaxed">
                          Your application has been accepted by the IEM Admissions Committee. Please pay the admission fee of <strong className="text-emerald-950 font-black">₹1,20,000</strong> to confirm your seat and generate your official Admission Letter & Payment Proof.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setAdmissionPaymentModal({ open: true, app })}
                      className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-md flex items-center justify-center gap-1.5 px-4 py-2"
                    >
                      <CreditCard className="w-4 h-4" /> Pay Admission Fee (₹1,20,000)
                    </Button>
                  </div>
                )}

                {app.status === 'ACCEPTED' && isAdmissionFeePaid && (
                  <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-emerald-950">Admission Seat Confirmed!</h4>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            Admission Fee Paid (₹1,20,000)
                          </span>
                        </div>
                        <p className="text-xs text-emerald-900 mt-0.5">
                          Your provisional seat is secured. Download your official Admission Letter and Payment Proof below.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/applicant/applications/${app.id}/admission-letter`}>
                        <Button variant="primary" size="xs" className="font-bold bg-iem-navy hover:bg-iem-blue text-white shadow-xs">
                          <GraduationCap className="w-3.5 h-3.5 mr-1" /> Admission Letter
                        </Button>
                      </Link>
                      <Link to={`/applicant/applications/${app.id}/payment-proof`}>
                        <Button variant="outline" size="xs" className="font-bold bg-white text-emerald-800 border-emerald-400 hover:bg-emerald-50 shadow-xs">
                          <FileCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Payment Proof
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {app.status === 'REJECTED' && (
                  <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold">Application Status: Not Selected</h4>
                      <p className="text-xs mt-0.5">
                        <span className="font-bold">Admissions Committee Remarks:</span>{' '}
                        {app.decision?.rejection_reason || 'Application did not satisfy current cutoff requirements.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap items-center gap-3">
                    {app.status === 'DRAFT' ? (
                      <Link to={`/applicant/applications/${app.id}/form`}>
                        <Button variant="primary" size="sm" className="font-bold">
                          Continue Form (Step {app.current_step}/7) <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    ) : app.status === 'FLAGGED' ? (
                      <>
                        <Link to={`/applicant/applications/${app.id}/form`}>
                          <Button variant="primary" size="sm" className="font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm">
                            <Edit3 className="w-3.5 h-3.5 mr-1" /> Correct Form / Re-upload Documents
                          </Button>
                        </Link>

                        <Link to={`/applicant/applications/${app.id}/status`}>
                          <Button variant="outline" size="sm" className="font-bold text-xs border-amber-300 text-amber-900 bg-amber-50">
                            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> Review Flagged Remarks
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        {app.status === 'ACCEPTED' && !isAdmissionFeePaid && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setAdmissionPaymentModal({ open: true, app })}
                            className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                          >
                            <CreditCard className="w-3.5 h-3.5 mr-1" /> Pay Admission Fee (₹1,20,000)
                          </Button>
                        )}

                        {app.status === 'ACCEPTED' && isAdmissionFeePaid && (
                          <>
                            <Link to={`/applicant/applications/${app.id}/admission-letter`}>
                              <Button variant="primary" size="sm" className="font-bold bg-iem-navy hover:bg-iem-blue text-white shadow-sm">
                                <GraduationCap className="w-3.5 h-3.5 mr-1" /> Admission Letter
                              </Button>
                            </Link>
                            <Link to={`/applicant/applications/${app.id}/payment-proof`}>
                              <Button variant="outline" size="sm" className="font-bold text-emerald-800 border-emerald-300 bg-emerald-50">
                                <FileCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Payment Proof
                              </Button>
                            </Link>
                          </>
                        )}

                        <Link to={`/applicant/applications/${app.id}/status`}>
                          <Button variant="outline" size="sm" className="font-bold text-xs">
                            <Clock className="w-3.5 h-3.5 mr-1" /> Live Status Tracker
                          </Button>
                        </Link>

                        <Link to={`/applicant/applications/${app.id}/acknowledgement`}>
                          <Button variant="outline" size="sm" className="font-bold text-xs">
                            <Printer className="w-3.5 h-3.5 mr-1" /> Acknowledgement Slip
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>

                  <Link
                    to={`/applicant/applications/${app.id}/form`}
                    className="text-xs font-semibold text-slate-500 hover:text-iem-blue flex items-center gap-1"
                  >
                    View Submitted Data <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
            })}
          </div>
        )}
      </div>

      {/* New Application Department Selector Modal */}
      <Modal
        isOpen={newModalOpen}
        onClose={() => {
          setNewModalOpen(false);
          setDeptSearchTerm('');
        }}
        title="Start New Admission Application"
        subtitle="Search and select the engineering course/department you wish to apply for:"
      >
        <div className="space-y-4">
          {/* Course Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={deptSearchTerm}
              onChange={(e) => setDeptSearchTerm(e.target.value)}
              placeholder="Search courses by name or code (e.g. CSE, AIML, IT, ECE)..."
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-iem-blue focus:bg-white transition-all shadow-xs"
            />
            {deptSearchTerm && (
              <button
                type="button"
                onClick={() => setDeptSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Showing {filteredDepartments.length} of {departments.length} courses</span>
            {deptSearchTerm && (
              <span className="font-semibold text-iem-blue">Filtered by "{deptSearchTerm}"</span>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => (
                <label
                  key={dept.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedDept === dept.id
                      ? 'border-iem-blue bg-blue-50/50 ring-2 ring-blue-100 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="dept"
                    value={dept.id}
                    checked={selectedDept === dept.id}
                    onChange={() => setSelectedDept(dept.id)}
                    className="mt-1 text-iem-blue focus:ring-iem-blue"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{dept.name}</span>
                      <span className="text-[10px] font-mono font-bold text-iem-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {dept.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{dept.description}</p>
                  </div>
                </label>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p>No engineering courses match "{deptSearchTerm}".</p>
                <button
                  type="button"
                  onClick={() => setDeptSearchTerm('')}
                  className="mt-2 text-iem-blue font-bold hover:underline inline-block"
                >
                  Clear search filter
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button
              variant="ghost"
              onClick={() => {
                setNewModalOpen(false);
                setDeptSearchTerm('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!selectedDept}
              isLoading={creating}
              onClick={handleCreateApplication}
              className="font-bold"
            >
              Open Application Form
            </Button>
          </div>
        </div>
      </Modal>

      {/* Admission Fee Payment Modal (₹1,20,000) */}
      <PaymentGatewayModal
        isOpen={admissionPaymentModal.open}
        onClose={() => setAdmissionPaymentModal({ open: false, app: null })}
        applicationId={admissionPaymentModal.app?.id}
        applicationCode={admissionPaymentModal.app?.application_id}
        candidateName={user?.applicant?.first_name ? `${user.applicant.first_name} ${user.applicant.last_name || ''}`.trim() : 'Candidate'}
        paymentType="ADMISSION_FEE"
        onSuccess={handleAdmissionPaymentSuccess}
      />
    </div>
  );
};

export default Dashboard;
