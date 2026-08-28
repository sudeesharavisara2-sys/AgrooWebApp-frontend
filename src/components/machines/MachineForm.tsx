import React, { useState } from 'react';
import { MACHINE_STATUSES, MACHINE_TYPES, type MachineRentalRequest } from '../../types';
import { humanizeEnum } from '../../utils/helpers';

interface Props {
  initial?: Partial<MachineRentalRequest>;
  submitLabel?: string;
  onSubmit: (data: MachineRentalRequest, images?: File[]) => Promise<void>;
}

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

const MachineForm: React.FC<Props> = ({ initial, submitLabel = 'Save Machine', onSubmit }) => {
  const [form, setForm] = useState<MachineRentalRequest>({ ...emptyForm, ...initial });
  const [featuresText, setFeaturesText] = useState((initial?.features || []).join(', '));
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof MachineRentalRequest>(key: K, value: MachineRentalRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div>
        <label className="label">Machine Name</label>
        <input className="input" required value={form.name} onChange={(e) => update('name', e.target.value)} />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          className="input"
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Machine Type</label>
          <select
            className="input"
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
          <label className="label">Status</label>
          <select
            className="input"
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Price / Day (Rs.)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input"
            required
            value={form.pricePerDay}
            onChange={(e) => update('pricePerDay', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label">Price / Hour (Rs.)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input"
            value={form.pricePerHour ?? ''}
            onChange={(e) => update('pricePerHour', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
        <div>
          <label className="label">Price / Acre (Rs.)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input"
            value={form.pricePerAcre ?? ''}
            onChange={(e) => update('pricePerAcre', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Location</label>
          <input className="input" required value={form.location} onChange={(e) => update('location', e.target.value)} />
        </div>
        <div>
          <label className="label">District</label>
          <input className="input" value={form.district} onChange={(e) => update('district', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Contact Phone</label>
          <input
            className="input"
            required
            value={form.contactPhone}
            onChange={(e) => update('contactPhone', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Contact WhatsApp</label>
          <input
            className="input"
            value={form.contactWhatsapp}
            onChange={(e) => update('contactWhatsapp', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="label">Year</label>
          <input
            type="number"
            className="input"
            value={form.yearOfManufacture ?? ''}
            onChange={(e) =>
              update('yearOfManufacture', e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
        <div>
          <label className="label">Brand</label>
          <input className="input" value={form.brand} onChange={(e) => update('brand', e.target.value)} />
        </div>
        <div>
          <label className="label">Model</label>
          <input className="input" value={form.model} onChange={(e) => update('model', e.target.value)} />
        </div>
        <div>
          <label className="label">Fuel Type</label>
          <input className="input" value={form.fuelType} onChange={(e) => update('fuelType', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label">Horse Power</label>
        <input
          type="number"
          step="0.1"
          className="input"
          value={form.horsePower ?? ''}
          onChange={(e) => update('horsePower', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <div>
        <label className="label">Features (comma separated)</label>
        <input
          className="input"
          placeholder="4WD, AC, GPS..."
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
        />
      </div>

      <div>
        <label className="label">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          className="input"
          onChange={(e) => setImages(Array.from(e.target.files || []))}
        />
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default MachineForm;
