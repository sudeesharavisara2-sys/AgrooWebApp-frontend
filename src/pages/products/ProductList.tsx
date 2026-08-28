import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/products';
import ProductCard from '../../components/products/ProductCard';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../context/AuthContext';
import { PRODUCT_CATEGORIES, type Page, type ProductResponse } from '../../types';
import { getErrorMessage, humanizeEnum } from '../../utils/helpers';

const ProductList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<Page<ProductResponse> | null>(null);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState<string>('');
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<ProductResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = async (p: number, cat: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = cat
        ? await productsApi.getByCategory(cat as ProductResponse['category'], p, 12)
        : await productsApi.getAll({ page: p, size: 12 });
      setData(res);
      setSearchResults(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(page, category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      loadPage(0, category);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.search(keyword);
      setSearchResults(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const list = searchResults ?? data?.content ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        {isAuthenticated && (
          <Link to="/products/new" className="btn-primary">
            + List a Product
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px] gap-2">
          <input
            className="input"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="btn-secondary shrink-0" type="submit">
            Search
          </button>
        </form>
        <select
          className="input w-auto"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All Categories</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {humanizeEnum(c)}
            </option>
          ))}
        </select>
      </div>

      <ErrorAlert message={error} />

      {loading ? (
        <Loader />
      ) : list.length === 0 ? (
        <EmptyState title="No products found" subtitle="Try a different search or category." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {!searchResults && data && (
            <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
