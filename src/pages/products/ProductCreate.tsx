import React from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../../api/products';
import ProductForm from '../../components/products/ProductForm';
import type { ProductRequest } from '../../types';

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: ProductRequest, images?: File[]) => {
    const created = await productsApi.create(data, images);
    navigate(`/products/${created.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">List a New Product</h1>
      <div className="card">
        <ProductForm submitLabel="Create Product" onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ProductCreate;
