import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { machinesApi } from '../../api/machines';
import MachineForm from '../../components/machines/MachineForm';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { MachineRentalRequest, MachineRentalResponse } from '../../types';
import { getErrorMessage, resolveImageUrl } from '../../utils/helpers';

const MachineEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [machine, setMachine] = useState<MachineRentalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await machinesApi.getById(Number(id));
      setMachine(res);
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

  const initial: Partial<MachineRentalRequest> = {
    name: machine.name,
    description: machine.description || '',
    machineType: machine.machineType,
    pricePerDay: machine.pricePerDay,
    pricePerHour: machine.pricePerHour ?? undefined,
    pricePerAcre: machine.pricePerAcre ?? undefined,
    location: machine.location,
    district: machine.district || '',
    contactPhone: machine.contactPhone,
    contactWhatsapp: machine.contactWhatsapp || '',
    status: machine.status,
    yearOfManufacture: machine.yearOfManufacture ?? undefined,
    brand: machine.brand || '',
    model: machine.model || '',
    fuelType: machine.fuelType || '',
    horsePower: machine.horsePower ?? undefined,
    features: machine.features,
  };

  const handleSubmit = async (data: MachineRentalRequest, images?: File[]) => {
    await machinesApi.update(machine.id, data, images);
    navigate(`/machines/${machine.id}`);
  };

  const handleSetPrimary = async (imageId: number) => {
    const updated = await machinesApi.setPrimaryImage(imageId);
    setMachine(updated);
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Remove this image?')) return;
    await machinesApi.deleteImage(imageId);
    load();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Machine</h1>

      {machine.images.length > 0 && (
        <div className="card space-y-3">
          <h2 className="font-semibold text-gray-800">Images</h2>
          <div className="flex flex-wrap gap-3">
            {machine.images.map((img) => (
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
          <p className="text-xs text-gray-400">Uploading new images below will add to this listing.</p>
        </div>
      )}

      <div className="card">
        <MachineForm initial={initial} submitLabel="Save Changes" onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default MachineEdit;
