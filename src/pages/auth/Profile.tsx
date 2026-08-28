import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/user';
import ErrorAlert from '../../components/common/ErrorAlert';
import Loader from '../../components/common/Loader';
import type { UpdateProfileRequest } from '../../types';
import { formatDate, getErrorMessage } from '../../utils/helpers';

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState<UpdateProfileRequest>({});
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        district: user.district || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  if (!user) return <Loader />;

  const update = <K extends keyof UpdateProfileRequest>(key: K, value: UpdateProfileRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      await userApi.updateProfile(form);
      await refreshUser();
      setSuccess('Profile updated successfully.');
      setEditing(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <Link to="/change-password" className="btn-outline">
          Change Password
        </Link>
      </div>

      <ErrorAlert message={error} />
      {success && <div className="rounded-lg bg-agroo-50 px-4 py-3 text-sm text-agroo-700">{success}</div>}

      <div className="card space-y-1">
        <p className="text-sm text-gray-500">Username</p>
        <p className="font-medium text-gray-900">{user.username}</p>
        <p className="mt-2 text-sm text-gray-500">Email</p>
        <p className="font-medium text-gray-900">{user.email}</p>
        <p className="mt-2 text-sm text-gray-500">Role</p>
        <p className="font-medium text-gray-900">{user.role}</p>
        <p className="mt-2 text-sm text-gray-500">Member since</p>
        <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
      </div>

      <form onSubmit={handleSave} className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Details</h2>
          {!editing && (
            <button type="button" className="btn-outline" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>

        <div>
          <label className="label">Full Name</label>
          <input
            className="input"
            disabled={!editing}
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Phone Number</label>
          <input
            className="input"
            disabled={!editing}
            value={form.phoneNumber}
            onChange={(e) => update('phoneNumber', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Address</label>
            <input
              className="input"
              disabled={!editing}
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
            />
          </div>
          <div>
            <label className="label">District</label>
            <input
              className="input"
              disabled={!editing}
              value={form.district}
              onChange={(e) => update('district', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea
            className="input"
            rows={3}
            disabled={!editing}
            value={form.bio}
            onChange={(e) => update('bio', e.target.value)}
          />
        </div>

        {editing && (
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
