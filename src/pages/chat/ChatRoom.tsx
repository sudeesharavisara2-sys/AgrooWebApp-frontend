import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { groupsApi } from '../../api/groups';
import { messagesApi } from '../../api/messages';
import { ChatSocket } from '../../api/websocket';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { ChatGroupResponse, ChatMessageResponse } from '../../types';
import { formatDateTime, getErrorMessage, resolveImageUrl } from '../../utils/helpers';

const ChatRoom: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState<ChatGroupResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [text, setText] = useState('');
  const [typingText, setTypingText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<ChatSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const gid = Number(groupId);

  useEffect(() => {
    if (!gid) return;
    setLoading(true);
    setError(null);

    Promise.all([groupsApi.getById(gid), messagesApi.getGroupMessages(gid, 0, 50)])
      .then(([g, msgPage]) => {
        setGroup(g);
        // backend returns newest-first; reverse for chronological display
        setMessages([...msgPage.content].reverse());
        messagesApi.markAsRead(gid).catch(() => undefined);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));

    const socket = new ChatSocket();
    socketRef.current = socket;
    socket.connect(() => {
      socket.subscribeToGroup(gid, (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
      socket.subscribeToTyping(gid, (info) => {
        setTypingText(info);
        setTimeout(() => setTypingText(null), 2000);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [gid]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !socketRef.current) return;
    socketRef.current.sendMessage(gid, { content: text, messageType: 'TEXT' });
    setText('');
  };

  const handleTyping = (value: string) => {
    setText(value);
    if (!socketRef.current || !user) return;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current?.sendTyping(gid, user.username);
    }, 300);
  };

  const handleLeave = async () => {
    if (!confirm('Leave this group?')) return;
    try {
      await groupsApi.leave(gid);
      navigate('/chat');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Loader />;
  if (error && !group) return <ErrorAlert message={error} />;
  if (!group) return null;

  return (
    <div className="mx-auto flex h-[75vh] max-w-2xl flex-col rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/chat" className="text-gray-400 hover:text-gray-600">
            ←
          </Link>
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-agroo-100 font-bold text-agroo-700">
            {group.imageUrl ? (
              <img src={resolveImageUrl(group.imageUrl) || ''} alt="" className="h-full w-full object-cover" />
            ) : (
              group.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{group.name}</p>
            <p className="text-xs text-gray-400">{group.memberCount} members</p>
          </div>
        </div>
        <button className="text-sm text-red-600 hover:underline" onClick={handleLeave}>
          Leave
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => {
          const isMine = m.sender.username === user?.username;
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${isMine ? 'bg-agroo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {!isMine && <p className="mb-0.5 text-xs font-semibold opacity-70">{m.sender.fullName || m.sender.username}</p>}
                <p className="whitespace-pre-wrap">{m.content}</p>
                <p className={`mt-1 text-[10px] ${isMine ? 'text-agroo-100' : 'text-gray-400'}`}>
                  {formatDateTime(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && <p className="text-center text-sm text-gray-400">No messages yet. Say hello!</p>}
        <div ref={bottomRef} />
      </div>

      {typingText && <p className="px-4 text-xs italic text-gray-400">{typingText}</p>}
      {error && <p className="px-4 text-xs text-red-600">{error}</p>}

      <form onSubmit={handleSend} className="flex gap-2 border-t border-gray-100 p-3">
        <input
          className="input"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
