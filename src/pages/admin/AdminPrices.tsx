import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { PriceRequest, PriceResponse } from '../../types';
import { formatCurrency, formatDate, getErrorMessage } from '../../utils/helpers';

const emptyForm: PriceRequest = { productName: '', location: '', price: 0, unit: 'kg' };

const AdminPrices: React.FC = () => {
  const [prices, setPrices] = useState<PriceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PriceRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .getAllPrices()
      .then(setPrices)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const update = <K extends keyof PriceRequest>(key: K, value: PriceRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await adminApi.updatePrice(editingId, form);
      } else {
        await adminApi.addPrice(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: PriceResponse) => {
    setEditingId(p.id);
    setForm({ productName: p.productName, location: p.location, price: p.price, unit: p.unit || '' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this price entry?')) return;
    try {
      await adminApi.deletePrice(id);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Market Prices</h1>
      <ErrorAlert message={error} />

      <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-3 sm:grid-cols-5">
        <input
          className="input"
          placeholder="Product name"
          required
          value={form.productName}
          onChange={(e) => update('productName', e.target.value)}
        />
        <input
          className="input"
          placeholder="Location"
          required
          value={form.location}
          onChange={(e) => update('location', e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          className="input"
          placeholder="Price"
          required
          value={form.price}
          onChange={(e) => update('price', Number(e.target.value))}
        />
        <input
          className="input"
          placeholder="Unit"
          value={form.unit}
          onChange={(e) => update('unit', e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={saving}>
          {editingId ? 'Update' : 'Add'} Price
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prices.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.productName}</td>
                  <td className="px-4 py-3 text-gray-600">{p.location}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatCurrency(p.price)} {p.unit ? `/ ${p.unit}` : ''}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(p.updatedAt)}</td>
                  <td className="px-4 py-3 text-right text-xs">
                    <button className="mr-3 text-agroo-700 hover:underline" onClick={() => handleEdit(p)}>
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {prices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    No price entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPrices;
