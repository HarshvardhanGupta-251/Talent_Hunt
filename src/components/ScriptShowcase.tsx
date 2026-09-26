import React from 'react';
import { ScriptMeta } from '../types.js';
import { BookOpen, Check, QrCode } from 'lucide-react';

interface ScriptShowcaseProps {
  scriptMeta: ScriptMeta;
  hasPaidScriptAccess: boolean;
  isPaymentPending?: boolean;
  onOpenPreview: () => void;
  onUnlockScript: () => void;
}

export const ScriptShowcase: React.FC<ScriptShowcaseProps> = ({
  scriptMeta,
  hasPaidScriptAccess,
  isPaymentPending = false,
  onOpenPreview,
  onUnlockScript,
}) => {
  return (
    <section id="script" className="py-8 sm:py-14 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Left Column: Script Binder Graphic */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="w-full h-full p-6 sm:p-8 rounded-3xl glass-card shadow-xl border border-[#20201E]/10 bg-white flex flex-col justify-between">
              {/* Binder Cover */}
              <div className="rounded-2xl bg-[#FAF8F5] border border-[#20201E]/15 p-6 flex-1 flex flex-col justify-between min-h-[360px]">
                <div className="border-b border-[#20201E]/10 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-[#B98268] uppercase font-bold">
                      FEATURE SCREENPLAY
                    </span>
                    <span className="text-[10px] font-mono text-[#6F6A60]">
                      SCENES 1–{scriptMeta.totalPages}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#20201E] mt-2">
                    {scriptMeta.title}
                  </h3>
                  <p className="text-xs text-[#6F6A60] mt-1">
                    Written by {scriptMeta.author}
                  </p>
                </div>

                {/* Excerpt */}
                <div className="my-4 p-4 rounded-xl bg-white border border-[#20201E]/10 font-mono text-xs text-[#20201E] space-y-2 select-none shadow-2xs">
                  <p className="text-[#B98268] font-bold text-[11px]">EXT. VILLAGE GOVERNMENT SCHOOL - MORNING</p>
                  <p className="text-[#504C44] text-[11px] italic">
                    Morning mist hangs low over golden mustard fields. Sunlight strikes the cracked chalkboard in the school veranda.
                  </p>
                  <div className="pt-1">
                    <p className="font-bold text-[11px]">MASTER BEERBHAN</p>
                    <p className="text-[11px] text-[#504C44]">
                      "Rote learning teaches answers. Observation teaches thinking. Today we learn in the fields."
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#20201E]/10 flex items-center justify-between text-xs text-[#6F6A60]">
                  <span>8 Total Scenes</span>
                  <span className="text-[#B98268] font-semibold">First 3 Scenes Free</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-5 text-center">
                {hasPaidScriptAccess ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase">
                    <Check className="w-3.5 h-3.5" /> Full Access Granted
                  </span>
                ) : isPaymentPending ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wider uppercase">
                    UTR Pending Verification
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-stone-100 text-[#504C44] text-xs font-semibold tracking-wider uppercase">
                    Scenes 1 to 3 Free Preview
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Information, Access Workflow & Action */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between h-full space-y-5">
              <div>
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#B98268] uppercase block mb-1">
                  ABOUT THE SCREENPLAY
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#20201E]">
                  How to Access the Script
                </h3>
              </div>

              {/* 3 Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#20201E]/10">
                  <span className="text-[10px] text-[#6F6A60] uppercase block">Free Access</span>
                  <span className="font-serif text-lg font-bold text-[#20201E]">First 3 Scenes</span>
                  <span className="text-[11px] text-[#504C44] block mt-0.5">Read immediately without paying</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#20201E]/10">
                  <span className="text-[10px] text-[#6F6A60] uppercase block">Full Screenplay</span>
                  <span className="font-serif text-lg font-bold text-[#20201E]">8 Complete Scenes</span>
                  <span className="text-[11px] text-[#504C44] block mt-0.5">₹{scriptMeta.priceINR} One-Time Fee</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#20201E]/10">
                  <span className="text-[10px] text-[#6F6A60] uppercase block">Verification</span>
                  <span className="font-serif text-lg font-bold text-[#20201E]">Client UTR Approval</span>
                  <span className="text-[11px] text-[#504C44] block mt-0.5">Verified in Super Admin</span>
                </div>
              </div>

              {/* Step by step */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#20201E]/10 space-y-2 text-xs text-[#504C44]">
                <h4 className="font-bold text-[#20201E] uppercase tracking-wider text-[11px]">
                  Procedure for models and readers:
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                  <li><strong>Read first 3 pages:</strong> Models and readers can read scenes 1, 2, and 3 freely.</li>
                  <li><strong>Pay via QR code:</strong> To read further pages, click below to scan the Client QR code.</li>
                  <li><strong>Submit UTR number:</strong> Enter the 12-digit UTR reference number from your payment app.</li>
                  <li><strong>Client verification:</strong> The Client verifies the payment in the Super Admin portal and unlocks your access.</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onOpenPreview}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-white border border-[#20201E]/20 text-[#20201E] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#F2EFE7] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-[#B98268]" />
                  <span>READ FREE PREVIEW (SCENES 1–3)</span>
                </button>

                {!hasPaidScriptAccess ? (
                  <button
                    onClick={onUnlockScript}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-[#20201E] text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <QrCode className="w-4 h-4 text-[#B49A68]" />
                    <span>{isPaymentPending ? 'CHECK UTR STATUS' : `PAY ₹${scriptMeta.priceINR} & SUBMIT UTR`}</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenPreview}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-700 text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>OPEN COMPLETE SCRIPT</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScriptShowcase;
