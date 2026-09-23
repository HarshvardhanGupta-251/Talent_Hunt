import React, { useState } from 'react';
import { AuditionApplication } from '../types.js';
import { 
  X, 
  Search, 
  Clapperboard, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  FileText
} from 'lucide-react';

interface AuditionTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultApplicationId?: string;
}

export const AuditionTrackerModal: React.FC<AuditionTrackerModalProps> = ({
  isOpen,
  onClose,
  defaultApplicationId = '',
}) => {
  const [appId, setAppId] = useState(defaultApplicationId);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [trackedRecord, setTrackedRecord] = useState<AuditionApplication | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId.trim()) {
      setErrorMsg('Please enter your Application ID.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const query = email ? `?email=${encodeURIComponent(email.trim())}` : '';
      const res = await fetch(`/api/audition/track/${encodeURIComponent(appId.trim())}${query}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not find an application with this ID.');
      }

      setTrackedRecord(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error tracking application.');
      setTrackedRecord(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 0;
      case 'UNDER REVIEW': return 1;
      case 'SHORTLISTED': return 2;
      case 'AUDITION SCHEDULED': return 3;
      case 'SELECTED': return 4;
      default: return 1;
    }
  };

  const steps = [
    'Submitted',
    'Under Review',
    'Shortlisted',
    'Audition Scheduled',
    'Final Decision',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#20201E]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FFFDF8] rounded-3xl shadow-2xl border border-[#20201E]/12 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-[#F2EFE7] border-b border-[#20201E]/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#20201E] flex items-center justify-center text-white">
              <Search className="w-4 h-4 text-[#B49A68]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#20201E]">
                Track Audition Application
              </h3>
              <span className="text-[10px] tracking-widest text-[#6F6A60] uppercase block">
                Real-Time Casting Desk Status
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

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                Application ID (e.g. EYW-AUD-2026-000101) *
              </label>
              <input
                type="text"
                required
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="EYW-AUD-2026-000101"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-sm font-mono text-[#20201E] focus:outline-none focus:border-[#20201E]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6F6A60] block mb-1">
                Registered Email (Security Verification) *
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. virendra.theatre@gmail.com"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/15 text-sm text-[#20201E] focus:outline-none focus:border-[#20201E]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#6E7560] disabled:opacity-50"
                >
                  {loading ? 'VERIFYING...' : 'TRACK'}
                </button>
              </div>
            </div>

            {/* Quick prefill buttons for reviewers */}
            <div className="flex items-center gap-2 text-[11px] text-[#6F6A60]">
              <span>Sample Trackings:</span>
              <button
                type="button"
                onClick={() => {
                  setAppId('EYW-AUD-2026-000101');
                  setEmail('virendra.theatre@gmail.com');
                }}
                className="underline hover:text-[#20201E] font-mono"
              >
                000101 (Virendra)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setAppId('EYW-AUD-2026-000102');
                  setEmail('kuldeep.sharma88@gmail.com');
                }}
                className="underline hover:text-[#20201E] font-mono"
              >
                000102 (Kuldeep)
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {trackedRecord && (
            <div className="space-y-6 pt-4 border-t border-[#20201E]/8">
              {/* Record Summary Card */}
              <div className="p-5 rounded-2xl bg-[#F8F6F0] border border-[#20201E]/8 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <span className="font-mono text-xs font-bold text-[#B98268]">
                    {trackedRecord.id}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-[#20201E]">
                    {trackedRecord.fullName}
                  </h4>
                  <p className="text-xs text-[#6F6A60]">
                    Role Applied: <span className="font-semibold text-[#20201E]">{trackedRecord.characterInterestedIn}</span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#20201E]/15 text-xs font-bold tracking-wider text-[#20201E] uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{trackedRecord.status}</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-[#6F6A60] block mb-3">
                  SELECTION PROGRESSION
                </span>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-[#20201E]/10 z-0" />
                  {steps.map((s, idx) => {
                    const currentIdx = getStatusStepIndex(trackedRecord.status);
                    const isPassed = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={idx} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                            isCurrent
                              ? 'bg-[#20201E] text-white border-[#20201E] shadow-xs'
                              : isPassed
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-[#FFFDF8] text-[#6F6A60] border-[#20201E]/15'
                          }`}
                        >
                          {isPassed && !isCurrent ? '✓' : idx + 1}
                        </div>
                        <span className="text-[10px] font-medium text-[#6F6A60] mt-1.5 text-center max-w-[65px] leading-tight hidden sm:block">
                          {s}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specific Scheduled Audition Box if Scheduled */}
              {trackedRecord.status === 'AUDITION SCHEDULED' && trackedRecord.scheduleDetails && (
                <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-[#20201E] space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>Your Audition Has Been Scheduled!</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#6F6A60]" />
                      <span>Date: <strong>{trackedRecord.scheduleDetails.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#6F6A60]" />
                      <span>Time: <strong>{trackedRecord.scheduleDetails.time}</strong></span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-200/60">
                    <span className="font-semibold block mb-1">Venue / Video Link:</span>
                    <p className="text-amber-950 font-mono bg-white/70 p-2 rounded-lg border border-amber-200">
                      {trackedRecord.scheduleDetails.locationOrLink}
                    </p>
                  </div>

                  {trackedRecord.scheduleDetails.sceneInstructions && (
                    <div className="pt-2 border-t border-amber-200/60">
                      <span className="font-semibold block mb-1">Audition Instructions / Scene:</span>
                      <p className="text-[#6F6A60] italic leading-relaxed">
                        “{trackedRecord.scheduleDetails.sceneInstructions}”
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
