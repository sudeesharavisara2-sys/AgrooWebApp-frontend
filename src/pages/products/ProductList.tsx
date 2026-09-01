import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/products';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../context/AuthContext';
import { PRODUCT_CATEGORIES, type Page, type ProductResponse } from '../../types';
import { getErrorMessage, humanizeEnum, resolveImageUrl } from '../../utils/helpers';

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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => {
              // ProductDetail එකේ වගේම primary image එක හෝ පළමු image එක තෝරා ගැනීම
              const primaryImg = p.images?.find((i) => i.isPrimary) || p.images?.[0];
              const imageUrl = primaryImg ? resolveImageUrl(primaryImg.imageUrl) : null;

              return (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  {/* Product Image Box */}
                  <div className="h-48 w-full bg-gray-50 overflow-hidden flex items-center justify-center p-2">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={p.name}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl">🌱</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                      {p.name}
                    </h3>

                    {/* Price */}
                    <div className="text-lg font-bold text-gray-950 mb-3">
                      Rs. {p.price?.toLocaleString()}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-md font-medium">
                        {humanizeEnum(p.category)}
                      </span>
                      {p.listingType && (
                        <span className="px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded-md font-medium">
                          {humanizeEnum(p.listingType)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
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