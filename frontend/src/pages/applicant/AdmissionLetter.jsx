import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  FileCheck,
  Award,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import paymentService from '../../services/payment.service';
import applicationService from '../../services/application.service';
import logoImg from '../../assets/images/iem_logo.png';

export const AdmissionLetter = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLetterData();
  }, [id]);

  const loadLetterData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentService.getAdmissionLetter(id);
      setData(res.data);
    } catch (err) {
      setError(
        err.message ||
          'Failed to load admission letter. Please verify that admission fee (₹1,20,000) has been paid.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Spinner size="lg" label="Generating official admission letter..." className="py-24" />;
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 py-12">
        <Alert type="danger">{error || 'Admission letter not found.'}</Alert>
        <Link to={`/applicant/applications/${id}/status`}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Application Status
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Action Navigation Header (Hidden when printing) */}
      <div className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/applicant/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
            </Button>
          </Link>
          <span className="text-xs font-semibold text-slate-500">
            Application: <span className="font-mono text-slate-800 font-bold">{data.candidate?.applicationId}</span>
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to={`/applicant/applications/${id}/payment-proof`}>
            <Button variant="outline" size="sm" className="font-bold">
              <FileCheck className="w-4 h-4 mr-1.5 text-emerald-600" /> View Payment Proof (₹1,20,000)
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="font-bold bg-iem-navy hover:bg-iem-blue shadow-sm"
          >
            <Printer className="w-4 h-4 mr-1.5" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Official Admission Offer Letter Document */}
      <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto shadow-xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
        
        {/* Subtle Watermark for Authenticity */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <img src={logoImg} alt="IEM Watermark" className="w-[500px] h-[500px] object-contain" />
        </div>

        {/* Letterhead */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <img
              src={logoImg}
              alt="IEM Official Emblem"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
            />
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-black text-iem-navy uppercase tracking-tight">
                INSTITUTE OF ENGINEERING & MANAGEMENT
              </h1>
              <p className="text-xs sm:text-sm font-bold text-amber-700 tracking-wide">
                Good Education, Good Jobs
              </p>
              <p className="text-[11px] text-slate-600 max-w-xl leading-tight mt-0.5">
                {data.institution?.campus}
              </p>
            </div>
          </div>

          <div className="bg-slate-100 py-1 px-3 rounded-md text-[10px] text-slate-700 font-semibold mt-2 inline-block border border-slate-300">
            {data.institution?.affiliations}
          </div>
        </div>

        {/* Reference & Date Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 mb-6 font-mono pb-2 border-b border-slate-200 gap-1">
          <div>
            <span className="font-sans font-bold text-slate-800">Letter Ref No: </span>
            <span className="font-bold text-iem-navy">{data.letterReference}</span>
          </div>
          <div>
            <span className="font-sans font-bold text-slate-800">Date of Issue: </span>
            <span>{new Date(data.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Letter Title Banner */}
        <div className="text-center my-6">
          <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider inline-block border-b-2 border-iem-blue pb-1">
            PROVISIONAL ADMISSION OFFER LETTER (SESSION 2026-2027)
          </h2>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full border border-emerald-300">
              Admission Status: SEAT CONFIRMED & ALLOCATED
            </span>
          </div>
        </div>

        {/* Candidate Particulars & Program Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs mb-6">
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] text-iem-blue tracking-wider border-b border-slate-200 pb-1">
              Candidate Information
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-500">Student Name:</span>
              <span className="font-bold text-slate-900">{data.candidate?.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Application Number:</span>
              <span className="font-mono font-bold text-iem-navy">{data.candidate?.applicationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Permanent Roll / Enrollment:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {data.rollNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Father's Name:</span>
              <span className="font-semibold text-slate-800">{data.candidate?.fatherName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category & Gender:</span>
              <span className="font-semibold text-slate-800">{data.candidate?.category} • {data.candidate?.gender}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] text-iem-blue tracking-wider border-b border-slate-200 pb-1">
              Allotted Program Particulars
            </h3>
            <div className="flex justify-between">
              <span className="text-slate-500">Department / Branch:</span>
              <span className="font-bold text-slate-900">{data.program?.departmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Degree & Code:</span>
              <span className="font-bold text-slate-800">{data.program?.degree} ({data.program?.code})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Course Duration:</span>
              <span className="font-semibold text-slate-800">{data.program?.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Academic Session:</span>
              <span className="font-semibold text-slate-800">{data.program?.academicSession}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Seat Allocation Category:</span>
              <span className="font-semibold text-slate-800">{data.program?.seatCategory}</span>
            </div>
          </div>
        </div>

        {/* Congratulatory Text */}
        <div className="text-xs text-slate-700 leading-relaxed space-y-3 mb-6">
          <p>
            Dear <strong className="text-slate-900">{data.candidate?.fullName}</strong>,
          </p>
          <p>
            We take immense pleasure in informing you that based on your academic credentials, performance in the entrance examination, and successful fulfillment of eligibility parameters, you have been provisionally granted admission into the prestigious <strong>{data.program?.degree}</strong> programme in <strong>{data.program?.departmentName}</strong> at the Institute of Engineering & Management (IEM), Kolkata for the academic year 2026-2027.
          </p>
          <p>
            Your provisional admission fee has been officially credited and verified. Your allotted seat in the department has been secured in the institutional registry.
          </p>
        </div>

        {/* Fee Clearance Summary Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6 text-xs">
          <div className="bg-slate-100 px-4 py-2 font-bold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-200 flex justify-between">
            <span>Official Fee Clearance & Clearance Schedule</span>
            <span className="text-emerald-700 font-bold">100% Cleared</span>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2">Component</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Transaction ID</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-2 font-semibold text-slate-800">Application Form Filling Fee</td>
                <td className="px-4 py-2 font-mono">₹500.00</td>
                <td className="px-4 py-2 font-mono text-[10px] text-slate-600">{data.payments?.applicationFee?.transactionId}</td>
                <td className="px-4 py-2 font-mono text-[10px]">{new Date(data.payments?.applicationFee?.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    PAID
                  </span>
                </td>
              </tr>
              <tr className="bg-emerald-50/40">
                <td className="px-4 py-2 font-bold text-slate-900">
                  Provisional Admission Fee (1st Sem Tuition + Reg + Caution)
                </td>
                <td className="px-4 py-2 font-mono font-bold text-emerald-800">₹1,20,000.00</td>
                <td className="px-4 py-2 font-mono text-[10px] font-bold text-slate-800">{data.payments?.admissionFee?.transactionId}</td>
                <td className="px-4 py-2 font-mono text-[10px]">{new Date(data.payments?.admissionFee?.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    CONFIRMED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reporting & Counseling Instructions */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 text-xs mb-8 space-y-2">
          <h4 className="font-bold text-amber-950 uppercase text-[11px] tracking-wide flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-700" /> Physical Document Verification & Induction Schedule:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
            {data.reportingInstructions?.map((ins, i) => (
              <li key={i}>{ins}</li>
            ))}
          </ul>
        </div>

        {/* Signatures & Seal Section */}
        <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end text-center text-xs">
          {/* Institutional Seal */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-400 flex flex-col items-center justify-center p-1 text-[8px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-0.5" />
              <span>OFFICIAL SEAL</span>
              <span>IEM KOLKATA</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">Registrar Admissions</span>
          </div>

          {/* Dean Signature */}
          <div className="flex flex-col items-center">
            <div className="h-14 flex items-center justify-center">
              <span className="font-serif italic text-base font-bold text-slate-800 tracking-wider">
                Satyajit Chakrabarti
              </span>
            </div>
            <div className="w-36 border-t border-slate-700 pt-1">
              <p className="font-bold text-slate-900 text-[11px]">{data.signatories?.deanName}</p>
              <p className="text-[10px] text-slate-500">{data.signatories?.deanTitle}</p>
            </div>
          </div>

          {/* Principal Signature */}
          <div className="flex flex-col items-center col-span-2 sm:col-span-1">
            <div className="h-14 flex items-center justify-center">
              <span className="font-serif italic text-base font-bold text-slate-800 tracking-wider">
                A. K. Nayak
              </span>
            </div>
            <div className="w-36 border-t border-slate-700 pt-1">
              <p className="font-bold text-slate-900 text-[11px]">{data.signatories?.directorName}</p>
              <p className="text-[10px] text-slate-500">{data.signatories?.directorTitle}</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
          This is a computer-generated official admission document issued by the Centralized Admission Portal, Institute of Engineering & Management, Kolkata. No physical signature required beyond digital verification.
        </div>
      </div>
    </div>
  );
};

export default AdmissionLetter;
