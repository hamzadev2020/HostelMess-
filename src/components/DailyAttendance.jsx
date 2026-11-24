import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Users, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Save,
  Clock
} from 'lucide-react';
import { fetchAttendance, markAttendance, bulkMarkAttendance } from '../api';

export default function DailyAttendance({ onAttendanceChange, settings }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [batchSaving, setBatchSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const currency = settings?.currencySymbol || "Rs. ";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async (date) => {
    try {
      setLoading(true);
      const res = await fetchAttendance(date);
      if (res.success) {
        setRecords(res.data.records || []);
      }
    } catch (err) {
      console.error("Failed to load attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedDate);
  }, [selectedDate]);

  // Date navigation helpers
  const handleDateChange = (daysDelta) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + daysDelta);
    setSelectedDate(current.toISOString().slice(0, 10));
  };

  const handleSetToday = () => {
    setSelectedDate(new Date().toISOString().slice(0, 10));
  };

  // Mark single member status
  const handleMarkStatus = async (memberId, status) => {
    try {
      setSavingId(memberId);
      const res = await markAttendance(memberId, selectedDate, status);
      if (res.success) {
        // Update local state smoothly
        setRecords(prev => prev.map(r => {
          if (r.memberId === memberId) {
            return { ...r, status };
          }
          return r;
        }));
        showToast(res.message);
        if (onAttendanceChange) onAttendanceChange();
      }
    } catch (err) {
      alert("Error marking attendance: " + err.message);
    } finally {
      setSavingId(null);
    }
  };

  // Bulk action: Mark All Present or Mark All Absent
  const handleBulkAction = async (status) => {
    const activeList = records.filter(r => r.isMemberActive);
    if (activeList.length === 0) return;

    const actionText = status === 'present' ? 'PRESENT' : 'ABSENT';
    if (!window.confirm(`Mark all ${activeList.length} active members as ${actionText} for ${selectedDate}?`)) {
      return;
    }

    try {
      setBatchSaving(true);
      const bulkPayload = activeList.map(r => ({
        memberId: r.memberId,
        status: status
      }));

      const res = await bulkMarkAttendance(selectedDate, bulkPayload);
      if (res.success) {
        // Reload fresh data
        await loadData(selectedDate);
        showToast(`All active members marked as ${actionText} for ${selectedDate}`);
        if (onAttendanceChange) onAttendanceChange();
      }
    } catch (err) {
      alert("Bulk update failed: " + err.message);
    } finally {
      setBatchSaving(false);
    }
  };

  // Active records only for main calculation
  const activeRecords = records.filter(r => r.isMemberActive);
  const presentCount = activeRecords.filter(r => r.status === 'present').length;
  const absentCount = activeRecords.filter(r => r.status === 'absent').length;
  const unmarkedCount = activeRecords.filter(r => r.status === 'unmarked').length;

  // Real-time daily refund calculation
  const totalDailyRefund = activeRecords
    .filter(r => r.status === 'absent')
    .reduce((sum, r) => sum + (Number(r.dailyRate) || 200), 0);

  const isToday = selectedDate === new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Date Header & Quick Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => handleDateChange(-1)}
              title="Previous Day"
              className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-bold text-sm text-slate-800 px-2 focus:outline-none cursor-pointer"
            />
            <button
              onClick={() => handleDateChange(1)}
              title="Next Day"
              className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={handleSetToday}
              className="px-3 py-2 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors cursor-pointer"
            >
              Jump to Today
            </button>
          )}
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleBulkAction('present')}
            disabled={batchSaving || activeRecords.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={() => handleBulkAction('absent')}
            disabled={batchSaving || activeRecords.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            <span>Mark All Absent</span>
          </button>
        </div>
      </div>

      {/* Real-time Summary Cards for Selected Date */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Present */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 leading-none">
              {presentCount}
            </div>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              Present Today
            </span>
          </div>
        </div>

        {/* Absent */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <X className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-rose-600 leading-none">
              {absentCount}
            </div>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              Absent Today
            </span>
          </div>
        </div>

        {/* Unmarked */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600 leading-none">
              {unmarkedCount}
            </div>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              Pending / Unmarked
            </span>
          </div>
        </div>

        {/* Daily Refund Calculated */}
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-blue-700 leading-none">
              {currency}{totalDailyRefund.toLocaleString()}
            </div>
            <span className="text-xs text-blue-900 font-medium mt-0.5 block">
              Today's Absent Refund
            </span>
          </div>
        </div>
      </div>

      {/* Attendance Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Attendance Roster for {selectedDate}
            </h3>
            <p className="text-xs text-slate-500">
              Select Present or Absent for each student. Entries save automatically and dynamically update member refund balances.
            </p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Updating...</span>
            </div>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {records.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-slate-600">No members registered yet</p>
              <p className="text-xs text-slate-400 mt-1">Add members from Member Management to start marking attendance.</p>
            </div>
          ) : (
            records.map((member) => {
              const isPresent = member.status === 'present';
              const isAbsent = member.status === 'absent';
              const isUnmarked = !member.status || member.status === 'unmarked';
              const isSavingThis = savingId === member.memberId;

              return (
                <div 
                  key={member.memberId}
                  className={`p-4 md:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors ${
                    !member.isMemberActive ? 'opacity-50 bg-slate-50/50' : ''
                  }`}
                >
                  {/* Student Info */}
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-xs ${
                      isPresent ? 'bg-emerald-100 text-emerald-800' :
                      isAbsent ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {member.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          Room {member.roomNumber}
                        </span>
                        {!member.isMemberActive && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-600">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>Daily Rate: {currency}{member.dailyRate}</span>
                        {isAbsent && (
                          <span className="text-rose-600 font-bold">
                            &bull; +{currency}{member.dailyRate} credited to refund
                          </span>
                        )}
                        {isPresent && (
                          <span className="text-emerald-600 font-medium">
                            &bull; Meal consumed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Present / Absent Toggle Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Present Button */}
                    <button
                      onClick={() => handleMarkStatus(member.memberId, 'present')}
                      disabled={isSavingThis || !member.isMemberActive}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isPresent
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600 ring-offset-1'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Present</span>
                    </button>

                    {/* Absent Button */}
                    <button
                      onClick={() => handleMarkStatus(member.memberId, 'absent')}
                      disabled={isSavingThis || !member.isMemberActive}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isAbsent
                          ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600 ring-offset-1'
                          : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>Absent</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
