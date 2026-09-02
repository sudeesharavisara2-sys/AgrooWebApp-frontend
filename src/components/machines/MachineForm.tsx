import React, { useState } from 'react';
import { MACHINE_STATUSES, MACHINE_TYPES, type MachineRentalRequest } from '../../types';
import { humanizeEnum } from '../../utils/helpers';
import { 
  Wrench, 
  MapPin, 
  Phone, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  X,
  Sliders,
  Tag
} from 'lucide-react';

interface Props {
  initial?: Partial<MachineRentalRequest>;
  submitLabel?: string;
  allowImages?: boolean;
  onSubmit: (data: MachineRentalRequest, images?: File[]) => Promise<void>;
}

// List of Sri Lankan districts
const SRI_LANKAN_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

// List of standard fuel types for agricultural/industrial machines
const FUEL_TYPES = [
  'Diesel',
  'Petrol',
  'Electric',
  'Hybrid',
  'Other'
];

const emptyForm: MachineRentalRequest = {
  name: '',
  description: '',
  machineType: 'TRACTOR',
  pricePerDay: 0,
  pricePerHour: undefined,
  pricePerAcre: undefined,
  location: '',
  district: '',
  contactPhone: '',
  contactWhatsapp: '',
  status: 'AVAILABLE',
  yearOfManufacture: undefined,
  brand: '',
  model: '',
  fuelType: '',
  horsePower: undefined,
  features: [],
};

const MachineForm: React.FC<Props> = ({ initial, submitLabel = 'Save Machine', allowImages = true, onSubmit }) => {
  const [form, setForm] = useState<MachineRentalRequest>({ ...emptyForm, ...initial });
  const [featuresText, setFeaturesText] = useState((initial?.features || []).join(', '));
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof MachineRentalRequest>(key: K, value: MachineRentalRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Function to handle phone fields allowing only numbers and a maximum of 10 digits
  const handlePhoneChange = (key: 'contactPhone' | 'contactWhatsapp', value: string) => {
    const cleanedValue = value.replace(/\D/g, '').slice(0, 10);
    update(key, cleanedValue);
  };

  // Function to handle price fields allowing only positive numbers
  const handlePriceChange = (key: 'pricePerDay' | 'pricePerHour' | 'pricePerAcre', value: string) => {
    if (value === '') {
      update(key, undefined as any);
      return;
    }
    const num = Number(value);
    if (!isNaN(num) && num >= 0) {
      update(key, num);
    }
  };

  // Function to append newly selected images to the existing image array
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  // Function to remove an unwanted image from the preview list by index
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate that contact phone numbers contain exactly 10 digits if provided
    if (form.contactPhone && form.contactPhone.length !== 10) {
      setError('Contact Phone must be exactly 10 digits.');
      return;
    }
    if (form.contactWhatsapp && form.contactWhatsapp.length !== 10) {
      setError('Contact WhatsApp must be exactly 10 digits.');
      return;
    }

    setSubmitting(true);
    try {
      const features = featuresText
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);
      await onSubmit({ ...form, features }, images);
    } catch (err) {
      setError((err as { message?: string })?.message || 'Failed to save machine');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto">
      
      {/* Header Title */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Wrench className="text-emerald-600" size={24} />
          {submitLabel}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to list your machinery for rental.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 shadow-sm">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
          Basic Information
        </h3>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Machine Name *</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            required
            placeholder="e.g., Kubota Heavy Tractor"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            rows={3}
            placeholder="Write details about machine condition, horsepower, operator availability..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Machine Type</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.machineType}
              onChange={(e) => update('machineType', e.target.value as MachineRentalRequest['machineType'])}
            >
              {MACHINE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {humanizeEnum(t)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.status}
              onChange={(e) => update('status', e.target.value as MachineRentalRequest['status'])}
            >
              {MACHINE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {humanizeEnum(s)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Pricing */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
          Rental Pricing
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Price / Day (Rs.) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              required
              value={form.pricePerDay === 0 ? '' : form.pricePerDay}
              onChange={(e) => handlePriceChange('pricePerDay', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Price / Hour (Rs.)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.pricePerHour ?? ''}
              onChange={(e) => handlePriceChange('pricePerHour', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Price / Acre (Rs.)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.pricePerAcre ?? ''}
              onChange={(e) => handlePriceChange('pricePerAcre', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Location & Contact */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
          Location & Contact
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Location *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <MapPin size={16} />
              </span>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
                placeholder="City / Area"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.district || ''}
              onChange={(e) => update('district', e.target.value)}
            >
              <option value="">Select District</option>
              {SRI_LANKAN_DISTRICTS.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone (10 Digits) *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Phone size={16} />
              </span>
              <input
                type="text"
                maxLength={10}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
                placeholder="07XXXXXXXX"
                value={form.contactPhone}
                onChange={(e) => handlePhoneChange('contactPhone', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Contact WhatsApp (10 Digits)</label>
            <input
              type="text"
              maxLength={10}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="07XXXXXXXX"
              value={form.contactWhatsapp || ''}
              onChange={(e) => handlePhoneChange('contactWhatsapp', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section 4: Specifications & Features */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
          Specifications & Features
        </h3>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Year</label>
            <input
              type="number"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="e.g., 2021"
              value={form.yearOfManufacture ?? ''}
              onChange={(e) => update('yearOfManufacture', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Brand</label>
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="e.g., Kubota"
              value={form.brand || ''}
              onChange={(e) => update('brand', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Model</label>
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="e.g., L5018"
              value={form.model || ''}
              onChange={(e) => update('model', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Fuel Type</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.fuelType || ''}
              onChange={(e) => update('fuelType', e.target.value)}
            >
              <option value="">Select Fuel Type</option>
              {FUEL_TYPES.map((fuel) => (
                <option key={fuel} value={fuel}>{fuel}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Horse Power</label>
          <input
            type="number"
            step="0.1"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="e.g., 50"
            value={form.horsePower ?? ''}
            onChange={(e) => update('horsePower', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Features (comma separated)</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="4WD, AC, GPS..."
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
          />
        </div>
      </div>

      {/* Section 5: Image Upload & Previews */}
      {allowImages && (
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
            Machine Images
          </h3>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                <ImageIcon className="w-8 h-8 mb-2 text-emerald-600" />
                <p className="mb-1 text-sm text-gray-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Uploaded Images Preview Grid with Remove Option */}
          {images.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">Selected Images ({images.length}):</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((file, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md opacity-80 hover:opacity-100 transition-all hover:scale-110"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-[0_6px_25px_rgba(16,185,129,0.6)] active:scale-95 disabled:opacity-50 w-full sm:w-auto"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Saving Machine...</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default MachineForm;