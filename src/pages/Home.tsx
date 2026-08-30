import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../api/products';
import { machinesApi } from '../api/machines';
import ProductCard from '../components/products/ProductCard';
import MachineCard from '../components/machines/MachineCard';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import type { MachineRentalResponse, ProductResponse } from '../types';
import { 
  Sprout, Users, ShieldCheck, Mail, Phone, MapPin, Send, 
  Globe, MessageSquare, Share2, ExternalLink, Heart, 
  Menu, X, LogOut, User, ChevronDown 
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [machines, setMachines] = useState<MachineRentalResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Navbar Mobile Menu State
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setOpen(false);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    Promise.all([productsApi.getAll({ page: 0, size: 6 }), machinesApi.getAvailable(0, 3)])
      .then(([p, m]) => {
        setProducts(p.content);
        setMachines(m.content);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pb-0 relative bg-gray-900 text-white">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80" 
          alt="Agricultural Hero Background" 
          className="h-full w-full object-cover opacity-40 scale-105 fixed"
        />
        <div className="absolute inset-0 bg-gray-950/80 fixed" />
      </div>

{/* =========================================================
          MODERN GLASSMORPHISM NAVBAR (Background එකට ගැලපෙන විදිහට)
          ========================================================= */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full bg-black/30 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <a
            href="#home"
            onClick={closeMenu}
            className="group flex items-center gap-2.5 text-white"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md transition-transform duration-200 group-hover:scale-105">
              <Sprout size={20} />
            </div>
            <span className="text-xl font-black tracking-wider text-white">
              Agroo
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1.5 rounded-full bg-black/40 p-1.5 border border-white/10 shadow-2xl md:flex backdrop-blur-xl">
            <a href="#home" className="rounded-full px-4 py-2 text-xs font-medium text-gray-300 transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Home
            </a>
            <a href="#products" className="rounded-full px-4 py-2 text-xs font-medium text-gray-300 transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Products
            </a>
            <a href="#machines" className="rounded-full px-4 py-2 text-xs font-medium text-gray-300 transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Machines
            </a>
            <a href="#about" className="rounded-full px-4 py-2 text-xs font-medium text-gray-300 transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              About
            </a>
            <a href="#contact" className="rounded-full px-4 py-2 text-xs font-medium text-gray-300 transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Contact Us
            </a>
            <Link to="/posts" className="rounded-full px-4 py-2 text-xs font-medium text-gray-300 transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Community
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/feed" className="rounded-full px-4 py-2 text-xs font-medium text-gray-300 transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  My Feed
                </Link>
                <Link to="/chat" className="rounded-full px-4 py-2 text-xs font-medium text-gray-300 transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  Chat
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin" className="rounded-full px-4 py-2 text-xs font-bold text-emerald-400 transition-all duration-300 hover:bg-emerald-500/30 hover:text-emerald-200 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 rounded-full border border-white/20 bg-black/40 px-3.5 py-2 text-xs font-medium text-gray-200 transition-all hover:bg-white/15 hover:text-white backdrop-blur-md shadow-lg"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/30 text-emerald-300">
                    <User size={13} />
                  </div>
                  <span className="max-w-[100px] truncate">{user?.fullName || user?.username}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </Link>

                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 transition-all hover:bg-red-500/25 hover:text-red-200 active:scale-95 cursor-pointer backdrop-blur-md shadow-lg"
                  onClick={handleLogout}
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                {/* Updated Clear Outline Login Button */}
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-full border-2 border-emerald-500/60 bg-emerald-950/30 px-5 py-2 text-xs font-bold text-emerald-300 transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 backdrop-blur-md"
                >
                  <User size={14} />
                  <span>Log in</span>
                </Link>

                {/* Primary Sign Up Button */}
                <Link
                  to="/register"
                  className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] active:scale-95"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/40 text-gray-200 transition-all hover:bg-white/10 active:scale-95 md:hidden backdrop-blur-md"
            onClick={() => setOpen((current) => !current)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      {/* =========================================================
          1. HOME / HERO SECTION
          ========================================================= */}
      <section id="home" className="relative w-full overflow-hidden bg-gray-900 text-white m-0 p-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80" 
            alt="Agricultural Hero Background" 
            className="h-full w-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-28 sm:py-36 lg:py-44 flex flex-col items-start justify-center">
          <div className="max-w-3xl space-y-6 text-left">
            

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl leading-tight text-white drop-shadow-md">
              Sri Lanka's Agricultural Marketplace
            </h1>

            <p className="text-base sm:text-lg text-gray-200 leading-relaxed drop-shadow">
              Buy and sell fresh produce, rent farm machinery, track market prices, and connect with
              fellow farmers — all in one place.
            </p>

            <div className="flex flex-wrap justify-start gap-4 pt-4">
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
              >
                <span>Browse Products</span>
              </Link>

              {!isAuthenticated && (
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
                >
                  <span>Join Agroo</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. FRESH ON THE MARKETPLACE SECTION
          ========================================================= */}
      <section id="products" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 text-white m-0 p-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1920&q=80" 
            alt="Fresh Produce Background" 
            className="h-full w-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-28 sm:py-36 lg:py-44 flex flex-col justify-center">
          {!loading ? (
            <div className="mx-auto max-w-7xl w-full space-y-6">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div>
                  
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                    Fresh on the Marketplace
                  </h2>
                  <p className="text-sm text-gray-200 mt-1 drop-shadow">Directly harvested and listed by local farmers</p>
                </div>
                <Link 
                  to="/products" 
                  className="group inline-flex items-center gap-1 text-sm font-bold text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  <span>View all</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                {products.map((p) => (
                  <div key={p.id} className="w-full max-w-[260px] transform transition duration-300 hover:scale-[1.02]">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          3. AVAILABLE MACHINERY SECTION
          ========================================================= */}
      <section id="machines" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 text-white m-0 p-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ye1sylsEJnnlBnrxhZK3Wh2HOh1XNeXkkAyS-LAqjw&s=10" 
            alt="Agricultural Machinery Background" 
            className="h-full w-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-28 sm:py-36 lg:py-44 flex flex-col justify-center">
          {!loading ? (
            <div className="mx-auto max-w-7xl w-full space-y-6">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                    Available Machinery
                  </h2>
                  <p className="text-sm text-gray-200 mt-1 drop-shadow">Rent high-quality agricultural equipment near you</p>
                </div>
                <Link 
                  to="/machines" 
                  className="group inline-flex items-center gap-1 text-sm font-bold text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  <span>View all</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                {machines.map((m) => (
                  <div key={m.id} className="w-full max-w-[260px] transform transition duration-300 hover:scale-[1.02]">
                    <MachineCard machine={m} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          4. ABOUT US SECTION
          ========================================================= */}
      <section id="about" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 text-white m-0 p-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=1920&q=80" 
            alt="Agroo Farming Community" 
            className="h-full w-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-28 sm:py-36 lg:py-44 flex flex-col items-center justify-center">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-300 bg-emerald-900/60 border border-emerald-500/30 rounded-full backdrop-blur-md">
               About Agroo
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              Empowering Sri Lankan Farming Communities
            </h2>
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed drop-shadow">
              Agroo is designed to bridge the gap between local farmers, buyers, and modern technology. We provide a trusted digital space to buy fresh harvest, rent necessary agricultural machinery, and uplift rural livelihoods.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full max-w-7xl">
            <div className="p-8 text-center space-y-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl transition-all hover:bg-white/20 hover:-translate-y-1">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sprout size={28} />
              </div>
              <h3 className="font-bold text-lg text-white">100% Fresh Produce</h3>
              <p className="text-xs text-gray-200 leading-relaxed">Directly sourced from trusted local farmers across different districts of Sri Lanka.</p>
            </div>

            <div className="p-8 text-center space-y-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl transition-all hover:bg-white/20 hover:-translate-y-1">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Users size={28} />
              </div>
              <h3 className="font-bold text-lg text-white">Connected Community</h3>
              <p className="text-xs text-gray-200 leading-relaxed">A powerful network allowing farmers, renters, and buyers to communicate seamlessly.</p>
            </div>

            <div className="p-8 text-center space-y-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl transition-all hover:bg-white/20 hover:-translate-y-1">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-bold text-lg text-white">Secure & Reliable</h3>
              <p className="text-xs text-gray-200 leading-relaxed">Safe authentication and transparent listings ensuring a trustworthy trading experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. CONTACT US SECTION
          ========================================================= */}
      <section id="contact" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 text-white m-0 p-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1920&q=80" 
            alt="Agricultural Support Background" 
            className="h-full w-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
        </div>

        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 py-28 sm:py-36 lg:py-44 flex flex-col items-center justify-center">
          <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-left">
              
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                Have Questions? Let's Talk with Agroo Team.
              </h2>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed drop-shadow">
                Whether you need assistance with machinery rental, listing your products, or general inquiries, our team is always ready to support you.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 text-sm text-gray-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    <Mail size={20} />
                  </div>
                  <span className="font-medium">team@agroo.lk</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    <Phone size={20} />
                  </div>
                  <span className="font-medium">+94 72 950 2816</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    <MapPin size={20} />
                  </div>
                  <span className="font-medium">Nittambuwa, Sri Lanka</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-xs text-gray-300">Thank you for reaching out. We will get back to you shortly.</p>
                  <button 
                    onClick={() => { setSubmitted(false); setContactForm({ name: '', email: '', message: '' }); }}
                    className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-md"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-2">Send us a message</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-200">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Kamal Abeysinghe" 
                      className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-xs text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-200">Your Email</label>
                    <input 
                      type="email" 
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="kamal@example.com" 
                      className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-xs text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-200">Message</label>
                    <textarea 
                      rows={3}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="How can we help you?" 
                      className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-xs text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 backdrop-blur-sm resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-lg transition hover:bg-emerald-700 active:scale-[0.98]"
                  >
                    <span>Send Message</span>
                    <Send size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          6. DEDICATED HOME FOOTER SECTION
          ========================================================= */}
      <footer className="relative w-full bg-black text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-black shadow-lg">
                  🌱
                </span>
                <span className="text-xl font-black tracking-tight text-white">Agroo Ecosystem</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Sri Lanka’s premier digital agricultural platform connecting local farmers with modern buyers and machine rentals for sustainable growth.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="#home" className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-emerald-600 hover:text-white transition-colors" title="Website">
                  <Globe size={16} />
                </a>
                <a href="#products" className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-emerald-600 hover:text-white transition-colors" title="Community">
                  <MessageSquare size={16} />
                </a>
                <a href="#about" className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-emerald-600 hover:text-white transition-colors" title="Share">
                  <Share2 size={16} />
                </a>
                <a href="#contact" className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-emerald-600 hover:text-white transition-colors" title="External Link">
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase">Explore Page</h3>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="#home" className="hover:text-emerald-300 transition-colors">Home Overview</a></li>
                <li><a href="#products" className="hover:text-emerald-300 transition-colors">Fresh Marketplace</a></li>
                <li><a href="#machines" className="hover:text-emerald-300 transition-colors">Available Machinery</a></li>
                <li><a href="#about" className="hover:text-emerald-300 transition-colors">About Agroo Mission</a></li>
                <li><a href="#contact" className="hover:text-emerald-300 transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase">Services</h3>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/products" className="hover:text-emerald-300 transition-colors">Fresh Harvest Produce</Link></li>
                <li><Link to="/machines" className="hover:text-emerald-300 transition-colors">Agricultural Equipment Rentals</Link></li>
                <li><Link to="/register" className="hover:text-emerald-300 transition-colors">Farmer Registration</Link></li>
                <li><a href="#contact" className="hover:text-emerald-300 transition-colors">Bulk Order Support</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase">Stay Updated</h3>
              <p className="text-xs text-gray-400">Subscribe for the latest harvest insights and machinery deals in Sri Lanka.</p>
              <div className="flex flex-col gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
                <button className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-md">
                  Subscribe Now
                </button>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Agroo (Pvt) Ltd. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Crafted with Team Agroo <Heart size={12} className="text-emerald-500 fill-emerald-500" /> for Sri Lankan Farmers
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;