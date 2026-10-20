import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SignIn, SignUp } from './features/auth/AuthPages';
import { AppShell } from './layouts/AppShell';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomeFeed } from './features/feed/HomeFeed';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { ShortsFeed } from './features/shorts/ShortsFeed';
import { VideoLibrary } from './features/videos/VideoLibrary';
import { ProfileSettings } from './features/settings/ProfileSettings';
import { Messaging } from './features/messaging/Messaging';
import { Groups } from './features/groups/Groups';
import { ExplorePage } from './features/explore/ExplorePage';
import { NotificationsPage } from './features/notifications/NotificationsPage';
import { ProfilePage } from './features/profiles/ProfilePage';
import { MusicPage } from './features/music/MusicPage';

const StartupAnimation = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-veyra-black flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* The Funky Checkmark/V */}
        <svg
          viewBox="0 0 100 100"
          className="w-32 h-32 text-veyra-accentBlue"
          style={{ filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))' }}
        >
          <motion-path
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M30 50 L45 65 L70 35"
            className="animate-draw"
          />
        </svg>

        {/* The Falling and Spinning Star */}
        <div className="absolute text-yellow-400 animate-star-journey">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.86 1.4-8.168-5.934-5.787 8.2-1.192z" />
          </svg>
        </div>
      </div>
      <style>{`
        @keyframes draw {
          0% { stroke-dasharray: 0 100; opacity: 0; }
          50% { opacity: 1; }
          100% { stroke-dasharray: 100 0; opacity: 1; }
        }
        .animate-draw {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw 1.2s ease-out forwards;
        }
        @keyframes star-journey {
          0% {
            transform: translate(100px, -100vh) rotate(0deg);
            opacity: 0;
          }
          20% {
            transform: translate(80px, 0) rotate(180deg);
            opacity: 1;
          }
          50% {
            transform: translate(-100px, 0) rotate(360deg);
          }
          80% {
            transform: translate(-100px, -100px) rotate(720deg);
          }
          100% {
            transform: translate(0, -200px) rotate(1080deg) scale(0);
            opacity: 0;
          }
        }
        .animate-star-journey {
          animation: star-journey 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showAnimation) {
    return <StartupAnimation onComplete={() => setShowAnimation(false)} />;
  }

  if (!isAuthenticated) {
    return authMode === 'signin' ? (
      <SignIn onSwitch={() => setAuthMode('signup')} />
    ) : (
      <SignUp onSwitch={() => setAuthMode('signin')} />
    );
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/shorts" element={<ShortsFeed />} />
        <Route path="/videos" element={<VideoLibrary />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/messages" element={<Messaging />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<ProfileSettings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppShell>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
