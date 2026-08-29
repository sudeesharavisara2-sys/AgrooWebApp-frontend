import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Mail,
  KeyRound,
  Sprout,
  RefreshCw,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const VerifyOtp: React.FC = () => {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { email?: string } };
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Timer state (විනාඩි 2ක ටයිමර් එකක් - තත්පර 120)
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifyOtp({ email, otpCode });
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError(null);
    setInfo(null);
    try {
      const res = await authApi.resendOtp({ email });
      
      // Backend එකෙන් එන message එකෙන් "New OTP" හෝ "OTP" කොටස ඉවත් කර පණිවිඩය පමණක් ලබා ගැනීම
      const rawMessage = res.message || 'OTP resent successfully.';
      const cleanMessage = rawMessage.split(/new otp/i)[0].trim();

      setInfo(cleanMessage || 'OTP resent successfully.');
      setTimeLeft(120); // Reset timer to 2 minutes
      setCanResend(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-emerald-950 p-4 lg:p-8">
      
      {/* =========================================================
          SINGLE BACKGROUND IMAGE WITH DARK OVERLAY
          ========================================================= */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=85')` 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-zinc-950/85 backdrop-blur-[2px]" />

      {/* =========================================================
          MAIN CONTAINER: Single Card Split Layout
          ========================================================= */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-emerald-950/30 shadow-2xl backdrop-blur-xl lg:flex-row">
        
        {/* LEFT PROMOTIONAL PANEL */}
        <div className="flex flex-col justify-between p-8 lg:w-5/12 lg:p-12">
          {/* Agroo Logo & Link */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg">
              <Sprout size={22} />
            </div>
            <span className="text-xl font-black tracking-wider">Agroo</span>
          </Link>

          <div className="my-auto py-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-xl">
              <ShieldCheck size={14} />
              Secure Account Verification
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
              Protect your farm community
            </h1>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-emerald-100/80">
              Please enter the 6-digit verification code sent to your email to complete your registration and access Agroo.
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-emerald-200/70">Already verified?</p>
            <Link
              to="/login"
              className="group relative inline-flex w-full items-center justify-between overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-600/20 via-emerald-500/30 to-teal-500/20 px-6 py-3.5 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-emerald-400/60 hover:shadow-emerald-500/20 hover:shadow-xl active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Sign in
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/30 text-white transition-all duration-300 group-hover:bg-emerald-400 group-hover:translate-x-1">
                <ArrowRight size={15} />
              </div>
            </Link>
          </div>
        </div>

        {/* RIGHT OTP FORM PANEL */}
        <div className="w-full bg-black/40 p-6 backdrop-blur-2xl lg:w-7/12 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10">
          
          <div className="mb-6 text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Verify your email
            </h2>
            <p className="mt-0.5 text-xs font-medium text-emerald-200/70">
              Enter the verification code we sent to your email address.
            </p>
          </div>

          <ErrorAlert message={error} />
          {info && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-950/60 px-4 py-3 text-xs font-medium text-emerald-300 backdrop-blur-md">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-[11px] font-bold text-emerald-100">
                Email
              </label>
              <div className="group relative">
                <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block h-10 w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-3 text-xs font-medium text-white placeholder-emerald-200/40 transition-all focus:border-emerald-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>
            </div>

            {/* OTP Code Input */}
            <div className="space-y-1">
              <label htmlFor="otpCode" className="text-[11px] font-bold text-emerald-100">
                OTP Code
              </label>
              <div className="group relative">
                <KeyRound size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
                <input
                  id="otpCode"
                  type="text"
                  required
                  maxLength={6}
                  minLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="block h-11 w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-3 text-sm font-bold tracking-[0.3em] text-white placeholder-emerald-200/40 transition-all focus:border-emerald-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 px-4 text-xs font-bold text-emerald-950 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:from-emerald-400 hover:to-teal-300 hover:shadow-emerald-400/40 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-400/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-950/30 border-t-emerald-950" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Account</span>
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </>
                )}
              </button>
            </div>

            {/* Resend OTP with Timer */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-emerald-200/70">
                Didn't receive the code?
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={`inline-flex items-center gap-1.5 font-semibold transition-colors ${
                  canResend
                    ? 'text-emerald-300 hover:text-emerald-200 hover:underline cursor-pointer'
                    : 'text-emerald-400/40 cursor-not-allowed'
                }`}
              >
                <RefreshCw size={13} className={!canResend ? 'animate-spin' : ''} />
                {canResend ? 'Resend OTP' : `Resend in ${formatTime(timeLeft)}`}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;