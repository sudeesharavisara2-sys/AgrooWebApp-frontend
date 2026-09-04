import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { groupsApi } from '../../api/groups';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import type { ChatGroupResponse, Page } from '../../types';
import { formatDateTime, getErrorMessage, resolveImageUrl } from '../../utils/helpers';
import { 
  Users, 
  Plus, 
  MessageSquare, 
  Loader2, 
  AlertCircle, 
  X 
} from 'lucide-react';

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
    setError(null);
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
    <div className="mx-auto max-w-4xl space-y-6">
      
      {/* Top Header & Action */}
      <div className="flex items-center justify-between bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-emerald-600" size={24} />
            Chat Groups
          </h1>
          <p className="text-sm text-gray-500 mt-1">Connect and chat with other members of the community.</p>
        </div>
        <button 
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-[0_6px_25px_rgba(16,185,129,0.6)] active:scale-95"
          onClick={() => setShowCreate((s) => !s)}
        >
          {showCreate ? <X size={18} /> : <Plus size={18} />}
          <span>{showCreate ? 'Cancel' : 'New Group'}</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 shadow-sm">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Create Group Form Card */}
      {showCreate && (
        <form onSubmit={handleCreate} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 animate-fadeIn">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Plus className="text-emerald-600" size={20} />
              Create New Chat Group
            </h2>
            <p className="text-sm text-gray-500 mt-1">Set up a space for discussions and collaborations.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Group Name *</label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
                placeholder="e.g., Organic Vegetable Growers"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                rows={3}
                placeholder="Describe what this group is about..."
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-[0_6px_25px_rgba(16,185,129,0.6)] active:scale-95 disabled:opacity-50 w-full sm:w-auto"
              disabled={creating}
            >
              {creating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Creating Group...</span>
                </>
              ) : (
                <span>Create Group</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Main Content List / States */}
      {loading ? (
        <div className="flex justify-center py-12 bg-white rounded-2xl shadow-xl border border-gray-100">
          <Loader />
        </div>
      ) : data && data.content.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
          <EmptyState title="No groups yet" subtitle="Create a group to start chatting with other members." />
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 space-y-4">
          <div className="space-y-3">
            {data?.content.map((g) => (
              <Link
                key={g.id}
                to={`/chat/${g.id}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-emerald-50/30 hover:border-emerald-200 transition-all shadow-sm group"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-100 font-bold text-emerald-700 shadow-inner group-hover:scale-105 transition-transform">
                  {g.imageUrl ? (
                    <img src={resolveImageUrl(g.imageUrl) || ''} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <MessageSquare size={20} className="text-emerald-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="truncate font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">{g.name}</p>
                    {g.unreadCount > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                        {g.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-gray-500">
                    {g.latestMessage ? g.latestMessage.content : g.description || `${g.memberCount} members`}
                  </p>
                </div>
                {g.latestMessage && (
                  <span className="shrink-0 text-xs text-gray-400 font-medium pl-2">
                    {formatDateTime(g.latestMessage.createdAt)}
                  </span>
                )}
              </Link>
            ))}
          </div>
          
          {data && (
            <div className="pt-4 border-t border-gray-100 flex justify-center">
              <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Groups;