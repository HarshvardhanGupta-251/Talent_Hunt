import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BookMeta, User, PaymentRecord } from '../types.js';
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
  Smartphone,
  ExternalLink
} from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookMeta: BookMeta;
  currentUser: User | null;
  userToken?: string;
  onPaymentSuccess: (updatedUser: User) => void;
  onOpenAuth: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  bookMeta,
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

  const officialUpiId = 'eyewinnproductions@icici';
  const payeeName = 'EYE WINN PRODUCTIONS';

  // Check user status whenever modal opens
  useEffect(() => {
    if (isOpen && currentUser && userToken) {
      checkCurrentStatus();
    }
  }, [isOpen, currentUser, userToken]);

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
        if (data.hasPaidBook) {
          setIsApproved(true);
          if (currentUser && !currentUser.hasPaidBook) {
            onPaymentSuccess(data.user);
          }
        } else {
          // If locally user had hasPaidBook true but revoked on server, sync it
          if (currentUser?.hasPaidBook && data.user) {
            onPaymentSuccess(data.user);
          }
          if (data.latestPayment && data.latestPayment.status === 'PENDING_APPROVAL') {
            setPendingPayment(data.latestPayment);
            setIsApproved(false);
            setRejectionReason(null);
          } else if (data.latestPayment && (data.latestPayment.status === 'REJECTED' || data.latestPayment.status === 'REVOKED')) {
            setPendingPayment(null);
            setIsApproved(false);
            setRejectionReason(
              data.latestPayment.status === 'REVOKED'
                ? (data.latestPayment.rejectionReason || 'Previous book access was revoked by Super Admin.')
                : (data.latestPayment.rejectionReason || 'UTR number could not be matched with bank statements.')
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
              <QrCode className="w-5 h-5 text-[#B49A68]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#20201E]">
                UPI QR Code & UTR Verification
              </h3>
              <span className="text-[10px] tracking-widest text-[#6F6A60] uppercase block">
                Official EYE WINN Payment Portal
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
              <span>Sign in required to verify and link book purchase</span>
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
                Full Book Access Granted!
              </h3>

              <p className="text-sm text-[#504C44] leading-relaxed max-w-md mx-auto">
                The Super Admin has verified your transaction. Complete digital document access (Pages 1–8) has been permanently activated for{' '}
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
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>

                <span className="text-[11px] font-bold tracking-[0.25em] text-amber-800 uppercase block">
                  PENDING SUPER ADMIN APPROVAL
                </span>

                <h4 className="font-serif text-xl font-bold text-[#20201E]">
                  UTR Submitted for Verification
                </h4>

                <p className="text-xs text-[#504C44] leading-relaxed max-w-md mx-auto">
                  Your UTR reference has been successfully registered. The Super Admin reviews all incoming transfers against the official bank account statement. Once confirmed, full book access is unlocked immediately.
                </p>

                {/* Details pill */}
                <div className="p-4 rounded-xl bg-white/90 border border-amber-200 text-left text-xs space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6F6A60]">Submitted UTR:</span>
                    <span className="font-mono font-bold text-sm text-[#20201E] bg-[#F2EFE7] px-2 py-0.5 rounded">
                      {pendingPayment.utrNumber || pendingPayment.paymentId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6F6A60]">Amount:</span>
                    <span className="font-serif font-bold text-[#B98268]">₹{pendingPayment.amount} INR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6F6A60]">Submitted Time:</span>
                    <span className="text-[#20201E] font-medium">
                      {new Date(pendingPayment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                      {new Date(pendingPayment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={checkCurrentStatus}
                    disabled={isCheckingStatus}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#6E7560] transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                    <span>{isCheckingStatus ? 'CHECKING BANK STATUS...' : 'CHECK APPROVAL STATUS'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setPendingPayment(null);
                      setUtrNumber(pendingPayment.utrNumber || '');
                    }}
                    className="text-xs text-[#6F6A60] hover:text-[#20201E] underline font-medium py-2"
                  >
                    Edit / Re-submit UTR
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STATE 3: SCAN QR CODE & ENTER UTR FORM */
            <div className="space-y-6">
              {rejectionReason && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1">
                  <span className="text-[10px] font-bold tracking-widest text-red-700 uppercase block">
                    PREVIOUS SUBMISSION REJECTED
                  </span>
                  <p className="text-xs text-red-800 leading-relaxed font-medium">
                    {rejectionReason}
                  </p>
                  <span className="text-[11px] text-red-600 block mt-1">
                    Please verify your transfer details and enter the correct 12-digit UTR from your bank or UPI app.
                  </span>
                </div>
              )}

              {/* Step 1: Scan & Pay Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-5 rounded-2xl bg-[#F8F6F0] border border-[#20201E]/10">
                {/* Visual QR Code Display */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative p-3.5 bg-white rounded-2xl shadow-md border-2 border-[#20201E]/15">
                    {/* High-Contrast Crisp SVG QR Code Representation */}
                    <svg
                      className="w-44 h-44 sm:w-48 sm:h-48"
                      viewBox="0 0 200 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Quiet Zone */}
                      <rect width="200" height="200" fill="#FFFFFF" rx="8" />

                      {/* Top-Left Position Detection Marker */}
                      <rect x="15" y="15" width="45" height="45" rx="4" fill="#20201E" />
                      <rect x="22" y="22" width="31" height="31" rx="2" fill="#FFFFFF" />
                      <rect x="29" y="29" width="17" height="17" rx="2" fill="#20201E" />

                      {/* Top-Right Position Detection Marker */}
                      <rect x="140" y="15" width="45" height="45" rx="4" fill="#20201E" />
                      <rect x="147" y="22" width="31" height="31" rx="2" fill="#FFFFFF" />
                      <rect x="154" y="29" width="17" height="17" rx="2" fill="#20201E" />

                      {/* Bottom-Left Position Detection Marker */}
                      <rect x="15" y="140" width="45" height="45" rx="4" fill="#20201E" />
                      <rect x="22" y="147" width="31" height="31" rx="2" fill="#FFFFFF" />
                      <rect x="29" y="154" width="17" height="17" rx="2" fill="#20201E" />

                      {/* Timing Lines */}
                      <g fill="#20201E">
                        <rect x="68" y="25" width="7" height="7" rx="1" />
                        <rect x="82" y="25" width="7" height="7" rx="1" />
                        <rect x="96" y="25" width="7" height="7" rx="1" />
                        <rect x="110" y="25" width="7" height="7" rx="1" />
                        <rect x="124" y="25" width="7" height="7" rx="1" />

                        <rect x="25" y="68" width="7" height="7" rx="1" />
                        <rect x="25" y="82" width="7" height="7" rx="1" />
                        <rect x="25" y="96" width="7" height="7" rx="1" />
                        <rect x="25" y="110" width="7" height="7" rx="1" />
                        <rect x="25" y="124" width="7" height="7" rx="1" />

                        {/* QR Data Matrix Elements */}
                        <rect x="70" y="48" width="8" height="8" rx="1" />
                        <rect x="85" y="48" width="8" height="8" rx="1" />
                        <rect x="105" y="48" width="8" height="8" rx="1" />
                        <rect x="120" y="48" width="8" height="8" rx="1" />

                        <rect x="48" y="70" width="8" height="8" rx="1" />
                        <rect x="60" y="70" width="8" height="8" rx="1" />
                        <rect x="140" y="70" width="8" height="8" rx="1" />
                        <rect x="155" y="70" width="8" height="8" rx="1" />
                        <rect x="170" y="70" width="8" height="8" rx="1" />

                        <rect x="48" y="90" width="8" height="8" rx="1" />
                        <rect x="135" y="90" width="8" height="8" rx="1" />
                        <rect x="150" y="90" width="8" height="8" rx="1" />
                        <rect x="165" y="90" width="8" height="8" rx="1" />

                        <rect x="52" y="110" width="8" height="8" rx="1" />
                        <rect x="75" y="110" width="8" height="8" rx="1" />
                        <rect x="115" y="110" width="8" height="8" rx="1" />
                        <rect x="145" y="110" width="8" height="8" rx="1" />

                        <rect x="70" y="130" width="8" height="8" rx="1" />
                        <rect x="90" y="130" width="8" height="8" rx="1" />
                        <rect x="110" y="130" width="8" height="8" rx="1" />
                        <rect x="130" y="130" width="8" height="8" rx="1" />

                        <rect x="70" y="150" width="8" height="8" rx="1" />
                        <rect x="95" y="150" width="8" height="8" rx="1" />
                        <rect x="115" y="150" width="8" height="8" rx="1" />
                        <rect x="140" y="150" width="8" height="8" rx="1" />
                        <rect x="160" y="150" width="8" height="8" rx="1" />

                        <rect x="75" y="170" width="8" height="8" rx="1" />
                        <rect x="100" y="170" width="8" height="8" rx="1" />
                        <rect x="125" y="170" width="8" height="8" rx="1" />
                        <rect x="150" y="170" width="8" height="8" rx="1" />
                        <rect x="170" y="170" width="8" height="8" rx="1" />
                      </g>

                      {/* Center Brand Badge */}
                      <rect x="76" y="76" width="48" height="48" rx="8" fill="#FFFDF8" stroke="#B98268" strokeWidth="2" />
                      <text x="100" y="96" fill="#20201E" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                        UPI PAY
                      </text>
                      <text x="100" y="110" fill="#B98268" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                        ₹299
                      </text>
                    </svg>

                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#20201E] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                      SCAN VIA ANY UPI APP
                    </div>
                  </div>

                  <span className="text-[10px] text-[#6F6A60] font-medium mt-4">
                    GPay • PhonePe • Paytm • BHIM • Cred
                  </span>
                </div>

                {/* Payee Info & Copy Section */}
                <div className="space-y-3 text-left">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#B98268] uppercase block">
                      OFFICIAL BENEFICIARY
                    </span>
                    <h4 className="font-serif font-bold text-lg text-[#20201E]">
                      {payeeName}
                    </h4>
                  </div>

                  {/* UPI ID Box with One-Click Copy */}
                  <div>
                    <label className="text-[11px] font-medium text-[#6F6A60] block mb-1">
                      Beneficiary UPI ID:
                    </label>
                    <div className="flex items-center gap-2 bg-white border border-[#20201E]/15 rounded-xl p-2.5">
                      <code className="text-xs font-mono font-bold text-[#20201E] flex-1 truncate">
                        {officialUpiId}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-2.5 py-1 rounded-lg bg-[#20201E] text-white text-[10px] font-semibold tracking-wider uppercase hover:bg-[#6E7560] transition-colors flex items-center gap-1 shrink-0"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>COPY</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Amount Pill */}
                  <div className="p-3 rounded-xl bg-white border border-[#20201E]/10 flex items-center justify-between">
                    <span className="text-xs text-[#6F6A60]">Payable Amount:</span>
                    <span className="font-serif text-xl font-bold text-[#20201E]">
                      ₹{bookMeta.priceINR}.00
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6F6A60] leading-snug">
                    After completing the transfer in your UPI app, locate the <strong>12-digit UTR Number</strong> (UPI Ref No) from the payment receipt and enter it below.
                  </p>
                </div>
              </div>

              {/* Step 2: UTR Number Submission Form */}
              <form onSubmit={handleSubmitUtr} className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold tracking-wider text-[#20201E] uppercase">
                      ENTER 12-DIGIT UTR / REFERENCE NUMBER <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowUtrHelp(!showUtrHelp)}
                      className="text-[11px] text-[#B98268] hover:underline flex items-center gap-1 font-medium"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Where to find UTR?</span>
                    </button>
                  </div>

                  {/* UTR Help Accordion */}
                  {showUtrHelp && (
                    <div className="mb-3 p-3.5 rounded-xl bg-[#F2EFE7] border border-[#20201E]/10 text-xs text-[#504C44] space-y-1.5 animate-in fade-in duration-150">
                      <div className="font-bold text-[#20201E]">Finding your UTR (12-Digit Reference):</div>
                      <div>• <strong>Google Pay:</strong> Open payment receipt &gt; Look for "UPI transaction ID" (e.g. 426719823412).</div>
                      <div>• <strong>PhonePe:</strong> View transaction history &gt; Look for "UTR" or "Transfer Details".</div>
                      <div>• <strong>Paytm:</strong> Click on completed payment &gt; Find "UPI Ref No" under details.</div>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                      placeholder="e.g. 426719823412"
                      maxLength={30}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#FFFDF8] border-2 border-[#20201E]/20 focus:border-[#B98268] focus:ring-0 font-mono text-base tracking-wider text-[#20201E] transition-colors"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#6F6A60]">
                      {utrNumber.length}/12
                    </div>
                  </div>
                </div>

                {/* Optional note */}
                <div>
                  <label className="text-[11px] font-medium text-[#6F6A60] block mb-1">
                    Optional Note (e.g., Sender Name / UPI App used)
                  </label>
                  <input
                    type="text"
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="e.g. Paid via Google Pay from Aarav Sharma account"
                    maxLength={100}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#20201E]/15 text-xs text-[#20201E]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !utrNumber.trim()}
                  className="w-full py-4 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#6E7560] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-[#B49A68]" />
                  <span>
                    {isSubmitting
                      ? 'SUBMITTING UTR FOR APPROVAL...'
                      : 'SUBMIT UTR FOR SUPER ADMIN APPROVAL'}
                  </span>
                </button>
              </form>

              {/* Security Footnote */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#6F6A60]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Super Admin verified • Transactions credited to official EYE WINN account</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default RazorpayModal;
