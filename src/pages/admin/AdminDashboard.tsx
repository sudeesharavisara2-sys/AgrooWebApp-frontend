import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { DashboardStats } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const StatCard: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
  <div className="card">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <ErrorAlert message={error} />
      {stats && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Users" value={stats.totalUsers} />
            <StatCard label="Active Users" value={stats.activeUsers} />
            <StatCard label="Products" value={stats.totalProducts} />
            <StatCard label="Posts" value={stats.totalPosts} />
            <StatCard label="Groups" value={stats.totalGroups} />
            <StatCard label="Comments" value={stats.totalComments} />
            <StatCard label="Likes" value={stats.totalLikes} />
            <StatCard label="Alerts" value={stats.totalAlerts} />
          </div>

          {stats.categoryStats && Object.keys(stats.categoryStats).length > 0 && (
            <div className="card">
              <h2 className="mb-3 font-semibold text-gray-800">Products by Category</h2>
              <div className="space-y-2">
                {Object.entries(stats.categoryStats).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{k}</span>
                    <span className="font-medium text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.dailyActivity && Object.keys(stats.dailyActivity).length > 0 && (
            <div className="card">
              <h2 className="mb-3 font-semibold text-gray-800">Recent Daily Activity</h2>
              <div className="space-y-2">
                {Object.entries(stats.dailyActivity).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{k}</span>
                    <span className="font-medium text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
