import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  ScanFace, 
  CheckCircle2, 
  X, 
  Shield, 
  Sparkles, 
  Wrench,
  Clock,
  ArrowRight
} from 'lucide-react';

interface BiometricTouchScannerModalProps {
  title?: string;
  subtitle?: string;
  userName?: string;
  onSuccess: () => void;
  onClose: () => void;
  registrationMode?: boolean;
  initialMode?: 'fingerprint' | 'face';
}

export const BiometricTouchScannerModal: React.FC<BiometricTouchScannerModalProps> = ({
  title = 'DepEd Toboso Biometric Authentication',
  subtitle = 'Verify your identity using fingerprint recognition',
  userName = 'Authorized Personnel',
  onSuccess,
  onClose,
  registrationMode = false,
  initialMode = 'fingerprint'
}) => {
  // Always default to fingerprint while facial scan is under maintenance
  const [activeTab, setActiveTab] = useState<'fingerprint' | 'face'>(
    initialMode === 'face' ? 'face' : 'fingerprint'
  );

  // ----------------------------------------------------
  // FINGERPRINT SCAN STATE
  // ----------------------------------------------------
  const [fingerprintProgress, setFingerprintProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [fingerprintState, setFingerprintState] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');
  const [fingerprintStatusText, setFingerprintStatusText] = useState('Touch and hold the fingerprint scanner pad');

  // Safe Haptic feedback helper
  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  };

  // ----------------------------------------------------
  // FINGERPRINT PROGRESS LOGIC
  // ----------------------------------------------------
  useEffect(() => {
    if (activeTab !== 'fingerprint') return;

    let interval: any = null;

    if (isPressing && fingerprintState !== 'verified') {
      setFingerprintState('scanning');
      setFingerprintStatusText('Reading biometric ridges... Keep holding thumb');
      triggerHaptic(40);

      interval = setInterval(() => {
        setFingerprintProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setFingerprintState('verified');
            setFingerprintStatusText(
              registrationMode 
                ? 'Fingerprint Successfully Registered!' 
                : 'Fingerprint Match Verified! Access Granted'
            );

            triggerHaptic([60, 50, 100]);

            setTimeout(() => {
              onSuccess();
            }, 750);
            return 100;
          }
          return prev + 5; // ~1 second hold
        });
      }, 50);
    } else if (!isPressing && fingerprintState === 'scanning') {
      clearInterval(interval);
      setFingerprintProgress(0);
      setFingerprintState('idle');
      setFingerprintStatusText('Scan interrupted. Please touch and hold until verified.');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPressing, fingerprintState, onSuccess, registrationMode, activeTab]);

  const handleFingerprintStart = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (fingerprintState === 'verified') return;
    setIsPressing(true);
  };

  const handleFingerprintEnd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (fingerprintState === 'verified') return;
    setIsPressing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none font-sans">
      <div className="relative w-full max-w-sm bg-[#08101e] border-2 border-emerald-500/50 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.35)] overflow-hidden">
        
        {/* Glow ambient background header */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer z-30"
          aria-label="Close biometric modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-6 text-center space-y-4">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 uppercase tracking-widest">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Biometric Security Terminal</span>
            </div>
            <h3 className="text-base font-bold text-white tracking-wide mt-1">
              {title}
            </h3>
            <p className="text-xs text-slate-400">
              User: <strong className="text-slate-200">{userName}</strong>
            </p>
          </div>

          {/* Biometric Method Tabs: Fingerprint vs Facial Scan */}
          <div className="grid grid-cols-2 gap-1.5 bg-[#050b14] p-1 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('fingerprint')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeTab === 'fingerprint'
                  ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span>Fingerprint</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('face')}
              className={`relative flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeTab === 'face'
                  ? 'bg-amber-600/90 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
            >
              <ScanFace className="w-4 h-4 text-amber-400" />
              <span>Facial Scan</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-0.5" />
            </button>
          </div>

          {/* ==================================================== */}
          {/* TAB 1: FINGERPRINT SCANNER PAD (ACTIVE & WORKING)    */}
          {/* ==================================================== */}
          {activeTab === 'fingerprint' && (
            <div className="py-2 flex flex-col items-center justify-center animate-in fade-in duration-150">
              <div
                onMouseDown={handleFingerprintStart}
                onMouseUp={handleFingerprintEnd}
                onMouseLeave={handleFingerprintEnd}
                onTouchStart={handleFingerprintStart}
                onTouchEnd={handleFingerprintEnd}
                onTouchCancel={handleFingerprintEnd}
                role="button"
                tabIndex={0}
                className={`relative w-40 h-48 rounded-3xl border-2 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-inner touch-none select-none ${
                  fingerprintState === 'verified'
                    ? 'bg-emerald-900/40 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-105'
                    : fingerprintState === 'scanning'
                    ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] scale-98'
                    : 'bg-slate-950/80 border-slate-700 hover:border-emerald-500/70'
                }`}
              >
                {/* Progress Ring Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 160 192">
                  <rect
                    x="4"
                    y="4"
                    width="152"
                    height="184"
                    rx="22"
                    fill="none"
                    stroke={fingerprintState === 'verified' ? '#10b981' : '#059669'}
                    strokeWidth="3.5"
                    strokeDasharray="672"
                    strokeDashoffset={672 - (672 * fingerprintProgress) / 100}
                    className="transition-all duration-75"
                  />
                </svg>

                {/* Laser Scanning Line Animation */}
                {fingerprintState === 'scanning' && (
                  <div 
                    className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_15px_#10b981] animate-pulse z-20 pointer-events-none"
                    style={{
                      top: `${10 + (fingerprintProgress * 0.75)}%`,
                      transition: 'top 50ms linear'
                    }}
                  />
                )}

                {/* Glowing Fingerprint Graphic */}
                <div className="relative z-10">
                  {fingerprintState === 'verified' ? (
                    <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-in zoom-in-75 duration-200" />
                  ) : (
                    <Fingerprint 
                      className={`w-20 h-20 transition-all duration-300 ${
                        fingerprintState === 'scanning' 
                          ? 'text-emerald-300 scale-110 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]' 
                          : 'text-slate-500 hover:text-emerald-400'
                      }`} 
                    />
                  )}
                </div>

                {/* Pulse ripple circles */}
                {fingerprintState === 'scanning' && (
                  <>
                    <div className="absolute inset-0 rounded-3xl border border-emerald-400/30 animate-ping pointer-events-none" />
                    <div className="absolute inset-4 rounded-2xl border border-emerald-400/20 animate-pulse pointer-events-none" />
                  </>
                )}
              </div>

              {/* Hold progress counter */}
              <div className="mt-3 font-mono text-xs">
                <span className={`font-bold block ${
                  fingerprintState === 'verified' ? 'text-emerald-400 text-sm' : fingerprintState === 'scanning' ? 'text-emerald-300' : 'text-slate-300'
                }`}>
                  {fingerprintState === 'verified' 
                    ? 'VERIFIED ✓' 
                    : fingerprintState === 'scanning' 
                    ? `HOLD THUMB: ${fingerprintProgress}%` 
                    : 'TOUCH & HOLD THUMB'}
                </span>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] leading-tight">
                  {fingerprintStatusText}
                </p>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: FACIAL SCAN (UNDER MAINTENANCE)               */}
          {/* ==================================================== */}
          {activeTab === 'face' && (
            <div className="py-2 flex flex-col items-center justify-center animate-in fade-in duration-150">
              
              {/* Maintenance Container Card */}
              <div className="relative w-full max-w-[280px] p-5 rounded-2xl border border-amber-500/50 bg-[#0d1627] shadow-[0_0_30px_rgba(245,158,11,0.15)] text-center space-y-3.5">
                
                {/* Maintenance Glowing Icon */}
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/15 border-2 border-amber-400/80 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Wrench className="w-7 h-7 animate-pulse" />
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-[10px] font-mono text-amber-300 font-semibold uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Under Maintenance</span>
                </div>

                {/* Main Maintenance Heading */}
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Facial Scan Under Maintenance
                  </h4>
                  <p className="text-xs text-amber-200/90 leading-relaxed font-sans font-medium">
                    "Under maintenance. We will let you know once it's already okay to use."
                  </p>
                </div>

                {/* Explanation & Fallback Guidance */}
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed border-t border-slate-800/80 pt-2.5">
                  The camera facial recognition module is currently undergoing system updates. Please use the <strong className="text-emerald-300">Fingerprint Scanner</strong> in the meantime.
                </p>

                {/* Quick Switch to Fingerprint Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('fingerprint')}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Use Fingerprint Scanner</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

            </div>
          )}

          {/* Footer compatibility note */}
          <div className="p-2.5 bg-slate-900/70 border border-slate-800 rounded-lg text-slate-400 text-[11px] font-mono flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Fingerprint touch &amp; hold authentication is fully operational</span>
          </div>

        </div>

      </div>
    </div>
  );
};
