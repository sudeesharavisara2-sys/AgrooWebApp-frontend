import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { machinesApi } from '../../api/machines';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../context/AuthContext';
import { MACHINE_TYPES, type MachineRentalResponse, type MachineType, type Page } from '../../types';
import { getErrorMessage, humanizeEnum, resolveImageUrl } from '../../utils/helpers';
import { MapPin, Search } from 'lucide-react';

const MachineList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<Page<MachineRentalResponse> | null>(null);
  const [page, setPage] = useState(0);
  const [machineType, setMachineType] = useState<MachineType | ''>('');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      let res: Page<MachineRentalResponse>;
      if (keyword || location) {
        res = await machinesApi.search(keyword || undefined, location || undefined, p, 12);
      } else if (machineType) {
        res = await machinesApi.getByType(machineType, p, 12);
      } else {
        res = await machinesApi.getAll(p, 12);
      }
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, machineType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    load(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Machine Rentals</h1>
        {isAuthenticated && (
          <Link to="/machines/new" className="btn-primary">
            + List a Machine
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
        <input
          className="input flex-1 min-w-[160px]"
          placeholder="Keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          className="input flex-1 min-w-[160px]"
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          className="input w-auto"
          value={machineType}
          onChange={(e) => {
            setMachineType(e.target.value as MachineType | '');
            setPage(0);
          }}
        >
          <option value="">All Types</option>
          {MACHINE_TYPES.map((t) => (
            <option key={t} value={t}>
              {humanizeEnum(t)}
            </option>
          ))}
        </select>
        
        {/* Modern Search Button */}
        <button 
          type="submit" 
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-agroo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-agroo-700 transition-all active:scale-95"
        >
          <Search size={16} /> Search
        </button>
      </form>

      <ErrorAlert message={error} />

      {loading ? (
        <Loader />
      ) : data && data.content.length === 0 ? (
        <EmptyState title="No machines found" subtitle="Try a different search or type." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.content.map((m) => {
              const primaryImg = m.images?.find((i) => i.isPrimary) || m.images?.[0];
              const imageUrl = primaryImg ? resolveImageUrl(primaryImg.imageUrl) : null;

              return (
                <Link
                  key={m.id}
                  to={`/machines/${m.id}`}
                  className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  {/* Machine Image Box */}
                  <div className="h-48 w-full bg-gray-50 overflow-hidden flex items-center justify-center p-2">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={m.name}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl">🚜</div>
                    )}
                  </div>

                  {/* Machine Info */}
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                      {m.name}
                    </h3>

                    {/* Price */}
                    <div className="text-lg font-bold text-gray-950 mb-2">
                      Rs. {m.pricePerDay?.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ day</span>
                    </div>

                    {/* Location */}
                    {m.location && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                        <MapPin size={13} className="text-gray-400 shrink-0" />
                        {m.location}
                      </p>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {m.machineType && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-md font-medium">
                          {humanizeEnum(m.machineType)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {data && <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  );
};

export default MachineList;