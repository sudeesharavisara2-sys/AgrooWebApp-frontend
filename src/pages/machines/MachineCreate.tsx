import React from 'react';
import { useNavigate } from 'react-router-dom';
import { machinesApi } from '../../api/machines';
import MachineForm from '../../components/machines/MachineForm';
import type { MachineRentalRequest } from '../../types';

const MachineCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: MachineRentalRequest, images?: File[]) => {
    const created = await machinesApi.create(data, images);
    navigate(`/machines/${created.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">List a New Machine</h1>
      <div className="card">
        <MachineForm submitLabel="Create Machine" onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default MachineCreate;
