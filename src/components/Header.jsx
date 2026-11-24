import React from 'react';
import { Menu, Calendar, RotateCcw, Building2, User } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setMobileOpen, 
  settings, 
  onResetDemo, 
  isResetting 
}) {
  const getTabTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'members': return 'Hostel Member Management';
      case 'attendance': return 'Daily Attendance & Refunds';
      case 'expenses': return 'Mess Daily Expenses';
      case 'accounts': return 'Individual Member Accounts';
      case 'reports': return 'Monthly Financial Reports';
      default: return 'Hostel Mess Management';
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="h-18 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
            {getTabTitle()}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block">
            {settings?.messName || 'Hostel Mess'} &bull; Owner: {settings?.ownerName || 'Manager'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Date Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>{todayFormatted}</span>
        </div>

        {/* Demo Data Reset Button */}
        <button
          onClick={onResetDemo}
          disabled={isResetting}
          title="Reload initial realistic demo data"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors border border-slate-200 disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">Reset Demo</span>
        </button>

        {/* Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            {settings?.ownerName ? settings.ownerName.charAt(0).toUpperCase() : 'M'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">
              {settings?.ownerName || 'Rajesh Sharma'}
            </p>
            <span className="text-[10px] text-slate-500">Mess Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
}
