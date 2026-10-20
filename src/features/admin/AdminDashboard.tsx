import React, { useState, useEffect } from 'react';
import { useDB, getItems } from '../hooks/useDB';
import { Trash2, UserPlus, Activity, Database, ShieldAlert } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon }: { label: string, value: number, icon: any }) => (
  <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
    <div className="p-3 bg-veyra-accentBlue/20 text-veyra-accentBlue rounded-xl">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs text-veyra-textMuted uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const db = useDB();
  const [stats, setStats] = useState({ users: 0, posts: 0, videos: 0, messages: 0 });
  const [allPosts, setAllPosts] = useState<any[]>([]);

  const loadAdminData = async () => {
    if (!db) return;
    const users = await db.count('users');
    const posts = await db.count('posts');
    const videos = await db.count('videos');
    const messages = await db.count('messages');
    setStats({ users, posts, videos, messages });

    const postsList = await getItems(db, 'posts');
    setAllPosts(postsList);
  };

  useEffect(() => {
    if (db) loadAdminData();
  }, [db]);

  const deletePost = async (id: string) => {
    if (!db) return;
    await db.delete('posts', id);
    loadAdminData();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <p className="text-veyra-textMuted">Managing local instance: <span className="text-veyra-accentBlue">aldosh.pvld@gmail.com</span></p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-bold border border-red-500/30">
          <ShieldAlert size={14} />
          LOCAL PROTOTYPE MODE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.users} icon={UserPlus} />
        <StatCard label="Local Posts" value={stats.posts} icon={Activity} />
        <StatCard label="Video Assets" value={stats.videos} icon={Database} />
        <StatCard label="Total Messages" value={stats.messages} icon={MessageSquare} />
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="font-bold text-lg">Content Moderation</h2>
          <button onClick={loadAdminData} className="text-xs text-veyra-accentBlue hover:underline">Refresh Data</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-veyra-textMuted">
              <tr>
                <th className="p-4 font-medium">Post ID</th>
                <th className="p-4 font-medium">Content Snippet</th>
                <th className="p-4 font-medium">Author ID</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-veyra-textMuted">No content to moderate.</td>
                </tr>
              ) : (
                allPosts.map(post => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-xs">{post.id}</td>
                    <td className="p-4 truncate max-w-xs">{post.content}</td>
                    <td className="p-4 text-veyra-textMuted">{post.userId}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper for the icon that was missing in the imports
function MessageSquare({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
}
