import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../api/products';
import { machinesApi } from '../api/machines';
import ProductCard from '../components/products/ProductCard';
import MachineCard from '../components/machines/MachineCard';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import type { MachineRentalResponse, ProductResponse } from '../types';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [machines, setMachines] = useState<MachineRentalResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productsApi.getAll({ page: 0, size: 6 }), machinesApi.getAvailable(0, 3)])
      .then(([p, m]) => {
        setProducts(p.content);
        setMachines(m.content);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-agroo-600 to-agroo-800 px-6 py-14 text-center text-white sm:py-20">
        <h1 className="text-3xl font-bold sm:text-4xl">Sri Lanka's Agricultural Marketplace</h1>
        <p className="mx-auto mt-3 max-w-xl text-agroo-50">
          Buy and sell fresh produce, rent farm machinery, track market prices, and connect with
          fellow farmers — all in one place.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/products" className="btn bg-white text-agroo-700 hover:bg-agroo-50">
            Browse Products
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn border border-white text-white hover:bg-white/10">
              Join Agroo
            </Link>
          )}
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : (
        <>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Fresh on the Marketplace</h2>
              <Link to="/products" className="text-sm font-medium text-agroo-700 hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Available Machinery</h2>
              <Link to="/machines" className="text-sm font-medium text-agroo-700 hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {machines.map((m) => (
                <MachineCard key={m.id} machine={m} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
