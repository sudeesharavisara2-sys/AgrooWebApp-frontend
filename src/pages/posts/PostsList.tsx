import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import { useAuth } from '../../context/AuthContext';
import PostCard from '../../components/posts/PostCard';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import type { Page, PostResponse } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

interface Props {
  mode: 'all' | 'feed';
}

const PostsList: React.FC<Props> = ({ mode }) => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<Page<PostResponse> | null>(null);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<PostResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = mode === 'feed' ? await postsApi.getFeed(p, 10) : await postsApi.getAll(p, 10);
      setData(res);
      setSearchResults(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, mode]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      load(0);
      return;
    }
    setLoading(true);
    try {
      const res = await postsApi.search(keyword, 0, 20);
      setSearchResults(res.content);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const list = searchResults ?? data?.content ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{mode === 'feed' ? 'Your Feed' : 'Community'}</h1>
        {isAuthenticated && (
          <Link to="/posts/new" className="btn-primary">
            + New Post
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          className="input"
          placeholder="Search posts..."
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
      ) : list.length === 0 ? (
        <EmptyState title="No posts yet" subtitle="Be the first to share something with the community." />
      ) : (
        <>
          <div className="space-y-4">
            {list.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
          {!searchResults && data && <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  );
};

export default PostsList;
