import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout: React.FC = () => (
  <div className="flex min-h-screen flex-col relative">
    <Navbar />
    
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
      <Outlet />
    </main>

    {/* Footer Section */}
    <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
      Agroo Agricultural Platform &copy; {new Date().getFullYear()}
    </footer>

    {/* =========================================================
        Floating AI Assistant Button with Rotation & Pulse Animation
    ========================================================= */}
    <Link
      to="/ai-chat"
      className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group animate-bounce"
      title="Ask AI Assistant"
    >
      {/* Rotating AI Robot Icon */}
      <span className="text-2xl inline-block transition-transform duration-700 group-hover:rotate-[360deg]">
        🤖
      </span>
      
      {/* Tooltip visible on hover */}
      <span className="absolute right-16 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
        Ask Agroo AI 🌱
      </span>
    </Link>
  </div>
);

export default MainLayout;