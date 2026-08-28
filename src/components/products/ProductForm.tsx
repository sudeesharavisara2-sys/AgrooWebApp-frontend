import React, { useState } from 'react';
import { PRODUCT_CATEGORIES, PRODUCT_TYPES, SALE_TYPES, type ProductRequest } from '../../types';
import { humanizeEnum } from '../../utils/helpers';

interface Props {
  initial?: Partial<ProductRequest>;
  submitLabel?: string;
  allowImages?: boolean;
  onSubmit: (data: ProductRequest, images?: File[]) => Promise<void>;
}

const emptyForm: ProductRequest = {
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  unit: 'kg',
  category: 'FRESH_PRODUCE',
  productType: 'VEGETABLES',
  saleType: 'RETAIL',
  location: '',
  district: '',
  address: '',
  isAvailable: true,
  isOrganic: false,
  contactPhone: '',
  contactWhatsapp: '',
};

const ProductForm: React.FC<Props> = ({ initial, submitLabel = 'Save Product', allowImages = true, onSubmit }) => {
  const [form, setForm] = useState<ProductRequest>({ ...emptyForm, ...initial });
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProductRequest>(key: K, value: ProductRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(form, images);
    } catch (err) {
      setError((err as { message?: string })?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div>
        <label className="label">Product Name</label>
        <input
          className="input"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Price (Rs.)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input"
            required
            value={form.price}
            onChange={(e) => update('price', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label">Quantity</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input"
            value={form.quantity}
            onChange={(e) => update('quantity', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label">Unit</label>
          <input
            className="input"
            placeholder="kg, liter, unit..."
            value={form.unit}
            onChange={(e) => update('unit', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Category</label>
          <select
            className="input"
            value={form.category}
            onChange={(e) => update('category', e.target.value as ProductRequest['category'])}
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {humanizeEnum(c)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Product Type</label>
          <select
            className="input"
            value={form.productType}
            onChange={(e) => update('productType', e.target.value as ProductRequest['productType'])}
          >
            {PRODUCT_TYPES.map((t) => (
              <option key={t} value={t}>
                {humanizeEnum(t)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Sale Type</label>
          <select
            className="input"
            value={form.saleType}
            onChange={(e) => update('saleType', e.target.value as ProductRequest['saleType'])}
          >
            {SALE_TYPES.map((t) => (
              <option key={t} value={t}>
                {humanizeEnum(t)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Location</label>
          <input
            className="input"
            required
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />
        </div>
        <div>
          <label className="label">District</label>
          <input
            className="input"
            value={form.district}
            onChange={(e) => update('district', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Address</label>
          <input
            className="input"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Contact Phone</label>
          <input
            className="input"
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Harvest Date</label>
          <input
            type="date"
            className="input"
            value={form.harvestDate?.slice(0, 10) || ''}
            onChange={(e) => update('harvestDate', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Expiry Date</label>
          <input
            type="date"
            className="input"
            value={form.expiryDate?.slice(0, 10) || ''}
            onChange={(e) => update('expiryDate', e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => update('isAvailable', e.target.checked)}
          />
          Available
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isOrganic}
            onChange={(e) => update('isOrganic', e.target.checked)}
          />
          Organic
        </label>
      </div>

      {allowImages && (
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
      )}

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;
