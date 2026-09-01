import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { machinesApi } from '../../api/machines';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { MachineRentalResponse } from '../../types';
import { formatCurrency, formatDate, getErrorMessage, humanizeEnum, resolveImageUrl } from '../../utils/helpers';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Calendar, 
  User, 
  Edit3, 
  Trash2, 
  EyeOff, 
  Eye, 
  Wrench,
  ArrowLeft,
  Fuel,
  Gauge,
  Tag
} from 'lucide-react';

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
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-800 shadow-md border-2 border-agroo-500 hover:bg-agroo-50 hover:text-agroo-700 transition-all active:scale-95"
      >
        <ArrowLeft size={18} className="text-agroo-600" /> Back to Machines
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
        
        {/* Left Column: Images Section, Features, & Owner Action Buttons */}
        <div className="space-y-6 lg:sticky lg:top-6">
          
          {/* Main Image Box */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-50 shadow-sm border border-gray-200 flex items-center justify-center p-2">
            {activeImage ? (
              <img 
                src={activeImage} 
                alt={machine.name} 
                className="h-full w-full object-contain transition-transform duration-300 hover:scale-105" 
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl">🚜</div>
            )}
            
            {/* Machine Type Badge */}
            {machine.machineType && (
              <span className="absolute top-3 left-3 badge bg-agroo-600 text-white shadow-sm flex items-center gap-1 px-2.5 py-1">
                <Wrench size={12} /> {humanizeEnum(machine.machineType)}
              </span>
            )}
          </div>

          {/* Thumbnails Gallery */}
          {machine.images && machine.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {machine.images.map((img) => {
                const imgUrl = resolveImageUrl(img.imageUrl);
                const isActive = activeImage === imgUrl;
                return (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border transition-all bg-gray-50 p-1 ${
                      isActive ? 'border-agroo-600 ring-2 ring-agroo-500 shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl || ''} alt="" className="h-full w-full object-contain" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Features & Attachments (Moved to Left Column) */}
          {machine.features && machine.features.length > 0 && (
            <div className="card space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag size={14} /> Features & Attachments
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {machine.features.map((f) => (
                  <span key={f} className="badge bg-gray-100 text-gray-700 px-3 py-1 font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner Action Buttons */}
          {isOwner && (
            <div className="card bg-gray-50/50 border-gray-200 flex flex-wrap items-center gap-2.5">
              <Link 
                to={`/machines/${machine.id}/edit`} 
                className="btn-secondary bg-white hover:bg-gray-100 text-xs shadow-sm border border-gray-200"
              >
                <Edit3 size={14} className="mr-1.5 text-gray-600" /> Edit Listing
              </Link>
              
              <button 
                onClick={handleToggle} 
                className={`btn-secondary text-xs shadow-sm border ${
                  machine.isAvailable 
                    ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' 
                    : 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                }`}
              >
                {machine.isAvailable ? <EyeOff size={14} className="mr-1.5 text-amber-600" /> : <Eye size={14} className="mr-1.5 text-green-600" />}
                {machine.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
              </button>

              <button 
                onClick={handleDelete} 
                className="btn-danger text-xs ml-auto shadow-sm"
              >
                <Trash2 size={14} className="mr-1.5" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Details Section & Owner Contact Info */}
        <div className="space-y-6">
          
          {/* Title & Price Card */}
          <div className="card space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {machine.name}
              </h1>
              <span className={`badge ${
                machine.isAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {machine.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-xl font-bold text-agroo-600">
              <span>{formatCurrency(machine.pricePerDay)} <span className="text-sm font-normal text-gray-500">/ day</span></span>
              {machine.pricePerHour && (
                <span className="text-gray-700">{formatCurrency(machine.pricePerHour)} <span className="text-sm font-normal text-gray-500">/ hr</span></span>
              )}
              {machine.pricePerAcre && (
                <span className="text-gray-700">{formatCurrency(machine.pricePerAcre)} <span className="text-sm font-normal text-gray-500">/ acre</span></span>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed pt-2 border-t border-gray-100">
              {machine.description || 'No description provided for this machine.'}
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="card grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Type</p>
              <p className="font-semibold text-gray-800 mt-0.5">{humanizeEnum(machine.machineType)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Status</p>
              <p className="font-semibold text-gray-800 mt-0.5">{humanizeEnum(machine.status)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Brand / Model</p>
              <p className="font-semibold text-gray-800 mt-0.5">{[machine.brand, machine.model].filter(Boolean).join(' ') || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Year</p>
              <p className="font-semibold text-gray-800 mt-0.5">{machine.yearOfManufacture ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Fuel Type</p>
              <p className="font-semibold text-gray-800 mt-0.5 flex items-center gap-1">
                <Fuel size={14} className="text-gray-400 shrink-0" />
                {machine.fuelType || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Horse Power</p>
              <p className="font-semibold text-gray-800 mt-0.5 flex items-center gap-1">
                <Gauge size={14} className="text-gray-400 shrink-0" />
                {machine.horsePower ? `${machine.horsePower} HP` : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Location</p>
              <p className="font-semibold text-gray-800 mt-0.5 flex items-center gap-1">
                <MapPin size={14} className="text-gray-400 shrink-0" />
                {machine.location} {machine.district ? `(${machine.district})` : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Listed Date</p>
              <p className="font-semibold text-gray-800 mt-0.5 flex items-center gap-1">
                <Calendar size={14} className="text-gray-400 shrink-0" />
                {formatDate(machine.createdAt)}
              </p>
            </div>
          </div>

          {/* Owner Contact Info Card */}
          <div className="card space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <User size={14} /> Owner Information
            </p>
            <p className="font-semibold text-gray-900">
              {machine.owner.fullName || machine.owner.username}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {machine.contactPhone && (
                <a 
                  href={`tel:${machine.contactPhone}`} 
                  className="btn-primary text-xs py-2"
                >
                  <Phone size={14} className="mr-1.5" /> Call: {machine.contactPhone}
                </a>
              )}
              {machine.contactWhatsapp && (
                <a 
                  href={`https://wa.me/${machine.contactWhatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-secondary text-xs py-2 bg-green-50 text-green-700 hover:bg-green-100"
                >
                  <MessageCircle size={14} className="mr-1.5 text-green-600" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MachineDetail;