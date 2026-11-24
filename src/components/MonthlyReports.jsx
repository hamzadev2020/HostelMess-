import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Users, 
  UserCheck, 
  UserX, 
  Receipt, 
  Coins, 
  PieChart, 
  Building2,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Scale
} from 'lucide-react';
import { fetchMonthlyReport } from '../api';

export default function MonthlyReports({ settings, onViewMemberAccount }) {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const currency = settings?.currencySymbol || "Rs. ";

  const loadReport = async (month) => {
    try {
      setLoading(true);
      const res = await fetchMonthlyReport(month);
      if (res.success) {
        setReport(res.data);
      }
    } catch (err) {
      console.error("Failed to load monthly report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport(selectedMonth);
  }, [selectedMonth]);

  const handlePrint = () => {
    window.print();
  };

  const monthName = new Date(`${selectedMonth}-01`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Month Selector & Print Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Monthly Mess Financial Report
            </h2>
            <p className="text-xs text-slate-500">
              Complete statement of attendance, food expenses, and student refunds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Input */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold focus:outline-none cursor-pointer"
            />
          </div>

          {/* Print / Download Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Report</span>
          </button>
        </div>
      </div>

      {loading || !report ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Calculating monthly calculations...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 print-full-width">
          {/* Print Letterhead (visible primarily on print or top of report) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  OFFICIAL HOSTEL MESS STATEMENT
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-1">
                  {settings?.messName || 'Hostel Mess Management'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hostel Mess Financial Audit & Refund Ledger &bull; Month: <strong>{monthName}</strong>
                </p>
              </div>

              <div className="text-left md:text-right text-xs text-slate-600 space-y-0.5">
                <p><span className="text-slate-400">Owner:</span> <strong>{settings?.ownerName || 'Rajesh Sharma'}</strong></p>
                <p><span className="text-slate-400">Contact:</span> {settings?.contactPhone || '+91 98765 43210'}</p>
                <p><span className="text-slate-400">Generated:</span> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* 5 Big Highlight Metric Badges */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 pt-5">
              {/* Total Active Members */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  Active Members
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {report.totalActiveMembers}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Enrolled students
                </span>
              </div>

              {/* Total Present Days */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Total Present Days
                </span>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  {report.totalPresentDays}
                </div>
                <span className="text-[10px] text-emerald-600 mt-0.5 block">
                  Meals consumed
                </span>
              </div>

              {/* Total Absent Days */}
              <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
                  Total Absent Days
                </span>
                <div className="text-2xl font-black text-rose-700 mt-1">
                  {report.totalAbsentDays}
                </div>
                <span className="text-[10px] text-rose-600 mt-0.5 block">
                  Meals skipped
                </span>
              </div>

              {/* Total Food Expenses */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                  Total Food Expenses
                </span>
                <div className="text-2xl font-black text-amber-700 mt-1">
                  {currency}{report.totalFoodExpenses.toLocaleString()}
                </div>
                <span className="text-[10px] text-amber-600 mt-0.5 block">
                  Kitchen grocery bills
                </span>
              </div>

              {/* Total Refundable Amount */}
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 col-span-2 md:col-span-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">
                  Total Refund Amount
                </span>
                <div className="text-2xl font-black text-blue-700 mt-1">
                  {currency}{report.totalRefundAmount.toLocaleString()}
                </div>
                <span className="text-[10px] text-blue-600 mt-0.5 block">
                  Member-wise refund sum
                </span>
              </div>
            </div>
          </div>

          {/* Member-Wise Refund Details Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Member-wise Attendance & Refund Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  Individual calculations for each student based on actual attendance during {monthName}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Student Member</th>
                    <th className="px-4 py-3.5">Room</th>
                    <th className="px-4 py-3.5">Rate / Day</th>
                    <th className="px-4 py-3.5">Present Days</th>
                    <th className="px-4 py-3.5">Absent Days</th>
                    <th className="px-4 py-3.5 text-rose-700">Refund Amount</th>
                    <th className="px-4 py-3.5">Paid This Month</th>
                    <th className="px-5 py-3.5 text-right">Net Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.memberBreakdown.map((mb) => (
                    <tr key={mb.memberId} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name */}
                      <td className="px-5 py-3.5">
                        <span 
                          onClick={() => onViewMemberAccount && onViewMemberAccount(mb.memberId)}
                          className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                        >
                          {mb.name}
                        </span>
                      </td>

                      {/* Room */}
                      <td className="px-4 py-3.5 font-medium text-slate-700 text-xs">
                        Room {mb.roomNumber}
                      </td>

                      {/* Daily Rate */}
                      <td className="px-4 py-3.5 text-xs text-slate-600 font-semibold">
                        {currency}{mb.dailyRate}
                      </td>

                      {/* Present Days */}
                      <td className="px-4 py-3.5 text-xs font-semibold text-emerald-700">
                        {mb.presentDays} days
                      </td>

                      {/* Absent Days */}
                      <td className="px-4 py-3.5 text-xs font-semibold text-rose-700">
                        {mb.absentDays} days
                      </td>

                      {/* Refund Amount */}
                      <td className="px-4 py-3.5 font-bold text-rose-600 text-xs">
                        {currency}{mb.refundableAmount.toLocaleString()}
                      </td>

                      {/* Paid This Month */}
                      <td className="px-4 py-3.5 font-semibold text-slate-800 text-xs">
                        {currency}{mb.paidThisMonth.toLocaleString()}
                      </td>

                      {/* Net Balance */}
                      <td className="px-5 py-3.5 text-right font-black text-xs">
                        <span className={mb.finalBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          {mb.finalBalance >= 0 ? '+' : '-'}
                          {currency}{Math.abs(mb.finalBalance).toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {mb.finalBalance >= 0 ? 'Advance' : 'Due'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Table Footer Totals */}
                <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold text-xs text-slate-800">
                  <tr>
                    <td className="px-5 py-3.5">TOTALS ({report.memberBreakdown.length} Members)</td>
                    <td className="px-4 py-3.5">-</td>
                    <td className="px-4 py-3.5">-</td>
                    <td className="px-4 py-3.5 text-emerald-700">{report.totalPresentDays} days</td>
                    <td className="px-4 py-3.5 text-rose-700">{report.totalAbsentDays} days</td>
                    <td className="px-4 py-3.5 text-rose-700">{currency}{report.totalRefundAmount.toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      {currency}{report.memberBreakdown.reduce((sum, m) => sum + m.paidThisMonth, 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Monthly Expense Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="font-bold text-slate-800 text-base mb-1">
                Monthly Food Expense Breakdown
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Total expenditure distribution by category for {monthName}
              </p>

              <div className="space-y-3">
                {report.categoryList.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No expenses recorded for this month</p>
                ) : (
                  report.categoryList.map((item) => (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>{item.category}</span>
                        <span>{currency}{item.amount.toLocaleString()} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Financial Health Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-1">
                  Financial Balance Summary
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Net mess kitchen efficiency for {monthName}
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Total Billed Meals Revenue:</span>
                    <span className="font-bold text-slate-900">
                      {currency}{(report.totalPresentDays * (settings?.defaultDailyRate || 200)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Total Food Groceries & Kitchen Expenses:</span>
                    <span className="font-bold text-amber-700">
                      - {currency}{report.totalFoodExpenses.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Total Refund Claimed / Credited:</span>
                    <span className="font-bold text-rose-700">
                      - {currency}{report.totalRefundAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Kitchen Net Margin
                  </span>
                  <span className={`text-lg font-black ${
                    report.netMessProfitOrDeficit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {currency}{report.netMessProfitOrDeficit.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Calculated from Meal Revenue ({currency}200 &times; {report.totalPresentDays}) minus Total Food Purchases.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
