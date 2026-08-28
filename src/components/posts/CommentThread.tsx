import React, { useState } from 'react';
import { commentsApi } from '../../api/comments';
import { useAuth } from '../../context/AuthContext';
import type { CommentResponse } from '../../types';
import { formatDateTime, getErrorMessage } from '../../utils/helpers';

interface Props {
  comment: CommentResponse;
  postId: number;
  onDeleted: (id: number) => void;
}

const CommentItem: React.FC<Props> = ({ comment, postId, onDeleted }) => {
  const { user } = useAuth();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<CommentResponse[]>(comment.replies || []);
  const [error, setError] = useState<string | null>(null);

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const reply = await commentsApi.add(postId, {
        content: replyText,
        parentCommentId: comment.id,
      });
      setReplies((r) => [...r, reply]);
      setReplyText('');
      setReplying(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    try {
      await commentsApi.delete(comment.id);
      onDeleted(comment.id);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const canDelete = user && (user.username === comment.user.username || user.role === 'ADMIN');

  return (
    <div className="border-l-2 border-gray-100 pl-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-semibold text-gray-800">
            {comment.user.fullName || comment.user.username}
          </span>
          <p className="text-sm text-gray-600">{comment.content}</p>
          <span className="text-xs text-gray-400">{formatDateTime(comment.createdAt)}</span>
        </div>
        <div className="flex gap-2 text-xs text-gray-400">
          <button onClick={() => setReplying((r) => !r)} className="hover:text-agroo-600">
            Reply
          </button>
          {canDelete && (
            <button onClick={handleDelete} className="hover:text-red-600">
              Delete
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {replying && (
        <form onSubmit={submitReply} className="mt-2 flex gap-2">
          <input
            className="input"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button type="submit" className="btn-primary shrink-0">
            Send
          </button>
        </form>
      )}

      {replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {replies.map((r) => (
            <CommentItem
              key={r.id}
              comment={r}
              postId={postId}
              onDeleted={(id) => setReplies((rs) => rs.filter((x) => x.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentThread: React.FC<{ postId: number; comments: CommentResponse[] }> = ({ postId, comments }) => {
  const [list, setList] = useState<CommentResponse[]>(comments);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const comment = await commentsApi.add(postId, { content: text });
      setList((c) => [...c, comment]);
      setText('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={addComment} className="flex gap-2">
        <input
          className="input"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0">
          Post
        </button>
      </form>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="space-y-3">
        {list.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            postId={postId}
            onDeleted={(id) => setList((cs) => cs.filter((x) => x.id !== id))}
          />
        ))}
        {list.length === 0 && <p className="text-sm text-gray-400">No comments yet. Be the first!</p>}
      </div>
    </div>
  );
};

export default CommentThread;
