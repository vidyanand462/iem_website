import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Lock,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import useAuth from '../../hooks/useAuth';

// Name formatting helper: First letter MUST be capital, subsequent letters may be capital or small, strictly no numbers
export const formatNameInput = (val) => {
  if (!val) return '';
  const noNumbers = val.replace(/[0-9]/g, '');
  const validChars = noNumbers.replace(/[^A-Za-z\s.'-]/g, '');
  const trimmedLeading = validChars.replace(/^\s+/, '');
  if (!trimmedLeading) return '';
  return trimmedLeading.charAt(0).toUpperCase() + trimmedLeading.slice(1);
};

// Validation Schema with first-letter capital rule, no numbers, 10-digit Indian phone & mixed-character password rules
const registerSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name cannot exceed 100 characters')
    .refine((val) => !/[0-9]/.test(val), {
      message: 'Numbers are strictly prohibited in names',
    })
    .refine((val) => /^[A-Z]/.test(val), {
      message: 'First letter must be a capital letter (A-Z)',
    })
    .refine((val) => /^[A-Z][A-Za-z\s.'-]*$/.test(val), {
      message: 'First letter must be capital; remaining letters may be capital or small',
    }),
  last_name: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name cannot exceed 100 characters')
    .refine((val) => !/[0-9]/.test(val), {
      message: 'Numbers are strictly prohibited in names',
    })
    .refine((val) => /^[A-Z]/.test(val), {
      message: 'First letter must be a capital letter (A-Z)',
    })
    .refine((val) => /^[A-Z][A-Za-z\s.'-]*$/.test(val), {
      message: 'First letter must be capital; remaining letters may be capital or small',
    }),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g., student@example.com)'),
  phone: z
    .string()
    .trim()
    .min(1, 'Contact phone number is required')
    .regex(
      /^(?:\+91[\-\s]?)?[6-9]\d{9}$/,
      'Please enter a valid 10-digit Indian mobile number (e.g., 9876543210 or +91 9876543210)'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter (A-Z)')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter (a-z)')
    .regex(/[0-9]/, 'Password must include at least one number (0-9)')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/,
      'Password must include at least one special character (!@#$%^&*)'
    ),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match. Please re-enter identical passwords.',
  path: ['confirm_password'],
});

export const Register = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const watchPassword = watch('password', '');
  const watchPhone = watch('phone', '');

  // Live password requirements check
  const passwordChecks = [
    { label: 'At least 8 characters', met: watchPassword.length >= 8 },
    { label: 'At least 1 uppercase letter (A-Z)', met: /[A-Z]/.test(watchPassword) },
    { label: 'At least 1 lowercase letter (a-z)', met: /[a-z]/.test(watchPassword) },
    { label: 'At least 1 number (0-9)', met: /[0-9]/.test(watchPassword) },
    {
      label: 'At least 1 special character (!@#$%^&*)',
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(watchPassword),
    },
  ];

  const allPasswordChecksMet = passwordChecks.every((c) => c.met);

  const onSubmit = async (data) => {
    setServerError(null);
    setLoading(true);

    // Clean phone number: if it starts with +91, standardize it
    let cleanPhone = data.phone.trim();

    try {
      await authRegister({
        first_name: formatNameInput(data.first_name),
        last_name: formatNameInput(data.last_name),
        email: data.email.trim().toLowerCase(),
        phone: cleanPhone,
        password: data.password,
      });
      navigate('/applicant/dashboard');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo className="justify-center mb-6" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Applicant Account
        </h2>
        <p className="mt-2 text-xs text-slate-600">
          Already registered?{' '}
          <Link to="/auth/login" className="font-bold text-iem-blue hover:underline">
            Sign in to existing application
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="First Name"
                  required
                  placeholder="e.g. Subhas or SUBHAS"
                  helperText="First letter capital; no numbers allowed"
                  error={errors.first_name?.message}
                  {...register('first_name')}
                  onChange={(e) => {
                    const formatted = formatNameInput(e.target.value);
                    e.target.value = formatted;
                    setValue('first_name', formatted, { shouldValidate: true, shouldDirty: true });
                  }}
                />
              </div>
              <div>
                <Input
                  label="Last Name"
                  required
                  placeholder="e.g. Bose or BOSE"
                  helperText="First letter capital; no numbers allowed"
                  error={errors.last_name?.message}
                  {...register('last_name')}
                  onChange={(e) => {
                    const formatted = formatNameInput(e.target.value);
                    e.target.value = formatted;
                    setValue('last_name', formatted, { shouldValidate: true, shouldDirty: true });
                  }}
                />
              </div>
            </div>

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="candidate@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Contact Phone Number (+91)"
                type="tel"
                required
                placeholder="9876543210 / +91 9876543210"
                helperText="10-digit mobile number starting with 6, 7, 8, or 9"
                error={errors.phone?.message}
                {...register('phone')}
              />
              {watchPhone && !/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(watchPhone) && (
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>Warning: Phone number must be exactly 10 digits (as for +91 code).</span>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Create Password"
                type="password"
                required
                placeholder="Min. 8 mixed characters"
                error={errors.password?.message}
                {...register('password')}
              />

              {/* Mixed Characters Live Security Checklist */}
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-iem-blue" />
                    Password Security Criteria (Mixed Characters):
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      allPasswordChecksMet
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {allPasswordChecksMet ? 'Strong' : 'Requirements Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1 pt-1">
                  {passwordChecks.map((check, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                        check.met ? 'text-emerald-700 font-semibold' : 'text-slate-500'
                      }`}
                    >
                      {check.met ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Input
              label="Confirm Password"
              type="password"
              required
              placeholder="Re-enter password"
              error={errors.confirm_password?.message}
              {...register('confirm_password')}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full font-bold shadow-md"
              >
                Register & Open Application <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit Encrypted applicant credential transmission</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
