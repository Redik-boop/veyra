import React, { useState, useEffect } from 'react';
import { useDB, getItems, putItem } from '../hooks/useDB';
import { Users, Plus, Search } from 'lucide-react';
import { cn } from '../../utils/cn';

const API_URL = 'https://veyra-server.onrender.com/api';

const GroupDetail = ({ group, onBack }: { group: any, onBack: () => void }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/groups/${group.id}/posts`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('veyra_token')}` }
        });
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [group]);

  const createGroupPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await fetch(`${API_URL}/groups/post`, {
        method: 'POST',
        headers {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('veyra_token')}`
        },
        body: JSON.stringify({ groupId: group.id, content }),
      });
      if (res.ok) {
        setContent('');
        // Refresh posts
        const dataRes = await fetch(`${API_URL}/groups/${group.id}/posts`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('veyra_token')}` }
        });
        setPosts(await dataRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="h-16 bg-veyra-charcoal border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-veyra-textMuted">←</button>
          <div className="w-10 h-10 rounded-xl bg-veyra-accentBlue flex items-center justify-center font-bold text-white">
            {group.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-sm">{group.name}</h3>
            <span className="text-[10px] text-veyra-textMuted">{group.membersCount} Members</span>
          </div>
        </div>
        <button className="p-2 bg-veyra-accentBlue/20 text-veyra-accentBlue rounded-lg text-xs font-bold hover:bg-veyra-accentBlue hover:text-white transition-all">
          Leave Group
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
        <form onSubmit={createGroupPost} className="glass-panel p-4 rounded-2xl mb-6 flex gap-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Share something with ${group.name}...`}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
          />
          <button type="submit" className="bg-veyra-accentBlue px-4 py-1 rounded-full text-xs font-bold">Post</button>
        </form>

        {posts.length === 0 ? (
          <div className="text-center py-12 text-veyra-textMuted text-sm">No community posts yet.</div>
        ) : (
          posts.map((p: any) => (
            <div key={p.id} className="glass-panel p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-veyra-accentBlue">User_{p.userId?.slice(-3)}</span>
                <span className="text-[10px] text-veyra-textMuted">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm">{p.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const Groups = () => {
  const [activeGroup, setActiveGroup] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/groups`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('veyra_token')}` }
    })
    .then(res => res.json())
    .then(setGroups)
    .catch(console.error);
  }, []);

  return (
    <div className="h-full flex overflow-hidden bg-veyra-black">
      <div className={cn("w-full md:w-80 border-r border-white/10 flex flex-col", activeGroup && "hidden md:flex")}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Groups</h1>
            <button className="p-2 bg-veyra-accentBlue rounded-full text-white hover:bg-blue-600 transition-all">
              <Plus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-veyra-textMuted" size={16} />
            <input
              type="text"
              placeholder="Search communities..."
              className="w-full bg-veyra-darkgray border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {groups.map(group => (
            <div
              key={group.id}
              onClick={() => setActiveGroup(group)}
              className={cn(
                "p-4 flex items-center gap-3 cursor-pointer transition-colors",
                activeGroup?.id === group.id ? "bg-veyra-accentBlue/20 border-r-4 border-veyra-accentBlue" : "hover:bg-white/5"
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-veyra-darkgray flex items-center justify-center font-bold text-veyra-accentBlue">
                {group.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm truncate">{group.name}</span>
                  <span className="text-[10px] text-veyra-textMuted">{group.membersCount}</span>
                </div>
                <p className="text-xs text-veyra-textMuted truncate">{group.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cn("flex-1", !activeGroup && "hidden md:flex")}>
        {activeGroup ? (
          <GroupDetail group={activeGroup} onBack={() => setActiveGroup(null)} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-veyra-textMuted p-8 text-center">
            <Users size={64} className="mb-4 opacity-20" />
            <h2 className="text-xl font-bold mb-2">Find Your Community</h2>
            <p className="text-sm max-w-xs">Join a local group to share interests and connect with others in your network.</p>
          </div>
        )}
      </div>
    </div>
  );
};
