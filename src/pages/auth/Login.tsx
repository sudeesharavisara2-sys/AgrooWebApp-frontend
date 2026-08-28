import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ usernameOrEmail, password });
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Log in to Agroo</h1>
      <ErrorAlert message={error} />
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Username or Email</label>
          <input
            className="input"
            required
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        <div className="flex justify-between text-sm">
          <Link to="/forgot-password" className="text-agroo-700 hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="text-agroo-700 hover:underline">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
