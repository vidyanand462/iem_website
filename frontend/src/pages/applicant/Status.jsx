import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Printer,
  ArrowLeft,
  Calendar,
  GraduationCap,
  FileCheck,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import applicationService from '../../services/application.service';
import PaymentGatewayModal from '../../components/payment/PaymentGatewayModal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';

export const Status = () => {
  const { id } = useParams();
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getApplicationStatus(id);
      setStatusData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch application status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [id]);

  const handleAdmissionPaymentSuccess = () => {
    setPaymentModalOpen(false);
    fetchStatus();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  if (loading) {
    return <Spinner size="lg" label="Retrieving live status tracking..." className="py-24" />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert type="danger">{error}</Alert>
        <Link to="/applicant/dashboard">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isAdmissionFeePaid = statusData.payments?.some(
    (p) => p.payment_type === 'ADMISSION_FEE' && p.status === 'SUCCESS'
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded">
              {statusData.applicationId}
            </span>
            <Badge variant={statusData.currentStatus}>
              {statusData.currentStatus.replace('_', ' ')}
            </Badge>
            {isAdmissionFeePaid && (
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmed (₹1,20,000 Paid)
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {statusData.department} ({statusData.degree})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Evaluation & Verification Tracking Lifecycle
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {statusData.currentStatus === 'ACCEPTED' && !isAdmissionFeePaid && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setPaymentModalOpen(true)}
              className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
            >
              <CreditCard className="w-4 h-4 mr-1.5" /> Pay Admission Fee (₹1,20,000)
            </Button>
          )}

          {statusData.currentStatus === 'ACCEPTED' && isAdmissionFeePaid && (
            <>
              <Link to={`/applicant/applications/${id}/admission-letter`}>
                <Button variant="primary" size="sm" className="font-bold bg-iem-navy hover:bg-iem-blue text-white shadow-sm">
                  <GraduationCap className="w-4 h-4 mr-1.5" /> Admission Letter
                </Button>
              </Link>
              <Link to={`/applicant/applications/${id}/payment-proof`}>
                <Button variant="outline" size="sm" className="font-bold text-emerald-800 border-emerald-300 bg-emerald-50">
                  <FileCheck className="w-4 h-4 mr-1.5 text-emerald-600" /> Payment Proof
                </Button>
              </Link>
            </>
          )}

          <Link to={`/applicant/applications/${id}/acknowledgement`}>
            <Button variant="outline" size="sm" className="font-bold">
              <Printer className="w-4 h-4 mr-1.5" /> Acknowledgement Slip
            </Button>
          </Link>
        </div>
      </div>

      {/* Decision Notice Banner */}
      {statusData.currentStatus === 'FLAGGED' && (
        <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-sm">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-amber-950">Action Required: Flagged for Revision</h2>
                <span className="text-[11px] font-bold bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Form Unlocked
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-amber-900">
                The Admissions Committee has reviewed your application and requested revisions or document re-uploads. Your application form has been unlocked so you can make the corrections and resubmit.
              </p>
              {statusData.decision?.rejection_reason && (
                <div className="p-3 rounded-lg bg-white/90 border border-amber-200 text-xs text-slate-800">
                  <span className="font-bold block mb-0.5 text-slate-900">Review Committee Instructions:</span>
                  <span className="italic">"{statusData.decision.rejection_reason}"</span>
                </div>
              )}
              <div className="pt-2">
                <Link to={`/applicant/applications/${id}/form`}>
                  <Button variant="primary" size="sm" className="font-bold bg-amber-600 hover:bg-amber-700 text-white">
                    Open Form to Edit & Re-upload Documents
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {statusData.currentStatus === 'ACCEPTED' && !isAdmissionFeePaid && (
        <div className="p-6 rounded-2xl bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 text-emerald-950 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-black text-emerald-950">Provisional Admission Offer Granted!</h2>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed text-emerald-900">
                  The Admissions Committee has verified your academic credentials and offered provisional admission for the 2026-2027 academic session.
                  Please pay the provisional admission fee of <strong className="text-emerald-950 font-black">₹1,20,000</strong> to confirm your seat and generate your official Admission Offer Letter and Fee Receipt.
                </p>
                <p className="text-xs text-emerald-800 font-semibold mt-2">
                  Offer Date: {new Date(statusData.decision?.decided_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setPaymentModalOpen(true)}
              className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-md flex items-center justify-center gap-2 px-5 py-2.5"
            >
              <CreditCard className="w-4 h-4" /> Pay Admission Fee (₹1,20,000)
            </Button>
          </div>
        </div>
      )}

      {statusData.currentStatus === 'ACCEPTED' && isAdmissionFeePaid && (
        <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-emerald-950">Seat Officially Confirmed!</h2>
                  <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Admission Fee Paid (₹1,20,000)
                  </span>
                </div>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed text-emerald-800">
                  Your seat in {statusData.department} has been confirmed. Download your official provisional Admission Letter and payment proof for physical verification and registration.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link to={`/applicant/applications/${id}/admission-letter`}>
                <Button variant="primary" size="sm" className="font-bold bg-iem-navy hover:bg-iem-blue text-white shadow-xs">
                  <GraduationCap className="w-4 h-4 mr-1.5" /> Admission Letter
                </Button>
              </Link>
              <Link to={`/applicant/applications/${id}/payment-proof`}>
                <Button variant="outline" size="sm" className="font-bold text-emerald-800 border-emerald-400 bg-white hover:bg-emerald-50 shadow-xs">
                  <FileCheck className="w-4 h-4 mr-1.5 text-emerald-600" /> Payment Proof
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {statusData.currentStatus === 'REJECTED' && (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-sm">
          <div className="flex items-start gap-4">
            <XCircle className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold">Application Status: Not Selected</h2>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed">
                We regret to inform you that your application could not be accommodated for admission in this cycle.
              </p>
              <div className="mt-3 p-3 rounded-lg bg-rose-100/70 border border-rose-200 text-xs">
                <span className="font-bold block mb-0.5">Admissions Committee Rejection Reason:</span>
                <span>{statusData.decision?.rejection_reason || 'Application did not meet cutoff parameters.'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Progress Timeline */}
      <Card className="p-6 sm:p-8 bg-white border-slate-200">
        <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-iem-blue" />
          Status Progress Timeline
        </h2>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
          {statusData.timeline?.map((step, idx) => {
            const isDone = step.completed;
            const isRejected = step.key === 'REJECTED';

            return (
              <div key={step.key || idx} className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isRejected
                      ? 'bg-rose-600 border-white ring-4 ring-rose-100'
                      : isDone
                      ? 'bg-iem-blue border-white ring-4 ring-blue-100'
                      : 'bg-white border-slate-300'
                  }`}
                >
                  {isDone && !isRejected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${isRejected ? 'text-rose-600' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </h3>
                    {step.date && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {new Date(step.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {step.rejectionReason && (
                    <p className="text-xs text-rose-700 font-medium mt-1">
                      Reason: {step.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <Link to="/applicant/dashboard">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Admission Fee Payment Modal (₹1,20,000) */}
      <PaymentGatewayModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        applicationId={id}
        applicationCode={statusData.applicationId}
        candidateName="Candidate"
        paymentType="ADMISSION_FEE"
        onSuccess={handleAdmissionPaymentSuccess}
      />
    </div>
  );
};

export default Status;
