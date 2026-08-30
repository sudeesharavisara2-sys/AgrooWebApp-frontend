import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, ChevronDown, Sprout } from 'lucide-react';
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setOpen(false);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className="
          mx-auto flex max-w-6xl items-center justify-between
          rounded-2xl border border-white/20
          bg-emerald-950/40 px-4 py-3
          shadow-[0_8px_32px_rgba(0,0,0,0.37)]
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-emerald-950/30
          md:px-6
        "
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5 text-white"
        >
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-white/20
              bg-emerald-600 text-white
              shadow-md backdrop-blur-md
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            <Sprout size={20} />
          </div>

          <span className="text-xl font-black tracking-wider text-white">
            Agroo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="
            hidden items-center gap-1
            rounded-2xl border border-white/15
            bg-white/10 p-1.5
            shadow-sm backdrop-blur-lg
            md:flex
          "
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="
                rounded-xl px-4 py-2
                text-xs font-semibold text-emerald-100/80
                transition-all duration-200
                hover:bg-white/20 hover:text-white
                hover:shadow-sm
              "
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <>
              <Link
                to="/feed"
                className="
                  rounded-xl px-4 py-2
                  text-xs font-semibold text-emerald-100/80
                  transition-all duration-200
                  hover:bg-white/20 hover:text-white
                  hover:shadow-sm
                "
              >
                My Feed
              </Link>

              <Link
                to="/chat"
                className="
                  rounded-xl px-4 py-2
                  text-xs font-semibold text-emerald-100/80
                  transition-all duration-200
                  hover:bg-white/20 hover:text-white
                  hover:shadow-sm
                "
              >
                Chat
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="
                rounded-xl px-4 py-2
                text-xs font-bold text-emerald-300
                transition-all duration-200
                hover:bg-emerald-500/20 hover:text-white
              "
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
                className="
                  flex items-center gap-2
                  rounded-xl border border-white/20
                  bg-white/10 px-3 py-2
                  text-xs font-medium text-white
                  shadow-sm backdrop-blur-md
                  transition-all duration-200
                  hover:bg-white/20 hover:text-emerald-200
                "
              >
                <div
                  className="
                    flex h-7 w-7 items-center justify-center
                    rounded-lg bg-emerald-500/20 text-emerald-300
                  "
                >
                  <User size={14} />
                </div>

                <span className="max-w-[120px] truncate">
                  {user?.fullName || user?.username}
                </span>

                <ChevronDown size={14} className="text-emerald-300/70" />
              </Link>

              <button
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl border border-red-500/30
                  bg-red-500/10 text-red-400
                  transition-all duration-200
                  hover:bg-red-500/20 hover:text-red-300
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
                className="
                  rounded-xl border border-white/20
                  bg-white/10 px-4 py-2
                  text-xs font-semibold text-white
                  shadow-sm backdrop-blur-md
                  transition-all duration-200
                  hover:bg-white/20
                "
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="
                  rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2
                  text-xs font-bold text-emerald-950
                  shadow-md shadow-emerald-500/20
                  transition-all duration-200
                  hover:from-emerald-400 hover:to-teal-300 hover:shadow-lg
                  active:scale-95
                "
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
            rounded-xl border border-white/20
            bg-white/10 text-white
            shadow-sm backdrop-blur-md
            transition-all duration-200
            hover:bg-white/20
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
            border border-white/20
            bg-emerald-950/80 p-3
            shadow-[0_12px_40px_rgba(0,0,0,0.5)]
            backdrop-blur-2xl
            md:hidden
          "
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="
                  rounded-xl px-4 py-3
                  text-xs font-semibold text-emerald-100/90
                  transition-all duration-200
                  hover:bg-white/15 hover:text-white
                "
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Link
                  to="/feed"
                  onClick={closeMenu}
                  className="
                    rounded-xl px-4 py-3
                    text-xs font-semibold text-emerald-100/90
                    transition-all duration-200
                    hover:bg-white/15 hover:text-white
                  "
                >
                  My Feed
                </Link>

                <Link
                  to="/chat"
                  onClick={closeMenu}
                  className="
                    rounded-xl px-4 py-3
                    text-xs font-semibold text-emerald-100/90
                    transition-all duration-200
                    hover:bg-white/15 hover:text-white
                  "
                >
                  Chat
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="
                  rounded-xl px-4 py-3
                  text-xs font-bold text-emerald-300
                  transition-all duration-200
                  hover:bg-emerald-500/20 hover:text-white
                "
              >
                Admin
              </Link>
            )}

            <div className="my-2 h-px bg-white/10" />

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="
                    flex items-center gap-3
                    rounded-xl bg-white/10 px-4 py-3
                    text-xs font-medium text-white
                    transition-all duration-200
                    hover:bg-white/20
                  "
                >
                  <div
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-xl bg-emerald-500/20 text-emerald-300
                    "
                  >
                    <User size={16} />
                  </div>

                  <div className="flex flex-col">
                    <span>
                      {user?.fullName || user?.username || 'Profile'}
                    </span>

                    {user?.username && user?.fullName && (
                      <span className="text-[10px] font-normal text-emerald-300/60">
                        @{user.username}
                      </span>
                    )}
                  </div>
                </Link>

                <button
                  className="
                    mt-1 flex w-full items-center justify-center gap-2
                    rounded-xl border border-red-500/30
                    bg-red-500/10 px-4 py-3
                    text-xs font-semibold text-red-400
                    transition-all duration-200
                    hover:bg-red-500/20 hover:text-red-300
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
                  className="
                    flex items-center justify-center
                    rounded-xl border border-white/20
                    bg-white/10 px-4 py-3
                    text-xs font-semibold text-white
                    transition-all duration-200
                    hover:bg-white/20
                  "
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="
                    flex items-center justify-center
                    rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3
                    text-xs font-bold text-emerald-950
                    shadow-md shadow-emerald-500/20
                    transition-all duration-200
                    hover:from-emerald-400 hover:to-teal-300
                    active:scale-[0.98]
                  "
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