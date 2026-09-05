import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { PostResponse } from '../../types';
import { getErrorMessage, resolveImageUrl } from '../../utils/helpers';
import { ImageIcon, Globe, Loader2, AlertCircle } from 'lucide-react';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostResponse | null>(null);
  
  // Form fields
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [newMedia, setNewMedia] = useState<File | null>(null);
  const [removeExistingMedia, setRemoveExistingMedia] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await postsApi.getById(Number(id));
      setPost(res);
      setContent(res.content);
      setIsPublic(res.isPublic ?? true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;
  if (!post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !id) return;
    setError(null);
    setSubmitting(true);

    try {
      if (removeExistingMedia && !newMedia && (post.mediaUrl || post.imageUrl || post.videoUrl)) {
        await postsApi.deleteMedia(post.id);
      }

      await postsApi.update(
        Number(id), 
        { content, isPublic }, 
        newMedia
      );

      navigate(`/posts/${id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const existingMediaUrl = !removeExistingMedia ? (post.mediaUrl || post.imageUrl || post.videoUrl) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>

      {existingMediaUrl && (
        <div className="card space-y-3">
          <h2 className="font-semibold text-gray-800">Current Media</h2>
          <p className="text-xs text-gray-400">
            Manage your current attached media or remove it before saving changes.
          </p>
          <div className="relative w-fit">
            {post.mediaType === 'VIDEO' ? (
              <video controls className="h-32 w-32 rounded-lg object-cover bg-black">
                <source src={resolveImageUrl(existingMediaUrl) || ''} />
              </video>
            ) : (
              <img
                src={resolveImageUrl(existingMediaUrl) || ''}
                alt="post media"
                className="h-32 w-32 rounded-lg object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => setRemoveExistingMedia(true)}
              className="mt-2 text-xs text-red-600 hover:underline block font-medium"
            >
              Remove media
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Content *</label>
            <textarea
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
            Upload New Media (Optional)
          </h3>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
              <div className="flex flex-col items-center justify-center pt-4 pb-5 px-4 text-center">
                <ImageIcon className="w-6 h-6 mb-1 text-emerald-600" />
                <p className="text-xs text-gray-600"><span className="font-semibold">Click to upload</span> new photo or video</p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => setNewMedia(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {newMedia && (
            <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <ImageIcon size={16} />
                </div>
                <span className="text-xs font-medium text-gray-800 truncate">{newMedia.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setNewMedia(null)}
                className="bg-red-600 text-white rounded-full p-1 shadow-md hover:scale-110 transition-all shrink-0 text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-2">
          <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer select-none bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100/80 transition-all w-fit">
            <input
              type="checkbox"
              className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <Globe size={16} className="text-emerald-600" />
            <span>Visible to everyone (public)</span>
          </label>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditPost;