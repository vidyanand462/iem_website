import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Users,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import adminService from '../../services/admin.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

const STATUS_COLORS = {
  SUBMITTED: '#3B82F6',
  UNDER_REVIEW: '#F59E0B',
  ACCEPTED: '#10B981',
  REJECTED: '#EF4444',
  DRAFT: '#94A3B8',
};

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await adminService.getDashboard();
        setData(res.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch admin metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Spinner size="lg" label="Loading enterprise administration metrics..." className="py-24" />;
  }

  if (error) {
    return <Alert type="danger">{error}</Alert>;
  }

  const { overview, departmentStats, recentDecisions, recentApplications } = data;

  const pieData = [
    { name: 'Submitted', value: overview.submittedCount, color: STATUS_COLORS.SUBMITTED },
    { name: 'Under Review', value: overview.underReviewCount, color: STATUS_COLORS.UNDER_REVIEW },
    { name: 'Accepted', value: overview.acceptedCount, color: STATUS_COLORS.ACCEPTED },
    { name: 'Rejected', value: overview.rejectedCount, color: STATUS_COLORS.REJECTED },
    { name: 'Draft', value: overview.draftCount, color: STATUS_COLORS.DRAFT },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Admissions Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time candidate intake, departmental seat balances, and evaluation throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/applications">
            <Button variant="primary" size="sm" className="font-bold">
              <FileText className="w-4 h-4 mr-1.5" /> Manage Applications
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Applications */}
        <Card className="p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Applications
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-iem-blue flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{overview.totalApplications}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active admission cycle</span>
        </Card>

        {/* Card 2: Under Review */}
        <Card className="p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Under Review
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{overview.underReviewCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting evaluation committee</span>
        </Card>

        {/* Card 3: Accepted */}
        <Card className="p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Accepted
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{overview.acceptedCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Seats confirmed</span>
        </Card>

        {/* Card 4: Rejected */}
        <Card className="p-5 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Rejected
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{overview.rejectedCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Decided with official reason</span>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department-wise Applications Bar Chart */}
        <Card className="lg:col-span-8 p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Department-wise Applications & Available Seats
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time demand vs institutional capacity</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="code" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1F3F', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="totalSeats" fill="#94A3B8" name="Total Capacity" radius={[4, 4, 0, 0]} />
                <Bar dataKey="occupiedSeats" fill="#10B981" name="Occupied Seats" radius={[4, 4, 0, 0]} />
                <Bar dataKey="availableSeats" fill="#1F4E9C" name="Available Seats" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card className="lg:col-span-4 p-6 bg-white border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Status Distribution
            </h2>
            <p className="text-xs text-slate-400 mb-4">Current state breakdown</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1F3F', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Department Seat Inventory Table */}
      <Card className="p-6 bg-white border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-iem-blue" />
            Department Seat Balance Ledger
          </h2>
          <Link to="/admin/departments" className="text-xs font-bold text-iem-blue hover:underline">
            Manage Seats →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4 text-center">Total Intake</th>
                <th className="py-3 px-4 text-center">Occupied</th>
                <th className="py-3 px-4 text-center">Available</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentStats.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{dept.code}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{dept.name}</td>
                  <td className="py-3 px-4 text-center font-semibold">{dept.totalSeats}</td>
                  <td className="py-3 px-4 text-center font-semibold text-emerald-600">{dept.occupiedSeats}</td>
                  <td className="py-3 px-4 text-center font-bold text-iem-blue">{dept.availableSeats}</td>
                  <td className="py-3 px-4">
                    <Badge variant={dept.status}>{dept.status.replace('_', ' ')}</Badge>
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

export default Dashboard;
