import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export const Profile = () => {
  const { user } = useAuth();
  const [msg, setMsg] = useState(null);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-iem-navy text-white flex items-center justify-center font-bold text-xl">
            {user?.applicant?.first_name?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {user?.applicant?.first_name} {user?.applicant?.last_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-iem-blue" />
          Applicant Account Credentials
        </h2>

        {msg && <Alert type="success">{msg}</Alert>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Registered Email
            </label>
            <p className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-800">
              {user?.email}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Registered Mobile Number
            </label>
            <p className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-800">
              {user?.applicant?.phone || 'N/A'}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Role: CANDIDATE APPLICANT (Verified)</span>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
