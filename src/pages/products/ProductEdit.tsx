import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsApi } from '../../api/products';
import ProductForm from '../../components/products/ProductForm';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { ProductRequest, ProductResponse } from '../../types';
import { getErrorMessage, resolveImageUrl } from '../../utils/helpers';

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await productsApi.getById(Number(id));
      setProduct(res);
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

  const initial: Partial<ProductRequest> = {
    name: product.name,
    description: product.description || '',
    price: product.price,
    quantity: product.quantity ?? 0,
    unit: product.unit || '',
    category: product.category,
    productType: product.productType,
    saleType: product.saleType,
    location: product.location,
    district: product.district || '',
    address: product.address || '',
    isAvailable: product.isAvailable,
    isOrganic: product.isOrganic,
    contactPhone: product.contactPhone || '',
    contactWhatsapp: product.contactWhatsapp || '',
    harvestDate: product.harvestDate || '',
    expiryDate: product.expiryDate || '',
  };

  const handleSubmit = async (data: ProductRequest) => {
    await productsApi.update(product.id, data);
    navigate(`/products/${product.id}`);
  };

  const handleSetPrimary = async (imageId: number) => {
    const updated = await productsApi.setPrimaryImage(imageId);
    setProduct(updated);
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Remove this image?')) return;
    await productsApi.deleteImage(imageId);
    load();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>

      {product.images.length > 0 && (
        <div className="card space-y-3">
          <h2 className="font-semibold text-gray-800">Images</h2>
          <p className="text-xs text-gray-400">
            Note: to add new images, delete the listing and re-create it with photos, or use the image
            actions below to manage existing ones.
          </p>
          <div className="flex flex-wrap gap-3">
            {product.images.map((img) => (
              <div key={img.id} className="relative">
                <img
                  src={resolveImageUrl(img.imageUrl) || ''}
                  alt=""
                  className={`h-20 w-20 rounded-lg object-cover ${img.isPrimary ? 'ring-2 ring-agroo-600' : ''}`}
                />
                <div className="mt-1 flex gap-1 text-xs">
                  {!img.isPrimary && (
                    <button className="text-agroo-700 hover:underline" onClick={() => handleSetPrimary(img.id)}>
                      Set primary
                    </button>
                  )}
                  <button className="text-red-600 hover:underline" onClick={() => handleDeleteImage(img.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <ProductForm initial={initial} submitLabel="Save Changes" allowImages={false} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ProductEdit;
