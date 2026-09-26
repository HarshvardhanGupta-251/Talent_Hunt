import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BookMeta, ScriptMeta, User, PaymentRecord } from '../types.js';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Clock,
  QrCode,
  ArrowRight,
  HelpCircle,
  RefreshCw,
  Film
} from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookMeta: BookMeta;
  scriptMeta?: ScriptMeta;
  itemType?: 'BOOK' | 'SCRIPT';
  siteContent?: any;
  currentUser: User | null;
  userToken?: string;
  onPaymentSuccess: (updatedUser: User) => void;
  onOpenAuth: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  bookMeta,
  scriptMeta,
  itemType = 'BOOK',
  siteContent,
  currentUser,
  userToken,
  onPaymentSuccess,
  onOpenAuth,
}) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [userNote, setUserNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showUtrHelp, setShowUtrHelp] = useState(false);
  
  // Pending or approved status states
  const [pendingPayment, setPendingPayment] = useState<PaymentRecord | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const isScript = itemType === 'SCRIPT';
  const effectivePrice = isScript ? (scriptMeta?.priceINR || 499) : bookMeta.priceINR;
  const effectiveTitle = isScript ? (scriptMeta?.title || 'Master Beerbhan — Feature Screenplay') : bookMeta.title;

  const officialUpiId = siteContent?.upiId || 'eyewinnproductions@icici';
  const payeeName = siteContent?.upiPayeeName || 'EYE WINN PRODUCTIONS';

  // Check user status whenever modal opens or itemType changes
  useEffect(() => {
    if (isOpen && currentUser && userToken) {
      checkCurrentStatus();
    }
  }, [isOpen, currentUser, userToken, itemType]);

  const checkCurrentStatus = async () => {
    if (!userToken) return;
    setIsCheckingStatus(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/payment/my-status', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        const hasAccess = isScript ? data.hasPaidScript : data.hasPaidBook;
        const currentPending = isScript ? data.latestScriptPayment : (data.latestBookPayment || data.latestPayment);

        if (hasAccess) {
          setIsApproved(true);
          if (currentUser) {
            onPaymentSuccess(data.user);
          }
        } else {
          if (currentPending && currentPending.status === 'PENDING_APPROVAL') {
            setPendingPayment(currentPending);
            setIsApproved(false);
            setRejectionReason(null);
          } else if (currentPending && (currentPending.status === 'REJECTED' || currentPending.status === 'REVOKED')) {
            setPendingPayment(null);
            setIsApproved(false);
            setRejectionReason(
              currentPending.status === 'REVOKED'
                ? (currentPending.rejectionReason || `Previous ${isScript ? 'script' : 'book'} access was revoked by Super Admin.`)
                : (currentPending.rejectionReason || 'UTR number could not be matched with bank statements.')
            );
          } else {
            setPendingPayment(null);
            setIsApproved(false);
          }
        }
      }
    } catch (err: any) {
      console.warn('Status check notice:', err);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(officialUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userToken) {
      onOpenAuth();
      return;
    }

    const clean = utrNumber.trim();
    if (!clean) {
      setErrorMsg('Please enter your 12-digit UTR / UPI Reference Number.');
      return;
    }

    if (clean.length < 6) {
      setErrorMsg('Please enter a valid transaction reference / UTR number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/payment/submit-utr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          utrNumber: clean,
          itemType: isScript ? 'SCRIPT' : 'BOOK',
          userNote: userNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit UTR number.');
      }

      setPendingPayment(data.payment);
      setRejectionReason(null);
      if (data.user) {
        onPaymentSuccess(data.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting UTR number. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#20201E]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-[#FFFDF8] rounded-3xl shadow-2xl border border-[#20201E]/12 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#F2EFE7] border-b border-[#20201E]/8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#20201E] flex items-center justify-center text-[#FFFDF8] shadow-xs">
              {isScript ? (
                <Film className="w-5 h-5 text-[#B49A68]" />
              ) : (
                <QrCode className="w-5 h-5 text-[#B49A68]" />
              )}
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#20201E]">
                {isScript ? 'Unlock Full Screenplay' : 'UPI QR Code & UTR Verification'}
              </h3>
              <span className="text-[10px] tracking-widest text-[#6F6A60] uppercase block">
                Official EYE WINN Payment Portal • {isScript ? 'Screenplay License' : 'Book License'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6F6A60] hover:text-[#20201E] hover:bg-[#EAE4D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          {/* Guest Warning */}
          {!currentUser && (
            <div className="p-3.5 rounded-xl bg-[#B98268]/15 border border-[#B98268]/30 flex items-center justify-between text-xs text-[#20201E]">
              <span>Sign in required to verify and link {isScript ? 'script' : 'book'} purchase</span>
              <button
                onClick={onOpenAuth}
                className="font-bold underline text-[#20201E] tracking-wider"
              >
                SIGN IN NOW
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STATE 1: ALREADY APPROVED & UNLOCKED */}
          {isApproved ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <span className="text-[11px] font-bold tracking-[0.25em] text-emerald-700 uppercase block">
                PAYMENT VERIFIED & APPROVED
              </span>

              <h3 className="font-serif text-2xl font-bold text-[#20201E]">
                {isScript ? 'Full Script Access Granted!' : 'Full Book Access Granted!'}
              </h3>

              <p className="text-sm text-[#504C44] leading-relaxed max-w-md mx-auto">
                The Client / Super Admin has verified your transaction. Full access to {effectiveTitle} has been activated for{' '}
                <span className="font-semibold text-[#20201E]">{currentUser?.email}</span>.
              </p>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#6E7560] transition-colors shadow-md flex items-center justify-center gap-2 mx-auto"
                >
                  <span>START READING COMPLETE EDITION NOW</span>
                  <ArrowRight className="w-4 h-4 text-[#B49A68]" />
                </button>
              </div>
            </div>
          ) : pendingPayment ? (
            /* STATE 2: PENDING SUPER ADMIN APPROVAL */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto animate-pulse">
                <Clock className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold tracking-[0.25em] text-amber-800 uppercase block mb-1">
                  PENDING SUPER ADMIN VERIFICATION
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#20201E]">
                  UTR Number Submitted
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F6F0] border border-[#20201E]/10 max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6F6A60]">Item:</span>
                  <span className="font-semibold text-[#20201E]">{isScript ? 'Screenplay' : 'Official Book'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6F6A60]">UTR / Ref Number:</span>
                  <span className="font-mono font-bold text-[#20201E] bg-white px-2 py-0.5 rounded border border-[#20201E]/10">
                    {pendingPayment.utrNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6F6A60]">Amount:</span>
                  <span className="font-semibold text-[#20201E]">₹{pendingPayment.amount}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6F6A60]">User:</span>
                  <span className="text-[#20201E]">{currentUser?.email}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6F6A60]">Submitted:</span>
                  <span className="text-[#20201E]">
                    {pendingPayment.submittedAt ? new Date(pendingPayment.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#504C44] leading-relaxed max-w-md mx-auto">
                The Client will cross-verify this UTR number with the bank statement in the Super Admin Portal and give you permission to read.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={checkCurrentStatus}
                  disabled={isCheckingStatus}
                  className="px-6 py-3 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-wider uppercase hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                  <span>{isCheckingStatus ? 'Checking...' : 'Check Approval Status'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-[#EAE4D8] text-[#20201E] text-xs font-semibold tracking-wider uppercase hover:bg-[#DDD6C8] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* STATE 3: PAYMENT FORM WITH QR CODE & UTR INPUT */
            <div className="space-y-6">
              {/* Product Info & Price Banner */}
              <div className="p-4 rounded-2xl bg-[#F2EFE7] border border-[#20201E]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#B49A68] uppercase block">
                    {isScript ? 'FEATURE FILM SCREENPLAY' : 'COMPLETE EDITION ACCESS'}
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#20201E]">
                    {effectiveTitle}
                  </h4>
                  <p className="text-xs text-[#504C44]">
                    {isScript ? 'Unlock full screenplay (Scenes 1–8) • Complete dialogue & direction' : 'Unlock full book (Pages 1–8) • Unrestricted reading'}
                  </p>
                </div>
                <div className="text-right sm:text-right shrink-0">
                  <span className="text-[10px] text-[#6F6A60] block uppercase">Fixed Fee</span>
                  <span className="text-2xl font-serif font-bold text-[#20201E]">
                    ₹{effectivePrice}
                  </span>
                </div>
              </div>

              {/* Step 1: Scan QR Code */}
              <div className="border border-[#20201E]/10 rounded-2xl p-5 bg-white space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#20201E] text-white text-xs flex items-center justify-center font-bold">1</span>
                  <h5 className="font-bold text-sm text-[#20201E]">Scan Client QR Code or Pay via UPI</h5>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center pt-1">
                  {/* Dynamic UPI QR Code */}
                  <div className="p-3 bg-white border-2 border-[#20201E]/15 rounded-2xl shadow-sm text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=${officialUpiId}&pn=${encodeURIComponent(payeeName)}&am=${effectivePrice}&cu=INR&tn=${encodeURIComponent(isScript ? 'Script License' : 'Book License')}`)}`}
                      alt="Client UPI QR Code"
                      className="w-40 h-40 object-contain mx-auto rounded-lg"
                    />
                    <span className="text-[10px] text-[#6F6A60] font-medium block mt-2">
                      Scan with GPay / PhonePe / Paytm
                    </span>
                  </div>

                  {/* UPI ID Copy Details */}
                  <div className="space-y-3 text-left w-full sm:w-auto">
                    <div>
                      <span className="text-[10px] text-[#6F6A60] uppercase tracking-wider block mb-1">
                        Client UPI ID
                      </span>
                      <div className="flex items-center gap-2 bg-[#F8F6F0] px-3 py-2 rounded-xl border border-[#20201E]/10">
                        <span className="font-mono text-xs font-bold text-[#20201E] select-all">
                          {officialUpiId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1 rounded-md hover:bg-white text-[#6F6A60] transition-colors cursor-pointer"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#6F6A60] uppercase tracking-wider block">Payee Name</span>
                      <span className="text-xs font-semibold text-[#20201E]">{payeeName}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#6F6A60] uppercase tracking-wider block">Amount to Pay</span>
                      <span className="text-sm font-bold text-[#20201E]">₹{effectivePrice} (One-Time)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Enter UTR Number */}
              <form onSubmit={handleSubmitUtr} className="border border-[#20201E]/10 rounded-2xl p-5 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#B98268] text-white text-xs flex items-center justify-center font-bold">2</span>
                    <h5 className="font-bold text-sm text-[#20201E]">Enter 12-Digit UTR / Transaction Number</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUtrHelp(!showUtrHelp)}
                    className="text-[11px] text-[#B98268] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Where to find UTR?</span>
                  </button>
                </div>

                {showUtrHelp && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-[#504C44] space-y-1">
                    <p className="font-semibold text-[#20201E]">Where to find your UTR Number:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      <li><strong>Google Pay:</strong> Tap transaction → "UPI transaction ID" (12 digits)</li>
                      <li><strong>PhonePe:</strong> Tap transaction history → "UTR" number</li>
                      <li><strong>Paytm:</strong> Tap payment details → "UPI Ref No"</li>
                      <li><strong>Bank Netbanking:</strong> 12-digit IMPS/UPI reference code in SMS or receipt</li>
                    </ul>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#20201E] mb-1">
                      12-Digit UTR / UPI Reference Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 426719823412"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#20201E]/20 bg-[#F8F6F0] text-sm font-mono tracking-wider focus:outline-none focus:border-[#20201E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6F6A60] mb-1">
                      Optional Note / App Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Paid ₹499 from PhonePe under name Rohit"
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-[#20201E]/20 bg-[#F8F6F0] text-xs focus:outline-none focus:border-[#20201E]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-black transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#B49A68]" />
                      <span>SUBMITTING UTR FOR VERIFICATION...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#B49A68]" />
                      <span>SUBMIT UTR NUMBER TO CLIENT</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#6F6A60] text-center">
                  After submission, the Client will verify your UTR and grant full {isScript ? 'script' : 'book'} reading permission.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default RazorpayModal;
