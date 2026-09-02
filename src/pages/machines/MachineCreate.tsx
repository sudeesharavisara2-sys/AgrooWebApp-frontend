import React from 'react';
import { useNavigate } from 'react-router-dom';
import { machinesApi } from '../../api/machines';
import MachineForm from '../../components/machines/MachineForm';
import type { MachineRentalRequest } from '../../types';
import { ArrowLeft } from 'lucide-react';

const MachineCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: MachineRentalRequest, images?: File[]) => {
    const created = await machinesApi.create(data, images);
    navigate(`/machines/${created.id}`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6 px-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-800 shadow-md border-2 border-agroo-500 hover:bg-agroo-50 hover:text-agroo-700 transition-all active:scale-95"
      >
        <ArrowLeft size={18} className="text-agroo-600" /> Back
      </button>

      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900 tracking-tight">List a New Machine</h1>
        <div className="card">
          <MachineForm submitLabel="Create Machine" onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default MachineCreate;