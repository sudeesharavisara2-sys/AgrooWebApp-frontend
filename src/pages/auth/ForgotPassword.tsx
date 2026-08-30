import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  KeyRound, 
  Mail, 
  ArrowRight, 
  Sprout, 
  ShieldAlert, 
  ArrowLeft 
} from 'lucide-react';

import { authApi } from '../../api/auth';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-emerald-950 p-4 lg:p-8">
      
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=85')` 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-zinc-950/85 backdrop-blur-[2px]" />

      {/* Main Card Container */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-emerald-950/30 shadow-2xl backdrop-blur-xl lg:flex-row">
        
        {/* Left Promotional Panel */}
        <div className="flex flex-col justify-between p-8 lg:w-5/12 lg:p-12">
          {/* Agroo Logo */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg">
              <Sprout size={22} />
            </div>
            <span className="text-xl font-black tracking-wider">Agroo</span>
          </Link>

          <div className="my-auto py-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-xl">
              <ShieldAlert size={14} />
              Account Recovery
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
              Forgot your password?
            </h1>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-emerald-100/80">
              No worries! Enter your registered email address and we will send you a verification code to reset your password safely.
            </p>
          </div>

          <div>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 text-xs font-bold text-emerald-200 transition-colors hover:text-white"
            >
              <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Sign in</span>
            </Link>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full bg-black/40 p-6 backdrop-blur-2xl lg:w-7/12 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10">
          
          <div className="mb-6 text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Reset password
            </h2>
            <p className="mt-0.5 text-xs font-medium text-emerald-200/70">
              Enter your account email to receive a reset OTP code.
            </p>
          </div>

          <ErrorAlert message={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-[11px] font-bold text-emerald-100">
                Email Address
              </label>
              <div className="group relative">
                <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abc@gmail.com"
                  className="block h-10 w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-3 text-xs font-medium text-white placeholder-emerald-200/40 transition-all focus:border-emerald-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 px-4 text-xs font-bold text-emerald-950 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:from-emerald-400 hover:to-teal-300 hover:shadow-emerald-400/40 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-400/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-950/30 border-t-emerald-950" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send reset OTP</span>
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;