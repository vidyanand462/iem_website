import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  Receipt,
  FileCheck,
  Building,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import paymentService from '../../services/payment.service';
import logoImg from '../../assets/images/iem_logo.png';

export const PaymentProof = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReceiptData();
  }, [id]);

  const loadReceiptData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentService.getPaymentProof(id);
      setData(res.data);
    } catch (err) {
      setError(
        err.message ||
          'Failed to load fee receipt. Please verify that admission fee (₹1,20,000) has been paid.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Spinner size="lg" label="Retrieving official fee receipt..." className="py-24" />;
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 py-12">
        <Alert type="danger">{error || 'Fee receipt not found.'}</Alert>
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
      {/* Action Navigation Header (Hidden on print) */}
      <div className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/applicant/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
            </Button>
          </Link>
          <span className="text-xs font-semibold text-slate-500">
            Receipt: <span className="font-mono text-slate-800 font-bold">{data.receiptNumber}</span>
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to={`/applicant/applications/${id}/admission-letter`}>
            <Button variant="outline" size="sm" className="font-bold">
              <GraduationCap className="w-4 h-4 mr-1.5 text-iem-blue" /> View Admission Offer Letter
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="font-bold bg-emerald-700 hover:bg-emerald-800 shadow-sm"
          >
            <Printer className="w-4 h-4 mr-1.5" /> Print / Save Receipt
          </Button>
        </div>
      </div>

      {/* Official Money Receipt Card */}
      <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto shadow-xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
        
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <img src={logoImg} alt="IEM Watermark" className="w-[450px] h-[450px] object-contain" />
        </div>

        {/* Header Letterhead */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <img
              src={logoImg}
              alt="IEM Official Logo"
              className="w-16 h-16 sm:w-18 sm:h-18 object-contain shrink-0"
            />
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-black text-iem-navy uppercase tracking-tight">
                INSTITUTE OF ENGINEERING & MANAGEMENT
              </h1>
              <p className="text-xs font-bold text-slate-600">
                Salt Lake Electronics Complex, Sector V, Kolkata, West Bengal 700091
              </p>
              <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 mt-1 font-mono">
                <span>GSTIN: <strong className="text-slate-700">{data.gstin}</strong></span>
                <span>•</span>
                <span>PAN: <strong className="text-slate-700">{data.pan}</strong></span>
                <span>•</span>
                <span>Session: <strong className="text-slate-700">{data.financialYear}</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 text-emerald-800 text-xs font-black tracking-widest uppercase py-1 px-4 rounded-full inline-block border border-emerald-300 mt-2">
            OFFICIAL ADMISSION FEE PAYMENT RECEIPT
          </div>
        </div>

        {/* Receipt Meta Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs mb-6">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Receipt No:</span>
            <span className="font-mono font-bold text-iem-navy text-sm">{data.receiptNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Date & Time:</span>
            <span className="font-mono font-semibold text-slate-800">
              {new Date(data.receiptDate).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Payment Status:</span>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] inline-block border border-emerald-300">
              {data.paymentDetails?.status}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Candidate Name:</span>
            <span className="font-bold text-slate-900">{data.candidate?.fullName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Application ID:</span>
            <span className="font-mono font-bold text-slate-800">{data.candidate?.applicationId}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Program & Dept:</span>
            <span className="font-bold text-slate-800">{data.candidate?.department}</span>
          </div>
        </div>

        {/* Itemized Fee Breakdown Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6 text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="px-4 py-2.5">S.No.</th>
                <th className="px-4 py-2.5">Particulars / Fee Head</th>
                <th className="px-4 py-2.5 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.paymentDetails?.breakdown?.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2.5 font-mono text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-800">{item.description}</td>
                  <td className="px-4 py-2.5 font-mono font-semibold text-slate-900 text-right">
                    ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-sm">
              <tr>
                <td colSpan={2} className="px-4 py-3 text-slate-900">
                  Total Amount Paid (Admission Fee):
                </td>
                <td className="px-4 py-3 font-mono font-black text-emerald-800 text-right">
                  ₹{data.paymentDetails?.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Amount in Words Banner */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs mb-6 flex items-start gap-2">
          <span className="font-bold text-iem-navy shrink-0">Amount in Words:</span>
          <span className="font-semibold text-slate-800 italic">{data.paymentDetails?.amountInWords}</span>
        </div>

        {/* Transaction Reference & Bank Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs mb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Electronic Transaction Details
            </span>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono font-bold text-slate-800">{data.paymentDetails?.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Mode:</span>
              <span className="font-semibold text-slate-800">{data.paymentDetails?.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Gateway Status:</span>
              <span className="font-bold text-emerald-700">PAID & CAPTURED</span>
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Institution Bank Account
            </span>
            <div className="flex justify-between">
              <span className="text-slate-500">Bank & Branch:</span>
              <span className="font-semibold text-slate-800">{data.bankReference?.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account Title:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[180px]">{data.bankReference?.accountName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">IFSC Code:</span>
              <span className="font-mono font-semibold text-slate-800">{data.bankReference?.ifscCode}</span>
            </div>
          </div>
        </div>

        {/* Application Form Fee Reference (₹500) if present */}
        {data.applicationFeePaid && (
          <div className="mb-6 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-700">
                Application Form Filling Fee: <strong>₹{data.applicationFeePaid.amount}</strong> (Paid on {new Date(data.applicationFeePaid.date).toLocaleDateString()})
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">{data.applicationFeePaid.transactionId}</span>
          </div>
        )}

        {/* Signatures & Cashier Stamp */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-8 items-end text-center text-xs">
          <div className="flex flex-col items-center">
            <div className="w-18 h-18 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center p-1 text-[8px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-0.5" />
              <span>FEES RECEIVED</span>
              <span>IEM ACCOUNTS</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">Official Accounts Seal</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-12 flex items-center justify-center">
              <span className="font-serif italic text-base font-bold text-slate-800 tracking-wider">
                B. K. Mukherjee
              </span>
            </div>
            <div className="w-40 border-t border-slate-700 pt-1">
              <p className="font-bold text-slate-900 text-[11px]">Finance & Accounts Officer</p>
              <p className="text-[10px] text-slate-500">IEM Kolkata</p>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
          This receipt is an electronic proof of payment issued under the authority of Institute of Engineering & Management, Kolkata. No signature is required.
        </div>
      </div>
    </div>
  );
};

export default PaymentProof;
