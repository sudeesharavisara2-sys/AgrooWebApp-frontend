import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const VerifyOtp: React.FC = () => {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { email?: string } };
  const [email, setEmail] = useState(location.state?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifyOtp({ email, otpCode });
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setInfo(null);
    try {
      const res = await authApi.resendOtp({ email });
      setInfo(res.message || 'OTP resent successfully.');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Verify your email</h1>
      <ErrorAlert message={error} />
      {info && <div className="mb-4 rounded-lg bg-agroo-50 px-4 py-3 text-sm text-agroo-700">{info}</div>}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">OTP Code</label>
          <input
            className="input tracking-widest"
            required
            maxLength={6}
            minLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        <button type="button" className="btn-outline w-full" onClick={handleResend}>
          Resend OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
