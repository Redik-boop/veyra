import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Music, Video, Users, Shield, Zap, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const slides = [
  {
    id: 'intro',
    title: 'Welcome to Veyra',
    text: 'The world\'s first high-fidelity offline social network.',
    icon: <div className="text-6xl">🌌</div>,
    color: 'text-veyra-accentBlue',
    avatarMsg: 'Hey there! I\'m your Veyra guide. Let me show you something amazing.'
  },
  {
    id: 'privacy',
    title: 'True Privacy',
    text: 'Your data never leaves your device. No servers, no clouds, no tracking.',
    icon: <Shield size={64} className="text-veyra-accentGreen" />,
    avatarMsg: 'Everything stays right here on your machine. Total control, total privacy.'
  },
  {
    id: 'speed',
    title: 'Zero Latency',
    text: 'Experience instant loading. No spinners, no waiting, just pure speed.',
    icon: <Zap size={64} className="text-yellow-400" />,
    avatarMsg: 'Since it\'s local, it\'s effectively instant. Feel the speed!'
  },
  {
    id: 'media',
    title: 'Media Hub',
    text: 'Shorts, long-form videos, and a premium music library.',
    icon: <Video size={64} className="text-purple-400" />,
    avatarMsg: 'Your local media, reimagined with a professional cinematic interface.'
  },
  {
    id: 'social',
    title: 'Local Connection',
    text: 'Direct messages and community groups for your inner circle.',
    icon: <Users size={64} className="text-pink-400" />,
    avatarMsg: 'Build your own local ecosystem without needing an internet connection.'
  }
];

export const PromoMode = ({ onExit }: { onExit: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (isAutoPlaying) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isAutoPlaying]);

  return (
    <div className="fixed inset-0 z-[200] bg-veyra-black text-white overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-veyra-accentBlue/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-veyra-accentGreen/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl h-[600px] glass-panel rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-white/10 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="mb-8 p-6 bg-white/5 rounded-full border border-white/10 shadow-inner">
              {slides[currentSlide].icon}
            </div>
            <h2 className={cn("text-5xl font-extrabold mb-6 tracking-tight", slides[currentSlide].color)}>
              {slides[currentSlide].title}
            </h2>
            <p className="text-xl text-veyra-textMuted max-w-2xl leading-relaxed">
              {slides[currentSlide].text}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                i === currentSlide ? "bg-veyra-accentBlue w-8" : "bg-white/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Avatar Corner Guide */}
      <div className="absolute bottom-8 right-8 flex items-end gap-4 max-w-sm">
        <div className="relative animate-bounce-slow">
          <div className="w-20 h-20 rounded-full border-4 border-veyra-accentBlue overflow-hidden bg-gray-800 shadow-xl">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=VeyraGuide" alt="Guide" />
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-black animate-ping" />
        </div>
        <div className="bg-white text-black p-4 rounded-2xl rounded-br-none shadow-xl relative animate-fade-in">
          <p className="text-sm font-medium leading-snug">
            {slides[currentSlide].avatarMsg}
          </p>
          <div className="absolute -left-2 bottom-0 w-4 h-4 bg-white rotate-45" />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-8 right-8 flex gap-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="p-3 glass-panel rounded-full text-white hover:bg-white/10 transition-all"
          title={isAutoPlaying ? "Pause Tour" : "Resume Tour"}
        >
          {isAutoPlaying ? "⏸" : "▶️"}
        </button>
        <button
          onClick={onExit}
          className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-veyra-accentBlue hover:text-white transition-all shadow-lg"
        >
          Exit Promo
        </button>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
