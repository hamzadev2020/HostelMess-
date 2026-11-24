import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Receipt, 
  TrendingUp, 
  Coins, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function Dashboard({ 
  stats, 
  loading, 
  onNavigate, 
  settings 
}) {
  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading dashboard overview...</p>
        </div>
      </div>
    );
  }

  const currency = settings?.currencySymbol || "Rs. ";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/20 mb-3">
              <Calendar className="w-3.5 h-3.5" />
              Daily Operational Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {settings?.messName || "Greenwood Hostel Mess"}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Track daily meals, monitor member attendance, calculate automated daily absent refunds, and view live kitchen expenditures.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Mark Today's Attendance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Primary Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* 1. Total Members */}
        <div 
          onClick={() => onNavigate('members')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Members
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.totalMembers}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-600 font-semibold">{stats.activeMembers} Active</span> members enrolled
            </p>
          </div>
        </div>

        {/* 2. Today's Present Members */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Today's Present
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-emerald-600 tracking-tight">
              {stats.todayPresent}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Meals served today &bull; Charged to student accounts
            </p>
          </div>
        </div>

        {/* 3. Today's Absent Members */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Today's Absent
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-rose-600 tracking-tight">
              {stats.todayAbsent}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              + {currency}{stats.todayRefundAmount?.toLocaleString()} refunded today
            </p>
          </div>
        </div>

        {/* 4. Today's Total Expenses */}
        <div 
          onClick={() => onNavigate('expenses')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Today's Expenses
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {currency}{stats.todayExpenses?.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Purchases recorded for today's mess groceries
            </p>
          </div>
        </div>

        {/* 5. Monthly Total Expenses */}
        <div 
          onClick={() => onNavigate('expenses')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Monthly Total Expenses
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {currency}{stats.monthlyTotalExpenses?.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              All grocery & mess kitchen expenses this month
            </p>
          </div>
        </div>

        {/* 6. Total Refund Amount */}
        <div 
          onClick={() => onNavigate('reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Refund Amount
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-blue-700 tracking-tight">
              {currency}{stats.totalRefundAmount?.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Auto-calculated for {stats.monthlySummary?.totalAbsentDays || 0} absent member days
            </p>
          </div>
        </div>

      </div>

      {/* Monthly Mess Summary Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Monthly Mess Operational Summary
            </h3>
            <p className="text-xs text-slate-500">
              Overview for current billing cycle ({stats.month})
            </p>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Monthly Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Total Meals Served</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {stats.monthlySummary?.totalPresentDays || 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Present days recorded</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Total Meals Saved</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {stats.monthlySummary?.totalAbsentDays || 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Absent days refunded</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Attendance Rate</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {stats.monthlySummary?.attendanceRate || 0}%
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Overall mess participation</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>Standard Daily Rate</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {currency}{settings?.defaultDailyRate || 200}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Per student / day base</p>
          </div>
        </div>

        {/* Business Logic Explanation Alert Box */}
        <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-200/60 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            i
          </div>
          <div className="text-xs text-blue-900 leading-relaxed">
            <span className="font-semibold text-blue-950">Automated Daily Refund Calculation Rule:</span> Every active member has a daily mess charge (default {currency}200). When marked <strong className="text-emerald-700">Present</strong>, that day's meal is billed. When marked <strong className="text-rose-700">Absent</strong>, {currency}200 is automatically credited to that member's refundable balance.
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => onNavigate('members')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Add New Member</h4>
            <p className="text-xs text-slate-500 mt-0.5">Register a student to the mess</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('expenses')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Add Daily Expense</h4>
            <p className="text-xs text-slate-500 mt-0.5">Record vegetable, milk or grocery purchase</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Print Monthly Statement</h4>
            <p className="text-xs text-slate-500 mt-0.5">Export full member-wise refund sheet</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
