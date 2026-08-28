import React from 'react';

const EmptyState: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 text-center">
    <p className="text-base font-medium text-gray-700">{title}</p>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
  </div>
);

export default EmptyState;
