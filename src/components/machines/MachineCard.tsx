import React from 'react';
import { Link } from 'react-router-dom';
import type { MachineRentalResponse } from '../../types';
import { formatCurrency, humanizeEnum, resolveImageUrl } from '../../utils/helpers';
import { MapPin, Wrench } from 'lucide-react';

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20',
  RENTED: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20',
  UNDER_MAINTENANCE: 'bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400 border border-gray-500/20',
  NOT_AVAILABLE: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20',
};

const MachineCard: React.FC<{ machine: MachineRentalResponse }> = ({ machine }) => {
  const primaryImage = machine.images?.find((i) => i.isPrimary) || machine.images?.[0];

  return (
    <Link 
      to={`/machines/${machine.id}`} 
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/60 dark:border-gray-800/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-gray-900/70 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
    >
      <div>
        {/* Status Badge - Moved to Upper of the Image */}
        <div className="mb-2.5 flex items-center justify-between">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusColors[machine.status] || 'bg-gray-500/10 text-gray-600'}`}>
            {humanizeEnum(machine.status)}
          </span>
        </div>

        {/* Machine Image Box */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100/50 mb-3">
          {primaryImage ? (
            <img
              src={resolveImageUrl(primaryImage.imageUrl) || ''}
              alt={machine.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">🚜</div>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {machine.name}
          </h3>
          <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {machine.description || 'No description available for this machine.'}
          </p>
        </div>
      </div>

      {/* Footer Info: Price, Location & Tags */}
      <div className="mt-4 pt-3 border-t border-gray-100/80 dark:border-gray-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
            {formatCurrency(machine.pricePerDay)}
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400"> / day</span>
          </span>
          
          {machine.location && (
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin size={12} className="text-emerald-500" />
              {machine.location}
            </span>
          )}
        </div>

        {/* Tags / Machine Types */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-lg bg-gray-100/70 dark:bg-gray-800/70 px-2 py-0.5 text-gray-600 dark:text-gray-300 font-medium">
            {humanizeEnum(machine.machineType)}
          </span>
          {machine.brand && (
            <span className="rounded-lg bg-gray-100/70 dark:bg-gray-800/70 px-2 py-0.5 text-gray-600 dark:text-gray-300 font-medium">
              {machine.brand}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MachineCard;