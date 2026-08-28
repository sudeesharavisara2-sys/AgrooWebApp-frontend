import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { likesApi } from '../../api/likes';
import { useAuth } from '../../context/AuthContext';
import type { PostResponse } from '../../types';
import { formatDateTime, getErrorMessage, resolveImageUrl } from '../../utils/helpers';

const PostCard: React.FC<{ post: PostResponse; onDeleted?: (id: number) => void }> = ({ post }) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(post.userLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [error, setError] = useState<string | null>(null);

  const toggleLike = async () => {
    if (!isAuthenticated) {
      setError('Please log in to like posts.');
      return;
    }
    try {
      if (liked) {
        await likesApi.unlike(post.id);
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        await likesApi.like(post.id, { likeType: 'LIKE' });
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const media = post.mediaUrl || post.imageUrl || post.videoUrl;

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-agroo-100 font-bold text-agroo-700">
          {(post.user.fullName || post.user.username).charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{post.user.fullName || post.user.username}</p>
          <p className="text-xs text-gray-400">{formatDateTime(post.createdAt)}</p>
        </div>
      </div>

      <p className="whitespace-pre-wrap text-sm text-gray-700">{post.content}</p>

      {media && post.mediaType === 'VIDEO' && (
        <video controls className="max-h-96 w-full rounded-lg bg-black">
          <source src={resolveImageUrl(media) || ''} />
        </video>
      )}
      {media && post.mediaType !== 'VIDEO' && post.mediaType !== 'NONE' && (
        <img src={resolveImageUrl(media) || ''} alt="post media" className="max-h-96 w-full rounded-lg object-cover" />
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex items-center gap-6 border-t border-gray-100 pt-3 text-sm text-gray-500">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 hover:text-agroo-700 ${liked ? 'font-semibold text-agroo-600' : ''}`}
        >
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
        <Link to={`/posts/${post.id}`} className="flex items-center gap-1 hover:text-agroo-700">
          💬 {post.commentCount}
        </Link>
        <span className="flex items-center gap-1">👁 {post.viewCount}</span>
      </div>
    </div>
  );
};

export default PostCard;
