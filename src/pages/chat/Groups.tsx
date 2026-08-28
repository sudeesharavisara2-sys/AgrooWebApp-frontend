import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { groupsApi } from '../../api/groups';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import type { ChatGroupResponse, Page } from '../../types';
import { formatDateTime, getErrorMessage, resolveImageUrl } from '../../utils/helpers';

const Groups: React.FC = () => {
  const [data, setData] = useState<Page<ChatGroupResponse> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const load = (p: number) => {
    setLoading(true);
    groupsApi
      .getMyGroups(p, 15)
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await groupsApi.create({ name, description });
      setShowCreate(false);
      setName('');
      setDescription('');
      load(0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Chat Groups</h1>
        <button className="btn-primary" onClick={() => setShowCreate((s) => !s)}>
          + New Group
        </button>
      </div>

      <ErrorAlert message={error} />

      {showCreate && (
        <form onSubmit={handleCreate} className="card space-y-3">
          <div>
            <label className="label">Group Name</label>
            <input className="input" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" disabled={creating}>
            {creating ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      )}

      {loading ? (
        <Loader />
      ) : data && data.content.length === 0 ? (
        <EmptyState title="No groups yet" subtitle="Create a group to start chatting with other farmers." />
      ) : (
        <>
          <div className="space-y-2">
            {data?.content.map((g) => (
              <Link
                key={g.id}
                to={`/chat/${g.id}`}
                className="card flex items-center gap-3 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-agroo-100 font-bold text-agroo-700">
                  {g.imageUrl ? (
                    <img src={resolveImageUrl(g.imageUrl) || ''} alt="" className="h-full w-full object-cover" />
                  ) : (
                    g.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-semibold text-gray-900">{g.name}</p>
                    {g.unreadCount > 0 && (
                      <span className="badge bg-agroo-600 text-white">{g.unreadCount}</span>
                    )}
                  </div>
                  <p className="truncate text-sm text-gray-500">
                    {g.latestMessage ? g.latestMessage.content : g.description || `${g.memberCount} members`}
                  </p>
                </div>
                {g.latestMessage && (
                  <span className="shrink-0 text-xs text-gray-400">{formatDateTime(g.latestMessage.createdAt)}</span>
                )}
              </Link>
            ))}
          </div>
          {data && <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  );
};

export default Groups;
