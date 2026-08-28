import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { machinesApi } from '../../api/machines';
import MachineCard from '../../components/machines/MachineCard';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../context/AuthContext';
import { MACHINE_TYPES, type MachineRentalResponse, type MachineType, type Page } from '../../types';
import { getErrorMessage, humanizeEnum } from '../../utils/helpers';

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
        <button type="submit" className="btn-secondary">
          Search
        </button>
      </form>

      <ErrorAlert message={error} />

      {loading ? (
        <Loader />
      ) : data && data.content.length === 0 ? (
        <EmptyState title="No machines found" subtitle="Try a different search or type." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.content.map((m) => (
              <MachineCard key={m.id} machine={m} />
            ))}
          </div>
          {data && <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  );
};

export default MachineList;
