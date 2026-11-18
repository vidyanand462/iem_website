import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn, ArrowRight, Shield } from 'lucide-react';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import useAuth from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/applicant/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setLoading(true);
    try {
      const user = await login(data);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setServerError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo className="justify-center mb-6" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Applicant Portal Login
        </h2>
        <p className="mt-2 text-xs text-slate-600">
          New applicant?{' '}
          <Link to="/auth/register" className="font-bold text-iem-blue hover:underline">
            Register new candidate account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200">
          {serverError && (
            <Alert type="danger" className="mb-6" onClose={() => setServerError(null)}>
              {serverError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              required
              placeholder="applicant@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Account Password <span className="text-rose-500">*</span>
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs font-semibold text-iem-blue hover:text-iem-blue-dark hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-iem-blue/20 ${
                  errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-iem-blue'
                }`}
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full font-bold shadow-md"
              >
                Sign In to Application <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/auth/admin/login" className="text-slate-600 hover:text-iem-blue font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Admin Sign In
            </Link>
            <Link to="/" className="text-slate-600 hover:text-iem-blue">
              ← Return to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
