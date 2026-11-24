import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Phone, 
  DoorClosed, 
  Calendar, 
  Coins, 
  X,
  Filter,
  Check
} from 'lucide-react';
import { createMember, updateMember, deleteMember } from '../api';

export default function MemberManagement({ 
  members, 
  loading, 
  onRefresh, 
  onViewAccount, 
  settings 
}) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    roomNumber: '',
    dailyRate: settings?.defaultDailyRate || 200,
    joiningDate: new Date().toISOString().slice(0, 10),
    status: 'active',
    notes: ''
  });

  const currency = settings?.currencySymbol || "Rs. ";

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      phone: '',
      roomNumber: '',
      dailyRate: settings?.defaultDailyRate || 200,
      joiningDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      phone: member.phone || '',
      roomNumber: member.roomNumber || '',
      dailyRate: member.dailyRate || 200,
      joiningDate: member.joiningDate || new Date().toISOString().slice(0, 10),
      status: member.status || 'active',
      notes: member.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.roomNumber.trim()) {
      alert("Please provide member name and room number.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingMember) {
        await updateMember(editingMember.id, formData);
      } else {
        await createMember(formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      alert("Error saving member: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete member "${name}"? This will remove all their records.`)) {
      try {
        setDeletingId(id);
        await deleteMember(id);
        onRefresh();
      } catch (err) {
        alert("Error deleting member: " + err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleToggleStatus = async (member) => {
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    try {
      await updateMember(member.id, { ...member, status: newStatus });
      onRefresh();
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  // Filter members
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search);
    
    const matchesStatus = 
      filterStatus === 'all' || m.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Hostel Mess Members</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student registrations, daily mess fees, and individual account profiles
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, room or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({members.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                filterStatus === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({members.filter(m => m.status === 'active').length})
            </button>
            <button
              onClick={() => setFilterStatus('inactive')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                filterStatus === 'inactive' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inactive ({members.filter(m => m.status === 'inactive').length})
            </button>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Student Member</th>
                <th className="px-4 py-3.5">Room</th>
                <th className="px-4 py-3.5">Phone Number</th>
                <th className="px-4 py-3.5">Daily Charge</th>
                <th className="px-4 py-3.5">Joining Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Refund Balance</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No members found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search or add a new member</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div 
                            onClick={() => onViewAccount(member.id)}
                            className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer"
                          >
                            {member.name}
                          </div>
                          {member.notes && (
                            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {member.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Room */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                        <DoorClosed className="w-3.5 h-3.5 text-slate-500" />
                        Room {member.roomNumber}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-4 text-xs font-medium text-slate-600">
                      {member.phone ? (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{member.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not set</span>
                      )}
                    </td>

                    {/* Daily Charge */}
                    <td className="px-4 py-4 font-semibold text-slate-900 text-xs">
                      {currency}{member.dailyRate || 200}/day
                    </td>

                    {/* Joining Date */}
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {member.joiningDate || '-'}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(member)}
                        title="Click to toggle Active/Inactive"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          member.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Refund Balance */}
                    <td className="px-4 py-4 text-xs font-bold text-blue-700">
                      {currency}{(member.totalRefundable || 0).toLocaleString()}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        ({member.absentDays || 0} absent days)
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Individual Account */}
                        <button
                          onClick={() => onViewAccount(member.id)}
                          title="View Member Account & History"
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEditModal(member)}
                          title="Edit Member Details"
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          disabled={deletingId === member.id}
                          title="Delete Member"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingMember ? 'Edit Member Details' : 'Add New Hostel Member'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aman Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Room Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Daily Mess Charge <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                      {currency}
                    </span>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="200"
                      value={formData.dailyRate}
                      onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Notes / Dietary Preference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pure Veg, Jain, No Onion"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
