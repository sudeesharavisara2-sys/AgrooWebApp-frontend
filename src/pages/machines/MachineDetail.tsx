import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { machinesApi } from '../../api/machines';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { MachineRentalResponse } from '../../types';
import { formatCurrency, formatDate, getErrorMessage, humanizeEnum, resolveImageUrl } from '../../utils/helpers';

const MachineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [machine, setMachine] = useState<MachineRentalResponse | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await machinesApi.getById(Number(id));
      setMachine(res);
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
  if (!machine) return null;

  const isOwner = user?.username === machine.owner.username;

  const handleDelete = async () => {
    if (!confirm('Delete this machine listing?')) return;
    try {
      await machinesApi.delete(machine.id);
      navigate('/machines');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleToggle = async () => {
    try {
      const updated = await machinesApi.toggleAvailability(machine.id);
      setMachine(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="aspect-video overflow-hidden rounded-xl bg-gray-100">
          {activeImage ? (
            <img src={activeImage} alt={machine.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl">🚜</div>
          )}
        </div>
        {machine.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {machine.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(resolveImageUrl(img.imageUrl))}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200"
              >
                <img src={resolveImageUrl(img.imageUrl) || ''} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{machine.name}</h1>
        <div className="flex flex-wrap gap-4 text-lg font-bold text-agroo-700">
          <span>{formatCurrency(machine.pricePerDay)} / day</span>
          {machine.pricePerHour && <span className="text-gray-500">{formatCurrency(machine.pricePerHour)} / hr</span>}
          {machine.pricePerAcre && <span className="text-gray-500">{formatCurrency(machine.pricePerAcre)} / acre</span>}
        </div>
        <p className="text-gray-600">{machine.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400">Type</p>
            <p className="font-medium">{humanizeEnum(machine.machineType)}</p>
          </div>
          <div>
            <p className="text-gray-400">Status</p>
            <p className="font-medium">{humanizeEnum(machine.status)}</p>
          </div>
          <div>
            <p className="text-gray-400">Brand / Model</p>
            <p className="font-medium">{[machine.brand, machine.model].filter(Boolean).join(' ') || '—'}</p>
          </div>
          <div>
            <p className="text-gray-400">Year</p>
            <p className="font-medium">{machine.yearOfManufacture ?? '—'}</p>
          </div>
          <div>
            <p className="text-gray-400">Fuel Type</p>
            <p className="font-medium">{machine.fuelType || '—'}</p>
          </div>
          <div>
            <p className="text-gray-400">Horse Power</p>
            <p className="font-medium">{machine.horsePower ?? '—'}</p>
          </div>
          <div>
            <p className="text-gray-400">Location</p>
            <p className="font-medium">
              {machine.location} {machine.district ? `(${machine.district})` : ''}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Listed</p>
            <p className="font-medium">{formatDate(machine.createdAt)}</p>
          </div>
        </div>

        {machine.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {machine.features.map((f) => (
              <span key={f} className="badge bg-gray-100 text-gray-600">
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="card space-y-1">
          <p className="text-sm text-gray-500">Owner</p>
          <p className="font-semibold text-gray-900">{machine.owner.fullName || machine.owner.username}</p>
          <p className="text-sm text-gray-600">📞 {machine.contactPhone}</p>
          {machine.contactWhatsapp && <p className="text-sm text-gray-600">💬 WhatsApp: {machine.contactWhatsapp}</p>}
        </div>

        {isOwner && (
          <div className="flex flex-wrap gap-3">
            <Link to={`/machines/${machine.id}/edit`} className="btn-outline">
              Edit
            </Link>
            <button className="btn-secondary" onClick={handleToggle}>
              {machine.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
            </button>
            <button className="btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineDetail;
