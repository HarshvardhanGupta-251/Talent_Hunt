import React, { useState, useEffect } from 'react';
import { User, BookMeta, ScriptMeta, AuditionApplication } from './types.js';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { BookShowcase } from './components/BookShowcase.js';
import { ScriptShowcase } from './components/ScriptShowcase.js';
import { AuditionCallout } from './components/AuditionCallout.js';
import { AboutAuthorSection } from './components/AboutAuthorSection.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';
import { BookReaderModal } from './components/BookReaderModal.js';
import { ScriptReaderModal } from './components/ScriptReaderModal.js';
import { RazorpayModal } from './components/RazorpayModal.js';
import { AuditionModal } from './components/AuditionModal.js';
import { AuditionTrackerModal } from './components/AuditionTrackerModal.js';
import { AuthModal } from './components/AuthModal.js';
import { UserDashboard } from './components/UserDashboard.js';
import { AdminPanel } from './components/AdminPanel.js';
import { LegalModals } from './components/LegalModals.js';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string>('');
  const [activeView, setActiveView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'book', 'script', 'audition', 'account', 'admin'].includes(hash)) {
        return hash;
      }
    }
    return 'home';
  });

  // Book & Content
  const [bookMeta, setBookMeta] = useState<BookMeta>({
    title: 'Master Beerbhan',
    author: 'Wing Commander (Retd.) Surender Singh',
    synopsis: 'Set against the vivid agricultural landscapes of an Indian village, a veteran schoolteacher named Master Beerbhan challenges rote learning by making the village square, the tea stall, and the mandi the true classrooms of critical thought.',
    genre: 'Literary & Social Narrative',
    pageCount: '184 Pages',
    totalPages: 184,
    previewPagesCount: 3,
    priceINR: 299,
    isPurchaseEnabled: true,
    themes: [
      'Education Philosophy',
      'Rural Economics',
      'Farming Realities',
      'Critical Thinking',
      'Family Dignity',
      'Self-Reliance',
    ],
  });

  // Script Metadata
  const [scriptMeta, setScriptMeta] = useState<ScriptMeta>({
    title: 'Master Beerbhan — Feature Screenplay',
    author: 'Wing Commander (Retd.) Surender Singh',
    synopsis: 'The full cinematic screenplay of Master Beerbhan. Experience authentic rural dialogues, dramatic classroom confrontations, mandi trade negotiations, and deep character arcs across 8 complete scenes.',
    genre: 'Drama / Social Realism',
    totalPages: 8,
    previewPagesCount: 3,
    priceINR: 499,
    isPurchaseEnabled: true,
  });

  const [siteContent, setSiteContent] = useState<any>({
    quoteHindi: 'शिक्षा केवल अंक पाने का माध्यम नहीं, सोचने की शक्ति विकसित करने का माध्यम है।',
    quoteEnglish: 'Education is not merely a means of earning marks; it is the power to think.',
    introText: 'In a village where conversations travel from the fields to the tea shop, ordinary people discuss extraordinary questions — the price of crops, government decisions, money, family, education and the future.',
    beerbhanBio: 'Master Beerbhan is a government schoolteacher who has spent three decades teaching in the village. But his classroom extends far beyond the walls of a school into markets, fields, chopal gatherings, and everyday rural situations.',
    economicsText: 'Through the everyday struggles and choices of two medium-scale farmer brothers, Santosh and Nafe, agricultural problems transform into profound explorations of rural economics, risk management, and self-reliance.',
    authorBio: 'Written by a retired Indian Air Force officer whose deep observation of rural life and passionate commitment to foundational education shaped this narrative journey.',
  });

  // Modal states
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerStartPage, setReaderStartPage] = useState(1);
  const [scriptReaderOpen, setScriptReaderOpen] = useState(false);
  const [scriptReaderStartPage, setScriptReaderStartPage] = useState(1);
  
  // Payment modal state
  const [razorpayOpen, setRazorpayOpen] = useState(false);
  const [paymentItemType, setPaymentItemType] = useState<'BOOK' | 'SCRIPT'>('BOOK');

  const [auditionModalOpen, setAuditionModalOpen] = useState(false);
  const [auditionTrackerOpen, setAuditionTrackerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'refund' | 'auditionTerms' | null>(null);
  const [trackedAppId, setTrackedAppId] = useState<string>('');

  useEffect(() => {
    // Check saved token or session
    const savedToken = localStorage.getItem('eyewinn_client_token');
    if (savedToken) {
      setUserToken(savedToken);
      fetchSession(savedToken);
    } else {
      fetchSession('');
    }

    fetchBookMetadata();
    fetchScriptMetadata();
    fetchSiteContent();
  }, []);

  const fetchSession = async (token: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/auth/me', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
        } else if (token) {
          setCurrentUser(null);
          setUserToken('');
          localStorage.removeItem('eyewinn_client_token');
        }
      }
    } catch (e) {
      console.warn('Session verify notice:', e);
    }
  };

  const fetchBookMetadata = async () => {
    try {
      const res = await fetch('/api/book/meta');
      if (res.ok) {
        setBookMeta(await res.json());
      }
    } catch (e) {
      console.error('Book metadata fetch error:', e);
    }
  };

  const fetchScriptMetadata = async () => {
    try {
      const res = await fetch('/api/script/meta');
      if (res.ok) {
        setScriptMeta(await res.json());
      }
    } catch (e) {
      console.error('Script metadata fetch error:', e);
    }
  };

  const fetchSiteContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        setSiteContent(await res.json());
      }
    } catch (e) {
      console.error('Content fetch error:', e);
    }
  };

  const handleAuthSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setUserToken(token);
    localStorage.setItem('eyewinn_client_token', token);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
      });
    } catch (e) {}
    setCurrentUser(null);
    setUserToken('');
    localStorage.removeItem('eyewinn_client_token');
    if (activeView === 'account' || activeView === 'admin') {
      setActiveView('home');
    }
  };

  const handleNavigate = (view: string) => {
    setActiveView(view);
    if (view === 'home') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'book', 'script', 'audition', 'about', 'contact', 'account', 'admin'].includes(hash)) {
        setActiveView(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!hash) {
        setActiveView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const hasBookAccess = Boolean(currentUser?.hasPaidBook);
  const hasScriptAccess = Boolean(currentUser?.hasPaidScript);

  return (
    <div className="min-h-screen flex flex-col text-[#20201E] antialiased selection:bg-[#B98268]/20 selection:text-[#20201E] relative bg-[#F8F6F0] overflow-x-hidden">
      {/* Scenic Theme All Page Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2400"
          alt="Scenic Village Landscape Background"
          className="w-full h-full object-cover object-center filter brightness-105 saturate-95"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF8]/45 via-[#F8F6F0]/65 to-[#F2EFE7]/85" />
        <div className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full sun-flare pointer-events-none" />
        <div className="absolute top-1/3 -left-48 w-[600px] h-[600px] rounded-full bg-amber-200/15 filter blur-3xl pointer-events-none" />
      </div>

      {/* Header Navigation */}
      <div className="relative z-40">
        <Navbar
          currentUser={currentUser}
          hasFullAccess={hasBookAccess}
          activeView={activeView}
          onNavigate={handleNavigate}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          onOpenReader={() => {
            setReaderStartPage(1);
            setReaderOpen(true);
          }}
        />
      </div>

      {/* Main Content Router — strictly renders only the clicked page */}
      <main className="flex-1 relative z-10">
        {activeView === 'account' && currentUser ? (
          <div className="animate-in fade-in duration-150">
            <UserDashboard
              currentUser={currentUser}
              userToken={userToken}
              bookMeta={bookMeta}
              onOpenReader={(page) => {
                setReaderStartPage(page || 1);
                setReaderOpen(true);
              }}
              onUnlockBook={() => {
                setPaymentItemType('BOOK');
                setRazorpayOpen(true);
              }}
              onOpenAuditionModal={() => setAuditionModalOpen(true)}
              onTrackApp={(appId) => {
                setTrackedAppId(appId);
                setAuditionTrackerOpen(true);
              }}
            />
          </div>
        ) : activeView === 'admin' &&
          (currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN') ? (
          <div className="animate-in fade-in duration-150">
            <AdminPanel
              currentUser={currentUser}
              userToken={userToken}
              onRefreshSiteContent={() => {
                fetchBookMetadata();
                fetchScriptMetadata();
                fetchSiteContent();
              }}
            />
          </div>
        ) : activeView === 'book' ? (
          /* PAGE: THE BOOK ONLY */
          <div className="py-6 sm:py-10 animate-in fade-in duration-150">
            <BookShowcase
              bookMeta={bookMeta}
              hasFullAccess={hasBookAccess}
              onOpenPreview={() => {
                setReaderStartPage(1);
                setReaderOpen(true);
              }}
              onUnlockBook={() => {
                setPaymentItemType('BOOK');
                if (!currentUser) {
                  setAuthModalOpen(true);
                } else {
                  setRazorpayOpen(true);
                }
              }}
            />
          </div>
        ) : activeView === 'script' ? (
          /* PAGE: THE SCRIPT ONLY */
          <div className="py-6 sm:py-10 animate-in fade-in duration-150">
            <ScriptShowcase
              scriptMeta={scriptMeta}
              hasPaidScriptAccess={hasScriptAccess}
              isPaymentPending={Boolean(currentUser?.scriptPaymentPending)}
              onOpenPreview={() => {
                setScriptReaderStartPage(1);
                setScriptReaderOpen(true);
              }}
              onUnlockScript={() => {
                setPaymentItemType('SCRIPT');
                if (!currentUser) {
                  setAuthModalOpen(true);
                } else {
                  setRazorpayOpen(true);
                }
              }}
            />
          </div>
        ) : activeView === 'audition' ? (
          /* PAGE: AUDITION ONLY */
          <div className="py-6 sm:py-10 animate-in fade-in duration-150">
            <AuditionCallout
              onApplyAudition={() => setAuditionModalOpen(true)}
              onTrackAudition={() => {
                setTrackedAppId('');
                setAuditionTrackerOpen(true);
              }}
            />
          </div>
        ) : activeView === 'about' ? (
          /* PAGE: ABOUT ONLY */
          <div className="py-6 sm:py-10 animate-in fade-in duration-150">
            <AboutAuthorSection
              authorName={bookMeta.author}
              authorBio={siteContent.authorBio}
            />
          </div>
        ) : activeView === 'contact' ? (
          /* PAGE: CONTACT ONLY */
          <div className="py-6 sm:py-10 animate-in fade-in duration-150">
            <ContactSection />
          </div>
        ) : (
          /* PAGE: HOME ONLY */
          <div className="animate-in fade-in duration-150">
            <Hero
              onReadBook={() => handleNavigate('book')}
              onReadScript={() => handleNavigate('script')}
              onJoinAudition={() => handleNavigate('audition')}
            />
          </div>
        )}
      </main>

      {/* Brand Footer */}
      <div className="relative z-10">
        <Footer
          onNavigate={handleNavigate}
          onOpenLegal={(type) => setLegalModalType(type)}
          onOpenAuth={() => setAuthModalOpen(true)}
          isLoggedIn={Boolean(currentUser)}
        />
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE APPLICATION MODALS                               */}
      {/* ============================================================ */}

      {/* 1. Secure Book Reader */}
      <BookReaderModal
        isOpen={readerOpen}
        onClose={() => setReaderOpen(false)}
        bookMeta={bookMeta}
        hasPaidAccess={hasBookAccess}
        isPaymentPending={Boolean(currentUser?.paymentPending)}
        userToken={userToken}
        initialPage={readerStartPage}
        onUnlockBook={() => {
          setReaderOpen(false);
          setPaymentItemType('BOOK');
          if (!currentUser) {
            setAuthModalOpen(true);
          } else {
            setRazorpayOpen(true);
          }
        }}
      />

      {/* 2. Secure Script Reader */}
      <ScriptReaderModal
        isOpen={scriptReaderOpen}
        onClose={() => setScriptReaderOpen(false)}
        scriptMeta={scriptMeta}
        hasPaidAccess={hasScriptAccess}
        isPaymentPending={Boolean(currentUser?.scriptPaymentPending)}
        userToken={userToken}
        initialPage={scriptReaderStartPage}
        onUnlockScript={() => {
          setScriptReaderOpen(false);
          setPaymentItemType('SCRIPT');
          if (!currentUser) {
            setAuthModalOpen(true);
          } else {
            setRazorpayOpen(true);
          }
        }}
      />

      {/* 3. Direct UPI QR Code & UTR Verification Payment Modal */}
      <RazorpayModal
        isOpen={razorpayOpen}
        onClose={() => setRazorpayOpen(false)}
        bookMeta={bookMeta}
        scriptMeta={scriptMeta}
        itemType={paymentItemType}
        siteContent={siteContent}
        currentUser={currentUser}
        userToken={userToken}
        onPaymentSuccess={(updatedUser) => {
          setCurrentUser(updatedUser);
        }}
        onOpenAuth={() => {
          setRazorpayOpen(false);
          setAuthModalOpen(true);
        }}
      />

      {/* 4. Official Audition Application Form */}
      <AuditionModal
        isOpen={auditionModalOpen}
        onClose={() => setAuditionModalOpen(false)}
        currentUser={currentUser}
        onApplicationSubmitted={(app: AuditionApplication) => {
          setTrackedAppId(app.id);
        }}
      />

      {/* 5. Real-Time Audition Status Tracker */}
      <AuditionTrackerModal
        isOpen={auditionTrackerOpen}
        onClose={() => setAuditionTrackerOpen(false)}
        defaultApplicationId={trackedAppId}
      />

      {/* 6. User Authentication (Login / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 7. Legal Policy Modals */}
      <LegalModals
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
