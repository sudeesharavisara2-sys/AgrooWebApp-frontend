import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductResponse } from '../../types';
import { formatCurrency, humanizeEnum, resolveImageUrl } from '../../utils/helpers';

const ProductCard: React.FC<{ product: ProductResponse }> = ({ product }) => {
  const primaryImage = product.images?.find((i) => i.isPrimary) || product.images?.[0];

  return (
    <Link to={`/products/${product.id}`} className="card flex flex-col gap-3 hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
        {primaryImage ? (
          <img
            src={resolveImageUrl(primaryImage.imageUrl) || ''}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">🌱</div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        {product.isOrganic && <span className="badge bg-agroo-100 text-agroo-700">Organic</span>}
      </div>
      <p className="line-clamp-2 text-sm text-gray-500">{product.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-agroo-700">
          {formatCurrency(product.price)}
          {product.unit ? ` / ${product.unit}` : ''}
        </span>
        <span className="text-gray-400">{product.location}</span>
      </div>
      <div className="flex flex-wrap gap-1 text-xs text-gray-500">
        <span className="badge bg-gray-100">{humanizeEnum(product.category)}</span>
        <span className="badge bg-gray-100">{humanizeEnum(product.saleType)}</span>
        {!product.isAvailable && <span className="badge bg-red-100 text-red-600">Unavailable</span>}
      </div>
    </Link>
  );
};

export default ProductCard;