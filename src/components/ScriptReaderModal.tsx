import React, { useState, useEffect } from 'react';
import { ScriptMeta, ScriptPage } from '../types.js';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Film, 
  Lock, 
  Sparkles,
  QrCode,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface ScriptReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptMeta: ScriptMeta;
  hasPaidAccess: boolean;
  isPaymentPending?: boolean;
  onUnlockScript: () => void;
  userToken?: string;
  initialPage?: number;
}

export const ScriptReaderModal: React.FC<ScriptReaderModalProps> = ({
  isOpen,
  onClose,
  scriptMeta,
  hasPaidAccess,
  isPaymentPending,
  onUnlockScript,
  userToken,
  initialPage = 1,
}) => {
  const [currentPageNum, setCurrentPageNum] = useState<number>(() => {
    return !hasPaidAccess && initialPage > 3 ? 3 : (initialPage || 1);
  });
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(1); // 0: regular, 1: large (default for old age readability), 2: extra large
  const [pageData, setPageData] = useState<ScriptPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [lockedError, setLockedError] = useState<{ isLocked: boolean; message: string } | null>(null);

  // Synchronize start page when modal opens or initialPage changes
  useEffect(() => {
    if (!isOpen) {
      setPageData(null);
      setLockedError(null);
      return;
    }
    const start = !hasPaidAccess && initialPage > 3 ? 3 : (initialPage || 1);
    setCurrentPageNum(start);
  }, [isOpen, initialPage, hasPaidAccess]);

  // Fetch page content on change with race-condition prevention
  useEffect(() => {
    if (!isOpen) return;

    let isCurrent = true;

    // Hard paywall gate: if page > 3 and user has not paid, display the paywall screen
    if (!hasPaidAccess && currentPageNum > 3) {
      setLockedError({
        isLocked: true,
        message: 'You have completed the 3-page free screenplay preview. Unlock the complete screenplay with QR code payment & UTR approval.',
      });
      setPageData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLockedError(null);

    const loadPage = async () => {
      try {
        const headers: Record<string, string> = {};
        if (userToken) {
          headers['Authorization'] = `Bearer ${userToken}`;
        }

        const res = await fetch(`/api/script/page/${currentPageNum}`, { headers });
        const data = await res.json();

        if (!isCurrent) return;

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setLockedError({
              isLocked: true,
              message: data.error || 'Please purchase full screenplay access to read beyond the 3-page free preview.',
            });
            setPageData(null);
          } else {
            throw new Error(data.error || 'Failed to load screenplay page.');
          }
        } else {
          setPageData(data);
        }
      } catch (err: any) {
        if (!isCurrent) return;
        console.error('Error fetching screenplay page:', err);
        setLockedError({
          isLocked: true,
          message: err.message || 'Unable to load page content. Please try again.',
        });
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      isCurrent = false;
    };
  }, [isOpen, currentPageNum, hasPaidAccess, userToken]);

  const handleNextPage = () => {
    if (currentPageNum < scriptMeta.totalPages) {
      const targetPage = currentPageNum + 1;
      if (!hasPaidAccess && targetPage > 3) {
        setCurrentPageNum(4);
      } else {
        setCurrentPageNum(targetPage);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPageNum > 1) {
      setCurrentPageNum(currentPageNum - 1);
    }
  };

  if (!isOpen) return null;

  const fontClasses = [
    'text-base leading-relaxed',
    'text-lg sm:text-xl leading-loose',
    'text-xl sm:text-2xl leading-loose font-medium'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#191918]/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[94vh] bg-[#FFFDF9] rounded-3xl shadow-2xl border border-[#20201E]/15 flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <header className="px-5 py-4 bg-[#F2EDE2] border-b border-[#20201E]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#20201E] flex items-center justify-center text-[#B49A68] shadow-sm">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[#B49A68] uppercase bg-[#EAE2D2] px-2 py-0.5 rounded">
                  FEATURE SCRIPT
                </span>
                <span className="text-xs font-semibold text-[#6F6A60]">
                  Scene {currentPageNum} of {scriptMeta.totalPages}
                </span>
              </div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#20201E] leading-tight">
                {scriptMeta.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Selector (Specially crafted for older eyes) */}
            <div className="hidden sm:flex items-center bg-[#E5DFCFC7] p-1 rounded-xl border border-[#20201E]/10">
              <button
                onClick={() => setFontSizeLevel(Math.max(0, fontSizeLevel - 1))}
                disabled={fontSizeLevel === 0}
                className="p-1.5 rounded-lg text-[#20201E] hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                title="Decrease Text Size"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono font-bold text-[#20201E]">
                {fontSizeLevel === 0 ? 'Standard' : fontSizeLevel === 1 ? 'Large' : 'XL Text'}
              </span>
              <button
                onClick={() => setFontSizeLevel(Math.min(2, fontSizeLevel + 1))}
                disabled={fontSizeLevel === 2}
                className="p-1.5 rounded-lg text-[#20201E] hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                title="Increase Text Size for Readability"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#6F6A60] hover:text-[#20201E] hover:bg-[#EAE4D8] transition-colors cursor-pointer"
              title="Close Script Reader"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Free Preview Banner / Paid Status Badge */}
        <div className="px-5 py-2.5 bg-[#FAF6EE] border-b border-[#20201E]/8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#504C44]">
            <FileText className="w-4 h-4 text-[#B98268]" />
            <span>
              {currentPageNum <= 3 ? (
                <strong className="text-emerald-700">Free Preview Page {currentPageNum} of 3</strong>
              ) : (
                <strong className="text-amber-800">Licensed Page {currentPageNum} of {scriptMeta.totalPages}</strong>
              )}
            </span>
          </div>

          {!hasPaidAccess ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#6F6A60] hidden sm:inline">
                Pages 1–3 are Free. Full Script ₹{scriptMeta.priceINR}.
              </span>
              <button
                onClick={onUnlockScript}
                className="px-3 py-1 rounded-lg bg-[#20201E] text-white text-[11px] font-bold tracking-wider uppercase hover:bg-black transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-[#B49A68]" />
                <span>{isPaymentPending ? 'Verify UTR Status' : 'Unlock Script (QR & UTR)'}</span>
              </button>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Script Access Granted</span>
            </span>
          )}
        </div>

        {/* Main Page Canvas (Page-by-page display designed for older clients) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-10 flex justify-center bg-[#FAF7F2]">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-[#20201E]/10 p-6 sm:p-12 flex flex-col justify-between min-h-[500px]">
            
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-[#6F6A60]">
                <div className="w-10 h-10 border-3 border-[#20201E] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-serif">Turning to Page {currentPageNum}...</p>
              </div>
            ) : lockedError ? (
              /* Paywall Gated Screen */
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold tracking-[0.25em] text-[#B98268] uppercase block">
                    FREE 3-PAGE PREVIEW FINISHED
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#20201E]">
                    Unlock the Complete Screenplay
                  </h3>
                  <p className="text-sm sm:text-base text-[#504C44] max-w-md mx-auto leading-relaxed">
                    You have read pages 1 to 3 for free. To read the remaining scenes of{' '}
                    <strong className="text-[#20201E]">{scriptMeta.title}</strong>, scan the Client QR code and enter your UTR number.
                  </p>
                </div>

                {/* Direct Action Box */}
                <div className="p-5 rounded-2xl bg-[#F8F6F0] border border-[#20201E]/10 w-full max-w-md space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6F6A60]">Screenplay Fee:</span>
                    <span className="text-xl font-serif font-bold text-[#20201E]">₹{scriptMeta.priceINR}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6F6A60]">Included:</span>
                    <span className="font-medium text-[#20201E]">All 8 Scenes • Full Dialogue & Stage Notes</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6F6A60]">Verification:</span>
                    <span className="font-medium text-[#20201E]">Instant UTR verification by Client</span>
                  </div>

                  <button
                    onClick={onUnlockScript}
                    className="w-full py-3.5 rounded-xl bg-[#20201E] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-black transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-[#B49A68]" />
                    <span>PAY VIA QR & SUBMIT UTR NUMBER</span>
                  </button>
                </div>

                <p className="text-xs text-[#6F6A60]">
                  Already submitted? The Client verifies UTR numbers in the Super Admin Portal and will grant your access.
                </p>
              </div>
            ) : pageData ? (
              /* Authentic Screenplay Page Content */
              <article className="space-y-6">
                {/* Scene Header */}
                <header className="border-b border-[#20201E]/10 pb-4 text-center">
                  <span className="text-[11px] font-mono tracking-widest text-[#B98268] uppercase block mb-1">
                    SCENE {pageData.pageNumber} • {pageData.sceneLocation || 'EXT. / INT.'}
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#20201E]">
                    {pageData.sceneTitle}
                  </h3>
                </header>

                {/* Screenplay Body Content */}
                <div className={`font-mono text-[#20201E] whitespace-pre-wrap ${fontClasses[fontSizeLevel]}`}>
                  {pageData.content}
                </div>

                {/* Dynamic Watermark */}
                {pageData.watermark && (
                  <footer className="pt-8 border-t border-[#20201E]/8 text-center">
                    <span className="text-[10px] font-mono text-[#8C877D] tracking-wider uppercase">
                      {pageData.watermark}
                    </span>
                  </footer>
                )}
              </article>
            ) : null}

          </div>
        </div>

        {/* Bottom Page Navigation (Large, Easy to Click for Older Clients) */}
        <footer className="px-5 py-4 bg-[#F2EDE2] border-t border-[#20201E]/10 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrevPage}
            disabled={currentPageNum <= 1 || loading}
            className="px-5 py-3 rounded-xl bg-white border border-[#20201E]/15 text-[#20201E] text-xs sm:text-sm font-bold tracking-wider uppercase hover:bg-[#EAE4D8] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-5 h-5 text-[#B98268]" />
            <span>Previous Page</span>
          </button>

          {/* Current Page Indicator */}
          <div className="text-center">
            <span className="font-serif font-bold text-base sm:text-lg text-[#20201E] block">
              Page {currentPageNum} of {scriptMeta.totalPages}
            </span>
            <span className="text-[10px] text-[#6F6A60] tracking-widest uppercase">
              {currentPageNum <= 3 ? 'Free Preview' : hasPaidAccess ? 'Full Access' : 'Locked'}
            </span>
          </div>

          <button
            onClick={() => {
              if (!hasPaidAccess && currentPageNum >= 4) {
                onUnlockScript();
              } else {
                handleNextPage();
              }
            }}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#20201E] text-white text-xs sm:text-sm font-bold tracking-wider uppercase hover:bg-[#6E7560] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>
              {!hasPaidAccess && currentPageNum >= 4 
                ? `Unlock All (₹${scriptMeta.priceINR})`
                : !hasPaidAccess && currentPageNum === 3 
                  ? 'Next (Locked Scene 4)' 
                  : 'Next Page'}
            </span>
            <ChevronRight className="w-5 h-5 text-[#B49A68]" />
          </button>
        </footer>

      </div>
    </div>
  );
};
export default ScriptReaderModal;
