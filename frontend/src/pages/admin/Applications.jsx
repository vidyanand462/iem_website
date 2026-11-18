import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  Building2,
} from 'lucide-react';
import adminService from '../../services/admin.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

export const Applications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ applications: [], total: 0, totalPages: 1 });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [deptFilter, setDeptFilter] = useState(searchParams.get('department_id') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const loadApplications = async () => {
    setLoading(true);
    try {
      const [res, deptsRes] = await Promise.all([
        adminService.getApplications({
          search: searchTerm,
          status: statusFilter,
          department_id: deptFilter,
          page,
          limit: 10,
        }),
        adminService.getDepartments(),
      ]);
      setData(res.data);
      setDepartments(deptsRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter, deptFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadApplications();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Application Submissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {data.total} applications registered across all branches
          </p>
        </div>
      </div>

      {error && <Alert type="danger">{error}</Alert>}

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border-slate-200">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, candidate name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-iem-blue"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-iem-blue"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="FLAGGED">Flagged for Correction</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-iem-blue"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <Button type="submit" variant="primary" size="md" className="w-full text-xs font-bold">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Applications Table */}
      <Card className="bg-white border-slate-200 overflow-hidden">
        {loading ? (
          <Spinner size="lg" label="Filtering applications..." className="py-20" />
        ) : data.applications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No applications match the specified criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">App ID</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Academic %</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.applications.map((app) => {
                  const candidateName = app.personalInfo
                    ? `${app.personalInfo.first_name} ${app.personalInfo.last_name}`
                    : `${app.applicant?.first_name || ''} ${app.applicant?.last_name || ''}`.trim() || 'Incomplete Profile';

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {app.application_id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{candidateName}</div>
                        <div className="text-[11px] text-slate-400">{app.contactInfo?.email || 'No email'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{app.department?.code}</span>
                        <span className="text-[11px] text-slate-400 block">{app.department?.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        {app.academicInfo?.twelfth_percentage ? (
                          <span className="font-medium text-slate-700">
                            12th: {app.academicInfo.twelfth_percentage}%
                          </span>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                        {app.academicInfo?.entrance_rank && (
                          <span className="text-[10px] text-iem-blue block font-mono">
                            Rank: {app.academicInfo.entrance_rank}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={app.status}>{app.status.replace('_', ' ')}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {app.submitted_at
                          ? new Date(app.submitted_at).toLocaleDateString()
                          : 'Not submitted'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link to={`/admin/applications/${app.id}/review`}>
                          <Button variant="outline" size="sm" className="font-semibold text-xs">
                            <Eye className="w-3.5 h-3.5 mr-1" /> Review
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {data.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {data.page} of {data.totalPages} ({data.total} total items)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Applications;
