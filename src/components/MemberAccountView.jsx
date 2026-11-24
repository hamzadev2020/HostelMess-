import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  DoorClosed, 
  Phone, 
  Calendar, 
  Coins, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Printer, 
  Receipt, 
  FileText, 
  X,
  Clock,
  Trash2
} from 'lucide-react';
import { fetchMemberDetails, fetchMembers, createPayment, deletePayment } from '../api';

export default function MemberAccountView({ 
  memberId, 
  onBack, 
  onSelectMember, 
  settings 
}) {
  const [member, setMember] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMethod: 'UPI',
    notes: 'Mess fee'
  });

  const currency = settings?.currencySymbol || "Rs. ";

  const loadData = async (id) => {
    try {
      setLoading(true);
      const [memberRes, allMembersRes] = await Promise.all([
        fetchMemberDetails(id),
        fetchMembers()
      ]);

      if (memberRes.success) {
        setMember(memberRes.data);
      }
      if (allMembersRes.success) {
        setAllMembers(allMembersRes.data);
      }
    } catch (err) {
      console.error("Error loading member account:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memberId) {
      loadData(memberId);
    }
  }, [memberId]);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    try {
      setPaymentSubmitting(true);
      await createPayment({
        memberId: member.id,
        amount: Number(paymentForm.amount),
        paymentDate: paymentForm.paymentDate,
        paymentMethod: paymentForm.paymentMethod,
        notes: paymentForm.notes
      });
      setIsPaymentModalOpen(false);
      setPaymentForm({
        amount: '',
        paymentDate: new Date().toISOString().slice(0, 10),
        paymentMethod: 'UPI',
        notes: 'Mess fee'
      });
      loadData(member.id);
    } catch (err) {
      alert("Error recording payment: " + err.message);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleDeletePayment = async (payId) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      try {
        await deletePayment(payId);
        loadData(member.id);
      } catch (err) {
        alert("Error deleting payment: " + err.message);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading member financial account...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <p className="text-slate-600 font-semibold">Member record not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Members
        </button>
      </div>
    );
  }

  const attendanceHistory = member.attendanceHistory || [];
  const paymentHistory = member.paymentHistory || [];

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to Members List"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Individual Account Statement
            </h2>
            <p className="text-xs text-slate-500">
              Financial and attendance ledger for {member.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Member Switcher Dropdown */}
          <select
            value={member.id}
            onChange={(e) => onSelectMember(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
          >
            {allMembers.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} (Room {m.roomNumber})
              </option>
            ))}
          </select>

          {/* Record Payment Button */}
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>

          {/* Print Statement Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer border border-slate-200"
          >
            <Printer className="w-4 h-4" />
            <span>Print Bill</span>
          </button>
        </div>
      </div>

      {/* Member Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs print-full-width">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {member.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  member.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {member.status === 'active' ? 'Active Student' : 'Inactive'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <DoorClosed className="w-3.5 h-3.5 text-slate-400" />
                  Room: {member.roomNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {member.phone || 'No phone'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Enrolled: {member.joiningDate || '-'}
                </span>
                {member.notes && (
                  <span className="text-blue-600 font-medium">
                    &bull; Note: {member.notes}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Daily Mess Charge
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {currency}{member.dailyMessCharges || 200}<span className="text-xs text-slate-500 font-normal"> / day</span>
            </div>
          </div>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 pt-6">
          {/* Days Present */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
              Days Present
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              {member.totalDaysPresent} <span className="text-xs font-normal">days</span>
            </div>
            <span className="text-[11px] text-emerald-600 mt-0.5 block">
              Billed: {currency}{(member.totalUsedCharges || 0).toLocaleString()}
            </span>
          </div>

          {/* Days Absent */}
          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
              Days Absent
            </span>
            <div className="text-2xl font-extrabold text-rose-700 mt-1">
              {member.totalDaysAbsent} <span className="text-xs font-normal">days</span>
            </div>
            <span className="text-[11px] text-rose-600 mt-0.5 block">
              Meals not eaten
            </span>
          </div>

          {/* Total Refundable Amount */}
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">
              Refundable Amount
            </span>
            <div className="text-2xl font-black text-blue-700 mt-1">
              {currency}{(member.totalRefundableAmount || 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-blue-600 mt-0.5 block">
              {member.totalDaysAbsent} &times; {currency}{member.dailyMessCharges}
            </span>
          </div>

          {/* Total Amount Paid */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
              Total Amount Paid
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {currency}{(member.totalAmountPaid || 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {paymentHistory.length} payments logged
            </span>
          </div>

          {/* Final Net Balance */}
          <div className={`p-4 rounded-xl border col-span-2 md:col-span-1 ${
            member.finalBalance >= 0 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider block">
              Account Status
            </span>
            <div className={`text-2xl font-black mt-1 ${
              member.finalBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}>
              {currency}{Math.abs(member.finalBalance || 0).toLocaleString()}
            </div>
            <span className="text-[11px] font-semibold mt-0.5 block">
              {member.finalBalance >= 0 ? 'Advance Credit Balance' : 'Outstanding Dues'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Columns: Payment History and Attendance History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance Log History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print-full-width">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Date-wise Attendance & Refund Log
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total {attendanceHistory.length} Days
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {attendanceHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No attendance records for this student yet.
              </div>
            ) : (
              attendanceHistory.map((att) => (
                <div 
                  key={att.id}
                  className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      att.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {att.status === 'present' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        {att.date}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {att.status === 'present' ? 'Present (Meal Eaten)' : 'Absent (Meal Skipped)'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {att.status === 'absent' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        +{currency}{member.dailyMessCharges} Refund
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Billed {currency}{member.dailyMessCharges}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print-full-width">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Payment Receipts & Fees Received
              </h3>
            </div>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer no-print"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Fee</span>
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {paymentHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No payment transactions recorded yet.
              </div>
            ) : (
              paymentHistory.map((p) => (
                <div 
                  key={p.id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {p.receiptNo || 'Receipt'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {p.paymentMethod || 'Cash'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Date: {p.paymentDate} {p.notes ? `\u2022 ${p.notes}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-emerald-600">
                      +{currency}{Number(p.amount).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeletePayment(p.id)}
                      title="Delete payment entry"
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md no-print cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                Record Payment for {member.name}
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Payment Amount <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 6000"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentForm.paymentDate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Payment Notes / Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly Advance, Nov Mess Fee"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                >
                  {paymentSubmitting ? 'Saving...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
