import React from 'react';
import { Shield, Key, Database, Server, Lock, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import useAuth from '../../hooks/useAuth';

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System Governance & Security Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Enterprise security policies, session encryption parameters, and database sync configurations
        </p>
      </div>

      <Card className="p-6 bg-white border-slate-200 space-y-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-iem-blue" /> Administrative Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Authenticated Admin:</span>
            <span className="font-bold text-slate-900 font-mono">{user?.email}</span>
          </div>
          <div>
            <span className="text-slate-500 block">System Access Privilege:</span>
            <span className="font-bold text-emerald-600 uppercase font-mono">ROLE_SUPER_ADMIN</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white border-slate-200 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-iem-blue" /> Enterprise Security Rules Enforced
        </h2>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Row-Locking ACID Transactions:</strong> Application acceptance uses transactional row locks on department seat allocations to eliminate race conditions.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Mandatory Rejection Reasons:</strong> Application rejection requires non-empty justifications recorded in audit trails and communicated to applicants.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Server-Side Deadline Enforcement:</strong> Submissions and edits automatically blocked upon expiration of the admissions cycle window.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Strict Data Ownership Isolation:</strong> Applicants are cryptographically prevented from viewing or modifying records belonging to other candidates.</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
