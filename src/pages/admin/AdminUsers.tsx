import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import Pagination from '../../components/common/Pagination';
import type { Page, User } from '../../types';
import { formatDate, getErrorMessage } from '../../utils/helpers';

const AdminUsers: React.FC = () => {
  const [data, setData] = useState<Page<User> | null>(null);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = (p: number, kw: string) => {
    setLoading(true);
    setError(null);
    const req = kw.trim() ? adminApi.searchUsers(kw, p, 10) : adminApi.getAllUsers(p, 10);
    req
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(page, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    load(0, keyword);
  };

  const runAction = async (id: number, action: (id: number) => Promise<unknown>) => {
    setBusyId(id);
    setError(null);
    try {
      await action(id);
      load(page, keyword);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user permanently?')) return;
    runAction(id, adminApi.deleteUser);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          className="input"
          placeholder="Search by username, email, name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="btn-secondary shrink-0" type="submit">
          Search
        </button>
      </form>

      <ErrorAlert message={error} />

      {loading ? (
        <Loader />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.content.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{u.fullName || u.username}</p>
                    <p className="text-xs text-gray-400">@{u.username}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="badge bg-gray-100">{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.isActive ? 'bg-agroo-100 text-agroo-700' : 'bg-red-100 text-red-600'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2 text-xs">
                      {u.isActive ? (
                        <button
                          disabled={busyId === u.id}
                          className="text-amber-600 hover:underline"
                          onClick={() => runAction(u.id, adminApi.deactivateUser)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          disabled={busyId === u.id}
                          className="text-agroo-700 hover:underline"
                          onClick={() => runAction(u.id, adminApi.activateUser)}
                        >
                          Activate
                        </button>
                      )}
                      {u.role === 'ADMIN' ? (
                        <button
                          disabled={busyId === u.id}
                          className="text-gray-600 hover:underline"
                          onClick={() => runAction(u.id, adminApi.removeAdmin)}
                        >
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          disabled={busyId === u.id}
                          className="text-gray-600 hover:underline"
                          onClick={() => runAction(u.id, adminApi.makeAdmin)}
                        >
                          Make Admin
                        </button>
                      )}
                      <button
                        disabled={busyId === u.id}
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  );
};

export default AdminUsers;
