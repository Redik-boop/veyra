import React, { useState, useEffect } from 'react';
import { User, Settings, Battery, Moon, Sun, Palette, Volume2, Bell, Lock } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ProfileSettings = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState(false);
  const [mood, setMood] = useState('Neutral');

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setBatteryCharging(battery.charging);
        battery.addEventListener('levelchange', () => setBatteryLevel(Math.round(battery.level * 100)));
        battery.addEventListener('chargingchange', () => setBatteryCharging(battery.charging));
      });
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.style.backgroundColor = newTheme === 'dark' ? '#000000' : '#F5F5F5';
    document.body.style.color = newTheme === 'dark' ? '#FFFFFF' : '#121212';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-veyra-accentBlue overflow-hidden border-4 border-white/10">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-veyra-accentBlue rounded-full text-white shadow-lg hover:scale-110 transition-transform">
                <Palette size={14} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold">Alex Rivers</h2>
              <p className="text-veyra-textMuted text-sm">@alex_dev</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-veyra-textMuted uppercase">Display Name</label>
              <input
                type="text"
                defaultValue="Alex Rivers"
                className="w-full bg-veyra-darkgray border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-veyra-accentBlue"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-veyra-textMuted uppercase">Username</label>
              <input
                type="text"
                defaultValue="alex_dev"
                className="w-full bg-veyra-darkgray border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-veyra-accentBlue"
              />
            </div>
          </div>
        </div>

        {/* System Status Section (Battery & Mood) */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Settings size={20} className="text-veyra-accentBlue" />
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Battery Widget */}
            <div className="bg-white/5 p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-white/5">
              <div className="relative">
                <Battery
                  size={32}
                  className={cn(
                    "transition-colors",
                    (batteryLevel ?? 0) < 20 ? "text-red-500" : "text-green-500"
                  )}
                />
                {batteryCharging && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-sm font-bold">{batteryLevel !== null ? `${batteryLevel}%` : 'N/A'}</span>
              <span className="text-[10px] text-veyra-textMuted uppercase">{batteryCharging ? 'Charging' : 'Discharging'}</span>
            </div>

            {/* Mood Selector */}
            <div className="bg-white/5 p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-white/5">
              <div className="text-2xl mb-1">
                {mood === 'Happy' ? '😊' : mood === 'Chill' ? '😎' : mood === 'Focus' ? '🎯' : '😐'}
              </div>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="bg-transparent text-sm font-bold text-center focus:outline-none cursor-pointer"
              >
                <option value="Neutral">Neutral</option>
                <option value="Happy">Happy</option>
                <option value="Chill">Chill</option>
                <option value="Focus">Focus</option>
              </select>
              <span className="text-[10px] text-veyra-textMuted uppercase">Current Mood</span>
            </div>

            {/* Theme Toggle */}
            <div className="bg-white/5 p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-white/5">
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    theme === 'light' ? "bg-white text-black" : "bg-white/10 text-white"
                  )}
                >
                  <Sun size={20} />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    theme === 'dark' ? "bg-veyra-accentBlue text-white" : "bg-white/10 text-white"
                  )}
                >
                  <Moon size={20} />
                </button>
              </div>
              <span className="text-[10px] text-veyra-textMuted uppercase">Theme Mode</span>
            </div>
          </div>
        </div>

        {/* Privacy & Prefs */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold mb-2">Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-veyra-textMuted" />
                <span className="text-sm">Push Notifications (Local)</span>
              </div>
              <div className="w-10 h-5 bg-veyra-accentBlue rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-veyra-textMuted" />
                <span className="text-sm">Private Local Profile</span>
              </div>
              <div className="w-10 h-5 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
