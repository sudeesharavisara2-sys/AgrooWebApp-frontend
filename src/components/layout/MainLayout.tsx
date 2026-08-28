import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout: React.FC = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
      <Outlet />
    </main>
    <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
      Agroo Agricultural Platform &copy; {new Date().getFullYear()}
    </footer>
  </div>
);

export default MainLayout;
