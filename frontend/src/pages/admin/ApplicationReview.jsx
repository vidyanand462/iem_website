import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  User,
  GraduationCap,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Building2,
  FileCheck,
  Eye,
  AlertTriangle,
  Send,
  Flag,
} from 'lucide-react';
import adminService from '../../services/admin.service';
import documentService from '../../services/document.service';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';

export const ApplicationReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Accept Modal State
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Flag Modal State
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagNotes, setFlagNotes] = useState('');

  const loadApplication = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getApplicationById(id);
      setApplication(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load application details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
  }, [id]);

  // Action: Mark Under Review
  const handleMarkUnderReview = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await adminService.markUnderReview(id);
      setSuccessMsg('Application status updated to UNDER REVIEW.');
      await loadApplication();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Accept Application
  const handleAccept = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await adminService.acceptApplication(id, adminNotes);
      setAcceptModalOpen(false);
      setSuccessMsg('Application successfully ACCEPTED and 1 seat decremented.');
      await loadApplication();
    } catch (err) {
      setError(err.message || 'Acceptance failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Reject Application
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('A valid rejection reason is required.');
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      await adminService.rejectApplication(id, rejectReason.trim(), adminNotes);
      setRejectModalOpen(false);
      setSuccessMsg('Application marked as REJECTED with recorded reason.');
      await loadApplication();
    } catch (err) {
      setError(err.message || 'Rejection failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Flag Application for Candidate Correction
  const handleFlag = async () => {
    if (!flagReason.trim()) {
      setError('A valid correction remark/reason is required to flag an application.');
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      await adminService.flagApplication(id, flagReason.trim(), flagNotes);
      setFlagModalOpen(false);
      setFlagReason('');
      setFlagNotes('');
      setSuccessMsg('Application successfully flagged for correction and unlocked for the candidate.');
      await loadApplication();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Flagging failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Loading application evaluation record..." className="py-24" />;
  }

  if (error && !application) {
    return (
      <div className="space-y-4">
        <Alert type="danger">{error}</Alert>
        <Link to="/admin/applications">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Applications</Button>
        </Link>
      </div>
    );
  }

  const {
    application_id,
    status,
    submitted_at,
    department,
    personalInfo,
    contactInfo,
    guardianInfo,
    academicInfo,
    documents = [],
    decision,
  } = application;

  const candidateName = personalInfo
    ? `${personalInfo.first_name} ${personalInfo.middle_name || ''} ${personalInfo.last_name}`
    : 'Candidate Profile';

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/admin/applications" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-iem-blue">
          <ArrowLeft className="w-4 h-4" /> Back to Applications List
        </Link>
      </div>

      {error && <Alert type="danger" onClose={() => setError(null)}>{error}</Alert>}
      {successMsg && <Alert type="success" onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

      {/* Header Banner & Decision Actions */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
              {application_id}
            </span>
            <Badge variant={status}>{status.replace('_', ' ')}</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{candidateName}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Applying for: <span className="font-bold text-slate-800">{department?.name} ({department?.code})</span>
            {submitted_at && ` • Submitted: ${new Date(submitted_at).toLocaleString()}`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {status === 'SUBMITTED' && (
            <Button
              variant="outline"
              size="md"
              isLoading={actionLoading}
              onClick={handleMarkUnderReview}
              className="font-bold text-xs"
            >
              <Clock className="w-4 h-4 mr-1.5 text-amber-600" /> Move to Under Review
            </Button>
          )}

          {['SUBMITTED', 'UNDER_REVIEW', 'FLAGGED'].includes(status) && (
            <>
              {/* Flag / Request Correction Option */}
              <Button
                variant="outline"
                size="md"
                onClick={() => setFlagModalOpen(true)}
                className="font-bold text-xs border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 shadow-2xs"
                title="Flag application to unlock form for student corrections or document re-uploads"
              >
                <Flag className="w-4 h-4 mr-1.5 text-amber-600" /> Flag for Correction
              </Button>

              <Button
                variant="danger"
                size="md"
                onClick={() => setRejectModalOpen(true)}
                className="font-bold text-xs shadow-sm"
              >
                <XCircle className="w-4 h-4 mr-1.5" /> Reject Application
              </Button>

              <Button
                variant="success"
                size="md"
                onClick={() => setAcceptModalOpen(true)}
                className="font-bold text-xs shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Accept & Allocate Seat
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Flagged Status Banner */}
      {status === 'FLAGGED' && (
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-2xs">
          <Flag className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-950">Application Currently Flagged for Candidate Correction</h3>
            <p className="text-xs text-amber-900 leading-relaxed">
              The application form and document slots have been unlocked for the candidate. Once the student submits the corrected details or re-uploaded documents, the status will automatically update for your final review.
            </p>
            {decision?.rejection_reason && (
              <div className="mt-2 p-2.5 bg-white/90 rounded-lg border border-amber-200 text-xs">
                <span className="font-bold text-slate-900 block mb-0.5">Recorded Reviewer Correction Request:</span>
                <span className="text-slate-800 italic">"{decision.rejection_reason}"</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decision Status Banner if already decided */}
      {status === 'ACCEPTED' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold">Provisional Admission Accepted</h3>
            <p className="text-xs mt-0.5">
              Seat successfully decremented from {department?.name}. Decision recorded by admissions officer on {new Date(decision?.decided_at).toLocaleString()}.
            </p>
          </div>
        </div>
      )}

      {status === 'REJECTED' && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold">Application Formally Rejected</h3>
            <p className="text-xs mt-0.5">
              <span className="font-bold">Recorded Rejection Reason:</span> {decision?.rejection_reason}
            </p>
          </div>
        </div>
      )}

      {/* Grid: Candidate Particulars & Academic Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personal, Contact & Guardian */}
        <div className="lg:col-span-6 space-y-6">
          {/* Personal Info */}
          <Card className="p-6 bg-white border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-iem-blue" /> Personal Particulars
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Date of Birth:</span>
                <span className="font-bold text-slate-800">{personalInfo?.date_of_birth || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Gender:</span>
                <span className="font-bold text-slate-800">{personalInfo?.gender || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Category:</span>
                <span className="font-bold text-slate-800">{personalInfo?.category || 'GENERAL'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Nationality:</span>
                <span className="font-bold text-slate-800">{personalInfo?.nationality || 'Indian'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Blood Group (Rh):</span>
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                  {personalInfo?.blood_group || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Aadhaar Card:</span>
                <span className="font-bold text-slate-800">{personalInfo?.aadhar_number || 'N/A'}</span>
              </div>
            </div>
          </Card>

          {/* Contact Info */}
          <Card className="p-6 bg-white border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-iem-blue" /> Contact & Permanent Address
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Email:</span>
                <span className="font-semibold text-slate-800">{contactInfo?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone:</span>
                <span className="font-semibold text-slate-800">{contactInfo?.phone || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Address:</span>
                <span className="font-medium text-slate-800">
                  {contactInfo?.address_line1}, {contactInfo?.city}, {contactInfo?.state} - {contactInfo?.pincode}
                </span>
              </div>
            </div>
          </Card>

          {/* Guardian Info */}
          <Card className="p-6 bg-white border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-iem-blue" /> Guardian Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Father's Name:</span>
                <span className="font-bold text-slate-800">{guardianInfo?.father_name || 'N/A'}</span>
                <span className="text-[11px] text-slate-500 block">{guardianInfo?.father_occupation}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Mother's Name:</span>
                <span className="font-bold text-slate-800">{guardianInfo?.mother_name || 'N/A'}</span>
                <span className="text-[11px] text-slate-500 block">{guardianInfo?.mother_occupation}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Family Income:</span>
                <span className="font-semibold text-slate-800">{guardianInfo?.annual_income || 'N/A'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Academic & Document Viewer */}
        <div className="lg:col-span-6 space-y-6">
          {/* Academic Info */}
          <Card className="p-6 bg-white border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-iem-blue" /> Academic Scores & Entrance Rank
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Class 10th (Secondary):</span>
                <span className="font-bold text-slate-900 block text-sm">
                  {academicInfo?.tenth_percentage || '0'}%
                </span>
                <span className="text-[11px] text-slate-500">{academicInfo?.tenth_board} ({academicInfo?.tenth_year})</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Class 12th (Higher Secondary):</span>
                <span className="font-bold text-slate-900 block text-sm">
                  {academicInfo?.twelfth_percentage || '0'}%
                </span>
                <span className="text-[11px] text-slate-500">{academicInfo?.twelfth_board} ({academicInfo?.twelfth_year})</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Entrance Examination:</span>
                <span className="font-bold text-slate-900 block">{academicInfo?.entrance_exam_name || 'N/A'}</span>
                <span className="text-[11px] text-slate-500">Roll: {academicInfo?.entrance_roll_number || 'N/A'}</span>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                <span className="text-iem-blue font-bold block">Merit Rank (GMR):</span>
                <span className="font-extrabold text-iem-navy block text-lg font-mono">
                  {academicInfo?.entrance_rank || 'N/A'}
                </span>
              </div>
            </div>
          </Card>

          {/* Uploaded Documents Viewer */}
          <Card className="p-6 bg-white border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-iem-blue" /> Uploaded Document Verification ({documents.length})
            </h3>

            {documents.length === 0 ? (
              <p className="text-xs text-slate-400">No documents uploaded for this application.</p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        {doc.document_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-500">{doc.original_name}</span>
                    </div>

                    <a
                      href={documentService.getDocumentUrl(doc.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-iem-blue hover:bg-slate-50 inline-flex items-center gap-1 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect File
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Reject Modal Dialog (Reason Mandatory) */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Application & Record Reason"
        subtitle="A valid rejection reason is mandatory and will be visible to the candidate."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Academic scores in Class 12 PCM below department cutoff threshold."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={!rejectReason.trim()}
              isLoading={actionLoading}
              onClick={handleReject}
              className="font-bold"
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Accept Modal Dialog (Seat Verification & Decrement) */}
      <Modal
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
        title="Confirm Provisional Admission Offer"
        subtitle={`This will decrement 1 available seat from ${department?.name}`}
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <span className="font-bold block mb-1">Transactional Seat Allocation:</span>
            Submitting acceptance executes an ACID database transaction row-locking the seat allocation table.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Administrative Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Merit rank verified against official WBJEE 2026 portal."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-iem-blue"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setAcceptModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              isLoading={actionLoading}
              onClick={handleAccept}
              className="font-bold"
            >
              Confirm Admission Offer
            </Button>
          </div>
        </div>
      </Modal>
      {/* Flag / Request Correction Modal Dialog */}
      <Modal
        isOpen={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
        title="Flag Application for Candidate Revision"
        subtitle="This will unlock the candidate's form to correct fields or re-upload documents"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <Flag className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Candidate Correction Mode:</span>
              Flagging this application unlocks the applicant portal so the student can update their personal, contact, academic details, or re-upload rejected document scans.
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Correction Reason / Action Required by Student *
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Class 12 marksheet image is blurry. Please re-upload a clear colored scan of the original marksheet."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            {/* Quick Presets */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-400 font-semibold self-center mr-1">Quick Select:</span>
              {[
                'Please re-upload a clear colored Passport Photograph.',
                '12th Marksheet is unreadable. Please re-upload original scan.',
                '10th Certificate missing. Please upload valid certificate.',
                'Please correct academic percentages to match marksheet.',
                'Address details incomplete. Please provide full address.',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFlagReason(preset)}
                  className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 rounded transition-colors"
                >
                  {preset.split('.')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Internal Reviewer Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Contacted applicant via email on 18 Nov."
              value={flagNotes}
              onChange={(e) => setFlagNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setFlagModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="warning"
              disabled={!flagReason.trim()}
              isLoading={actionLoading}
              onClick={handleFlag}
              className="font-bold bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Flag className="w-3.5 h-3.5 mr-1" /> Confirm & Unlock for Student
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApplicationReview;
