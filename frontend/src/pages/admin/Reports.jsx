import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Printer } from 'lucide-react';
import adminService from '../../services/admin.service';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

export const Reports = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await adminService.getReports();
        setReport(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to generate report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Spinner size="lg" label="Generating consolidated admissions report..." className="py-24" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Admissions Intake & Yield Analytics Report
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Department-wise conversion funnel, acceptance ratios, and seat fill rates
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handlePrint} className="font-bold">
          <Printer className="w-4 h-4 mr-1.5" /> Print / Export Report
        </Button>
      </div>

      {error && <Alert type="danger">{error}</Alert>}

      <Card className="bg-white border-slate-200 overflow-hidden p-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
          Departmental Admissions Ledger (2026-2027 Cycle)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Dept Code</th>
                <th className="py-3 px-3">Department Name</th>
                <th className="py-3 px-3 text-center">Total Seats</th>
                <th className="py-3 px-3 text-center">Total Apps</th>
                <th className="py-3 px-3 text-center">Accepted</th>
                <th className="py-3 px-3 text-center">Under Review</th>
                <th className="py-3 px-3 text-center">Rejected</th>
                <th className="py-3 px-3 text-center">Available</th>
                <th className="py-3 px-3 text-center">Fill Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report.map((item) => (
                <tr key={item.departmentCode} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.departmentCode}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{item.departmentName}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">{item.totalSeats}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900">{item.applications.total}</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-600">{item.applications.accepted}</td>
                  <td className="py-3 px-3 text-center font-semibold text-amber-600">{item.applications.underReview}</td>
                  <td className="py-3 px-3 text-center font-semibold text-rose-600">{item.applications.rejected}</td>
                  <td className="py-3 px-3 text-center font-bold text-iem-blue">{item.availableSeats}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {item.fillRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
