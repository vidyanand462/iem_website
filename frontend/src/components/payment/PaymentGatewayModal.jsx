import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Smartphone,
  Wallet,
  Clock,
  X,
} from 'lucide-react';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import logoImg from '../../assets/images/iem_logo.png';
import paymentService from '../../services/payment.service';

export const PaymentGatewayModal = ({
  isOpen,
  onClose,
  applicationId,
  applicationCode,
  candidateName,
  paymentType = 'APPLICATION_FEE', // 'APPLICATION_FEE' (₹500) | 'ADMISSION_FEE' (₹1,20,000)
  onSuccess,
}) => {
  const isAdmissionFee = paymentType === 'ADMISSION_FEE';
  const amount = isAdmissionFee ? 120000 : 500;
  const formattedAmount = isAdmissionFee ? '₹1,20,000.00' : '₹500.00';
  const feeTitle = isAdmissionFee
    ? 'Provisional Admission Confirmation Fee'
    : 'Application Form Processing Fee';
  const feeDescription = isAdmissionFee
    ? 'B.Tech 1st Semester Tuition, Registration & Caution Deposit'
    : 'Centralized Admissions 2026-2027 Registration Fee (Non-refundable)';

  const [activeMethod, setActiveMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING' | 'NEFT'
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 •••• •••• 8899',
    cardHolder: candidateName || 'Rohan Raj',
    expiry: '08/28',
    cvv: '•••',
  });
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  if (!isOpen) return null;

  const handlePay = async (e) => {
    e?.preventDefault();
    setError(null);
    setProcessing(true);
    setProcessingStage('Connecting to IEM Secure Payment Gateway...');

    try {
      // Realistic multi-stage verification
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStage('Authenticating with NPCI / Banking Switch...');
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStage('Authorizing Transaction...');

      const payload = {
        paymentMethod: activeMethod,
        provider: activeMethod === 'UPI' ? 'UPI 2.0 / NPCI' : 'BillDesk Gateway',
        bankName: activeMethod === 'NETBANKING' ? selectedBank : activeMethod === 'UPI' ? 'HDFC Bank' : 'State Bank of India',
        upiId: activeMethod === 'UPI' ? (upiId || `${candidateName?.toLowerCase().replace(/\s+/g, '') || 'candidate'}@okhdfcbank`) : null,
        cardLast4: activeMethod === 'CARD' ? '8899' : null,
      };

      let res;
      if (isAdmissionFee) {
        res = await paymentService.payAdmissionFee(applicationId, payload);
      } else {
        res = await paymentService.payApplicationFee(applicationId, payload);
      }

      setProcessingStage('Payment Authorized! Generating Official Receipt...');
      await new Promise((r) => setTimeout(r, 400));

      setPaymentSuccess(res.data?.payment || res.data);
      if (onSuccess) {
        onSuccess(res.data);
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
      setProcessingStage('');
    }
  };

  const handleModalClose = () => {
    if (processing) return;
    setError(null);
    setPaymentSuccess(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header / Letterhead Bar */}
        <div className="bg-linear-to-r from-iem-navy via-slate-900 to-iem-navy px-6 py-4 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="IEM Official Logo"
              className="h-10 w-10 object-contain bg-white rounded-full p-0.5 border border-amber-300"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase text-white">
                  IEM Kolkata Payment Gateway
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Official Central Admissions • Safe & Encrypted Checkout
              </p>
            </div>
          </div>

          {!processing && (
            <button
              onClick={handleModalClose}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Payment Success View */}
        {paymentSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Transaction Successful
              </span>
              <h2 className="text-2xl font-black text-slate-900 pt-2">
                {formattedAmount} Paid Successfully!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isAdmissionFee
                  ? 'Your provisional admission seat has been officially confirmed. You can now download your Official Admission Offer Letter & Fee Receipt.'
                  : 'Your application form filling fee has been received. Your admission application has been lodged with the Admissions Committee.'}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5 max-w-md mx-auto font-sans">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800">
                  {paymentSuccess.transaction_id || paymentSuccess.payment?.transaction_id || 'TXN-IEM-SUCCESS'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Application Number:</span>
                <span className="font-mono font-bold text-iem-navy">
                  {applicationCode || 'IEM-2026-CSE'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Category:</span>
                <span className="font-bold text-slate-800">{feeTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-black text-emerald-700 text-sm">{formattedAmount}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-mono text-slate-600">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={handleModalClose}
                className="font-bold bg-emerald-600 hover:bg-emerald-700 shadow-md"
              >
                Continue to Portal <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* Payment Interactive Screen */
          <div className="p-6">
            {/* Amount Banner */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-iem-blue bg-white px-2 py-0.5 rounded border border-blue-200">
                  {feeTitle}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  Application: <span className="font-mono text-iem-navy">{applicationCode || 'IEM-2026-CSE'}</span>
                </h3>
                <p className="text-xs text-slate-600">{feeDescription}</p>
              </div>

              <div className="text-right sm:border-l sm:border-blue-200 sm:pl-4">
                <span className="text-[11px] text-slate-500 font-medium block">Total Payable</span>
                <span className="text-2xl sm:text-3xl font-black text-iem-navy tracking-tight">
                  {formattedAmount}
                </span>
                <span className="text-[10px] text-emerald-700 block font-semibold">Zero Processing Surcharge</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-4 gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveMethod('UPI')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeMethod === 'UPI'
                    ? 'bg-white text-iem-navy shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-iem-blue" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMethod('CARD')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeMethod === 'CARD'
                    ? 'bg-white text-iem-navy shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-iem-blue" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMethod('NETBANKING')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeMethod === 'NETBANKING'
                    ? 'bg-white text-iem-navy shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-iem-blue" />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMethod('NEFT')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeMethod === 'NEFT'
                    ? 'bg-white text-iem-navy shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-iem-blue" />
                <span>RTGS / Challan</span>
              </button>
            </div>

            {/* TAB 1: UPI / QR Code */}
            {activeMethod === 'UPI' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Dynamic QR Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Scan QR with any UPI App
                    </span>
                    
                    {/* Simulated Authentic QR Graphic */}
                    <div className="mx-auto w-40 h-40 bg-white border-2 border-slate-800 rounded-xl p-2 relative flex items-center justify-center shadow-inner">
                      <div className="absolute inset-2 grid grid-cols-6 grid-rows-6 gap-1 opacity-80">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-xs ${
                              (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                                ? 'bg-slate-900'
                                : (i * 7) % 5 === 0
                                ? 'bg-iem-navy'
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="z-10 bg-white p-1 rounded-full shadow-md border border-slate-300">
                        <img src={logoImg} alt="IEM" className="w-7 h-7 object-contain" />
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-semibold pt-1">
                      <span className="bg-slate-200 px-1.5 py-0.5 rounded">GPay</span>
                      <span className="bg-slate-200 px-1.5 py-0.5 rounded">PhonePe</span>
                      <span className="bg-slate-200 px-1.5 py-0.5 rounded">Paytm</span>
                      <span className="bg-slate-200 px-1.5 py-0.5 rounded">BHIM</span>
                    </div>
                  </div>

                  {/* Manual UPI ID Input */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Or Enter Your Virtual Payment Address (UPI ID)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-iem-blue focus:border-iem-blue font-mono"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        A payment request will be sent directly to your UPI mobile app.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Merchant Name:</span>
                        <span className="font-bold text-slate-800">IEM Central Admissions</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VPA Handle:</span>
                        <span className="font-mono font-bold text-iem-navy">iemadmission@hdfcbank</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Cards */}
            {activeMethod === 'CARD' && (
              <div className="space-y-4">
                <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-lg space-y-3 border border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                      Debit / Credit Card
                    </span>
                    <span className="text-xs font-black tracking-wider text-amber-400">RUPAY / VISA / MC</span>
                  </div>
                  <div className="text-base sm:text-lg font-mono font-bold tracking-widest text-slate-100">
                    4532 •••• •••• 8899
                  </div>
                  <div className="flex justify-between items-end text-[11px]">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Card Holder</span>
                      <span className="font-bold">{candidateName || 'ROHAN RAJ'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Valid Thru</span>
                      <span className="font-bold font-mono">08/28</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Expiry Date</label>
                    <input
                      type="text"
                      defaultValue="08/28"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">CVV / Security Code</label>
                    <input
                      type="password"
                      maxLength={3}
                      defaultValue="782"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Net Banking */}
            {activeMethod === 'NETBANKING' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Select Your Bank:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra'].map(
                    (bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          selectedBank === bank
                            ? 'border-iem-blue bg-blue-50 text-iem-navy ring-2 ring-blue-200'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{bank}</span>
                        {selectedBank === bank && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-iem-blue shrink-0" />
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: NEFT / RTGS Challan */}
            {activeMethod === 'NEFT' && (
              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                  <Building2 className="w-4 h-4 text-iem-blue" />
                  <span>College Designated Virtual Account for RTGS / NEFT</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-sans text-slate-500">Beneficiary:</span>
                    <span className="font-bold text-slate-800">INSTITUTE OF ENGINEERING & MANAGEMENT</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-sans text-slate-500">Virtual A/C No:</span>
                    <span className="font-bold text-iem-navy">IEM2026{applicationId}9471</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-sans text-slate-500">Bank & Branch:</span>
                    <span className="font-bold text-slate-800">HDFC Bank, Salt Lake Sector-V</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-sans text-slate-500">IFSC Code:</span>
                    <span className="font-bold text-slate-800">HDFC0000123</span>
                  </div>
                </div>
              </div>
            )}

            {/* Security Guarantee Footer & Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified IEM Merchant • PCI-DSS Level 1 Certified</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleModalClose}
                  disabled={processing}
                  className="w-full sm:w-auto font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePay}
                  disabled={processing}
                  className="w-full sm:w-auto font-bold text-xs bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2 px-6 py-2.5"
                >
                  {processing ? (
                    <>
                      <Spinner size="xs" className="text-white" />
                      <span>{processingStage || 'Processing...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay {formattedAmount}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGatewayModal;
