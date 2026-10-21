import React, { useState, useEffect } from 'react';
import { useDB, getItems } from '../../hooks/useDB';
import { Play, Info, Clock, User as UserIcon, Search } from 'lucide-react';
import { cn } from '../../utils/cn';

const VideoCard = ({ video, user, onSelect }: { video: any, user: any, onSelect: (v: any) => void }) => (
  <div
    onClick={() => onSelect(video)}
    className="group cursor-pointer glass-panel rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:border-white/30"
  >
    <div className="relative aspect-video bg-veyra-darkgray overflow-hidden">
      <img
        src={video.thumbnail || 'https://via.placeholder.com/400x225/121212/FFFFFF?text=Veyra+Video'}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        alt={video.title}
      />
      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
      </div>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
        <div className="w-12 h-12 bg-veyra-accentBlue rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">
          <Play fill="white" className="text-white ml-1" size={24} />
        </div>
      </div>
    </div>
    <div className="p-3 flex gap-3">
      <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden bg-gray-700">
        <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=video'} alt="user" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm truncate">{video.title}</h3>
        <p className="text-xs text-veyra-textMuted truncate">{user?.displayName}</p>
      </div>
    </div>
  </div>
);

export const VideoLibrary = () => {
  const db = useDB();
  const [videos, setVideos] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!db) return;
      const vids = await getItems(db, 'videos');
      const usrs = await getItems(db, 'users');
      setVideos(vids.filter(v => !v.isShort));
      setUsers(usrs);
    };
    load();
  }, [db]);

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Video Library</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-veyra-textMuted" size={18} />
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-veyra-darkgray border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-veyra-accentBlue"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.length === 0 ? (
          <div className="col-span-full text-center py-20 text-veyra-textMuted">
            No videos found. Try importing local files!
          </div>
        ) : (
          filteredVideos.map(v => (
            <VideoCard
              key={v.id}
              video={v}
              user={users.find(u => u.id === v.userId)}
              onSelect={setSelectedVideo}
            />
          ))
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="w-full max-w-4xl glass-panel rounded-3xl overflow-hidden flex flex-col">
            <div className="aspect-video bg-black relative group">
              <video
                src={selectedVideo.url || 'https://www.w3schools.com/html/mov_bbb.mp4'}
                controls
                autoPlay
                className="w-full h-full"
              />
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-600">
                      <img src={users.find(u => u.id === selectedVideo.userId)?.avatar} alt="user" />
                    </div>
                    <span className="text-sm text-veyra-textMuted">{users.find(u => u.id === selectedVideo.userId)?.displayName}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-veyra-accentBlue rounded-full text-sm font-bold">Save</button>
                  <button className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold hover:bg-white/20">Share</button>
                </div>
              </div>
              <p className="text-veyra-textMuted text-sm leading-relaxed mb-6">
                {selectedVideo.description}
              </p>
              <div className="border-t border-white/10 pt-4">
                <h3 className="font-bold mb-4">Comments</h3>
                <div className="text-sm text-veyra-textMuted py-4 text-center">
                  No comments yet. Be the first to comment!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
