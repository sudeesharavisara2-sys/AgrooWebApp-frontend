import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { AuthRequest } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const emptyForm: AuthRequest = {
  username: '',
  email: '',
  password: '',
  fullName: '',
  phoneNumber: '',
  address: '',
  district: '',
};

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<AuthRequest>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof AuthRequest>(key: K, value: AuthRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create your Agroo account</h1>
      <ErrorAlert message={error} />
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Username</label>
          <input className="input" required minLength={3} value={form.username} onChange={(e) => update('username', e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" required value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Full Name</label>
          <input className="input" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Phone Number</label>
            <input className="input" value={form.phoneNumber} onChange={(e) => update('phoneNumber', e.target.value)} />
          </div>
          <div>
            <label className="label">District</label>
            <input className="input" value={form.district} onChange={(e) => update('district', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Address</label>
          <input className="input" value={form.address} onChange={(e) => update('address', e.target.value)} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-agroo-700 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
