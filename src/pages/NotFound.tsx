import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
    <p className="text-5xl">🌾</p>
    <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
    <p className="text-gray-500">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary mt-2">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
