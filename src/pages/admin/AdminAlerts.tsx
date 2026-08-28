import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import Pagination from '../../components/common/Pagination';
import { ALERT_TYPES, type AlertRequest, type AlertResponse, type Page } from '../../types';
import { formatDateTime, getErrorMessage, humanizeEnum } from '../../utils/helpers';

const emptyForm: AlertRequest = { title: '', content: '', alertType: 'SYSTEM', location: '', isUrgent: false };

const AdminAlerts: React.FC = () => {
  const [data, setData] = useState<Page<AlertResponse> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AlertRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const load = (p: number) => {
    setLoading(true);
    adminApi
      .getAllAlerts(p, 10)
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const update = <K extends keyof AlertRequest>(key: K, value: AlertRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await adminApi.updateAlert(editingId, form);
      } else {
        await adminApi.createAlert(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load(page);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (a: AlertResponse) => {
    setEditingId(a.id);
    setForm({
      title: a.title,
      content: a.content,
      alertType: a.alertType,
      location: a.location || '',
      isUrgent: a.isUrgent,
    });
  };

  const handleDeactivate = async (id: number) => {
    try {
      await adminApi.deactivateAlert(id);
      load(page);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this alert?')) return;
    try {
      await adminApi.deleteAlert(id);
      load(page);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
      <ErrorAlert message={error} />

      <form onSubmit={handleSubmit} className="card space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            className="input"
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
          />
          <select
            className="input"
            value={form.alertType}
            onChange={(e) => update('alertType', e.target.value as AlertRequest['alertType'])}
          >
            {ALERT_TYPES.map((t) => (
              <option key={t} value={t}>
                {humanizeEnum(t)}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className="input"
          rows={2}
          placeholder="Content"
          required
          value={form.content}
          onChange={(e) => update('content', e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-4">
          <input
            className="input max-w-xs"
            placeholder="Location (optional)"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isUrgent}
              onChange={(e) => update('isUrgent', e.target.checked)}
            />
            Urgent
          </label>
          <button type="submit" className="btn-primary" disabled={saving}>
            {editingId ? 'Update Alert' : 'Create Alert'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-3">
          {data?.content.map((a) => (
            <div key={a.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    <span className="badge bg-gray-100">{humanizeEnum(a.alertType)}</span>
                    {a.isUrgent && <span className="badge bg-red-100 text-red-600">Urgent</span>}
                    {!a.isActive && <span className="badge bg-gray-200 text-gray-500">Inactive</span>}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{a.content}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {a.location ? `${a.location} · ` : ''}
                    {formatDateTime(a.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1 text-xs">
                  <button className="text-agroo-700 hover:underline" onClick={() => handleEdit(a)}>
                    Edit
                  </button>
                  {a.isActive && (
                    <button className="text-amber-600 hover:underline" onClick={() => handleDeactivate(a.id)}>
                      Deactivate
                    </button>
                  )}
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(a.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {data && data.content.length === 0 && <p className="text-center text-gray-400">No alerts yet.</p>}
        </div>
      )}

      {data && <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  );
};

export default AdminAlerts;
