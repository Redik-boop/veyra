import React, { useState, useEffect } from 'react';
import { Search, User, FileText, Music, Video, Compass } from 'lucide-react';
import { useDB, getItems } from '../../hooks/useDB';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

export const ExplorePage: React.FC = () => {
  const db = useDB();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<{ type: 'user' | 'post' | 'video' | 'music', data: any }[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts' | 'media'>('all');

  useEffect(() => {
    if (!db) return;

    const performSearch = async () => {
      if (!searchQuery) {
        setResults([]);
        return;
      }

      const q = searchQuery.toLowerCase();
      const searchResults: any[] = [];

      // Search Users
      const users = await getItems<any>(db, 'users');
      users.forEach(u => {
        if (u.username.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q)) {
          searchResults.push({ type: 'user', data: u });
        }
      });

      // Search Posts
      const posts = await getItems<any>(db, 'posts');
      posts.forEach(p => {
        if (p.content.toLowerCase().includes(q)) {
          searchResults.push({ type: 'post', data: p });
        }
      });

      // Search Videos
      const videos = await getItems<any>(db, 'videos');
      videos.forEach(v => {
        if (v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)) {
          searchResults.push({ type: 'video', data: v });
        }
      });

      // Search Music
      const music = await getItems<any>(db, 'music');
      music.forEach(m => {
        if (m.title.toLowerCase().includes(q) || m.artist.toLowerCase().includes(q)) {
          searchResults.push({ type: 'music', data: m });
        }
      });

      setResults(searchResults);
    };

    performSearch();
  }, [db, searchQuery]);

  const filteredResults = results.filter(r => {
    if (activeTab === 'all') return true;
    if (activeTab === 'users') return r.type === 'user';
    if (activeTab === 'posts') return r.type === 'post';
    if (activeTab === 'media') return r.type === 'video' || r.type === 'music';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Explore Veyra</h1>
        <p className="text-veyra-textMuted">Discover local content, users, and media</p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-veyra-textMuted group-focus-within:text-veyra-accentBlue transition-colors" size={20} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users, posts, music, videos..."
          className="w-full bg-veyra-charcoal border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-veyra-accentBlue transition-all text-lg backdrop-blur-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'users', 'posts', 'media'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap",
              activeTab === tab
                ? "bg-veyra-accentBlue text-white shadow-lg shadow-veyra-accentBlue/20"
                : "bg-veyra-charcoal text-veyra-textMuted hover:bg-white/5"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {searchQuery && filteredResults.length === 0 && (
          <div className="text-center py-20 glass-panel rounded-3xl">
            <Compass className="mx-auto text-veyra-textMuted mb-4" size={48} />
            <p className="text-veyra-textMuted">No results found for "{searchQuery}"</p>
          </div>
        )}

        {filteredResults.map((result, idx) => (
          <div
            key={idx}
            className="glass-panel p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-veyra-darkgray flex items-center justify-center text-veyra-accentBlue shrink-0">
              {result.type === 'user' && <User size={24} />}
              {result.type === 'post' && <FileText size={24} />}
              {result.type === 'music' && <Music size={24} />}
              {result.type === 'video' && <Video size={24} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold truncate">
                  {result.type === 'user' && result.data.displayName}
                  {result.type === 'post' && result.data.content.slice(0, 50) + (result.data.content.length > 50 ? '...' : '')}
                  {result.type === 'music' && result.data.title}
                  {result.type === 'video' && result.data.title}
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-veyra-textMuted font-bold">
                  {result.type}
                </span>
              </div>
              <p className="text-sm text-veyra-textMuted truncate">
                {result.type === 'user' && result.data.bio}
                {result.type === 'post' && `Posted by ${result.data.userId}`}
                {result.type === 'music' && result.data.artist}
                {result.type === 'video' && result.data.description}
              </p>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-2 rounded-full bg-veyra-accentBlue text-white">
                <Compass size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
