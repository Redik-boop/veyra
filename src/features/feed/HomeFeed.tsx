import React, { useState, useEffect } from 'react';
import { useDB } from '../hooks/useDB';
import { Send, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../hooks/useAuth';

const API_URL = 'https://veyra-server.onrender.com/api';

const CreatePost = ({ onPostCreated }: { onPostCreated: () => void }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || !currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/posts/create`, {
        method: 'POST',
        headers {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('veyra_token')}`
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to create post');
      setContent('');
      onPostCreated();
    } catch (err) {
      console.error(err);
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-4 rounded-2xl mb-6">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-veyra-accentBlue shrink-0 overflow-hidden">
          <img src={currentUser?.avatar} alt="avatar" />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening in Veyra?"
          className="flex-1 bg-transparent border-none focus:ring-0 text-veyra-textMain resize-none py-2 text-lg"
          rows={2}
        />
      </div>
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
        <div className="flex gap-4 text-veyra-textMuted">
          <button className="hover:text-veyra-accentBlue transition-colors">📷</button>
          <button className="hover:text-veyra-accentBlue transition-colors">🎥</button>
          <button className="hover:text-veyra-accentBlue transition-colors">🎵</button>
        </div>
        <button
          onClick={handlePost}
          disabled={loading}
          className="bg-veyra-accentBlue hover:bg-blue-600 text-white px-4 py-1.5 rounded-full font-bold transition-all disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

const Post = ({ post, user }: { post: any, user: any }) => {
  const [liked, setLiked] = useState(false);
  const { currentUser } = useAuth();

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/posts/like/${post._id}`, {
        method: 'POST',
        headers {
          'Authorization': `Bearer ${localStorage.getItem('veyra_token')}`
        },
      });
      if (res.ok) setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-panel p-4 rounded-2xl mb-4 transition-all hover:border-white/20">
      <div className="flex gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-700 shrink-0 overflow-hidden">
          <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown'} alt={user?.displayName} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">{user?.displayName}</span>
            <span className="text-xs text-veyra-textMuted">@{user?.username}</span>
          </div>
          <div className="text-xs text-veyra-textMuted">
            {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      <div className="text-veyra-textMain mb-4 leading-relaxed">
        {post.content}
      </div>
      <div className="flex items-center justify-between text-veyra-textMuted">
        <button
          onClick={handleLike}
          className={cn("flex items-center gap-2 hover:text-red-500 transition-colors", liked && "text-red-500")}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          <span className="text-sm">{post.likes?.length || 0}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-veyra-accentBlue transition-colors">
          <MessageCircle size={18} />
          <span className="text-sm">{post.comments?.length || 0}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
          <Repeat2 size={18} />
          <span className="text-sm">0</span>
        </button>
      </div>
    </div>
  );
};

export const HomeFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/posts/feed`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Home Feed</h1>
      <CreatePost onPostCreated={loadData} />
      {loading ? (
        <div className="text-center py-12 text-veyra-textMuted">Loading feed...</div>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-veyra-textMuted">
              No posts yet. Be the first to share something!
            </div>
          ) : (
            posts.map(post => (
              <Post key={post._id} post={post} user={post.userId} />
            ))
          )}
        </div>
      )}
    </div>
  );
};
