import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Leaf,
  LockKeyhole,
  Mail,
  Sprout,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

// Background images array 
const backgroundImages = [
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=85',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1920&q=85',
];

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const location = useLocation() as {
    state?: { from?: { pathname: string } };
  };

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Background image index එක වෙනස් කිරීමට state එකක්
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // සෑම තත්පර 5කට වරක් background image එක මාරු වීමට
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await login({
        usernameOrEmail,
        password,
      });

      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-emerald-950 p-4 lg:p-8">
      
      {/* =========================================================
          SLIDESHOW BACKGROUND IMAGES WITH DARK OVERLAY
          ========================================================= */}
      {backgroundImages.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${img}')` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-zinc-950/85 backdrop-blur-[2px]" />

      {/* =========================================================
          MAIN CONTAINER: Single Card Split Layout
          ========================================================= */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-emerald-950/30 shadow-2xl backdrop-blur-xl lg:flex-row">
        
        {/* LEFT PROMOTIONAL PANEL */}
        <div className="flex flex-col justify-between p-8 lg:w-5/12 lg:p-12">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg">
              <Sprout size={22} />
            </div>
            <span className="text-xl font-black tracking-wider">Agroo</span>
          </Link>

          <div className="my-auto py-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-xl">
              <Leaf size={14} />
              Smart agriculture, connected community
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
              Growing agriculture, together.
            </h1>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-emerald-100/80">
              Connect with farmers, discover agricultural products, explore machinery, and become part of a growing agricultural community.
            </p>
          </div>

          {/* Register Redirect Box (Aesthetic Glow & Smooth Button) */}
          <div>
            <p className="mb-2 text-xs font-medium text-emerald-200/70">New to Agroo?</p>
            <Link
              to="/register"
              className="group relative inline-flex w-full items-center justify-between overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-600/20 via-emerald-500/30 to-teal-500/20 px-6 py-3.5 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-emerald-400/60 hover:shadow-emerald-500/20 hover:shadow-xl active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Create an account
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/30 text-white transition-all duration-300 group-hover:bg-emerald-400 group-hover:translate-x-1">
                <ArrowRight size={15} />
              </div>
            </Link>
          </div>
        </div>

        {/* RIGHT LOGIN FORM PANEL */}
        <div className="w-full bg-black/40 p-6 backdrop-blur-2xl lg:w-7/12 lg:p-8 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10">
          
          <div className="mb-6 text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="mt-0.5 text-xs font-medium text-emerald-200/70">
              Enter your details to access your Agroo account.
            </p>
          </div>

          <ErrorAlert message={error} />

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Email */}
            <div className="space-y-1">
              <label
                htmlFor="usernameOrEmail"
                className="text-[11px] font-bold text-emerald-100"
              >
                Username or Email
              </label>

              <div className="group relative">
                <Mail
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70"
                />

                <input
                  id="usernameOrEmail"
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) =>
                    setUsernameOrEmail(e.target.value)
                  }
                  placeholder="Enter your username or email"
                  className="block h-10 w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-3 text-xs font-medium text-white placeholder-emerald-200/40 transition-all focus:border-emerald-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-[11px] font-bold text-emerald-100"
              >
                Password
              </label>

              <div className="group relative">
                <LockKeyhole
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70"
                />

                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••••••"
                  className="block h-10 w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-3 text-xs font-medium text-white placeholder-emerald-200/40 transition-all focus:border-emerald-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end pt-1">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-emerald-300 transition-colors hover:text-emerald-200 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Action (Aesthetic Gradient Button with Glow & Smooth Icon Transition) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 px-4 text-xs font-bold text-emerald-950 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:from-emerald-400 hover:to-teal-300 hover:shadow-emerald-400/40 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-400/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-950/30 border-t-emerald-950" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Log in to Agroo</span>
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

export default Login;