import React, { useState } from 'react';
import { User, AuditionApplication } from '../types.js';
import { 
  X, 
  Clapperboard, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  FileText, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight,
  Instagram,
  Facebook,
  Video,
  Globe,
  MapPin
} from 'lucide-react';

interface AuditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onApplicationSubmitted: (app: AuditionApplication) => void;
}

export const AuditionModal: React.FC<AuditionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onApplicationSubmitted,
}) => {
  const [formData, setFormData] = useState({
    characterInterestedIn: 'Master Beerbhan',
    fullName: currentUser?.name || '',
    dob: '1995-06-15',
    gender: 'Male',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: 'Flat 402, Green Meadows, Model Town',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    actingExperience: 'Theatre (3 Years)',
    currentProfession: 'Theatre Artist & Voice Actor',
    languages: 'Hindi (Fluent), Haryanvi dialect, English',
    height: "5'9\"",
    instagramUrl: 'https://instagram.com/actor_sample',
    facebookUrl: 'https://facebook.com/actor.sample',
    introVideoUrl: 'https://youtube.com/watch?v=intro-video',
    portfolioUrl: 'https://myactingportfolio.example.com',
    portfolioFileName: 'Actor_Portfolio_CV.pdf',
    previousProjects: 'Independent Hindi plays at Prithvi Theatre, two regional short films.',
    introduction: 'I have read the premise of Master Beerbhan and deeply resonate with his calm intellectual presence and commitment to rural education. I would be honored to audition.',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    demoReelUrl: 'https://vimeo.com/eyewinn-demo-reel',
    videoAuditionUrl: '',
    consent: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<AuditionApplication | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.address || !formData.city || !formData.introduction) {
      setErrorMsg('Please fill in all mandatory fields including your address and contact details.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('You must agree to the Audition Terms and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/audition/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit audition application.');

      setSubmissionSuccess(data.application);
      onApplicationSubmitted(data.application);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please check network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submissionSuccess) {
      navigator.clipboard.writeText(submissionSuccess.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#20201E]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FFFDF8] rounded-3xl shadow-2xl border border-[#20201E]/12 flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 bg-[#F2EFE7] border-b border-[#20201E]/8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#20201E] flex items-center justify-center text-white">
              <Clapperboard className="w-4 h-4 text-[#B49A68]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#20201E]">
                Official Audition Application
              </h3>
              <span className="text-[10px] tracking-widest text-[#6F6A60] uppercase block">
                Feature Film Adaptation Casting & Audition ID Generation
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

        {/* Modal Content / Form */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {submissionSuccess ? (
            /* Application Success Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold tracking-[0.25em] text-[#B98268] uppercase block mb-1">
                  APPLICATION RECEIVED
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#20201E]">
                  Your Audition ID has been Generated
                </h3>
                <p className="mt-2 text-sm text-[#6F6A60] max-w-md mx-auto leading-relaxed">
                  Your audition profile for <span className="font-semibold text-[#20201E]">{submissionSuccess.characterInterestedIn}</span> has been logged into the Client Super Admin casting portal. Keep your Audition ID safe to track your scheduled audition date and time.
                </p>
              </div>

              {/* ID Pill */}
              <div className="p-5 rounded-2xl bg-[#F8F6F0] border border-[#20201E]/10 max-w-md mx-auto text-left">
                <span className="text-[10px] uppercase tracking-wider text-[#6F6A60] font-semibold block mb-1">
                  Your Unique Audition Tracking ID
                </span>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xl font-bold text-[#20201E] tracking-wider">
                    {submissionSuccess.id}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="p-2 rounded-xl bg-[#EAE4D8] hover:bg-[#DDD6C8] text-[#20201E] transition-colors"
                    title="Copy Audition ID"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-left text-xs text-amber-900 leading-relaxed max-w-md mx-auto">
                <p className="font-bold mb-1">Next Steps:</p>
                <p>1. The casting director will review your profile, video reels, and CV.</p>
                <p>2. Use the "Audition Status Tracker" button in the menu or on the Audition page to check on which date and time your audition is scheduled.</p>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-[#20201E] text-white text-xs font-semibold tracking-wider uppercase hover:bg-black transition-colors"
              >
                Close & Return
              </button>
            </div>
          ) : (
            /* Audition Submission Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Section 1: Character Choice */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#20201E] block">
                  1. Role / Character of Interest *
                </span>
                <select
                  value={formData.characterInterestedIn}
                  onChange={(e) => setFormData({ ...formData, characterInterestedIn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E] focus:outline-none focus:border-[#B98268]"
                >
                  <option value="Master Beerbhan">Master Beerbhan (Lead Protagonist, Age 45-55)</option>
                  <option value="Santosh (Farmer)">Santosh (Farmer Elder Brother, Age 35-45)</option>
                  <option value="Nafe (Younger Brother)">Nafe (Younger Farmer Brother, Age 28-35)</option>
                  <option value="Village Elders">Village Elders & Chopal Members</option>
                  <option value="Villagers & Ensemble">Villagers / Tea Shop Regulars / Students</option>
                  <option value="Open to Any Suitable Role">Open to Any Suitable Role</option>
                </select>
              </div>

              {/* Section 2: Personal & Contact Information */}
              <div className="space-y-4 pt-2 border-t border-[#20201E]/8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#20201E] block">
                  2. Personal & Contact Details *
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="model@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="text-xs font-medium text-[#6F6A60] block mb-1">
                    Street Address / Residential Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House/Flat No., Building Name, Street, Landmark"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1">Country *</label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Physical & Acting Profile */}
              <div className="space-y-4 pt-2 border-t border-[#20201E]/8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#20201E] block">
                  3. Physical & Acting Profile
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1">Experience Level</label>
                    <input
                      type="text"
                      value={formData.actingExperience}
                      onChange={(e) => setFormData({ ...formData, actingExperience: e.target.value })}
                      placeholder="Fresher / Theatre (3 Yrs) / Screen"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1">Languages Comfortable With</label>
                    <input
                      type="text"
                      value={formData.languages}
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                      placeholder="Hindi, Haryanvi, English, etc."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1">Height</label>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="e.g. 5'10&quot; or 178 cm"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#6F6A60] block mb-1">Current Profession</label>
                  <input
                    type="text"
                    value={formData.currentProfession}
                    onChange={(e) => setFormData({ ...formData, currentProfession: e.target.value })}
                    placeholder="e.g. Theatre Artist / Voice Actor / Student"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#6F6A60] block mb-1">
                    Introduction & Candidate Statement *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.introduction}
                    onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                    placeholder="Describe your background and what you bring to this village story..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E] resize-none"
                  />
                </div>
              </div>

              {/* Section 4: Social Media, Media & Portfolio */}
              <div className="space-y-4 pt-2 border-t border-[#20201E]/8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#20201E] block">
                  4. Social Media Handles & Media Links
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                      <span>Instagram Handle / Profile</span>
                    </label>
                    <input
                      type="text"
                      value={formData.instagramUrl}
                      onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                      placeholder="@username or https://instagram.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1 flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>Facebook Profile</span>
                    </label>
                    <input
                      type="text"
                      value={formData.facebookUrl}
                      onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-purple-600" />
                      <span>Intro Video / Audition Tape URL</span>
                    </label>
                    <input
                      type="url"
                      value={formData.introVideoUrl}
                      onChange={(e) => setFormData({ ...formData, introVideoUrl: e.target.value })}
                      placeholder="YouTube / Vimeo / Google Drive Link"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#6F6A60] block mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Portfolio / Website Link</span>
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-[#20201E]/12 text-sm text-[#20201E]"
                    />
                  </div>
                </div>

                {/* Portfolio CV PDF Attachment */}
                <div>
                  <label className="text-xs font-medium text-[#6F6A60] block mb-1">
                    Portfolio / CV Document (Portfolio_CV.pdf)
                  </label>
                  <div className="p-4 rounded-xl bg-[#F8F6F0] border border-dashed border-[#20201E]/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#B98268]" />
                      <div>
                        <span className="text-xs font-semibold text-[#20201E] block">
                          {formData.portfolioFileName}
                        </span>
                        <span className="text-[10px] text-[#6F6A60]">
                          Attached CV file (Viewable by Client in Super Admin Portal)
                        </span>
                      </div>
                    </div>
                    <label className="cursor-pointer text-xs font-semibold text-[#20201E] px-3 py-1.5 rounded-lg bg-[#FFFDF8] border border-[#20201E]/15 hover:bg-[#EAE4D8] transition-colors">
                      Choose PDF
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, portfolioFileName: file.name });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 5: Consent */}
              <div className="pt-2 border-t border-[#20201E]/8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-[#20201E] focus:ring-0"
                  />
                  <span className="text-xs text-[#6F6A60] leading-relaxed">
                    I confirm that the information provided is accurate and authentic. I agree to the{' '}
                    <span className="underline text-[#20201E]">Audition Terms</span> and{' '}
                    <span className="underline text-[#20201E]">Privacy Policy</span> of EYE WINN.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#20201E] text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-black transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Clapperboard className="w-4 h-4 text-[#B49A68]" />
                <span>{isSubmitting ? 'GENERATING AUDITION ID & SUBMITTING...' : 'SUBMIT APPLICATION & GET AUDITION ID'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
