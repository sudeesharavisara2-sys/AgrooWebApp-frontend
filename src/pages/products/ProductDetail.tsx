import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productsApi } from '../../api/products';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { ProductResponse } from '../../types';
import { formatCurrency, formatDate, getErrorMessage, humanizeEnum, resolveImageUrl } from '../../utils/helpers';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Calendar, 
  User, 
  Edit3, 
  Trash2, 
  EyeOff, 
  Eye, 
  Leaf,
  ArrowLeft
} from 'lucide-react';

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
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors px-2 py-1"
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
        
        {/* Left Column: Images Section */}
        <div className="space-y-4">
          {/* Main Image Box - Aligned & Fitted */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border border-gray-200/60 dark:border-gray-800">
            {activeImage ? (
              <img 
                src={activeImage} 
                alt={product.name} 
                className="h-full w-full object-contain p-2 transition-transform duration-300 hover:scale-105" 
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl">🌱</div>
            )}
            
            {/* Organic Badge over image */}
            {product.isOrganic && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow-md">
                <Leaf size={14} /> Organic
              </span>
            )}
          </div>

          {/* Thumbnails Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {product.images.map((img) => {
                const imgUrl = resolveImageUrl(img.imageUrl);
                const isActive = activeImage === imgUrl;
                return (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all bg-gray-50 dark:bg-gray-800 ${
                      isActive ? 'border-emerald-500 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl || ''} alt="" className="h-full w-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Details Section */}
        <div className="space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                {product.name}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                product.isAvailable 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20'
              }`}>
                {product.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(product.price)}
              {product.unit ? <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> / {product.unit}</span> : ''}
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-b border-gray-100 dark:border-gray-800 py-4">
            {product.description || 'No description provided for this item.'}
          </p>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Category</p>
              <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">{humanizeEnum(product.category)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Type</p>
              <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">{humanizeEnum(product.productType)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Sale Type</p>
              <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">{humanizeEnum(product.saleType)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Quantity</p>
              <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                {product.quantity ?? '—'} {product.unit || ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Location</p>
              <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5 flex items-center gap-1">
                <MapPin size={12} className="text-emerald-500 shrink-0" />
                {product.location} {product.district ? `(${product.district})` : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Listed Date</p>
              <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5 flex items-center gap-1">
                <Calendar size={12} className="text-emerald-500 shrink-0" />
                {formatDate(product.createdAt)}
              </p>
            </div>
          </div>

          {/* Farmer Contact Info Box */}
          <div className="bg-emerald-50/30 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/20 space-y-2">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <User size={14} /> Farmer Information
            </p>
            <p className="font-bold text-gray-900 dark:text-gray-100 text-base">
              {product.farmer.fullName || product.farmer.username}
            </p>
            <div className="flex flex-wrap gap-4 pt-1">
              {product.contactPhone && (
                <a href={`tel:${product.contactPhone}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:text-emerald-600 transition-colors shadow-sm">
                  <Phone size={14} className="text-emerald-500" /> {product.contactPhone}
                </a>
              )}
              {product.contactWhatsapp && (
                <a href={`https://wa.me/${product.contactWhatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:text-emerald-600 transition-colors shadow-sm">
                  <MessageCircle size={14} className="text-emerald-500" /> WhatsApp: {product.contactWhatsapp}
                </a>
              )}
            </div>
          </div>

          {/* Owner Action Buttons */}
          {isOwner && (
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link 
                to={`/products/${product.id}/edit`} 
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
              >
                <Edit3 size={16} className="text-emerald-600" /> Edit Listing
              </Link>
              
              <button 
                onClick={handleToggle} 
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
              >
                {product.isAvailable ? <EyeOff size={16} className="text-amber-500" /> : <Eye size={16} className="text-emerald-500" />}
                {product.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
              </button>

              <button 
                onClick={handleDelete} 
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 shadow-sm transition-all ml-auto"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;