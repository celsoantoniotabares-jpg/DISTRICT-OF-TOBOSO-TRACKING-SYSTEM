import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, X, Fingerprint, ScanFace } from 'lucide-react';
import { BiometricTouchScannerModal } from './BiometricTouchScannerModal';

export interface SchoolPasswordTarget {
  name: string;
  officialName?: string;
  schoolId: string;
  barangay?: string;
}

interface SchoolPasswordModalProps {
  school: SchoolPasswordTarget;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const SchoolPasswordModal: React.FC<SchoolPasswordModalProps> = ({
  school,
  onClose,
  onAuthenticated,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showTouchScanner, setShowTouchScanner] = useState(false);
  const [hasLoggedInOnce, setHasLoggedInOnce] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`deped_toboso_school_logged_in_once_${school.schoolId}`) === 'true' ||
             localStorage.getItem('deped_toboso_district_logged_in_once') === 'true';
    } catch {
      return false;
    }
  });

  const canUseBiometrics = hasLoggedInOnce;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter the school security password.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsVerifying(false);
      // As requested by user: Password is "123456"
      if (password.trim() === '123456') {
        try {
          localStorage.setItem(`deped_toboso_school_logged_in_once_${school.schoolId}`, 'true');
          setHasLoggedInOnce(true);
        } catch {
          // ignore
        }
        onAuthenticated();
      } else {
        setErrorMsg('Invalid password. Access restricted to authorized school personnel.');
      }
    }, 200);
  };

  const handleBiometricAuth = () => {
    if (!canUseBiometrics) {
      setErrorMsg('First-Time Access: You must log in with the school password once first. The next time you open this school record, fingerprint and facial scan will be ready to use!');
      return;
    }
    setShowTouchScanner(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#0b1426] border border-slate-800 border-t-2 border-t-white shadow-[0_25px_60px_rgba(0,0,0,0.8)] font-sans">

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-800 bg-[#080f1d] flex items-center justify-between font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold uppercase tracking-wider text-white">School Security Gate</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="text-center mb-5">
            <div className="w-11 h-11 mx-auto mb-3 rounded-full bg-sky-950/60 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Lock className="w-5 h-5" />
            </div>
            <div className="font-mono text-[10px] text-sky-400 uppercase tracking-widest mb-1">
              Protected School Record
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
              {school.name}
            </h3>
            <div className="text-xs font-mono text-slate-400 mt-1">
              DepEd ID: {school.schoolId} · {school.barangay}
            </div>
            <p className="text-xs text-slate-300 mt-2.5 max-w-xs mx-auto leading-relaxed">
              To prevent unauthorized data misencoding, please enter the security password for this school to proceed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                <label htmlFor="school-pwd" className="text-slate-200 font-semibold uppercase tracking-wider">
                  School Passkey
                </label>
                <span className="text-[10px] text-slate-500">AUTHORIZED ACCESS ONLY</span>
              </div>

              <div className="relative">
                <input
                  id="school-pwd"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Enter school security passkey"
                  autoFocus
                  className="w-full bg-[#060b14] border border-slate-700 px-3.5 py-2.5 text-sm text-white font-mono tracking-wider focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40 placeholder:text-slate-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="w-1/2 py-2.5 px-3 bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-white/20"
              >
                {isVerifying ? 'Checking...' : 'Unlock School'}
              </button>
            </div>

            {/* Optional Alternative Divider */}
            <div className="relative my-3 flex items-center justify-center">
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
                className={`w-full py-2.5 px-4 flex items-center justify-center gap-2 transition-all font-mono text-xs font-semibold cursor-pointer ${
                  canUseBiometrics
                    ? 'bg-[#081224] hover:bg-[#0d1d3a] border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:shadow-[0_0_18px_rgba(16,185,129,0.3)]'
                    : 'bg-[#060c18] border border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                }`}
              >
                <div className={`flex items-center gap-1.5 transition-transform ${canUseBiometrics ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <Fingerprint className="w-4 h-4" />
                  <span className="text-slate-600 text-xs">/</span>
                  <ScanFace className="w-4 h-4" />
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
        </div>

      </div>

      {/* Touch & Hold Biometric Scanner Pad Modal */}
      {showTouchScanner && (
        <BiometricTouchScannerModal
          title={`Biometric Gate: ${school.name}`}
          subtitle="Place your thumb on the scanner pad"
          userName={school.officialName || school.name}
          onSuccess={() => {
            try {
              localStorage.setItem(`deped_toboso_school_logged_in_once_${school.schoolId}`, 'true');
              setHasLoggedInOnce(true);
            } catch {
              // ignore
            }
            setShowTouchScanner(false);
            onAuthenticated();
          }}
          onClose={() => setShowTouchScanner(false)}
        />
      )}
    </div>
  );
};
