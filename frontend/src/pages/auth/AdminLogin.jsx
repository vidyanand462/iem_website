import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, Lock, ArrowRight, Info } from 'lucide-react';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import useAuth from '../../hooks/useAuth';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid administrator email'),
  password: z.string().min(1, 'Password is required'),
});

export const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: 'admin@iemcal.com',
      password: 'Admin@12345',
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setLoading(true);
    try {
      await adminLogin(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setServerError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = () => {
    setValue('email', 'admin@iemcal.com');
    setValue('password', 'Admin@12345');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo light className="justify-center mb-6" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iem-sky/10 border border-iem-sky/30 text-iem-sky text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Restricted Portal
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Admissions Control Suite
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Authorized admissions personnel and committee members only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-700">
          {serverError && (
            <Alert type="danger" className="mb-6" onClose={() => setServerError(null)}>
              {serverError}
            </Alert>
          )}

          {/* Development Demo Credentials Helper */}
          <div className="mb-6 p-3 rounded-xl bg-iem-blue/20 border border-iem-blue/40 text-xs flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-iem-sky shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Demo Admin Credentials:</span>
                <span className="text-slate-300">admin@iemcal.com / Admin@12345</span>
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemoCreds}
              className="text-[11px] font-bold text-iem-sky hover:underline"
            >
              Fill
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-iem-sky focus:ring-1 focus:ring-iem-sky"
                placeholder="admin@iemcal.com"
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Security Password <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-iem-sky focus:ring-1 focus:ring-iem-sky"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full font-bold bg-iem-blue hover:bg-iem-blue-light text-white shadow-lg"
              >
                Authenticate & Access Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/60 text-center text-xs text-slate-400">
            <Link to="/auth/login" className="hover:text-white transition-colors">
              ← Candidate Application Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
