import React, { useState, useEffect } from 'react';
import { User, AuditionApplication, PaymentRecord, BookMeta } from '../types.js';
import { 
  BookOpen, 
  CreditCard, 
  Clapperboard, 
  User as UserIcon, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface UserDashboardProps {
  currentUser: User;
  userToken: string;
  bookMeta: BookMeta;
  onOpenReader: (startPage?: number) => void;
  onUnlockBook: () => void;
  onOpenAuditionModal: () => void;
  onTrackApp: (appId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  userToken,
  bookMeta,
  onOpenReader,
  onUnlockBook,
  onOpenAuditionModal,
  onTrackApp,
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'auditions' | 'payments' | 'profile'>('book');
  const [userAuditions, setUserAuditions] = useState<AuditionApplication[]>([]);
  const [userPayments, setUserPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${userToken}` };
      
      const [audRes, payRes] = await Promise.all([
        fetch('/api/audition/my-application', { headers }),
        fetch('/api/payment/my-history', { headers }),
      ]);

      if (audRes.ok) {
        const audData = await audRes.json();
        setUserAuditions(audData);
      }
      if (payRes.ok) {
        const payData = await payRes.json();
        setUserPayments(payData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-[#F8F6F0] min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Account Header Banner */}
        <div className="card-paper p-6 sm:p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#20201E] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#20201E]">
                  {currentUser.name}
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#6E7560]/15 text-[#6E7560] uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-[#6F6A60] mt-1 font-mono">
                {currentUser.email} • Member since {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {currentUser.hasPaidBook ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>FULL BOOK ACCESS ACTIVE</span>
              </span>
            ) : (
              <button
                onClick={onUnlockBook}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#6E7560] transition-colors shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-[#B49A68]" />
                <span>UNLOCK BOOK • ₹{bookMeta.priceINR}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#20201E]/10 mb-8 overflow-x-auto space-x-6">
          {[
            { id: 'book', label: 'MY READING & BOOK', icon: BookOpen },
            { id: 'auditions', label: `AUDITIONS (${userAuditions.length})`, icon: Clapperboard },
            { id: 'payments', label: `PAYMENTS (${userPayments.length})`, icon: CreditCard },
            { id: 'profile', label: 'PROFILE DETAILS', icon: UserIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3.5 text-xs font-semibold tracking-[0.18em] transition-all flex items-center gap-2 whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? 'text-[#20201E]'
                    : 'text-[#6F6A60] hover:text-[#20201E]'
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

        {/* Tab 1: Book Access */}
        {activeTab === 'book' && (
          <div className="space-y-6">
            <div className="card-paper p-6 sm:p-8 rounded-3xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#20201E]/8">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-28 rounded-lg bg-[#20201E] text-white flex flex-col justify-between p-2 book-shadow shrink-0 border-l-2 border-[#B49A68]">
                    <span className="text-[8px] text-[#B49A68] uppercase font-mono">EDITIONS</span>
                    <span className="font-serif text-[10px] font-bold line-clamp-2">{bookMeta.title}</span>
                    <span className="text-[8px] text-white/50">{bookMeta.author}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#20201E]">
                      {bookMeta.title}
                    </h3>
                    <p className="text-xs text-[#6F6A60] mt-1">
                      By {bookMeta.author} • {bookMeta.pageCount} Pages • {bookMeta.genre}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      {currentUser.hasPaidBook ? (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          ✓ Complete Digital Edition Licensed
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                          3-Page Free Preview Mode
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={() => onOpenReader(currentUser.readingProgress || 1)}
                    className="px-6 py-3 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#6E7560] transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-[#B49A68]" />
                    <span>
                      {currentUser.readingProgress > 1
                        ? `CONTINUE (PAGE ${currentUser.readingProgress})`
                        : 'LAUNCH BOOK READER'}
                    </span>
                  </button>

                  {!currentUser.hasPaidBook && (
                    <button
                      onClick={onUnlockBook}
                      className="px-5 py-3 rounded-xl bg-[#FFFDF8] text-[#20201E] text-xs font-semibold tracking-wider uppercase border border-[#20201E]/20 hover:bg-[#F2EFE7] transition-colors"
                    >
                      UNLOCK FULL BOOK (₹{bookMeta.priceINR})
                    </button>
                  )}
                </div>
              </div>

              {/* Reading Progress */}
              <div className="pt-6">
                <div className="flex justify-between items-center text-xs font-medium text-[#20201E] mb-2">
                  <span>Reading Progress: Page {currentUser.readingProgress || 1} of {bookMeta.totalPages}</span>
                  <span className="font-mono text-[#6F6A60]">
                    {Math.round(((currentUser.readingProgress || 1) / bookMeta.totalPages) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EAE4D8] overflow-hidden">
                  <div
                    className="h-full bg-[#B98268] transition-all duration-300"
                    style={{
                      width: `${((currentUser.readingProgress || 1) / bookMeta.totalPages) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Auditions */}
        {activeTab === 'auditions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-bold text-[#20201E]">
                My Casting Applications
              </h3>
              <button
                onClick={onOpenAuditionModal}
                className="px-4 py-2 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#6E7560]"
              >
                + SUBMIT NEW APPLICATION
              </button>
            </div>

            {userAuditions.length === 0 ? (
              <div className="card-paper p-10 rounded-3xl text-center">
                <Clapperboard className="w-12 h-12 text-[#6F6A60]/40 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-[#20201E]">
                  No Audition Applications Yet
                </h4>
                <p className="text-sm text-[#6F6A60] max-w-sm mx-auto mt-1 mb-6">
                  Auditions are currently open for Master Beerbhan, Santosh, Nafe, and village ensemble roles.
                </p>
                <button
                  onClick={onOpenAuditionModal}
                  className="px-6 py-2.5 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#6E7560]"
                >
                  APPLY FOR CASTING
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userAuditions.map((app) => (
                  <div
                    key={app.id}
                    className="card-paper p-6 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#B98268]">{app.id}</span>
                        <span className="text-xs text-[#6F6A60]">• Submitted {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#20201E]">
                        Role: {app.characterInterestedIn}
                      </h4>
                      <p className="text-xs text-[#6F6A60] mt-1">
                        Applicant: {app.fullName} ({app.city}, {app.state})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded-full bg-[#F2EFE7] border border-[#20201E]/10 text-xs font-bold tracking-wider text-[#20201E] uppercase">
                        {app.status}
                      </span>
                      <button
                        onClick={() => onTrackApp(app.id)}
                        className="px-4 py-2 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#6E7560]"
                      >
                        VIEW STATUS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Payments */}
        {activeTab === 'payments' && (
          <div className="card-paper p-6 sm:p-8 rounded-3xl">
            <h3 className="font-serif text-xl font-bold text-[#20201E] mb-6">
              Razorpay Payment Records
            </h3>

            {userPayments.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#6F6A60]">
                No payment transactions recorded for this account.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#20201E]/10 text-[#6F6A60] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-2">Order ID</th>
                      <th className="py-3 px-2">Payment ID</th>
                      <th className="py-3 px-2">Amount</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#20201E]/6">
                    {userPayments.map((p) => (
                      <tr key={p.id} className="text-[#20201E]">
                        <td className="py-3.5 px-2 font-mono">{p.orderId}</td>
                        <td className="py-3.5 px-2 font-mono text-[#6F6A60]">{p.paymentId || '—'}</td>
                        <td className="py-3.5 px-2 font-bold font-serif text-sm">₹{p.amount} {p.currency}</td>
                        <td className="py-3.5 px-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              p.status === 'SUCCESSFUL'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-[#6F6A60]">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile Details */}
        {activeTab === 'profile' && (
          <div className="card-paper p-6 sm:p-8 rounded-3xl max-w-xl">
            <h3 className="font-serif text-xl font-bold text-[#20201E] mb-6">
              Account Credentials
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-[#6F6A60] block mb-1">Full Name</span>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/10 text-[#20201E]"
                />
              </div>
              <div>
                <span className="font-semibold text-[#6F6A60] block mb-1">Email Address</span>
                <input
                  type="text"
                  disabled
                  value={currentUser.email}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/10 text-[#20201E]"
                />
              </div>
              <div>
                <span className="font-semibold text-[#6F6A60] block mb-1">User Role</span>
                <input
                  type="text"
                  disabled
                  value={currentUser.role}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/10 text-[#20201E]"
                />
              </div>
              <div>
                <span className="font-semibold text-[#6F6A60] block mb-1">Book Access Status</span>
                <input
                  type="text"
                  disabled
                  value={currentUser.hasPaidBook ? 'Full Access Granted' : 'Free Preview Mode'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/10 text-[#20201E]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
