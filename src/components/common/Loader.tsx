import React from 'react';

const Loader: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-agroo-200 border-t-agroo-600" />
    <p className="text-sm">{label}</p>
  </div>
);

export default Loader;
