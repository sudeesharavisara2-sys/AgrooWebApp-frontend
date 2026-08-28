import React from 'react';
import { Link } from 'react-router-dom';
import type { MachineRentalResponse } from '../../types';
import { formatCurrency, humanizeEnum, resolveImageUrl } from '../../utils/helpers';

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-agroo-100 text-agroo-700',
  RENTED: 'bg-amber-100 text-amber-700',
  UNDER_MAINTENANCE: 'bg-gray-200 text-gray-600',
  NOT_AVAILABLE: 'bg-red-100 text-red-600',
};

const MachineCard: React.FC<{ machine: MachineRentalResponse }> = ({ machine }) => {
  const primaryImage = machine.images?.find((i) => i.isPrimary) || machine.images?.[0];

  return (
    <Link to={`/machines/${machine.id}`} className="card flex flex-col gap-3 hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
        {primaryImage ? (
          <img
            src={resolveImageUrl(primaryImage.imageUrl) || ''}
            alt={machine.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">🚜</div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{machine.name}</h3>
        <span className={`badge ${statusColors[machine.status] || 'bg-gray-100'}`}>
          {humanizeEnum(machine.status)}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-gray-500">{machine.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-agroo-700">{formatCurrency(machine.pricePerDay)} / day</span>
        <span className="text-gray-400">{machine.location}</span>
      </div>
      <div className="flex flex-wrap gap-1 text-xs text-gray-500">
        <span className="badge bg-gray-100">{humanizeEnum(machine.machineType)}</span>
        {machine.brand && <span className="badge bg-gray-100">{machine.brand}</span>}
      </div>
    </Link>
  );
};

export default MachineCard;
