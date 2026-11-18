import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react';
import adminService from '../../services/admin.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

export const Applicants = () => {
  const [data, setData] = useState({ applicants: [], total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApplicants = async () => {
    setLoading(true);
    try {
      const res = await adminService.getApplicants({ search });
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load applicants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadApplicants();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Registered Candidates Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {data.total} candidates registered on the admissions portal
          </p>
        </div>
      </div>

      {error && <Alert type="danger">{error}</Alert>}

      <Card className="p-4 bg-white border-slate-200">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by candidate name, registered email, or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-iem-blue"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-iem-blue hover:bg-iem-blue-dark text-white rounded-lg text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>
      </Card>

      <Card className="bg-white border-slate-200 overflow-hidden">
        {loading ? (
          <Spinner size="lg" label="Loading candidate directory..." className="py-20" />
        ) : data.applicants.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No applicants found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4 text-center">Applications Created</th>
                  <th className="py-3 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.applicants.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {a.first_name} {a.last_name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{a.user?.email}</td>
                    <td className="py-3 px-4 text-slate-600">{a.phone}</td>
                    <td className="py-3 px-4 text-center font-bold text-iem-blue">
                      {a.applications?.length || 0}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Applicants;
