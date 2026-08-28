import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productsApi } from '../../api/products';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { ProductResponse } from '../../types';
import { formatCurrency, formatDate, getErrorMessage, humanizeEnum, resolveImageUrl } from '../../utils/helpers';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getById(Number(id));
      setProduct(res);
      const primary = res.images?.find((i) => i.isPrimary) || res.images?.[0];
      setActiveImage(primary ? resolveImageUrl(primary.imageUrl) : null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;
  if (!product) return null;

  const isOwner = user?.username === product.farmer.username;

  const handleDelete = async () => {
    if (!confirm('Delete this product listing?')) return;
    try {
      await productsApi.delete(product.id);
      navigate('/products');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleToggle = async () => {
    try {
      const updated = await productsApi.toggleAvailability(product.id);
      setProduct(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="aspect-video overflow-hidden rounded-xl bg-gray-100">
          {activeImage ? (
            <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl">🌱</div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(resolveImageUrl(img.imageUrl))}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200"
              >
                <img src={resolveImageUrl(img.imageUrl) || ''} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          {product.isOrganic && <span className="badge bg-agroo-100 text-agroo-700">Organic</span>}
        </div>
        <p className="text-2xl font-bold text-agroo-700">
          {formatCurrency(product.price)}
          {product.unit ? ` / ${product.unit}` : ''}
        </p>
        <p className="text-gray-600">{product.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400">Category</p>
            <p className="font-medium">{humanizeEnum(product.category)}</p>
          </div>
          <div>
            <p className="text-gray-400">Type</p>
            <p className="font-medium">{humanizeEnum(product.productType)}</p>
          </div>
          <div>
            <p className="text-gray-400">Sale Type</p>
            <p className="font-medium">{humanizeEnum(product.saleType)}</p>
          </div>
          <div>
            <p className="text-gray-400">Quantity</p>
            <p className="font-medium">
              {product.quantity ?? '—'} {product.unit || ''}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Location</p>
            <p className="font-medium">
              {product.location} {product.district ? `(${product.district})` : ''}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Listed</p>
            <p className="font-medium">{formatDate(product.createdAt)}</p>
          </div>
        </div>

        <div className="card space-y-1">
          <p className="text-sm text-gray-500">Farmer</p>
          <p className="font-semibold text-gray-900">{product.farmer.fullName || product.farmer.username}</p>
          {product.contactPhone && <p className="text-sm text-gray-600">📞 {product.contactPhone}</p>}
          {product.contactWhatsapp && <p className="text-sm text-gray-600">💬 WhatsApp: {product.contactWhatsapp}</p>}
        </div>

        {isOwner && (
          <div className="flex flex-wrap gap-3">
            <Link to={`/products/${product.id}/edit`} className="btn-outline">
              Edit
            </Link>
            <button className="btn-secondary" onClick={handleToggle}>
              {product.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
            </button>
            <button className="btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
