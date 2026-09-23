import React, { useState, useEffect } from 'react';
import { BookMeta, BookPage } from '../types.js';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Columns, 
  BookOpen, 
  Lock, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface BookReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookMeta: BookMeta;
  hasPaidAccess: boolean;
  isPaymentPending?: boolean;
  onUnlockBook: () => void;
  userToken?: string;
  initialPage?: number;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  isOpen,
  onClose,
  bookMeta,
  hasPaidAccess,
  isPaymentPending,
  onUnlockBook,
  userToken,
  initialPage = 1,
}) => {
  const [currentPageNum, setCurrentPageNum] = useState<number>(() => {
    return !hasPaidAccess && initialPage > 3 ? 3 : initialPage;
  });
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(1); // 0: small, 1: normal, 2: large
  const [pageData, setPageData] = useState<BookPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [lockedError, setLockedError] = useState<{ isLocked: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (!hasPaidAccess && initialPage > 3) {
      setCurrentPageNum(3);
    } else {
      setCurrentPageNum(initialPage);
    }
  }, [isOpen, initialPage, hasPaidAccess]);

  useEffect(() => {
    if (isOpen) {
      if (!hasPaidAccess && currentPageNum > 3) {
        setLockedError({
          isLocked: true,
          message: 'You must purchase the complete book to read beyond the 3-page free preview.',
        });
        setPageData(null);
      } else {
        fetchPage(currentPageNum);
      }
    }
  }, [isOpen, currentPageNum, hasPaidAccess]);

  const fetchPage = async (page: number) => {
    // Client-side hard paywall gate: never fetch or display page > 3 for unpaid users
    if (!hasPaidAccess && page > 3) {
      setLockedError({
        isLocked: true,
        message: 'You must purchase the complete book to read beyond the 3-page free preview.',
      });
      setPageData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLockedError(null);
    try {
      const headers: Record<string, string> = {};
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
      }

      const res = await fetch(`/api/book/page/${page}`, { headers });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setLockedError({
            isLocked: true,
            message: data.error || 'You must purchase the complete book to read beyond the 3-page free preview.',
          });
          setPageData(null);
        } else {
          throw new Error(data.error || 'Failed to load page.');
        }
      } else {
        setPageData(data);
      }
    } catch (err: any) {
      console.error('Reader fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!hasPaidAccess && currentPageNum >= 3) {
      onUnlockBook();
      return;
    }
    if (currentPageNum < bookMeta.totalPages) {
      setCurrentPageNum((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageNum > 1) {
      setCurrentPageNum((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  const fontClasses = [
    'text-base sm:text-lg leading-relaxed',
    'text-lg sm:text-xl leading-relaxed',
    'text-xl sm:text-2xl leading-loose',
  ][fontSizeLevel];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#20201E]/80 backdrop-blur-sm animate-in fade-in duration-200"
      onContextMenu={(e) => e.preventDefault()} // Security: Prevent right-click copying
    >
      {/* Reader Container */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-[#EAE4D8] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#20201E]/20">
        {/* Top Control Bar */}
        <div className="h-14 px-4 sm:px-6 bg-[#F2EFE7] border-b border-[#20201E]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-[#B98268]" />
            <span className="font-serif font-bold text-sm text-[#20201E] truncate max-w-[200px] sm:max-w-xs">
              {bookMeta.title}
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-[#6E7560] bg-[#FFFDF8] px-2.5 py-0.5 rounded-full border border-[#20201E]/10">
              {hasPaidAccess ? 'FULL EDITION' : (currentPageNum <= 3 ? 'FREE PREVIEW' : 'EDITION READER')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Font sizing */}
            <div className="flex items-center bg-[#FFFDF8] rounded-lg border border-[#20201E]/10 px-1 py-0.5">
              <button
                onClick={() => setFontSizeLevel((prev) => Math.max(0, prev - 1))}
                disabled={fontSizeLevel === 0}
                className="p-1 text-[#6F6A60] hover:text-[#20201E] disabled:opacity-30"
                title="Decrease font"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-2 text-[#20201E]">
                {fontSizeLevel === 0 ? 'A-' : fontSizeLevel === 1 ? 'A' : 'A+'}
              </span>
              <button
                onClick={() => setFontSizeLevel((prev) => Math.min(2, prev + 1))}
                disabled={fontSizeLevel === 2}
                className="p-1 text-[#6F6A60] hover:text-[#20201E] disabled:opacity-30"
                title="Increase font"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6F6A60] hover:text-[#20201E] hover:bg-[#EAE4D8] transition-colors"
              title="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Book Stage */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto relative select-none">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-[#B98268] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-serif text-[#6F6A60] tracking-wider">Turning page...</p>
            </div>
          ) : lockedError ? (
            /* Paywall Lock Screen at Page 4 */
            <div className="w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-[#FFFDF8] border border-[#20201E]/10 book-shadow text-center">
              <div className="w-14 h-14 rounded-full bg-[#B98268]/15 text-[#B98268] flex items-center justify-center mx-auto mb-5">
                <Lock className="w-7 h-7" />
              </div>

              <span className="text-[11px] font-bold tracking-[0.25em] text-[#B98268] uppercase block mb-2">
                FREE 3-PAGE PREVIEW CONCLUDED
              </span>

              <h3 
                className="text-2xl sm:text-3xl font-serif font-bold text-[#20201E] tracking-tight mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                DOCUMENT ACCESS LIMITED
              </h3>

              <p className="text-sm text-[#504C44] leading-relaxed mb-6">
                You have reached the end of the free 3-page preview. Unlock the complete Vidyarthi Mediclaim document to access Section 4 (Exclusions), Section 5 (Student & Guardian Personal Accident Tables), Section 6 (TPA Cashless Guidelines), and the Official Premium Schedule.
              </p>

              <div className="p-4 rounded-xl bg-[#F2EFE7] border border-[#20201E]/8 mb-6 text-left text-xs text-[#20201E] space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B49A68]" />
                  <span>Unlimited lifetime access on any device</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B49A68]" />
                  <span>Personalized licensed digital edition</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B49A68]" />
                  <span>Directly supports independent literature & cinematic adaptation</span>
                </div>
              </div>

              {isPaymentPending ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs mb-6 space-y-1">
                  <div className="font-bold uppercase tracking-wider text-[11px] text-amber-800">
                    ⏳ UTR VERIFICATION UNDER SUPER ADMIN REVIEW
                  </div>
                  <p>
                    Your submitted UTR number is being verified against our official ICICI bank credit records. Once the Super Admin approves, this page will unlock immediately.
                  </p>
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onUnlockBook}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#6E7560] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-[#B49A68]" />
                  <span>
                    {isPaymentPending
                      ? 'CHECK UTR APPROVAL STATUS'
                      : `SCAN UPI QR & UNLOCK • ₹${bookMeta.priceINR}`}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setLockedError(null);
                    setCurrentPageNum(3);
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#FFFDF8] text-[#20201E] text-xs font-semibold tracking-wider uppercase border border-[#20201E]/20 hover:bg-[#F2EFE7]"
                >
                  BACK TO PREVIEW (PAGE 3)
                </button>
                <button
                  onClick={() => {
                    setLockedError(null);
                    setCurrentPageNum(1);
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#FFFDF8] text-[#20201E] text-xs font-semibold tracking-wider uppercase border border-[#20201E]/20 hover:bg-[#F2EFE7]"
                >
                  BACK TO PAGE 1
                </button>
              </div>
            </div>
          ) : pageData ? (
            /* Physical Book Page Canvas */
            <div className="relative w-full max-w-2xl min-h-[500px] sm:min-h-[580px] bg-[#FFFDF8] text-[#252421] p-8 sm:p-14 rounded-r-xl rounded-l-xs book-shadow flex flex-col justify-between border-l-2 border-[#20201E]/10 overflow-hidden">
              {/* Dynamic Licensed Watermark */}
              {pageData.watermark && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center rotate-[-25deg] opacity-[0.06] select-none text-center">
                  <span className="text-xl sm:text-2xl font-serif font-bold text-[#20201E] uppercase tracking-widest leading-loose">
                    {pageData.watermark}
                  </span>
                </div>
              )}

              {/* Page Header */}
              <div className="flex items-center justify-between border-b border-[#20201E]/6 pb-4 mb-6 text-[10px] sm:text-xs font-serif text-[#6F6A60] tracking-widest uppercase">
                <span>{bookMeta.title}</span>
                <span>{pageData.chapterTitle}</span>
              </div>

              {/* Page Body Text */}
              <div className="flex-1 overflow-y-auto pr-1">
                {pageData.pageNumber === 1 && (
                  <div className="text-center mb-6 pb-4 border-b border-[#20201E]/10">
                    <span className="text-[10px] tracking-[0.25em] font-bold text-[#B49A68] uppercase block mb-1">
                      OFFICIAL PROSPECTUS & POLICY TERMS
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#20201E]">
                      Vidyarthi Mediclaim for Students
                    </h3>
                    <p className="text-xs text-[#6F6A60] mt-1 font-sans">
                      National Insurance Company Limited • UIN: NICHLIP21113V032021
                    </p>
                    <div className="w-12 h-[1.5px] bg-[#B98268] mx-auto mt-3" />
                  </div>
                )}

                <div 
                  className={`font-serif text-[#252421] space-y-4 ${fontClasses}`}
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                >
                  {pageData.content.split('\n\n').map((block: string, i: number) => {
                    const lines = block.split('\n');
                    return (
                      <div key={i} className="space-y-1.5 leading-relaxed">
                        {lines.map((line: string, lineIdx: number) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;

                          // Check if line is a major section title or header
                          if (/^[0-9]+(\.[0-9]+)*\s+[A-Z]/.test(trimmed) || /^[0-9]+\s+Section/i.test(trimmed) || trimmed.startsWith('VIDYARTHI MEDICLAIM') || trimmed.startsWith('National Insurance Company')) {
                            return (
                              <h4 key={lineIdx} className="font-sans font-bold text-sm sm:text-base text-[#20201E] tracking-tight mt-4 mb-2 border-b border-[#20201E]/10 pb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B98268]"></span>
                                <span>{trimmed}</span>
                              </h4>
                            );
                          }

                          // Bullet points
                          if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                            return (
                              <div key={lineIdx} className="flex items-start gap-2.5 pl-3 py-0.5">
                                <span className="text-[#B98268] text-xs leading-none mt-1">✦</span>
                                <span className="flex-1 text-[#302D28] font-medium">{trimmed.replace(/^[•-]\s*/, '')}</span>
                              </div>
                            );
                          }

                          // Subclauses / numbered items
                          if (/^[0-9]+\)\s+/.test(trimmed) || /^[a-z]\)\s+/.test(trimmed) || /^[ivx]+\.\s+/i.test(trimmed) || /^\([a-z]\)\s+/i.test(trimmed)) {
                            return (
                              <div key={lineIdx} className="flex items-start gap-2.5 pl-3 py-0.5">
                                <span className="font-mono text-xs font-bold text-[#B98268] mt-0.5 min-w-[22px]">
                                  {trimmed.match(/^([0-9]+\)|[a-z]\)|[ivx]+\.|\([a-z]\))/i)?.[0]}
                                </span>
                                <span className="flex-1 text-[#302D28]">
                                  {trimmed.replace(/^([0-9]+\)|[a-z]\)|[ivx]+\.|\([a-z]\))\s*/i, '')}
                                </span>
                              </div>
                            );
                          }

                          // Tier premium schedule formatting
                          if (trimmed.startsWith('Tier ') || trimmed.startsWith('• Tier ')) {
                            return (
                              <div key={lineIdx} className="p-2.5 my-1.5 rounded-lg bg-stone-100/90 border border-stone-200/80 font-sans text-xs text-[#20201E] font-semibold">
                                <span className="text-[#B98268] mr-2">◈</span>
                                {trimmed}
                              </div>
                            );
                          }

                          return (
                            <p key={lineIdx} className="leading-relaxed">
                              {trimmed}
                            </p>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                {/* Page 3 Payment Limit Card for Unpaid Users */}
                {pageData.pageNumber === 3 && !hasPaidAccess && (
                  <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#F2EFE7] border-2 border-[#B98268]/50 text-center space-y-3 shadow-md">
                    <div className="w-10 h-10 rounded-full bg-[#B98268]/15 text-[#B98268] flex items-center justify-center mx-auto">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-[#B98268] uppercase block">
                      PREVIEW PAYMENT LIMIT • FINAL FREE PREVIEW PAGE
                    </span>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#20201E]">
                      Unlock Complete Prospectus (Pages 4–8)
                    </h4>
                    <p className="text-xs text-[#504C44] leading-relaxed max-w-md mx-auto">
                      Page 3 is the limit for non-purchased access. Beyond this page, access to Exclusions, Student & Guardian Capital Sum Insured Tables, and Official Premium Schedules requires the licensed digital edition.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={onUnlockBook}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-[0.18em] uppercase hover:bg-[#6E7560] transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#B49A68]" />
                        <span>UNLOCK COMPLETE BOOK • ₹{bookMeta.priceINR}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Page Footer & Number */}
              <div className="pt-6 mt-6 border-t border-[#20201E]/6 flex items-center justify-between text-xs font-serif text-[#6F6A60]">
                <span className="text-[10px] tracking-wider text-[#B98268] font-sans font-medium">NATIONAL INSURANCE CO. LTD.</span>
                <span className="font-mono text-sm font-semibold text-[#20201E]">
                  — Page {pageData.pageNumber} —
                </span>
                <span className="text-[10px] tracking-wider font-sans font-medium">OF {bookMeta.totalPages}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Bottom Pagination & Progress Bar */}
        <div className="h-16 px-4 sm:px-6 bg-[#F2EFE7] border-t border-[#20201E]/10 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentPageNum <= 1 || loading}
            className="flex items-center gap-1 text-xs font-semibold tracking-wider text-[#20201E] px-3.5 py-2 rounded-lg bg-[#FFFDF8] border border-[#20201E]/10 hover:bg-[#EAE4D8] disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">PREVIOUS</span>
          </button>

          {/* Progress Slider / Counter */}
          <div className="flex flex-col items-center max-w-xs w-full px-4">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#20201E]">
              <span>Page {currentPageNum}</span>
              <span className="text-[#6F6A60]">/</span>
              <span className="text-[#6F6A60]">{bookMeta.totalPages}</span>
            </div>
            <div className="w-full h-1 bg-[#20201E]/10 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-[#B98268] transition-all duration-300"
                style={{ width: `${(currentPageNum / bookMeta.totalPages) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (currentPageNum === 3 && !hasPaidAccess) {
                onUnlockBook();
              } else {
                handleNext();
              }
            }}
            disabled={(hasPaidAccess && currentPageNum >= bookMeta.totalPages) || (!hasPaidAccess && currentPageNum > 3) || loading}
            className={`flex items-center gap-1.5 text-xs font-semibold tracking-wider px-3.5 py-2 rounded-lg border transition-all ${
              currentPageNum === 3 && !hasPaidAccess
                ? 'bg-[#20201E] text-white border-[#20201E] hover:bg-[#6E7560] shadow-md'
                : 'text-[#20201E] bg-[#FFFDF8] border-[#20201E]/10 hover:bg-[#EAE4D8] disabled:opacity-40'
            }`}
          >
            {currentPageNum === 3 && !hasPaidAccess ? (
              <>
                <Lock className="w-3.5 h-3.5 text-[#B49A68]" />
                <span className="hidden sm:inline">UNLOCK COMPLETE BOOK (₹{bookMeta.priceINR})</span>
                <span className="sm:hidden">UNLOCK (₹{bookMeta.priceINR})</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
