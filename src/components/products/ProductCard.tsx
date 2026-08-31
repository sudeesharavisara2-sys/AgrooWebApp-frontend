import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductResponse } from '../../types';
import { formatCurrency, humanizeEnum, resolveImageUrl } from '../../utils/helpers';
import { MapPin, Leaf } from 'lucide-react';

const ProductCard: React.FC<{ product: ProductResponse }> = ({ product }) => {
  const primaryImage = product.images?.find((i) => i.isPrimary) || product.images?.[0];

  return (
    <Link 
      to={`/products/${product.id}`} 
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/60 dark:border-gray-800/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-gray-900/70 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
    >
      <div>
        {/* Product Image Box */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100/50 mb-3">
          {primaryImage ? (
            <img
              src={resolveImageUrl(primaryImage.imageUrl) || ''}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">🌱</div>
          )}

          {/* Top Badges over image */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {product.isOrganic && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                <Leaf size={12} /> Organic
              </span>
            )}
            {!product.isAvailable && (
              <span className="inline-flex items-center rounded-full bg-red-500/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                Unavailable
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {product.description || 'No description available for this product.'}
          </p>
        </div>
      </div>

      {/* Footer Info: Price, Location & Tags */}
      <div className="mt-4 pt-3 border-t border-gray-100/80 dark:border-gray-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
            {formatCurrency(product.price)}
            {product.unit ? <span className="text-xs font-normal text-gray-500 dark:text-gray-400"> / {product.unit}</span> : ''}
          </span>
          
          {product.location && (
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin size={12} className="text-emerald-500" />
              {product.location}
            </span>
          )}
        </div>

        {/* Tags / Categories */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded-lg bg-gray-100/70 dark:bg-gray-800/70 px-2 py-0.5 text-gray-600 dark:text-gray-300 font-medium">
            {humanizeEnum(product.category)}
          </span>
          <span className="rounded-lg bg-gray-100/70 dark:bg-gray-800/70 px-2 py-0.5 text-gray-600 dark:text-gray-300 font-medium">
            {humanizeEnum(product.saleType)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;