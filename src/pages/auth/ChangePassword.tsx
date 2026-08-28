import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.changePassword({ currentPassword, newPassword, confirmPassword });
      setSuccess(res.message || 'Password changed successfully.');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Change Password</h1>
      <ErrorAlert message={error} />
      {success && <div className="mb-4 rounded-lg bg-agroo-50 px-4 py-3 text-sm text-agroo-700">{success}</div>}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Current Password</label>
          <input
            type="password"
            className="input"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            className="input"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <input
            type="password"
            className="input"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
