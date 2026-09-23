import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BookMeta, User } from '../types.js';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
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
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  if (!isOpen) return null;

  const handleProcessPayment = async () => {
    if (!currentUser || !userToken) {
      onOpenAuth();
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway.');
      }

      // 2. Simulate Razorpay payment confirmation
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 3. Server-side verification (CRITICAL: NEVER TRUST FRONTEND ONLY)
      const verifyRes = await fetch('/api/payment/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentId: `pay_rzp_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          signature: 'simulated_hmac_sha256_valid_sig',
          simulationMode: true,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Payment verification failed.');
      }

      // 4. Trigger celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B98268', '#B49A68', '#6E7560', '#20201E'],
      });

      setSuccessData(verifyData);
      onPaymentSuccess(verifyData.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing error.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20201E]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FFFDF8] rounded-3xl shadow-2xl border border-[#20201E]/12 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#F2EFE7] border-b border-[#20201E]/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#20201E] flex items-center justify-center text-[#FFFDF8]">
              <Lock className="w-4 h-4 text-[#B49A68]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#20201E]">
                Razorpay Checkout
              </h3>
              <span className="text-[10px] tracking-widest text-[#6F6A60] uppercase block">
                EYE WINN Official Gateway
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

        {/* Content */}
        <div className="p-6 sm:p-8">
          {successData ? (
            /* Successful Payment Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#20201E]">
                Payment Verified!
              </h3>

              <p className="text-sm text-[#6F6A60] leading-relaxed">
                Complete digital book access has been permanently unlocked for{' '}
                <span className="font-semibold text-[#20201E]">{currentUser?.email}</span>.
              </p>

              <div className="p-4 rounded-xl bg-[#F8F6F0] border border-[#20201E]/8 text-left text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#6F6A60]">Order ID:</span>
                  <span className="text-[#20201E] font-semibold">{successData.payment?.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F6A60]">Payment ID:</span>
                  <span className="text-[#20201E] font-semibold">{successData.payment?.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F6A60]">Amount Paid:</span>
                  <span className="text-[#B98268] font-bold">₹{successData.payment?.amount} INR</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#6E7560] transition-colors shadow-md"
              >
                START READING NOW
              </button>
            </div>
          ) : (
            /* Order Summary and Payment Options */
            <div className="space-y-6">
              {!currentUser && (
                <div className="p-3.5 rounded-xl bg-[#B98268]/15 border border-[#B98268]/30 flex items-center justify-between text-xs text-[#20201E]">
                  <span>Sign in required to link purchase</span>
                  <button
                    onClick={onOpenAuth}
                    className="font-bold underline text-[#20201E] tracking-wider"
                  >
                    SIGN IN NOW
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-[#F8F6F0] border border-[#20201E]/8">
                <span className="text-[10px] font-bold tracking-widest text-[#6F6A60] uppercase block mb-1">
                  ORDER DETAILS
                </span>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-serif font-bold text-base text-[#20201E]">
                    {bookMeta.title}
                  </h4>
                  <span className="font-serif text-xl font-bold text-[#20201E]">
                    ₹{bookMeta.priceINR}
                  </span>
                </div>
                <p className="text-xs text-[#6F6A60] mt-1">
                  Complete 184-Page Digital Edition • Lifetime Cloud Reader Access
                </p>
              </div>

              {/* Payment Method Selector */}
              <div>
                <span className="text-xs font-bold tracking-wider text-[#6F6A60] uppercase block mb-3">
                  SELECT PAYMENT METHOD
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      selectedMethod === 'upi'
                        ? 'border-[#20201E] bg-[#F2EFE7] text-[#20201E] font-bold'
                        : 'border-[#20201E]/10 bg-[#FFFDF8] text-[#6F6A60] hover:bg-[#F8F6F0]'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#B98268]" />
                    <span className="text-[11px]">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      selectedMethod === 'card'
                        ? 'border-[#20201E] bg-[#F2EFE7] text-[#20201E] font-bold'
                        : 'border-[#20201E]/10 bg-[#FFFDF8] text-[#6F6A60] hover:bg-[#F8F6F0]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#6E7560]" />
                    <span className="text-[11px]">Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      selectedMethod === 'netbanking'
                        ? 'border-[#20201E] bg-[#F2EFE7] text-[#20201E] font-bold'
                        : 'border-[#20201E]/10 bg-[#FFFDF8] text-[#6F6A60] hover:bg-[#F8F6F0]'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#B49A68]" />
                    <span className="text-[11px]">Netbanking</span>
                  </button>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#6E7560] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-[#B49A68]" />
                <span>
                  {isProcessing
                    ? 'VERIFYING WITH RAZORPAY...'
                    : `PAY ₹${bookMeta.priceINR} VIA RAZORPAY`}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#6F6A60]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted • Direct Server-Side Verification</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
