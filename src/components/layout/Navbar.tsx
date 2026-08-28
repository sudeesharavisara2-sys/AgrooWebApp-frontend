import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-agroo-700">
          🌾 Agroo
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-gray-600 hover:text-agroo-700">
              {l.label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <Link to="/feed" className="text-sm font-medium text-gray-600 hover:text-agroo-700">
                My Feed
              </Link>
              <Link to="/chat" className="text-sm font-medium text-gray-600 hover:text-agroo-700">
                Chat
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-agroo-700">
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-agroo-700">
                {user?.fullName || user?.username}
              </Link>
              <button className="btn-outline" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-gray-600 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm font-medium text-gray-700" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link to="/chat" className="text-sm font-medium text-gray-700" onClick={() => setOpen(false)}>
                Chat
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-gray-700" onClick={() => setOpen(false)}>
                Admin
              </Link>
            )}
            <hr />
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-sm font-medium text-gray-700" onClick={() => setOpen(false)}>
                  Profile ({user?.username})
                </Link>
                <button className="btn-outline w-fit" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline w-fit" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn-primary w-fit" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
