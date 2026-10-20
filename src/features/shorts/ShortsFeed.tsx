import React, { useState, useEffect, useRef } from 'react';
import { useDB, getItems } from '../hooks/useDB';
import { Heart, MessageCircle, Share2, Music2, User } from 'lucide-react';
import { cn } from '../../utils/cn';

const ShortVideo = ({ video, user }: { video: any, user: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative h-full w-full bg-black snap-start flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={video.url || 'https://www.w3schools.com/html/mov_bbb.mp4'} // Local fallback for demo
        className="h-full w-full object-cover"
        loop
        playsInline
        onClick={togglePlay}
      />

      {/* Play Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setLiked(!liked)}
            className={cn("p-3 rounded-full bg-black/30 backdrop-blur-md transition-colors", liked && "text-red-500")}
          >
            <Heart size={28} fill={liked ? "currentColor" : "none"} />
          </button>
          <span className="text-xs font-bold">{video.likes?.length || 12}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button className="p-3 rounded-full bg-black/30 backdrop-blur-md">
            <MessageCircle size={28} />
          </button>
          <span className="text-xs font-bold">84</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <button className="p-3 rounded-full bg-black/30 backdrop-blur-md">
            <Share2 size={28} />
          </button>
          <span className="text-xs font-bold">Share</span>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-800">
          <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=video'} alt="user" />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute left-4 bottom-8 right-16 z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-lg">@{user?.username || 'creator'}</span>
          <button className="bg-veyra-accentBlue text-white text-xs px-3 py-1 rounded-full font-bold">Follow</button>
        </div>
        <p className="text-sm line-clamp-2 mb-3">{video.description}</p>
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Music2 size={14} />
          <span className="animate-marquee whitespace-nowrap">Original Sound - {user?.displayName}</span>
        </div>
      </div>
    </div>
  );
};

export const ShortsFeed = () => {
  const db = useDB();
  const [videos, setVideos] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!db) return;
      const vids = await getItems(db, 'videos');
      const usrs = await getItems(db, 'users');
      setVideos(vids.filter(v => v.isShort));
      setUsers(usrs);
    };
    load();
  }, [db]);

  const findUser = (id: string) => users.find(u => u.id === id);

  return (
    <div className="h-[calc(100vh-120px)] w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-black snap-y snap-mandatory overflow-y-scroll custom-scrollbar">
      {videos.length === 0 ? (
        <div className="h-full flex items-center justify-center text-veyra-textMuted p-8 text-center">
          No short videos available. Import some to get started!
        </div>
      ) : (
        videos.map(v => <ShortVideo key={v.id} video={v} user={findUser(v.userId)} />)
      )}
    </div>
  );
};
