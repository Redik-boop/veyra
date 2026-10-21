import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AppShell } from './layouts/AppShell';
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
import { SignIn, SignUp } from './features/auth/AuthPages';

// Simple placeholders for other pages
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-full text-veyra-textMuted">
    <h2 className="text-2xl font-bold">{name} coming soon...</h2>
  </div>
);

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

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
