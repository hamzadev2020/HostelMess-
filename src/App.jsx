import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import DailyAttendance from './components/DailyAttendance';
import DailyExpenses from './components/DailyExpenses';
import MemberAccountView from './components/MemberAccountView';
import MonthlyReports from './components/MonthlyReports';
import SettingsModal from './components/SettingsModal';
import { 
  fetchDashboard, 
  fetchMembers, 
  fetchSettings, 
  resetDemoData 
} from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Core Data
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Load all foundational data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [dashRes, membersRes, settingsRes] = await Promise.all([
        fetchDashboard(),
        fetchMembers(),
        fetchSettings()
      ]);

      if (dashRes.success) setStats(dashRes.data);
      if (membersRes.success) {
        setMembers(membersRes.data || []);
        if (membersRes.data && membersRes.data.length > 0 && !selectedMemberId) {
          setSelectedMemberId(membersRes.data[0].id);
        }
      }
      if (settingsRes.success) setSettings(settingsRes.data);
    } catch (err) {
      console.error("Failed to load application data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Quick refresh triggers
  const refreshDashboardAndMembers = async () => {
    try {
      const [dashRes, membersRes] = await Promise.all([
        fetchDashboard(),
        fetchMembers()
      ]);
      if (dashRes.success) setStats(dashRes.data);
      if (membersRes.success) setMembers(membersRes.data || []);
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  // Switch to individual account view
  const handleViewMemberAccount = (memberId) => {
    setSelectedMemberId(memberId);
    setActiveTab('accounts');
  };

  // Reset Demo Data
  const handleResetDemo = async () => {
    if (window.confirm("Reload demo database with realistic students, attendance and expense records?")) {
      try {
        setIsResetting(true);
        const res = await resetDemoData();
        if (res.success) {
          await loadInitialData();
          alert("Demo data has been restored successfully!");
        }
      } catch (err) {
        alert("Failed to reset demo: " + err.message);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row antialiased text-slate-800">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        openSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          setMobileOpen={setMobileOpen}
          settings={settings}
          onResetDemo={handleResetDemo}
          isResetting={isResetting}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              loading={loading}
              onNavigate={(tab) => setActiveTab(tab)}
              settings={settings}
            />
          )}

          {activeTab === 'members' && (
            <MemberManagement
              members={members}
              loading={loading}
              onRefresh={refreshDashboardAndMembers}
              onViewAccount={handleViewMemberAccount}
              settings={settings}
            />
          )}

          {activeTab === 'attendance' && (
            <DailyAttendance
              onAttendanceChange={refreshDashboardAndMembers}
              settings={settings}
            />
          )}

          {activeTab === 'expenses' && (
            <DailyExpenses
              onExpenseChange={refreshDashboardAndMembers}
              settings={settings}
            />
          )}

          {activeTab === 'accounts' && (
            <MemberAccountView
              memberId={selectedMemberId || (members[0]?.id)}
              onBack={() => setActiveTab('members')}
              onSelectMember={(id) => setSelectedMemberId(id)}
              settings={settings}
            />
          )}

          {activeTab === 'reports' && (
            <MonthlyReports
              settings={settings}
              onViewMemberAccount={handleViewMemberAccount}
            />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newSettings) => setSettings(newSettings)}
      />
    </div>
  );
}
