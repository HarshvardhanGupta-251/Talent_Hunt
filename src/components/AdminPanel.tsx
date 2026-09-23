import React, { useState, useEffect } from 'react';
import { User, AuditionApplication, PaymentRecord, BookMeta, AuditLog } from '../types.js';
import { 
  ShieldCheck, 
  Users, 
  Clapperboard, 
  CreditCard, 
  BookOpen, 
  Edit3, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Calendar, 
  Video, 
  FileText, 
  RotateCcw, 
  Lock, 
  Check, 
  X,
  Sparkles,
  DollarSign
} from 'lucide-react';

interface AdminPanelProps {
  currentUser: User;
  userToken: string;
  onRefreshSiteContent?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  userToken,
  onRefreshSiteContent,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'auditions' | 'users' | 'payments' | 'book' | 'content' | 'logs' | 'security'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [auditions, setAuditions] = useState<AuditionApplication[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [paymentsList, setPaymentsList] = useState<PaymentRecord[]>([]);
  const [bookData, setBookData] = useState<BookMeta | null>(null);
  const [contentData, setContentData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters & Selected records
  const [auditionSearch, setAuditionSearch] = useState('');
  const [auditionStatusFilter, setAuditionStatusFilter] = useState('ALL');
  const [selectedAudition, setSelectedAudition] = useState<AuditionApplication | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: '2026-10-15',
    time: '11:00 AM IST',
    locationOrLink: 'https://meet.google.com/eyewinn-casting-room-01',
    sceneInstructions: 'Please prepare the scene from Chapter 2: The debate at the Tea Shop regarding crop margins.',
    adminNotes: '',
    status: 'AUDITION SCHEDULED' as any,
  });

  // Security test suite states
  const [securityTestResults, setSecurityTestResults] = useState<any[]>([]);
  const [runningTests, setRunningTests] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchAdminData = async () => {
    if (!userToken || activeTab === 'security') return;
    setLoading(true);
    const headers: Record<string, string> = {
      Authorization: `Bearer ${userToken}`,
    };

    let endpoint = '';
    if (activeTab === 'overview') endpoint = '/api/admin/stats';
    else if (activeTab === 'auditions') endpoint = '/api/admin/auditions';
    else if (activeTab === 'users') endpoint = '/api/admin/users';
    else if (activeTab === 'payments') endpoint = '/api/admin/payments';
    else if (activeTab === 'book') endpoint = '/api/admin/book';
    else if (activeTab === 'content') endpoint = '/api/admin/content';
    else if (activeTab === 'logs') endpoint = '/api/admin/logs';

    if (!endpoint) {
      setLoading(false);
      return;
    }

    try {
      // Retry once on transient network drops or server reload
      let res: Response | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          res = await fetch(endpoint, { headers });
          if (res) break;
        } catch (fetchErr) {
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 500));
          } else {
            throw fetchErr;
          }
        }
      }

      if (!res) {
        setLoading(false);
        return;
      }

      if (res.status === 401 || res.status === 403) {
        showNotify('error', 'Session expired. Please sign in again.');
        setLoading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (activeTab === 'overview') setStats(data);
        else if (activeTab === 'auditions') setAuditions(data);
        else if (activeTab === 'users') setUsersList(data);
        else if (activeTab === 'payments') setPaymentsList(data);
        else if (activeTab === 'book') setBookData(data);
        else if (activeTab === 'content') setContentData(data);
        else if (activeTab === 'logs') setAuditLogs(data);
      }
    } catch (err: any) {
      console.warn('Admin fetch notice:', err?.message || err);
      // Only show error notification if it was not aborted
      if (err?.name !== 'AbortError') {
        showNotify('error', 'Failed to fetch admin data. Retrying...');
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle user book access
  const handleToggleUserBookAccess = async (targetUser: User) => {
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}/toggle-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ hasPaidBook: !targetUser.hasPaidBook }),
      });
      if (res.ok) {
        showNotify('success', `Updated book access for ${targetUser.name}`);
        fetchAdminData();
      }
    } catch (err) {
      showNotify('error', 'Failed to update user access.');
    }
  };

  // Update Audition Status / Schedule
  const handleSaveAuditionStatus = async () => {
    if (!selectedAudition) return;
    try {
      const res = await fetch(`/api/admin/auditions/${selectedAudition.id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          status: scheduleForm.status,
          scheduleDetails: {
            date: scheduleForm.date,
            time: scheduleForm.time,
            locationOrLink: scheduleForm.locationOrLink,
            sceneInstructions: scheduleForm.sceneInstructions,
          },
          adminNotes: scheduleForm.adminNotes,
        }),
      });

      if (res.ok) {
        showNotify('success', `Audition status updated for ${selectedAudition.fullName}`);
        setScheduleModalOpen(false);
        setSelectedAudition(null);
        fetchAdminData();
      }
    } catch (err) {
      showNotify('error', 'Failed to update audition schedule.');
    }
  };

  // Save Book Settings
  const handleSaveBookSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookData) return;
    try {
      const res = await fetch('/api/admin/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(bookData),
      });
      if (res.ok) {
        showNotify('success', 'Book parameters updated successfully.');
        if (onRefreshSiteContent) onRefreshSiteContent();
      }
    } catch (err) {
      showNotify('error', 'Failed to save book settings.');
    }
  };

  // Save Editorial Content
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentData) return;
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(contentData),
      });
      if (res.ok) {
        showNotify('success', 'Editorial text saved.');
        if (onRefreshSiteContent) onRefreshSiteContent();
      }
    } catch (err) {
      showNotify('error', 'Failed to save content.');
    }
  };

  // Security Acceptance Test Suite Runner (Section 63)
  const runSecurityAcceptanceSuite = async () => {
    setRunningTests(true);
    setSecurityTestResults([]);

    const tests = [
      {
        id: 1,
        title: 'TEST 1: Protected Admin Endpoint vs Unauthenticated Request',
        fn: async () => {
          const res = await fetch('/api/admin/stats');
          return {
            passed: res.status === 401,
            detail: `Expected 401 Unauthorized, received ${res.status}`,
          };
        },
      },
      {
        id: 2,
        title: 'TEST 2: Protected Admin Endpoint vs Normal User Token',
        fn: async () => {
          // Log in as standard reader
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'reader@example.com', password: 'reader12345' }),
          });
          const loginData = await loginRes.json();
          const res = await fetch('/api/admin/stats', {
            headers: { Authorization: `Bearer ${loginData.token}` },
          });
          return {
            passed: res.status === 403,
            detail: `Normal user forbidden from admin console. Status: ${res.status}`,
          };
        },
      },
      {
        id: 3,
        title: 'TEST 3: Book Page 1 (Free Preview Accessible Without Auth)',
        fn: async () => {
          const res = await fetch('/api/book/page/1');
          return {
            passed: res.status === 200,
            detail: `Publicly accessible page 1 returned ${res.status}`,
          };
        },
      },
      {
        id: 4,
        title: 'TEST 4: Book Page 3 (Free Preview Accessible Without Auth)',
        fn: async () => {
          const res = await fetch('/api/book/page/3');
          return {
            passed: res.status === 200,
            detail: `Preview boundary page 3 returned ${res.status}`,
          };
        },
      },
      {
        id: 5,
        title: 'TEST 5: Book Page 4 (Locked Beyond Preview Without Auth -> 401)',
        fn: async () => {
          const res = await fetch('/api/book/page/4');
          return {
            passed: res.status === 401,
            detail: `Unauthenticated access to page 4 blocked with ${res.status}`,
          };
        },
      },
      {
        id: 6,
        title: 'TEST 6: Book Page 4 (Logged-in Unpaid User Blocked -> 403)',
        fn: async () => {
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'reader@example.com', password: 'reader12345' }),
          });
          const loginData = await loginRes.json();
          const res = await fetch('/api/book/page/4', {
            headers: { Authorization: `Bearer ${loginData.token}` },
          });
          return {
            passed: res.status === 403,
            detail: `Unpaid user blocked with 403 Forbidden. Status: ${res.status}`,
          };
        },
      },
      {
        id: 7,
        title: 'TEST 7: Book Page 4 (Paid User Authorized -> 200 + Watermark)',
        fn: async () => {
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'priya@example.com', password: 'priya12345' }),
          });
          const loginData = await loginRes.json();
          const res = await fetch('/api/book/page/4', {
            headers: { Authorization: `Bearer ${loginData.token}` },
          });
          const pageData = await res.json();
          const hasWatermark = pageData.watermark && pageData.watermark.includes('Licensed to: Priya Sharma');
          return {
            passed: res.status === 200 && Boolean(hasWatermark),
            detail: `Paid patron received page 4 with dynamic watermark: "${pageData.watermark}"`,
          };
        },
      },
      {
        id: 8,
        title: 'TEST 8: Cross-Applicant Portfolio Access Isolation (Candidate A cannot view B)',
        fn: async () => {
          // Log in as user A
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'reader@example.com', password: 'reader12345' }),
          });
          const loginData = await loginRes.json();

          // Try to access portfolio of application 101 (owned by someone else)
          const res = await fetch('/api/portfolio/doc-sec-portfolio-101', {
            headers: { Authorization: `Bearer ${loginData.token}` },
          });
          return {
            passed: res.status === 403,
            detail: `Unauthorized applicant prevented from reading foreign portfolio. Status: ${res.status}`,
          };
        },
      },
      {
        id: 9,
        title: 'TEST 9: No Direct Static PDF File Exposed (/book.pdf -> 404)',
        fn: async () => {
          const res = await fetch('/book.pdf');
          return {
            passed: res.status === 404 || !res.headers.get('content-type')?.includes('application/pdf'),
            detail: `Direct PDF asset exposure rejected. Status: ${res.status}`,
          };
        },
      },
      {
        id: 10,
        title: 'TEST 10: Server-Side Audit Trail Logging Validation',
        fn: async () => {
          const res = await fetch('/api/admin/logs', {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          const logs = await res.json();
          return {
            passed: Array.isArray(logs) && logs.length > 0,
            detail: `Audit trail active with ${logs.length} verifiable action entries.`,
          };
        },
      },
    ];

    const results = [];
    for (const test of tests) {
      try {
        const out = await test.fn();
        results.push({ id: test.id, title: test.title, ...out });
      } catch (e: any) {
        results.push({ id: test.id, title: test.title, passed: false, detail: e.message });
      }
    }
    setSecurityTestResults(results);
    setRunningTests(false);
  };

  const filteredAuditions = auditions.filter((a) => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(auditionSearch.toLowerCase()) ||
      a.id.toLowerCase().includes(auditionSearch.toLowerCase()) ||
      a.city.toLowerCase().includes(auditionSearch.toLowerCase()) ||
      a.characterInterestedIn.toLowerCase().includes(auditionSearch.toLowerCase());

    const matchesStatus = auditionStatusFilter === 'ALL' || a.status === auditionStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-10 bg-[#F2EFE7] min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Top Header */}
        <div className="card-paper p-6 sm:p-8 rounded-3xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-l-[#B49A68]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#20201E] text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#B49A68]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-[#20201E]">
                  EYE WINN Super Admin Console
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                  ACTIVE SESSION
                </span>
              </div>
              <p className="text-xs text-[#6F6A60] mt-0.5 font-mono">
                Logged in as: {currentUser.name} ({currentUser.email}) • Role: {currentUser.role}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('security')}
            className="px-4 py-2.5 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#6E7560] flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B49A68]" />
            <span>SECURITY SUITE (10 TESTS)</span>
          </button>
        </div>

        {/* Global Notification */}
        {notification && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-xs font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#20201E]/10 mb-8 overflow-x-auto space-x-6">
          {[
            { id: 'overview', label: 'OVERVIEW & METRICS', icon: Sparkles },
            { id: 'auditions', label: 'CASTING DESK', icon: Clapperboard },
            { id: 'users', label: 'USER ROSTER', icon: Users },
            { id: 'payments', label: 'PAYMENTS & REVENUE', icon: CreditCard },
            { id: 'book', label: 'BOOK SETTINGS', icon: BookOpen },
            { id: 'content', label: 'EDITORIAL CONTENT', icon: Edit3 },
            { id: 'logs', label: 'AUDIT TRAIL', icon: Clock },
            { id: 'security', label: 'SECURITY ACCEPTANCE', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3.5 text-xs font-semibold tracking-[0.18em] transition-all flex items-center gap-2 whitespace-nowrap relative ${
                  activeTab === tab.id ? 'text-[#20201E]' : 'text-[#6F6A60] hover:text-[#20201E]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#20201E] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview & Metrics */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {stats ? (
              <>
                {/* 6 KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="card-paper p-5 rounded-2xl">
                    <span className="text-[10px] font-bold tracking-widest text-[#6F6A60] uppercase block">TOTAL USERS</span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#20201E] block mt-1">{stats.totalUsers}</span>
                  </div>
                  <div className="card-paper p-5 rounded-2xl">
                    <span className="text-[10px] font-bold tracking-widest text-[#6F6A60] uppercase block">PAID READERS</span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700 block mt-1">{stats.paidUsers}</span>
                  </div>
                  <div className="card-paper p-5 rounded-2xl">
                    <span className="text-[10px] font-bold tracking-widest text-[#6F6A60] uppercase block">TOTAL REVENUE</span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B98268] block mt-1">₹{stats.totalRevenue}</span>
                  </div>
                  <div className="card-paper p-5 rounded-2xl">
                    <span className="text-[10px] font-bold tracking-widest text-[#6F6A60] uppercase block">AUDITION APPS</span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#20201E] block mt-1">{stats.auditionApplications}</span>
                  </div>
                  <div className="card-paper p-5 rounded-2xl">
                    <span className="text-[10px] font-bold tracking-widest text-[#6F6A60] uppercase block">SHORTLISTED</span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#6E7560] block mt-1">{stats.shortlisted}</span>
                  </div>
                  <div className="card-paper p-5 rounded-2xl">
                    <span className="text-[10px] font-bold tracking-widest text-[#6F6A60] uppercase block">SCHEDULED</span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 block mt-1">{stats.scheduled}</span>
                  </div>
                </div>

                {/* Growth Trend Bar Visualization */}
                <div className="card-paper p-6 sm:p-8 rounded-3xl">
                  <h3 className="font-serif text-xl font-bold text-[#20201E] mb-6">
                    Platform Growth & Engagement Trajectory
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center">
                    {stats.chartData.map((d: any) => (
                      <div key={d.month} className="p-4 rounded-xl bg-[#F8F6F0] border border-[#20201E]/8">
                        <span className="text-xs font-mono text-[#6F6A60] block mb-2">{d.month}</span>
                        <div className="space-y-1 text-xs">
                          <p><strong className="text-[#20201E]">{d.users}</strong> users</p>
                          <p className="text-emerald-700 font-bold">₹{d.revenue}</p>
                          <p className="text-[#B98268]">{d.auditions} auditions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-sm text-[#6F6A60]">Loading metrics...</div>
            )}
          </div>
        )}

        {/* Tab 2: Casting & Auditions */}
        {activeTab === 'auditions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#6F6A60] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={auditionSearch}
                  onChange={(e) => setAuditionSearch(e.target.value)}
                  placeholder="Search by ID, candidate name, character, city..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FFFDF8] border border-[#20201E]/15 text-xs text-[#20201E]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#6F6A60]" />
                <select
                  value={auditionStatusFilter}
                  onChange={(e) => setAuditionStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#FFFDF8] border border-[#20201E]/15 text-xs font-medium text-[#20201E]"
                >
                  <option value="ALL">All Statuses ({auditions.length})</option>
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="UNDER REVIEW">UNDER REVIEW</option>
                  <option value="SHORTLISTED">SHORTLISTED</option>
                  <option value="AUDITION SCHEDULED">AUDITION SCHEDULED</option>
                  <option value="SELECTED">SELECTED</option>
                  <option value="NOT SELECTED">NOT SELECTED</option>
                </select>
              </div>
            </div>

            {/* Audition Records Table */}
            <div className="card-paper rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#EAE4D8]/50 border-b border-[#20201E]/10 text-[#6F6A60] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Application ID</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Role Interested In</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Experience</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#20201E]/6">
                    {filteredAuditions.map((a) => (
                      <tr key={a.id} className="hover:bg-[#F8F6F0]/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#B98268]">{a.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#20201E] block">{a.fullName}</span>
                          <span className="text-[10px] text-[#6F6A60] font-mono">{a.email}</span>
                        </td>
                        <td className="py-3.5 px-4 font-serif font-bold text-[#20201E]">{a.characterInterestedIn}</td>
                        <td className="py-3.5 px-4 text-[#6F6A60]">{a.city}, {a.state}</td>
                        <td className="py-3.5 px-4 text-[#6F6A60]">{a.actingExperience}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F2EFE7] border border-[#20201E]/10">
                            {a.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAudition(a);
                              setScheduleForm({
                                date: a.scheduleDetails?.date || '2026-10-15',
                                time: a.scheduleDetails?.time || '11:00 AM IST',
                                locationOrLink: a.scheduleDetails?.locationOrLink || 'https://meet.google.com/eyewinn-casting-desk',
                                sceneInstructions: a.scheduleDetails?.sceneInstructions || 'Please prepare Scene 3 from Chapter 2.',
                                adminNotes: a.adminNotes || '',
                                status: a.status,
                              });
                              setScheduleModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#20201E] text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-[#6E7560]"
                          >
                            REVIEW / SCHEDULE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Schedule & Review Modal */}
        {scheduleModalOpen && selectedAudition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20201E]/80 backdrop-blur-sm">
            <div className="relative w-full max-w-xl bg-[#FFFDF8] rounded-3xl shadow-2xl border border-[#20201E]/12 overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 bg-[#F2EFE7] border-b border-[#20201E]/8 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#20201E]">
                    Casting Desk: {selectedAudition.fullName}
                  </h3>
                  <span className="font-mono text-xs text-[#B98268]">{selectedAudition.id} • Role: {selectedAudition.characterInterestedIn}</span>
                </div>
                <button onClick={() => setScheduleModalOpen(false)} className="p-1 rounded-lg text-[#6F6A60] hover:text-[#20201E]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                {/* Intro summary */}
                <div className="p-4 rounded-xl bg-[#F8F6F0] border border-[#20201E]/8 space-y-1.5">
                  <p><strong>Candidate Statement:</strong> “{selectedAudition.introduction}”</p>
                  <p><strong>Contact:</strong> {selectedAudition.phone} • {selectedAudition.email}</p>
                  <p><strong>Languages:</strong> {selectedAudition.languages} • Height: {selectedAudition.height}</p>
                  {selectedAudition.demoReelUrl && (
                    <p><strong>Demo Reel:</strong> <a href={selectedAudition.demoReelUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">{selectedAudition.demoReelUrl}</a></p>
                  )}
                  <p><strong>Attached Portfolio:</strong> {selectedAudition.portfolioFileName} (RBAC Secured)</p>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Update Status</label>
                  <select
                    value={scheduleForm.status}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-xs text-[#20201E] font-medium"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER REVIEW">UNDER REVIEW</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="AUDITION SCHEDULED">AUDITION SCHEDULED</option>
                    <option value="SELECTED">SELECTED</option>
                    <option value="NOT SELECTED">NOT SELECTED</option>
                  </select>
                </div>

                {/* Schedule Details if AUDITION SCHEDULED */}
                {scheduleForm.status === 'AUDITION SCHEDULED' && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <span className="font-bold text-amber-900 uppercase tracking-wider block">Audition Logistics</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-medium text-[#6F6A60] block mb-1">Date</label>
                        <input
                          type="date"
                          value={scheduleForm.date}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#20201E]/15"
                        />
                      </div>
                      <div>
                        <label className="font-medium text-[#6F6A60] block mb-1">Time</label>
                        <input
                          type="text"
                          value={scheduleForm.time}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                          placeholder="e.g. 11:30 AM IST"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#20201E]/15"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-medium text-[#6F6A60] block mb-1">Venue / Video Link</label>
                      <input
                        type="text"
                        value={scheduleForm.locationOrLink}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, locationOrLink: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#20201E]/15"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-[#6F6A60] block mb-1">Scene Instructions</label>
                      <textarea
                        rows={2}
                        value={scheduleForm.sceneInstructions}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, sceneInstructions: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#20201E]/15 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Internal Admin Notes */}
                <div>
                  <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Internal Admin Notes (Private)</label>
                  <textarea
                    rows={2}
                    value={scheduleForm.adminNotes}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, adminNotes: e.target.value })}
                    placeholder="Private casting director notes..."
                    className="w-full px-4 py-2 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    onClick={() => setScheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#F2EFE7] text-[#20201E]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAuditionStatus}
                    className="px-6 py-2 rounded-xl bg-[#20201E] text-white font-semibold uppercase tracking-wider hover:bg-[#6E7560]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="card-paper rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#EAE4D8]/50 border-b border-[#20201E]/10 text-[#6F6A60] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Book Access</th>
                    <th className="py-3 px-4">Reading Progress</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20201E]/6">
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#20201E] block">{u.name}</span>
                        <span className="text-[10px] text-[#6F6A60] font-mono">{u.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#F2EFE7]">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.hasPaidBook ? (
                          <span className="text-emerald-700 font-bold">✓ Full Access</span>
                        ) : (
                          <span className="text-[#6F6A60]">Preview Only</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">Page {u.readingProgress || 1}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800">
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleUserBookAccess(u)}
                          className="px-3 py-1.5 rounded-lg bg-[#FFFDF8] border border-[#20201E]/20 text-[#20201E] text-[11px] font-semibold uppercase hover:bg-[#EAE4D8]"
                        >
                          {u.hasPaidBook ? 'Revoke Access' : 'Grant Full Access'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Payments */}
        {activeTab === 'payments' && (
          <div className="card-paper rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#EAE4D8]/50 border-b border-[#20201E]/10 text-[#6F6A60] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Payment ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20201E]/6">
                  {paymentsList.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#20201E]">{p.orderId}</td>
                      <td className="py-3.5 px-4 font-mono text-[#6F6A60]">{p.paymentId || '—'}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#20201E] block">{p.userName}</span>
                        <span className="text-[10px] text-[#6F6A60]">{p.userEmail}</span>
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#20201E]">₹{p.amount} {p.currency}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#6F6A60]">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Book Settings */}
        {activeTab === 'book' && bookData && (
          <div className="card-paper p-6 sm:p-8 rounded-3xl max-w-2xl">
            <h3 className="font-serif text-xl font-bold text-[#20201E] mb-6">
              Book Configuration & Pricing
            </h3>
            <form onSubmit={handleSaveBookSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Book Title</label>
                <input
                  type="text"
                  value={bookData.title}
                  onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-[#20201E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={bookData.author}
                    onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-[#20201E]"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Price in INR (₹)</label>
                  <input
                    type="number"
                    value={bookData.priceINR}
                    onChange={(e) => setBookData({ ...bookData, priceINR: parseInt(e.target.value, 10) || 299 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-[#20201E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Free Preview Limit (Pages)</label>
                  <input
                    type="number"
                    value={bookData.previewPagesCount}
                    onChange={(e) => setBookData({ ...bookData, previewPagesCount: parseInt(e.target.value, 10) || 3 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-[#20201E]"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Genre</label>
                  <input
                    type="text"
                    value={bookData.genre}
                    onChange={(e) => setBookData({ ...bookData, genre: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-[#20201E]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Synopsis</label>
                <textarea
                  rows={4}
                  value={bookData.synopsis}
                  onChange={(e) => setBookData({ ...bookData, synopsis: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-[#20201E] resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#20201E] text-white font-semibold uppercase tracking-wider hover:bg-[#6E7560]"
              >
                Save Book Parameters
              </button>
            </form>
          </div>
        )}

        {/* Tab 6: Editorial Content */}
        {activeTab === 'content' && contentData && (
          <div className="card-paper p-6 sm:p-8 rounded-3xl max-w-3xl">
            <h3 className="font-serif text-xl font-bold text-[#20201E] mb-6">
              Homepage Editorial Text & Quotes
            </h3>
            <form onSubmit={handleSaveContent} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Hindi Core Quote</label>
                <input
                  type="text"
                  value={contentData.quoteHindi}
                  onChange={(e) => setContentData({ ...contentData, quoteHindi: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-sm font-semibold text-[#20201E]"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">English Translation</label>
                <input
                  type="text"
                  value={contentData.quoteEnglish}
                  onChange={(e) => setContentData({ ...contentData, quoteEnglish: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-[#20201E]"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Master Beerbhan Biography</label>
                <textarea
                  rows={3}
                  value={contentData.beerbhanBio}
                  onChange={(e) => setContentData({ ...contentData, beerbhanBio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-[#20201E] resize-none"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Santosh & Nafe Economic Narrative</label>
                <textarea
                  rows={3}
                  value={contentData.economicsText}
                  onChange={(e) => setContentData({ ...contentData, economicsText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-[#20201E] resize-none"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">Author Bio</label>
                <textarea
                  rows={2}
                  value={contentData.authorBio}
                  onChange={(e) => setContentData({ ...contentData, authorBio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-[#20201E] resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#20201E] text-white font-semibold uppercase tracking-wider hover:bg-[#6E7560]"
              >
                Publish Editorial Changes
              </button>
            </form>
          </div>
        )}

        {/* Tab 7: Audit Trail */}
        {activeTab === 'logs' && (
          <div className="card-paper rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-[#20201E]/8 flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-[#20201E]">System Security Audit Trail</h3>
              <span className="text-xs text-[#6F6A60] font-mono">{auditLogs.length} logged events</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#EAE4D8]/50 border-b border-[#20201E]/10 text-[#6F6A60] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Admin / Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20201E]/6">
                  {auditLogs.map((l) => (
                    <tr key={l.id}>
                      <td className="py-3.5 px-4 font-mono text-[#6F6A60] whitespace-nowrap">
                        {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#20201E]">{l.adminName}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#B98268]">{l.action}</td>
                      <td className="py-3.5 px-4 text-[#20201E]">{l.target}</td>
                      <td className="py-3.5 px-4 text-[#6F6A60]">{l.details || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 8: Security Acceptance Test Suite */}
        {activeTab === 'security' && (
          <div className="card-paper p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#20201E]/8">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#20201E]">
                  Security Acceptance Test Suite (Section 63)
                </h3>
                <p className="text-xs text-[#6F6A60] mt-1">
                  Automated live verification verifying all 10 mandatory security acceptance criteria.
                </p>
              </div>

              <button
                onClick={runSecurityAcceptanceSuite}
                disabled={runningTests}
                className="px-6 py-3 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#6E7560] disabled:opacity-50 flex items-center gap-2"
              >
                {runningTests ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ShieldCheck className="w-4 h-4 text-[#B49A68]" />}
                <span>{runningTests ? 'EXECUTING SUITE...' : 'RUN ALL 10 TESTS'}</span>
              </button>
            </div>

            {securityTestResults.length > 0 ? (
              <div className="space-y-3">
                {securityTestResults.map((t) => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                      t.passed ? 'bg-emerald-50/70 border-emerald-200' : 'bg-red-50/70 border-red-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                          t.passed ? 'bg-emerald-600' : 'bg-red-600'
                        }`}>
                          {t.passed ? '✓' : '✗'}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-[#20201E]">{t.title}</h4>
                      </div>
                      <p className="text-xs text-[#6F6A60] ml-7 font-mono">{t.detail}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      t.passed ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                    }`}>
                      {t.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#F8F6F0] border border-[#20201E]/8 text-center text-xs text-[#6F6A60]">
                Click "Run All 10 Tests" above to execute the real-time server and client security verification checks.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
