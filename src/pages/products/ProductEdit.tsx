import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { productsApi } from '../../api/products';
import ProductForm from '../../components/products/ProductForm';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

import type {
  ProductRequest,
  ProductResponse,
} from '../../types';

import {
  getErrorMessage,
  resolveImageUrl,
} from '../../utils/helpers';

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] =
    useState<ProductResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ------------------------------------------------------------
  // Load product
  // ------------------------------------------------------------
  const loadProduct = async () => {
    if (!id) {
      setError('Invalid product ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        await productsApi.getById(Number(id));

      setProduct(response);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ------------------------------------------------------------
  // Loading / error states
  // ------------------------------------------------------------
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!product) {
    return (
      <ErrorAlert message="Product not found." />
    );
  }

  // ------------------------------------------------------------
  // Initial product form values
  // ------------------------------------------------------------
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
    contactWhatsapp:
      product.contactWhatsapp || '',
    harvestDate: product.harvestDate || '',
    expiryDate: product.expiryDate || '',
  };

  // ------------------------------------------------------------
  // Update product details
  //
  // Current backend does NOT provide an endpoint for uploading
  // additional images to an existing product.
  // ------------------------------------------------------------
  const handleSubmit = async (
    data: ProductRequest
  ) => {
    setError(null);

    try {
      const updatedProduct =
        await productsApi.update(
          product.id,
          data
        );

      setProduct(updatedProduct);

      navigate(
        `/products/${product.id}`
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // ------------------------------------------------------------
  // Set existing image as primary
  // ------------------------------------------------------------
  const handleSetPrimary = async (
    imageId: number
  ) => {
    setError(null);

    try {
      const updatedProduct =
        await productsApi.setPrimaryImage(
          imageId
        );

      setProduct(updatedProduct);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // ------------------------------------------------------------
  // Delete existing image
  // ------------------------------------------------------------
  const handleDeleteImage = async (
    imageId: number
  ) => {
    const confirmed = window.confirm(
      'Remove this image?'
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      await productsApi.deleteImage(
        imageId
      );

      await loadProduct();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      <h1 className="text-2xl font-bold text-gray-900">
        Edit Product
      </h1>

      {error && (
        <ErrorAlert message={error} />
      )}

      {/* Existing Images */}
      {product.images &&
        product.images.length > 0 && (
          <div className="card space-y-3">

            <h2 className="font-semibold text-gray-800">
              Existing Images
            </h2>

            <div className="flex flex-wrap gap-3">
              {product.images.map(
                (img) => (
                  <div
                    key={img.id}
                    className="relative"
                  >
                    <img
                      src={
                        resolveImageUrl(
                          img.imageUrl
                        ) || ''
                      }
                      alt={product.name}
                      className={`h-20 w-20 rounded-lg object-cover ${
                        img.isPrimary
                          ? 'ring-2 ring-agroo-600'
                          : ''
                      }`}
                    />

                    <div className="mt-1 flex gap-2 text-xs">

                      {!img.isPrimary && (
                        <button
                          type="button"
                          className="text-agroo-700 hover:underline"
                          onClick={() =>
                            handleSetPrimary(
                              img.id
                            )
                          }
                        >
                          Set primary
                        </button>
                      )}

                      <button
                        type="button"
                        className="text-red-600 hover:underline"
                        onClick={() =>
                          handleDeleteImage(
                            img.id
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* Product Details */}
      <div className="card">

        <ProductForm
          initial={initial}
          submitLabel="Save Changes"
          allowImages={false}
          onSubmit={handleSubmit}
        />

      </div>
    </div>
  );
};

export default ProductEdit;