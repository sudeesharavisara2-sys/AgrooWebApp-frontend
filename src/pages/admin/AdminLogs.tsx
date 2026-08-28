import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import Pagination from '../../components/common/Pagination';
import type { ActivityLog, Page } from '../../types';
import { formatDateTime, getErrorMessage, humanizeEnum } from '../../utils/helpers';

const AdminLogs: React.FC = () => {
  const [data, setData] = useState<Page<ActivityLog> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    adminApi
      .getActivityLogs(page, 15)
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
      <ErrorAlert message={error} />

      {loading ? (
        <Loader />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Activity</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.content.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 font-medium text-gray-800">{humanizeEnum(log.activityType)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {log.user ? log.user.fullName || log.user.username : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTime(log.createdAt)}</td>
                </tr>
              ))}
              {data && data.content.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                    No activity recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  );
};

export default AdminLogs;
