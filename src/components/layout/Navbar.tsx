import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, ChevronDown, Sprout, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/products', label: 'Products' },
  { to: '/machines', label: 'Machines' },
  { to: '/posts', label: 'Community' },
];

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setOpen(false);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className="
          mx-auto flex max-w-6xl items-center justify-between
          rounded-2xl border border-agroo-600/20
          bg-white/80 px-4 py-3
          shadow-[0_8px_32px_rgba(0,0,0,0.1)]
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-white/60
          md:px-6
        "
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5 text-gray-900"
        >
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-agroo-600/20
              bg-agroo-600 text-white
              shadow-md backdrop-blur-md
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            <Sprout size={20} />
          </div>

          <span className="text-xl font-black tracking-wider text-agroo-700">
            Agroo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="
            hidden items-center gap-1
            rounded-2xl border border-gray-200
            bg-gray-100/80 p-1.5
            shadow-sm backdrop-blur-lg
            md:flex
          "
        >
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200
                  ${
                    active
                      ? 'bg-agroo-600 text-white shadow-md font-bold scale-[1.02]'
                      : 'text-gray-700 hover:bg-white hover:text-agroo-700 hover:shadow-sm'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}

          {/* AI Chatbot Button */}
          <Link
            to="/ai-chat"
            className={`
              flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200
              ${
                isActive('/ai-chat')
                  ? 'bg-green-600 text-white shadow-md font-bold scale-[1.02]'
                  : 'bg-green-50 text-green-700 border border-green-200/50 hover:bg-green-100 hover:shadow-sm'
              }
            `}
          >
            <Bot size={14} />
            AI Assistant
          </Link>

          {isAuthenticated && (
            <Link
              to="/chat"
              className={`
                rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200
                ${
                  isActive('/chat')
                    ? 'bg-agroo-600 text-white shadow-md font-bold scale-[1.02]'
                    : 'text-gray-700 hover:bg-white hover:text-agroo-700 hover:shadow-sm'
                }
              `}
            >
              Chat
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={`
                rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200
                ${
                  isActive('/admin')
                    ? 'bg-agroo-700 text-white shadow-md scale-[1.02]'
                    : 'text-agroo-700 hover:bg-agroo-100 hover:text-agroo-900'
                }
              `}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`
                  flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium shadow-sm backdrop-blur-md transition-all duration-200
                  ${
                    isActive('/profile')
                      ? 'border-agroo-600 bg-agroo-600 text-white font-bold shadow-md'
                      : 'border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-agroo-700'
                  }
                `}
              >
                <div
                  className={`
                    flex h-7 w-7 items-center justify-center rounded-lg transition-colors
                    ${isActive('/profile') ? 'bg-white/20 text-white' : 'bg-agroo-100 text-agroo-700'}
                  `}
                >
                  <User size={14} />
                </div>

                <span className="max-w-[120px] truncate">
                  {user?.fullName || user?.username}
                </span>

                <ChevronDown size={14} className={isActive('/profile') ? 'text-white/80' : 'text-gray-500'} />
              </Link>

              <button
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl border border-red-200
                  bg-red-50 text-red-600
                  transition-all duration-200
                  hover:bg-red-100 hover:text-red-700
                  active:scale-95 cursor-pointer
                "
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-outline text-xs px-4 py-2"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="btn-primary text-xs px-4 py-2"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-gray-200
            bg-gray-100 text-gray-800
            shadow-sm backdrop-blur-md
            transition-all duration-200
            hover:bg-gray-200
            active:scale-95
            md:hidden
          "
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div
          className="
            mx-auto mt-2 max-w-6xl
            overflow-hidden rounded-2xl
            border border-gray-200
            bg-white p-3
            shadow-[0_12px_40px_rgba(0,0,0,0.15)]
            backdrop-blur-2xl
            animate-slide-fade
            md:hidden
          "
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={`
                    rounded-xl px-4 py-3 text-xs font-semibold transition-all duration-200 flex items-center justify-between
                    ${
                      active
                        ? 'bg-agroo-600 text-white font-bold shadow-sm'
                        : 'text-gray-700 hover:bg-agroo-50 hover:text-agroo-700'
                    }
                  `}
                >
                  <span>{link.label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                </Link>
              );
            })}

            {/* Mobile AI Chatbot Button */}
            <Link
              to="/ai-chat"
              onClick={closeMenu}
              className={`
                rounded-xl px-4 py-3 text-xs font-semibold transition-all duration-200 flex items-center justify-between
                ${
                  isActive('/ai-chat')
                    ? 'bg-green-600 text-white font-bold shadow-sm'
                    : 'bg-green-50 text-green-700 border border-green-100 hover:bg-green-100'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Bot size={16} />
                <span>AI Assistant</span>
              </div>
              {isActive('/ai-chat') && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
            </Link>

            {isAuthenticated && (
              <Link
                to="/chat"
                onClick={closeMenu}
                className={`
                  rounded-xl px-4 py-3 text-xs font-semibold transition-all duration-200 flex items-center justify-between
                  ${
                    isActive('/chat')
                      ? 'bg-agroo-600 text-white font-bold shadow-sm'
                      : 'text-gray-700 hover:bg-agroo-50 hover:text-agroo-700'
                  }
                `}
              >
                <span>Chat</span>
                {isActive('/chat') && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className={`
                  rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 flex items-center justify-between
                  ${
                    isActive('/admin')
                      ? 'bg-agroo-700 text-white shadow-sm'
                      : 'text-agroo-700 hover:bg-agroo-50'
                  }
                `}
              >
                <span>Admin</span>
                {isActive('/admin') && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
              </Link>
            )}

            <div className="my-2 h-px bg-gray-200" />

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className={`
                    flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-medium transition-all duration-200
                    ${
                      isActive('/profile')
                        ? 'border-agroo-600 bg-agroo-600 text-white font-bold shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        flex h-9 w-9 items-center justify-center rounded-xl
                        ${isActive('/profile') ? 'bg-white/20 text-white' : 'bg-agroo-100 text-agroo-700'}
                      `}
                    >
                      <User size={16} />
                    </div>

                    <div className="flex flex-col">
                      <span>
                        {user?.fullName || user?.username || 'Profile'}
                      </span>

                      {user?.username && user?.fullName && (
                        <span className={`text-[10px] font-normal ${isActive('/profile') ? 'text-white/80' : 'text-gray-500'}`}>
                          @{user.username}
                        </span>
                      )}
                    </div>
                  </div>
                  {isActive('/profile') && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                </Link>

                <button
                  className="
                    mt-1 flex w-full items-center justify-center gap-2
                    rounded-xl border border-red-200
                    bg-red-50 px-4 py-3
                    text-xs font-semibold text-red-600
                    transition-all duration-200
                    hover:bg-red-100 hover:text-red-700
                    active:scale-[0.98] cursor-pointer
                  "
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="btn-outline w-full justify-center py-3 text-xs"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="btn-primary w-full justify-center py-3 text-xs"
                >
                  Create account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;