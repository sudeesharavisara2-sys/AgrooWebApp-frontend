import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  AtSign,
  LockKeyhole,
  MapPin,
  Phone,
  User,
  Sprout,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { AuthRequest } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const emptyForm: AuthRequest = {
  username: '',
  email: '',
  password: '',
  fullName: '',
  phoneNumber: '',
  address: '',
  district: '',
};

const sriLankanDistricts = [
  "Anuradhapura", "Polonnaruwa", "Kurunegala", "Puttalam", 
  "Kandy", "Matale", "Nuwara Eliya", "Badulla", "Monaragala", 
  "Ratnapura", "Kegalle", "Gampaha", "Colombo", "Kalutara", 
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", 
  "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee"
];

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<AuthRequest>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof AuthRequest>(
    key: K,
    value: AuthRequest[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(form);
      navigate('/verify-otp', {
        state: { email: form.email },
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-emerald-950 p-4 lg:p-8">
      
      {/* =========================================================
          SINGLE BACKGROUND IMAGE WITH DARK OVERLAY (Pinterest Style)
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
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
              It's time to boost your agriculture
            </h1>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-emerald-100/80">
              Connect directly with markets, manage your farm efficiently, and step into the future of smart farming in Sri Lanka.
            </p>
          </div>

          {/* Sign In Redirect Box */}
          <div>
            <p className="mb-2 text-xs font-medium text-emerald-200/70">Already have an account?</p>
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

        {/* RIGHT REGISTRATION FORM PANEL (Scrollbar hidden here) */}
        <div className="w-full bg-black/40 p-6 backdrop-blur-2xl lg:w-7/12 lg:p-8 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-t lg:border-t-0 lg:border-l border-white/10">
          
          <div className="mb-5 text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Create Account
            </h2>
            <p className="mt-0.5 text-xs font-medium text-emerald-200/70">
              Sign up as a farmer to get started with Agroo.
            </p>
          </div>

          <ErrorAlert message={error} />

          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Personal Details */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="fullName" className="text-[11px] font-bold text-emerald-100">Full Name</label>
                  <div className="group relative">
                    <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
                    <input
                      id="fullName"
                      className="block h-9 w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-3 text-xs font-medium text-white placeholder-emerald-200/40 transition-all focus:border-emerald-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      placeholder="Your Name Here"
                      value={form.fullName}
                      onChange={(e) => update('fullName', e.target.value)}
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label htmlFor="username" className="text-[11px] font-bold text-emerald-100">Username <span className="text-emerald-400">*</span></label>
                  <div className="group relative">
                    <AtSign size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
                    <input
                      id="username"
                      className="block h-9 w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-3 text-xs font-medium text-white placeholder-emerald-200/40 transition-all focus:border-emerald-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      placeholder="farmer_kamal"
                      required
                      minLength={3}
                      value={form.username}
                      onChange={(e) => update('username', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-[11px] font-bold text-emerald-100">E-mail <span className="text-emerald-400">*</span></label>
                <div className="group relative">
                  <AtSign size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
                  <input
                    id="email"
                    type="email"
                    className="block h-9 w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-3 text-xs font-medium text-white placeholder-emerald-200/40 transition-all focus:border-emerald-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                    placeholder="E-mail Address"
                    required
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="text-[11px] font-bold text-emerald-100">Password <span className="text-emerald-400">*</span></label>
                <div className="group relative">
                  <LockKeyhole size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
                  <input
                    id="password"
                    type="password"
                    className="block h-9 w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-3 text-xs font-medium text-white placeholder-emerald-200/40 transition-all focus:border-emerald-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                    placeholder="••••••••••••"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold text-emerald-300/70 uppercase tracking-wider">Location & Contact</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Location & Contact Details */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                
                {/* Phone Number */}
                <div className="space-y-1">
                  <label htmlFor="phoneNumber" className="text-[11px] font-bold text-emerald-100">Phone Number</label>
                  <div className="group relative">
                    <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
                    <input
                      id="phoneNumber"
                      type="tel"
                      className="block h-9 w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-3 text-xs font-medium text-white placeholder-emerald-200/40 transition-all focus:border-emerald-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      placeholder="071 234 5678"
                      value={form.phoneNumber}
                      onChange={(e) => update('phoneNumber', e.target.value)}
                    />
                  </div>
                </div>

                {/* District Selector */}
                <div className="space-y-1">
                  <label htmlFor="district" className="text-[11px] font-bold text-emerald-100">District</label>
                  <div className="group relative">
                    <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
                    <select
                      id="district"
                      className="block h-9 w-full rounded-xl border border-white/20 bg-emerald-950/80 pl-9 pr-3 text-xs font-medium text-white transition-all focus:border-emerald-400 focus:bg-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      value={form.district}
                      onChange={(e) => update('district', e.target.value)}
                    >
                      <option value="" className="bg-emerald-950 text-white">Select district</option>
                      {sriLankanDistricts.map((dist) => (
                        <option key={dist} value={dist} className="bg-emerald-950 text-white">{dist}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label htmlFor="address" className="text-[11px] font-bold text-emerald-100">Address / Village</label>
                <div className="group relative">
                  <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
                  <input
                    id="address"
                    className="block h-9 w-full rounded-xl border border-white/20 bg-white/10 pl-9 pr-3 text-xs font-medium text-white placeholder-emerald-200/40 transition-all focus:border-emerald-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                    placeholder="Temple Road, Village"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                  />
                </div>
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
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

export default Register;