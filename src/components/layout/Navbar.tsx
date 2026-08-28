import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
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
          rounded-2xl border border-white/50
          bg-white/70 px-4 py-3
          shadow-[0_8px_32px_rgba(31,38,135,0.10)]
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-white/60
          dark:border-white/10
          md:px-6
        "
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5"
        >
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-white/60
              bg-white/60 text-lg
              shadow-sm backdrop-blur-md
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            🌾
          </div>

          <span className="text-xl font-bold tracking-tight text-agroo-700">
            Agroo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="
            hidden items-center gap-1
            rounded-2xl border border-white/50
            bg-white/50 p-1.5
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
                text-sm font-medium text-gray-600
                transition-all duration-200
                hover:bg-white/80 hover:text-agroo-700
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
                  text-sm font-medium text-gray-600
                  transition-all duration-200
                  hover:bg-white/80 hover:text-agroo-700
                  hover:shadow-sm
                "
              >
                My Feed
              </Link>

              <Link
                to="/chat"
                className="
                  rounded-xl px-4 py-2
                  text-sm font-medium text-gray-600
                  transition-all duration-200
                  hover:bg-white/80 hover:text-agroo-700
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
                text-sm font-medium text-agroo-700
                transition-all duration-200
                hover:bg-agroo-50
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
                  rounded-xl border border-white/60
                  bg-white/50 px-3 py-2
                  text-sm font-medium text-gray-700
                  shadow-sm backdrop-blur-md
                  transition-all duration-200
                  hover:bg-white/80 hover:text-agroo-700
                "
              >
                <div
                  className="
                    flex h-7 w-7 items-center justify-center
                    rounded-lg bg-agroo-100 text-agroo-700
                  "
                >
                  <User size={15} />
                </div>

                <span className="max-w-[120px] truncate">
                  {user?.fullName || user?.username}
                </span>

                <ChevronDown size={15} className="text-gray-400" />
              </Link>

              <button
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl border border-red-100
                  bg-red-50/70 text-red-500
                  transition-all duration-200
                  hover:bg-red-100 hover:text-red-600
                  active:scale-95
                "
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="
                  rounded-xl border border-white/60
                  bg-white/50 px-4 py-2
                  text-sm font-medium text-gray-700
                  shadow-sm backdrop-blur-md
                  transition-all duration-200
                  hover:bg-white/80 hover:text-agroo-700
                "
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="
                  rounded-xl bg-agroo-700 px-4 py-2
                  text-sm font-semibold text-white
                  shadow-md shadow-agroo-700/20
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:bg-agroo-800
                  hover:shadow-lg hover:shadow-agroo-700/20
                  active:translate-y-0
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
            rounded-xl border border-white/60
            bg-white/60 text-gray-700
            shadow-sm backdrop-blur-md
            transition-all duration-200
            hover:bg-white/90
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
            border border-white/60
            bg-white/75 p-3
            shadow-[0_12px_40px_rgba(31,38,135,0.14)]
            backdrop-blur-2xl
            supports-[backdrop-filter]:bg-white/65
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
                  text-sm font-medium text-gray-700
                  transition-all duration-200
                  hover:bg-white/80 hover:text-agroo-700
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
                    text-sm font-medium text-gray-700
                    transition-all duration-200
                    hover:bg-white/80 hover:text-agroo-700
                  "
                >
                  My Feed
                </Link>

                <Link
                  to="/chat"
                  onClick={closeMenu}
                  className="
                    rounded-xl px-4 py-3
                    text-sm font-medium text-gray-700
                    transition-all duration-200
                    hover:bg-white/80 hover:text-agroo-700
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
                  text-sm font-semibold text-agroo-700
                  transition-all duration-200
                  hover:bg-agroo-50
                "
              >
                Admin
              </Link>
            )}

            <div className="my-2 h-px bg-gray-200/60" />

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="
                    flex items-center gap-3
                    rounded-xl bg-white/50 px-4 py-3
                    text-sm font-medium text-gray-700
                    transition-all duration-200
                    hover:bg-white/80
                  "
                >
                  <div
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-xl bg-agroo-100 text-agroo-700
                    "
                  >
                    <User size={17} />
                  </div>

                  <div className="flex flex-col">
                    <span>
                      {user?.fullName || user?.username || 'Profile'}
                    </span>

                    {user?.username && user?.fullName && (
                      <span className="text-xs font-normal text-gray-400">
                        @{user.username}
                      </span>
                    )}
                  </div>
                </Link>

                <button
                  className="
                    mt-1 flex w-full items-center justify-center gap-2
                    rounded-xl border border-red-100
                    bg-red-50/70 px-4 py-3
                    text-sm font-semibold text-red-600
                    transition-all duration-200
                    hover:bg-red-100
                    active:scale-[0.98]
                  "
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
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
                    rounded-xl border border-gray-200/70
                    bg-white/60 px-4 py-3
                    text-sm font-semibold text-gray-700
                    transition-all duration-200
                    hover:bg-white
                  "
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="
                    flex items-center justify-center
                    rounded-xl bg-agroo-700 px-4 py-3
                    text-sm font-semibold text-white
                    shadow-md shadow-agroo-700/20
                    transition-all duration-200
                    hover:bg-agroo-800
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