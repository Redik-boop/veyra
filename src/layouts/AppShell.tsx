import React from 'react';
import { Home, Film, Video, Compass, MessageSquare, Users, Music, Bell, User, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/shorts', label: 'Shorts', icon: Film },
  { to: '/videos', label: 'Videos', icon: Video },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/music', label: 'Music', icon: Music },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-veyra-black text-veyra-textMain overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-veyra-charcoal border-r border-white/10 p-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="relative w-8 h-8 bg-veyra-accentBlue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
            <div className="absolute -right-1 -bottom-1 w-2 h-2 bg-yellow-400 rounded-full" />
          </div>
          <span className="text-xl font-bold tracking-tight">Veyra</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                location.pathname === to
                  ? "bg-veyra-accentBlue text-white"
                  : "text-veyra-textMuted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-2 glass-panel rounded-xl text-xs text-veyra-textMuted text-center">
          Local Prototype v0.1.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-veyra-charcoal/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-10">
          <div className="md:hidden flex items-center gap-2">
             <div className="relative w-8 h-8 bg-veyra-accentBlue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
                <div className="absolute -right-1 -bottom-1 w-2 h-2 bg-yellow-400 rounded-full" />
              </div>
              <span className="text-lg font-bold">Veyra</span>
          </div>
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Veyra..."
                className="w-full bg-veyra-darkgray border border-white/10 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-veyra-accentBlue text-sm"
              />
              <Compass className="absolute left-3 top-2.5 text-veyra-textMuted" size={16} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/5 rounded-full text-veyra-textMuted">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-veyra-accentBlue border border-white/20" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden h-16 bg-veyra-charcoal border-t border-white/10 flex items-center justify-around px-2 z-10">
          {navItems.slice(0, 5).map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                location.pathname === to
                  ? "text-veyra-accentBlue"
                  : "text-veyra-textMuted"
              )}
            >
              <Icon size={24} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
};
