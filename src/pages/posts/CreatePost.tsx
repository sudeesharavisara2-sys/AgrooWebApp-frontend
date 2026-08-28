import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [media, setMedia] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const post = await postsApi.create({ content, isPublic }, media);
      navigate(`/posts/${post.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Share an Update</h1>
      <ErrorAlert message={error} />
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">What's on your mind?</label>
          <textarea
            className="input"
            rows={5}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share news, tips, or updates with the Agroo community..."
          />
        </div>
        <div>
          <label className="label">Photo or Video (optional)</label>
          <input
            type="file"
            accept="image/*,video/*"
            className="input"
            onChange={(e) => setMedia(e.target.files?.[0] || null)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Visible to everyone (public)
        </label>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
