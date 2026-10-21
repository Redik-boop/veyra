import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, ListMusic, Disc } from 'lucide-react';
import { useDB, getItems } from '../../hooks/useDB';
import { cn } from '../../utils/cn';

export const MusicPage: React.FC = () => {
  const db = useDB();
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!db) return;
    getItems<any>(db, 'music').then(setTracks);
  }, [db]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play();
    }
  };

  const skipForward = () => {
    if (!tracks.length) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const skipBack = () => {
    if (!tracks.length) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIndex]);
  };

  return (
    <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Library Section */}
      <div className="lg:col-span-2 space-y-6 overflow-hidden flex flex-col">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Music Library</h1>
          <p className="text-veyra-textMuted">Your local sonic collection</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
          {tracks.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl">
              <Music className="mx-auto text-veyra-textMuted mb-4" size={48} />
              <p className="text-veyra-textMuted">No music found in local storage</p>
            </div>
          ) : (
            tracks.map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={cn(
                  "p-3 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border border-transparent",
                  currentTrack?.id === track.id
                    ? "bg-veyra-accentBlue/20 border-veyra-accentBlue/30 text-white"
                    : "bg-veyra-charcoal hover:bg-white/5 text-veyra-textMuted"
                )}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-lg">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{track.title}</div>
                  <div className="text-xs opacity-70 truncate">{track.artist}</div>
                </div>
                <div className="text-xs font-mono opacity-50">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Player Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 sticky top-0">
          {currentTrack ? (
            <div className="space-y-6 text-center">
              <div className="relative group mx-auto w-64 h-64">
                <div className="absolute inset-0 bg-veyra-accentBlue blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className={cn(
                  "relative w-full h-full rounded-full border-8 border-veyra-charcoal overflow-hidden shadow-2xl transition-transform duration-700",
                  isPlaying && "animate-spin-slow"
                )}>
                  <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-veyra-charcoal rounded-full border-4 border-white/10 z-10" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold truncate">{currentTrack.title}</h2>
                <p className="text-veyra-textMuted">{currentTrack.artist}</p>
              </div>

              <div className="space-y-2">
                <div className="h-1.5 w-full bg-veyra-darkgray rounded-full overflow-hidden">
                  <div
                    className="h-full bg-veyra-accentBlue transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-veyra-textMuted">
                  <span>{Math.floor(audioRef.current?.currentTime || 0 / 60)}:{(audioRef.current?.currentTime || 0 % 60).toString().padStart(2, '0')}</span>
                  <span>{Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6">
                <button onClick={skipBack} className="p-2 text-veyra-textMuted hover:text-white transition-colors">
                  <SkipBack size={24} />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
                <button onClick={skipForward} className="p-2 text-veyra-textMuted hover:text-white transition-colors">
                  <SkipForward size={24} />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <Disc className="mx-auto text-veyra-textMuted animate-pulse" size={64} />
              <p className="text-veyra-textMuted">Select a track to start listening</p>
            </div>
          )}
          <audio ref={audioRef} onEnded={skipForward} />
        </div>
      </div>
    </div>
  );
};
