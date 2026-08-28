import React from 'react';

interface Props {
  page: number; // zero-based
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        className="btn-secondary"
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>
      <span className="px-3 text-sm text-gray-600">
        Page {page + 1} of {totalPages}
      </span>
      <button
        className="btn-secondary"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
