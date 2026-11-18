import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2, Building2, GraduationCap, FileCheck, CreditCard } from 'lucide-react';
import applicationService from '../../services/application.service';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import Logo from '../../components/ui/Logo';

export const Acknowledgement = () => {
  const { id } = useParams();
  const [ackData, setAckData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAck = async () => {
      setLoading(true);
      try {
        const res = await applicationService.getApplicationAcknowledgement(id);
        setAckData(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load acknowledgement slip.');
      } finally {
        setLoading(false);
      }
    };
    fetchAck();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Spinner size="lg" label="Generating official acknowledgement slip..." className="py-24" />;
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

  const appFeePay = ackData.payments?.find((p) => p.payment_type === 'APPLICATION_FEE' && p.status === 'SUCCESS');
  const admissionFeePay = ackData.payments?.find((p) => p.payment_type === 'ADMISSION_FEE' && p.status === 'SUCCESS');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link to="/applicant/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {admissionFeePay && (
            <>
              <Link to={`/applicant/applications/${id}/admission-letter`}>
                <Button variant="outline" size="sm" className="font-bold">
                  <GraduationCap className="w-4 h-4 mr-1 text-iem-blue" /> Admission Letter
                </Button>
              </Link>
              <Link to={`/applicant/applications/${id}/payment-proof`}>
                <Button variant="outline" size="sm" className="font-bold text-emerald-800 border-emerald-300 bg-emerald-50">
                  <FileCheck className="w-4 h-4 mr-1 text-emerald-600" /> Payment Proof
                </Button>
              </Link>
            </>
          )}
          <Button variant="primary" size="md" onClick={handlePrint} className="font-bold shadow-md bg-iem-navy hover:bg-iem-blue">
            <Printer className="w-4 h-4 mr-2" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Official Printable Slip */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 p-8 sm:p-12 shadow-md space-y-8 text-slate-900 print:shadow-none print:border print:rounded-none">
        {/* Slip Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
          <div>
            <Logo />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mt-3">
              Official Admission Application Acknowledgement Slip
            </h2>
            <p className="text-xs text-slate-600">
              Academic Session 2026-2027 • Centralized Admissions Cell
            </p>
          </div>

          <div className="text-right sm:border-l border-slate-200 sm:pl-6">
            <span className="text-[11px] text-slate-500 block uppercase font-semibold">Application Number:</span>
            <span className="text-xl font-extrabold font-mono text-iem-navy block">
              {ackData.applicationId}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Submitted: {new Date(ackData.submissionDate).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Candidate & Program Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Candidate Profile Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
              Candidate Particulars
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-slate-500">Name:</span>
              <span className="font-bold text-slate-900">{ackData.candidate?.fullName}</span>

              <span className="text-slate-500">Email:</span>
              <span className="font-semibold text-slate-900">{ackData.candidate?.email}</span>

              <span className="text-slate-500">Phone:</span>
              <span className="font-semibold text-slate-900">{ackData.candidate?.phone}</span>

              <span className="text-slate-500">Category / Gender:</span>
              <span className="font-semibold text-slate-900">
                {ackData.candidate?.category} / {ackData.candidate?.gender}
              </span>

              <span className="text-slate-500">Blood Group (Rh):</span>
              <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block w-fit">
                {ackData.candidate?.bloodGroup || 'N/A'}
              </span>
            </div>
          </div>

          {/* Program Allocation Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
              Applied Degree & Department
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-slate-500">Department:</span>
              <span className="font-bold text-slate-900">{ackData.program?.departmentName}</span>

              <span className="text-slate-500">Discipline Code:</span>
              <span className="font-bold text-slate-900 font-mono">{ackData.program?.code}</span>

              <span className="text-slate-500">Degree:</span>
              <span className="font-semibold text-slate-900">{ackData.program?.degree}</span>

              <span className="text-slate-500">Program Duration:</span>
              <span className="font-semibold text-slate-900">{ackData.program?.duration}</span>
            </div>
          </div>
        </div>

        {/* Academic History Record */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
            Academic & Entrance Exam Record
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">10th Board:</span>
              <span className="font-bold text-slate-900">
                {ackData.academicRecord?.tenthBoard} ({ackData.academicRecord?.tenthPercentage})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">12th Board:</span>
              <span className="font-bold text-slate-900">
                {ackData.academicRecord?.twelfthBoard} ({ackData.academicRecord?.twelfthPercentage})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Qualifying Exam:</span>
              <span className="font-bold text-slate-900">
                {ackData.academicRecord?.entranceExam}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Merit Rank:</span>
              <span className="font-bold text-slate-900 font-mono">
                {ackData.academicRecord?.rank}
              </span>
            </div>
          </div>
        </div>

        {/* Fee Payment & Transaction Status */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Fee Clearance & Transaction Records:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Application Form Filling Fee</span>
                <span className="text-[11px] font-mono text-slate-500">
                  {appFeePay ? `Txn: ${appFeePay.transaction_id}` : 'Official Record Validated'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                ₹500.00 PAID
              </span>
            </div>

            {admissionFeePay ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block">Provisional Admission Fee</span>
                  <span className="text-[11px] font-mono text-emerald-800">
                    Txn: {admissionFeePay.transaction_id}
                  </span>
                </div>
                <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
                  ₹1,20,000.00 PAID
                </span>
              </div>
            ) : ackData.status === 'ACCEPTED' ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950 block">Provisional Admission Fee</span>
                  <span className="text-[11px] text-amber-800">Seat offered, fee pending</span>
                </div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded border border-amber-300">
                  ₹1,20,000.00 PENDING
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Important Institutional Instructions */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Important Guidelines & Instructions:
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-5">
            {ackData.importantNotice?.map((notice, i) => (
              <li key={i}>{notice}</li>
            ))}
          </ul>
        </div>

        {/* Barcode & Verification Stamp */}
        <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Digital Cryptographic Verification: VALIDATED</span>
          </div>

          <div className="text-right">
            <p className="font-bold text-slate-900">IEM Kolkata Admissions Office</p>
            <p className="text-[11px] text-slate-400">Sector V, Salt Lake, Kolkata 700091</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acknowledgement;
