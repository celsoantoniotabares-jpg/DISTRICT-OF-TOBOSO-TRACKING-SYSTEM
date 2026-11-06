import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, LogOut, ArrowRight, ShieldCheck, Fingerprint, ScanFace } from 'lucide-react';
import { DistrictSeal } from './DistrictSeal';
import { BiometricTouchScannerModal } from './BiometricTouchScannerModal';

interface AccessGateProps {
  onUnlock?: () => void;
  isUnlocked?: boolean;
  onLock?: () => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({ 
  onUnlock, 
  isUnlocked = false, 
  onLock 
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showTouchScanner, setShowTouchScanner] = useState(false);
  const [hasLoggedInOnce, setHasLoggedInOnce] = useState<boolean>(() => {
    try {
      return localStorage.getItem('deped_toboso_district_logged_in_once') === 'true';
    } catch {
      return false;
    }
  });

  const canUseBiometrics = hasLoggedInOnce;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter the district security password.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsVerifying(false);
      const input = password.trim().toUpperCase();
      if (input === 'ASENSOTOBOSO') {
        try {
          localStorage.setItem('deped_toboso_district_logged_in_once', 'true');
          setHasLoggedInOnce(true);
        } catch {
          // ignore
        }
        if (onUnlock) {
          onUnlock();
        }
      } else {
        setErrorMsg('Access Denied: Invalid district password. Please enter the correct password to log in.');
      }
    }, 280);
  };

  const handleBiometricAuth = () => {
    if (!canUseBiometrics) {
      setErrorMsg('First-Time Access: You must log in with the password first. The next time you visit the website, fingerprint and facial scan will be ready to use!');
      return;
    }
    setShowTouchScanner(true);
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col justify-between relative overflow-hidden tech-grid-pattern selection:bg-white selection:text-slate-900 font-sans">
      
      {/* Subtle Ambient Technology Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-blue-700/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[480px] h-[260px] bg-sky-500/5 blur-[120px] pointer-events-none" />

      {/* Top DepEd Governance Breadcrumb Header */}
      <header className="relative z-10 w-full border-b border-slate-800 bg-[#08101e]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-white inline-block shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
            <span className="text-slate-300 font-medium">
              DEPED NIR (NEGROS ISLAND REGION) · SDO NEGROS OCCIDENTAL
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-semibold tracking-wider">
              DISTRICT OF TOBOSO
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SECURE ACCESS PORTAL</span>
          </div>
        </div>
      </header>

      {/* Main Container - Clean Card with NO + signs on edges */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          
          {/* Card with Clean White Accent Line and Clean Sleek Borders */}
          <div className="relative bg-[#0b1426]/95 border border-slate-800 border-t-2 border-t-white shadow-[0_24px_70px_rgba(0,0,0,0.75)] backdrop-blur-sm">
            
            {/* Terminal Header Indicator */}
            <div className="px-6 py-2.5 border-b border-slate-800/80 bg-[#080f1d] flex items-center gap-2 font-mono text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-slate-300 font-semibold uppercase tracking-wider">Authentication Gateway</span>
            </div>

            {/* Portal Identity & Logo */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                {/* Official Dual Logos: District of Toboso & Project RICHARD */}
                <div className="mb-6 flex items-center justify-center gap-5 sm:gap-7">
                  <div className="shrink-0 flex items-center justify-center">
                    <DistrictSeal size={124} />
                  </div>
                  <div className="shrink-0 flex items-center justify-center">
                    <img 
                      src="/assets/aistudio/project_richard_logo_ecbcacea.png" 
                      alt="Project RICHARD" 
                      className="h-28 sm:h-32 w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                </div>

                {/* Adjusted Spacing & Refined Professional Typography */}
                <h1 className="text-2xl sm:text-[30px] font-black tracking-wide text-white font-sans leading-tight mb-2">
                  DISTRICT OF TOBOSO
                </h1>

                <h2 className="text-xs sm:text-sm font-bold text-sky-400 tracking-[0.22em] font-mono uppercase mb-3">
                  Data Tracking System
                </h2>

                <p className="text-xs sm:text-[13px] text-slate-300 max-w-md leading-relaxed font-sans">
                  A centralized Data Tracking System where every school can upload its data, and the district office can automatically consolidate, analyze, and monitor the submitted information through one dashboard.
                </p>
              </div>

              {/* Form Divider */}
              <div className="my-6 border-t border-slate-800" />

              {/* State 1: Technology Password Login Form */}
              {!isUnlocked ? (
                <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                  
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label 
                        htmlFor="district-password" 
                        className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5 text-white" />
                        District Access Password
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">AUTH REQUIRED</span>
                    </div>

                    <div className="relative">
                      <input
                        id="district-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        placeholder="Enter password"
                        autoComplete="current-password"
                        autoFocus
                        className="w-full bg-[#060b14] border border-slate-700 rounded-none px-3.5 py-3 text-sm text-white font-mono tracking-wider focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 placeholder:text-slate-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none cursor-pointer p-1 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="p-3 bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-mono flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit Button (DepEd Blue with Clean White Accent & Tech Chevrons) */}
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full mt-2 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white font-mono text-xs font-bold py-3.5 px-4 uppercase tracking-wider flex items-center justify-center gap-2 border border-white/30 transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(29,78,216,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                  >
                    {isVerifying ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Security Key...</span>
                      </span>
                    ) : (
                      <>
                        <span>Verify &amp; Sign In</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>

                  {/* Optional Alternative Divider */}
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="border-t border-slate-800 w-full" />
                    <span className="bg-[#0b1426] px-3 font-mono text-[10px] text-slate-400 uppercase tracking-widest shrink-0">
                      OR BIOMETRICS
                    </span>
                  </div>

                  {/* Biometric Option Button */}
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={handleBiometricAuth}
                      className={`w-full py-3 px-4 flex items-center justify-center gap-2.5 transition-all font-mono text-xs font-semibold cursor-pointer ${
                        canUseBiometrics
                          ? 'bg-[#081224] hover:bg-[#0d1d3a] border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                          : 'bg-[#060c18] border border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                      }`}
                    >
                      <div className={`flex items-center gap-1.5 transition-transform ${canUseBiometrics ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <Fingerprint className="w-5 h-5" />
                        <span className="text-slate-600 text-xs">/</span>
                        <ScanFace className="w-5 h-5" />
                      </div>
                      <span>Sign in with Fingerprint / Facial Scan</span>
                      {!canUseBiometrics && (
                        <Lock className="w-3.5 h-3.5 text-slate-500 ml-1" />
                      )}
                    </button>

                    {!canUseBiometrics ? (
                      <p className="text-[10px] font-mono text-slate-500 text-center">
                        Locked: Log in with the password once first. Biometrics will be ready on your next visit!
                      </p>
                    ) : (
                      <div className="text-[10px] font-mono text-center space-y-0.5">
                        <p className="text-emerald-400/90 flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Biometrics Active: Fingerprint sign-in ready</span>
                        </p>
                        <p className="text-amber-400/80 text-[9px]">
                          (Facial Scan: under maintenance · we will let you know once okay to use)
                        </p>
                      </div>
                    )}
                  </div>

                </form>
              ) : (
                /* State 2: Verified First Page State */
                <div className="max-w-sm mx-auto p-5 bg-[#081224] border border-emerald-500/50 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-mono text-xs text-emerald-400 font-bold uppercase">
                        Access Key Verified
                      </div>
                      <div className="text-sm font-semibold text-white">
                        Authenticated · District of Toboso
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans">
                    Security clearance confirmed. Access granted to District Dashboard.
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setPassword('');
                        setErrorMsg(null);
                        if (onLock) onLock();
                      }}
                      className="px-3 py-1.5 bg-[#0d172a] hover:bg-slate-800 text-white border border-white/30 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Lock / Test Again</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 bg-[#050912] py-3 text-center text-xs font-mono text-slate-500 z-10">
        <div className="max-w-6xl mx-auto px-4">
          Department of Education · NIR (Negros Island Region) · Division of Negros Occidental · District of Toboso
        </div>
      </footer>

      {/* Touch & Hold Biometric Scanner Pad Modal */}
      {showTouchScanner && (
        <BiometricTouchScannerModal
          title="District Biometric Gate"
          subtitle="Place your thumb on the scanner pad"
          userName="District Authorized Personnel"
          onSuccess={() => {
            try {
              localStorage.setItem('deped_toboso_district_logged_in_once', 'true');
              setHasLoggedInOnce(true);
            } catch {
              // ignore
            }
            setShowTouchScanner(false);
            if (onUnlock) onUnlock();
          }}
          onClose={() => setShowTouchScanner(false)}
        />
      )}

    </div>
  );
};
