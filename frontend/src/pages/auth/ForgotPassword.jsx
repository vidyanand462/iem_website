import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Mail, Lock, RefreshCw, Key } from 'lucide-react';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import authService from '../../services/auth.service';

export const ForgotPassword = () => {
  const navigate = useNavigate();

  // Multi-step: 'EMAIL' | 'OTP_PASSWORD' | 'SUCCESS'
  const [step, setStep] = useState('EMAIL');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Generated OTP for development / demo convenience
  const [demoOtp, setDemoOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Request Reset Code (Step 1)
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(cleanEmail);
      setSuccessMsg('A 6-digit password reset verification code has been generated for your account.');
      if (res.data?.otp) {
        setDemoOtp(res.data.otp);
        setOtp(res.data.otp); // prefill for instant convenience
      }
      setStep('OTP_PASSWORD');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'No account found with this email.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Password Reset (Step 2)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the valid 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        new_password: newPassword,
      });
      setStep('SUCCESS');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Password reset failed. Please check your verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo className="justify-center mb-6" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Reset Account Password
        </h2>
        <p className="mt-1.5 text-xs text-slate-600">
          Recover your candidate account access for IEM Kolkata Admission Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200">
          {error && (
            <Alert type="danger" className="mb-6" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {successMsg && step !== 'SUCCESS' && (
            <Alert type="success" className="mb-6" onClose={() => setSuccessMsg(null)}>
              {successMsg}
            </Alert>
          )}

          {/* STEP 1: Enter Registered Email */}
          {step === 'EMAIL' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Registered Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="applicant@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl transition-all shadow-2xs focus:outline-none focus:border-iem-blue focus:ring-2 focus:ring-iem-blue/20"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Enter the email address you used when registering your candidate account.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  className="w-full font-bold shadow-md bg-iem-blue hover:bg-iem-blue-dark text-white"
                >
                  <span>Send Reset Verification Code</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>

              <div className="text-center pt-3 border-t border-slate-100">
                <Link
                  to="/auth/login"
                  className="text-xs font-semibold text-slate-600 hover:text-iem-blue inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: Enter Verification Code & New Password */}
          {step === 'OTP_PASSWORD' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Demo / Verification Code Notice Banner */}
              {demoOtp && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-2.5 shadow-2xs">
                  <KeyRound className="w-4 h-4 text-iem-blue shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Your 6-Digit Verification Code:</span>
                    <span className="font-mono text-base font-extrabold text-iem-blue tracking-widest bg-white px-2 py-0.5 rounded border border-blue-200 inline-block mt-1">
                      {demoOtp}
                    </span>
                    <p className="text-[11px] text-blue-800 mt-1">
                      (Simulated instant verification code for testing)
                    </p>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    6-Digit Verification Code <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('EMAIL');
                      setError(null);
                    }}
                    className="text-[11px] font-semibold text-iem-blue hover:underline"
                  >
                    Change Email
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold tracking-widest bg-white border border-slate-300 rounded-xl transition-all shadow-2xs focus:outline-none focus:border-iem-blue focus:ring-2 focus:ring-iem-blue/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Set New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl transition-all shadow-2xs focus:outline-none focus:border-iem-blue focus:ring-2 focus:ring-iem-blue/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl transition-all shadow-2xs focus:outline-none focus:border-iem-blue focus:ring-2 focus:ring-iem-blue/20"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  className="w-full font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  <span>Update & Reset Password</span>
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-iem-blue hover:underline font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                </button>
                <Link to="/auth/login" className="text-slate-600 hover:text-iem-blue font-semibold">
                  Return to Sign In
                </Link>
              </div>
            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 'SUCCESS' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Password Reset Successfully!
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Your account password has been updated. You can now log in to the IEM Admission Portal using your registered email and new password.
              </p>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/auth/login')}
                  className="w-full font-bold shadow-md bg-iem-blue hover:bg-iem-blue-dark text-white"
                >
                  <span>Sign In to Your Account</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
