import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import { useAuth } from '../../context/AuthContext';
import PostCard from '../../components/posts/PostCard';
import CommentThread from '../../components/posts/CommentThread';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { PostResponse } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    postsApi
      .getById(Number(id))
      .then(setPost)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;
  if (!post) return null;

  const isOwner = user?.username === post.user.username;

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await postsApi.delete(post.id);
      navigate('/posts');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PostCard post={post} />

      {/* Owner Actions */}
      {isOwner && (
        <div className="flex gap-3">
          <button 
            className="btn-secondary" 
            onClick={() => navigate(`/posts/${post.id}/edit`)}
          >
            Edit Post
          </button>
          <button 
            className="btn-danger" 
            onClick={handleDelete}
          >
            Delete Post
          </button>
        </div>
      )}

      <div className="card">
        <h2 className="mb-3 font-semibold text-gray-800">Comments</h2>
        <CommentThread postId={post.id} comments={post.comments || []} />
      </div>
    </div>
  );
};

export default PostDetail;