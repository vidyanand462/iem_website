import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  AlertOctagon,
  XCircle,
  GraduationCap,
  ArrowLeft,
  Edit3,
  PhoneCall,
  Mail,
  MapPin,
  HelpCircle,
  FileText,
  Building2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import applicationService from '../../services/application.service';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

export const NotEligible = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [appData, setAppData] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state && !!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If state wasn't passed directly, fetch application details by id
    if (!appData && id) {
      const fetchApp = async () => {
        setLoading(true);
        try {
          const res = await applicationService.getApplicationById(id);
          const app = res.data;
          setAppData({
            percentage: app.academicInfo?.twelfth_percentage || '',
            departmentName: app.department?.name,
            degree: app.department?.degree,
            applicationId: app.application_id,
            id: id,
          });
        } catch (err) {
          setError(err.message || 'Unable to retrieve application details.');
        } finally {
          setLoading(false);
        }
      };
      fetchApp();
    }
  }, [id, appData]);

  if (loading) {
    return <Spinner size="lg" label="Verifying eligibility criteria..." className="py-24" />;
  }

  const recordedPercentage = parseFloat(appData?.percentage);
  const minRequiredPercentage = 60.0;
  const shortfall = !isNaN(recordedPercentage)
    ? (minRequiredPercentage - recordedPercentage).toFixed(2)
    : null;

  const handleEditMarks = () => {
    if (id) {
      navigate(`/applicant/applications/${id}/form`);
    } else {
      navigate('/applicant/dashboard');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Top Breadcrumb / Return */}
      <div className="flex items-center justify-between">
        <Link to="/applicant/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
          </Button>
        </Link>
        {appData?.applicationId && (
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            Application ID: {appData.applicationId}
          </span>
        )}
      </div>

      {/* Main Alert Card */}
      <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-8 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl shrink-0 border border-white/20">
              <AlertOctagon className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-red-800/60 border border-red-400/40 text-red-100 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                <XCircle className="w-3.5 h-3.5" /> Admission Criteria Not Met
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Not Eligible for Admission
              </h1>
              <p className="text-red-100 text-sm max-w-2xl leading-relaxed">
                We regret to inform you that your application does not meet the minimum Class 12th
                academic threshold required for admission to this program.
              </p>
            </div>
          </div>
        </div>

        {/* Reason Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Target Course Info */}
          {appData?.departmentName && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-iem-blue/10 flex items-center justify-center text-iem-blue shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Applied Program
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {appData.departmentName} {appData.degree ? `(${appData.degree})` : ''}
                  </p>
                </div>
              </div>
              <Badge variant="REJECTED" className="self-start sm:self-auto">
                Not Eligible
              </Badge>
            </div>
          )}

          {/* Detailed Criteria Breakdown */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Eligibility Evaluation Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Requirement Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 block font-medium">
                  Minimum Required (Class 12th)
                </span>
                <p className="text-2xl font-black text-slate-900 font-mono">60.00%</p>
                <span className="text-[11px] text-slate-500 block">
                  Mandatory Institute Cutoff
                </span>
              </div>

              {/* Recorded Score Box */}
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-1">
                <span className="text-xs text-red-700 block font-semibold">
                  Your Entered Class 12th Score
                </span>
                <p className="text-2xl font-black text-red-600 font-mono">
                  {!isNaN(recordedPercentage) ? `${recordedPercentage}%` : 'Below 60%'}
                </p>
                <span className="text-[11px] text-red-600 font-medium block">
                  {shortfall && shortfall > 0 ? `${shortfall}% below the cutoff` : 'Below requirement'}
                </span>
              </div>

              {/* Status Box */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-xs text-amber-800 block font-semibold">
                  Application Status
                </span>
                <p className="text-xl font-bold text-amber-700">Blocked / Ineligible</p>
                <span className="text-[11px] text-amber-700 block">
                  Cannot proceed to Documents Step
                </span>
              </div>
            </div>
          </div>

          {/* Reason Explanation Notice */}
          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Specific Reason for Rejection:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-6">
              As per the official Admission Policy and Regulatory Guidelines of Institute of
              Engineering &amp; Management (IEM), candidates must secure a minimum aggregate score of{' '}
              <strong className="text-red-700 font-semibold">60% or higher</strong> in Class 12th
              (Higher Secondary) examination to be eligible for document submission and merit
              evaluation. Because your recorded score is less than 60%, the system cannot proceed
              with this application.
            </p>
          </div>

          {/* If Mistake / Typo Alert */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-iem-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Did you make a typographical error?
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  If you entered an incorrect Class 12th percentage by mistake, you can return to
                  Academic Records to correct your score.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleEditMarks}
              className="shrink-0 font-bold shadow-sm"
            >
              <Edit3 className="w-4 h-4 mr-1.5" /> Correct Academic Marks
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link to="/applicant/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
              </Button>
            </Link>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link to="/admissions" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <FileText className="w-4 h-4 mr-1.5" /> View Admission Guidelines
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admissions Help & Support Desk Card */}
      <Card className="p-6 bg-slate-50 border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-iem-blue" />
          Admissions Helpdesk &amp; Special Counseling
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          If you have questions regarding other eligible diploma or certificate courses, or require
          guidance regarding entrance examination eligibility, please reach out to the Admissions
          Desk:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-2.5">
            <PhoneCall className="w-4 h-4 text-iem-blue shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 block">Helpline Numbers</span>
              <span className="text-slate-600 block mt-0.5">+91 33 2357 2059</span>
              <span className="text-slate-600 block">+91 33 2357 2995</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-iem-blue shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 block">Email Support</span>
              <span className="text-slate-600 block mt-0.5">admissions@iemcal.com</span>
              <span className="text-slate-600 block">helpline@iem.edu.in</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-iem-blue shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 block">Admissions Office</span>
              <span className="text-slate-600 block mt-0.5">Management House, D-1</span>
              <span className="text-slate-600 block">Sector-V, Salt Lake, Kolkata 700091</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotEligible;
