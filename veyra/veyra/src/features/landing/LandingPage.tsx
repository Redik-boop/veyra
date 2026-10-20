import React from 'react';
import { ArrowRight, Shield, Zap, Globe, Smartphone } from 'lucide-react';
import { cn } from '../utils/cn';

export const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <div className="min-h-screen bg-veyra-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-veyra-accentBlue/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-veyra-accentGreen/20 blur-[100px] rounded-full" />

        <div className="relative z-10 max-w-4xl">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 bg-veyra-accentBlue rounded-3xl flex items-center justify-center shadow-2xl shadow-veyra-accentBlue/40 rotate-3">
              <span className="text-white font-bold text-5xl -rotate-3">V</span>
              <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-yellow-400 rounded-full" />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tighter">
            Veyra<span className="text-veyra-accentBlue">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-veyra-textMuted mb-10 max-w-2xl mx-auto leading-relaxed">
            The world's first high-fidelity <span className="text-white font-semibold">offline</span> social network.
            No clouds, no tracking, just pure local connection.
          </p>

          <button
            onClick={onEnter}
            className="group bg-white text-black px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-veyra-accentBlue hover:text-white flex items-center gap-2 mx-auto"
          >
            Launch Veyra
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything you love, <span className="text-veyra-accentBlue">offline.</span></h2>
          <p className="text-veyra-textMuted">A complete suite of social tools running entirely on your device.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Zap className="text-yellow-400" />}
            title="Instant Speed"
            desc="Zero latency. No loading spinners. All data is stored locally for immediate access."
          />
          <FeatureCard
            icon={<Smartphone className="text-veyra-accentBlue" />}
            title="Shorts & Video"
            desc="Immersive vertical feeds and a full cinema library for your local media."
          />
          <FeatureCard
            icon={<Shield className="text-veyra-accentGreen" />}
            title="Total Privacy"
            desc="Your data never leaves your device. No servers, no leaks, no surveillance."
          />
          <FeatureCard
            icon={<Globe className="text-purple-400" />}
            title="Local Groups"
            desc="Build communities and share interests with others in your local network."
          />
          <FeatureCard
            icon={<div className="text-2xl">🎵</div>}
            title="Music Hub"
            desc="A dedicated local audio player with a premium vinyl-inspired experience."
          />
          <FeatureCard
            icon={<div className="text-2xl">💬</div>}
            title="Private Chat"
            desc="Secure, local direct messaging to keep your conversations strictly personal."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center">
        <p className="text-veyra-textMuted text-sm">
          © {new Date().getFullYear()} Veyra Project. Built for the offline future.
        </p>
      </footer >
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="glass-panel p-8 rounded-3xl border border-white/10 transition-all hover:border-veyra-accentBlue/50 group">
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-veyra-textMuted leading-relaxed">{desc}</p>
  </div>
);
