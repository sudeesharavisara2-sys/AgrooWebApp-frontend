import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/products';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/products/ProductCard';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import type { Page, ProductResponse } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const MyProducts: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Page<ProductResponse> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    productsApi
      .getByFarmer(user.id, page, 12)
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [user, page]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <Link to="/products/new" className="btn-primary">
          + List a Product
        </Link>
      </div>
      <ErrorAlert message={error} />
      {data && data.content.length === 0 ? (
        <EmptyState title="You haven't listed any products yet" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.content.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {data && <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  );
};

export default MyProducts;
