import React, { useState, useEffect } from 'react';
import { Building2, Edit2, Save, X, Plus } from 'lucide-react';
import adminService from '../../services/admin.service';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Edit Seat Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [totalSeats, setTotalSeats] = useState(60);
  const [occupiedSeats, setOccupiedSeats] = useState(0);
  const [saving, setSaving] = useState(false);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDepartments();
      setDepartments(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleOpenEdit = (dept) => {
    setSelectedDept(dept);
    setTotalSeats(dept.seatAllocation?.total_seats || 60);
    setOccupiedSeats(dept.seatAllocation?.occupied_seats || 0);
    setEditModalOpen(true);
  };

  const handleSaveSeats = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminService.updateSeats(selectedDept.id, totalSeats, occupiedSeats);
      setSuccessMsg(`Seats updated for ${selectedDept.name}.`);
      setEditModalOpen(false);
      await loadDepartments();
    } catch (err) {
      setError(err.message || 'Failed to update seats.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Loading departmental seat allocations..." className="py-24" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Departmental Seat Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure total admissions intake and monitor live seat occupancy balances
          </p>
        </div>
      </div>

      {error && <Alert type="danger" onClose={() => setError(null)}>{error}</Alert>}
      {successMsg && <Alert type="success" onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

      <Card className="bg-white border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Department & Degree</th>
                <th className="py-3 px-4 text-center">Total Seats</th>
                <th className="py-3 px-4 text-center">Occupied</th>
                <th className="py-3 px-4 text-center">Available</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{d.code}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{d.name}</span>
                    <span className="text-[11px] text-slate-500">{d.degree} • {d.duration_years} Years</span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    {d.seatAllocation?.total_seats || 0}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600">
                    {d.seatAllocation?.occupied_seats || 0}
                  </td>
                  <td className="py-3 px-4 text-center font-black text-iem-blue">
                    {d.seatAllocation?.available_seats || 0}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={d.seatAllocation?.status || 'AVAILABLE'}>
                      {(d.seatAllocation?.status || 'AVAILABLE').replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(d)}
                      className="font-semibold text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Seats
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Seat Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Adjust Seats: ${selectedDept?.code}`}
        subtitle={selectedDept?.name}
      >
        <form onSubmit={handleSaveSeats} className="space-y-4">
          <Input
            label="Total Seat Intake"
            type="number"
            min={occupiedSeats}
            required
            value={totalSeats}
            onChange={(e) => setTotalSeats(Math.max(0, parseInt(e.target.value, 10) || 0))}
          />

          <Input
            label="Occupied Seats"
            type="number"
            min={0}
            max={totalSeats}
            required
            value={occupiedSeats}
            onChange={(e) => setOccupiedSeats(Math.max(0, parseInt(e.target.value, 10) || 0))}
          />

          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
            Calculated Available Seats: <span className="font-bold text-iem-blue">{Math.max(0, totalSeats - occupiedSeats)}</span>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving} className="font-bold">
              Save Allocations
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;
