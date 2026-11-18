import React, { useState, useEffect } from 'react';
import { CalendarClock, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import adminService from '../../services/admin.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

export const Deadlines = () => {
  const [deadline, setDeadline] = useState(null);
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('OPEN');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const loadDeadline = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDeadline();
      if (res.data) {
        setDeadline(res.data);
        setAcademicYear(res.data.academic_year);
        setStartDate(res.data.start_date ? res.data.start_date.split('T')[0] : '');
        setEndDate(res.data.end_date ? res.data.end_date.split('T')[0] : '');
        setStatus(res.data.status);
        setNotice(res.data.announcement_notice || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load deadline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeadline();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminService.updateDeadline({
        academic_year: academicYear,
        start_date: startDate,
        end_date: endDate,
        status,
        announcement_notice: notice,
      });
      setSuccessMsg('Admission cycle deadline updated successfully.');
      await loadDeadline();
    } catch (err) {
      setError(err.message || 'Failed to update deadline.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Loading admission deadlines..." className="py-24" />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Application Deadline & Admission Windows
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Enforce server-side cutoff dates and application status windows
        </p>
      </div>

      {error && <Alert type="danger" onClose={() => setError(null)}>{error}</Alert>}
      {successMsg && <Alert type="success" onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

      <Card className="p-6 sm:p-8 bg-white border-slate-200">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Academic Admission Cycle"
              required
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />

            <Select
              label="Application Window Status"
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'OPEN', label: 'OPEN (Accepting Submissions)' },
                { value: 'CLOSING_SOON', label: 'CLOSING SOON (Warning Banner)' },
                { value: 'CLOSED', label: 'CLOSED (Submissions Blocked)' },
                { value: 'UPCOMING', label: 'UPCOMING' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Portal Start Date"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              label="Application Deadline (Cutoff)"
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Public Announcement Banner Notice
            </label>
            <textarea
              rows={3}
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
              placeholder="e.g. Admissions for AY 2026-2027 are currently open across all engineering departments."
              className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-iem-blue"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" isLoading={saving} className="font-bold">
              <Save className="w-4 h-4 mr-1.5" /> Save Window Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Deadlines;
