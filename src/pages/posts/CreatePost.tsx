import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import { getErrorMessage } from '../../utils/helpers';
import { 
  Share2, 
  Image as ImageIcon, 
  Globe, 
  Loader2, 
  AlertCircle, 
  X 
} from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 max-w-xl mx-auto">
      
      {/* Header Title */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Share2 className="text-emerald-600" size={24} />
          Share an Update
        </h2>
        <p className="text-sm text-gray-500 mt-1">Share news, tips, or updates with the Agroo community...</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 shadow-sm">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section: Content */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">What's on your mind? *</label>
          <textarea
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 transition-all focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            rows={5}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your update here..."
          />
        </div>
      </div>

      {/* Section: Media Upload */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
          Media Attachment
        </h3>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <ImageIcon className="w-8 h-8 mb-2 text-emerald-600" />
              <p className="mb-1 text-sm text-gray-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-400">Photo or Video (MAX. 800x400px)</p>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => setMedia(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* Selected Media Preview */}
        {media && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Selected Attachment:</p>
            <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <ImageIcon size={20} />
                </div>
                <span className="text-sm font-medium text-gray-800 truncate">{media.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setMedia(null)}
                className="bg-red-600 text-white rounded-full p-1.5 shadow-md opacity-80 hover:opacity-100 transition-all hover:scale-110 shrink-0"
                title="Remove attachment"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section: Visibility */}
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

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-[0_6px_25px_rgba(16,185,129,0.6)] active:scale-95 disabled:opacity-50 w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Posting...</span>
            </>
          ) : (
            <span>Post Update</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;