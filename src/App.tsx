/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { Sparkles, Leaf, Share2, RotateCcw, X, Heart, Star, Camera, Music, BookOpen, Utensils, MessageCircle, Play, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MISSIONS, Mission } from './missions';

// --- Components ---

const CharacterNabta = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-xl">
      <defs>
        <radialGradient id="nabtaHeadGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#AEE67A" />
          <stop offset="100%" stopColor="#76B041" />
        </radialGradient>
        <radialGradient id="nabtaEyeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#3E1D00" />
        </radialGradient>
      </defs>
      {/* Sprout */}
      <g transform="translate(50, 15)">
        <path d="M0,0 Q-15,-15 -25,-5 Q-15,5 0,0 Z" fill="#4B7E29" />
        <path d="M0,0 Q15,-15 25,-5 Q15,5 0,0 Z" fill="#5D923B" />
        <path d="M0,0 L0,-5" stroke="#3E6523" strokeWidth="1" />
      </g>
      {/* Head */}
      <circle cx="50" cy="55" r="38" fill="url(#nabtaHeadGrad)" />
      {/* Eyes Area */}
      <g transform="translate(0, 5)">
        {/* Left Eye */}
        <circle cx="36" cy="50" r="8" fill="white" />
        <circle cx="36" cy="50" r="6" fill="url(#nabtaEyeGrad)" />
        <circle cx="37" cy="48" r="2" fill="white" />
        {/* Right Eye */}
        <circle cx="64" cy="50" r="8" fill="white" />
        <circle cx="64" cy="50" r="6" fill="url(#nabtaEyeGrad)" />
        <circle cx="65" cy="48" r="2" fill="white" />
      </g>
      {/* Freckles */}
      <circle cx="30" cy="65" r="1" fill="#4B7E29" opacity="0.3" />
      <circle cx="28" cy="63" r="0.8" fill="#4B7E29" opacity="0.3" />
      <circle cx="70" cy="65" r="1" fill="#4B7E29" opacity="0.3" />
      <circle cx="72" cy="63" r="0.8" fill="#4B7E29" opacity="0.3" />
      {/* Smile */}
      <path d="M42 72 Q50 82 58 72" fill="none" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" />
      {/* Body / Shirt */}
      <path d="M30 90 Q50 120 70 90 L75 115 Q50 120 25 115 Z" fill="#45B7AF" />
      {/* Collar */}
      <path d="M35 90 L50 100 L65 90" fill="none" stroke="#FAD02C" strokeWidth="4" />
      {/* Badge */}
      <circle cx="50" cy="108" r="4" fill="#FAD02C" />
      <path d="M50 106 L51 108 L53 108 L51.5 109 L52 111 L50 110 L48 111 L48.5 109 L47 108 L49 108 Z" fill="#FFD700" />
    </svg>
  </div>
);

const CharacterFalfool = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-xl">
      <defs>
        <radialGradient id="falfoolHeadGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FF8A80" />
          <stop offset="100%" stopColor="#D32F2F" />
        </radialGradient>
      </defs>
      {/* Head */}
      <ellipse cx="50" cy="60" r="38" ry="42" fill="url(#falfoolHeadGrad)" />
      {/* Stem */}
      <g transform="translate(50, 18)">
        <circle cx="0" cy="0" r="5" fill="#4B7E29" />
        <path d="M-8,-2 Q0,-10 8,-2" fill="none" stroke="#4B7E29" strokeWidth="3" />
        <path d="M0,0 L0,-12" stroke="#4B7E29" strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* Eyes */}
      <g transform="translate(0, 5)">
        <circle cx="36" cy="52" r="7" fill="white" />
        <circle cx="36" cy="52" r="5" fill="#3E1D00" />
        <circle cx="64" cy="52" r="7" fill="white" />
        <circle cx="64" cy="52" r="5" fill="#3E1D00" />
      </g>
      {/* Smile */}
      <path d="M44 75 Q50 80 56 75" fill="none" stroke="#1A202C" strokeWidth="3" strokeLinecap="round" />
      {/* Shirt */}
      <path d="M30 95 Q50 118 70 95 L72 110 Q50 115 28 110 Z" fill="#B3E5FC" />
      {/* Tomato Badge */}
      <circle cx="58" cy="102" r="3" fill="#D32F2F" />
      <circle cx="58" cy="99" r="1" fill="#4B7E29" />
    </svg>
  </div>
);

interface WheelProps {
  onResult: (mission: Mission) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
}

const Wheel: React.FC<WheelProps> = ({ onResult, isSpinning, setIsSpinning }) => {
  const [rotation, setRotation] = useState(0);
  const controls = useAnimation();
  const numSlices = MISSIONS.length;
  const sliceAngle = 360 / numSlices;

  const spin = useCallback(async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const randomRotation = 1440 + Math.floor(Math.random() * 360);
    const finalRotation = rotation + randomRotation;
    
    await controls.start({
      rotate: finalRotation,
      transition: { duration: 5, ease: [0.12, 0, 0.39, 0] }
    });

    setRotation(finalRotation % 360);
    const landingAngle = (360 - (finalRotation % 360)) % 360;
    const missionIndex = Math.floor(landingAngle / sliceAngle);
    
    setIsSpinning(false);
    onResult(MISSIONS[missionIndex]);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#88C057', '#45B7AF', '#FAD02C', '#F87171']
    });
  }, [controls, isSpinning, onResult, rotation, setIsSpinning, sliceAngle]);

  return (
    <div className="relative w-full max-w-[320px] aspect-square mx-auto">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-nabta-teal/10 rounded-full blur-3xl animate-pulse" />
      
      {/* Pointer */}
      <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 z-20">
         <motion.div 
           animate={isSpinning ? { rotate: [0, -10, 10, -10, 0] } : {}}
           transition={{ duration: 0.2, repeat: Infinity }}
           className="w-10 h-12 flex items-center justify-center"
         >
           <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-lg">
             <path d="M12 21l-8-14h16l-8 14z" fill="#FAD02C" stroke="#2D3748" strokeWidth="1" />
           </svg>
         </motion.div>
      </div>

      {/* The Wheel */}
      <motion.div
        animate={controls}
        className="w-full h-full rounded-full border-[6px] border-white shadow-2xl overflow-hidden relative"
        style={{ transformOrigin: 'center center' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {MISSIONS.map((mission, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = (index + 1) * sliceAngle;
            
            // Calculate SVG path for the slice
            const x1 = 50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180));
            const y1 = 50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180));
            const x2 = 50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180));
            const y2 = 50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180));

            return (
              <g key={mission.id}>
                <path
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                  fill={mission.color}
                  stroke="white"
                  strokeWidth="0.2"
                />
                <text
                  x="50"
                  y="15"
                  transform={`rotate(${(startAngle + endAngle) / 2}, 50, 50)`}
                  fill="white"
                  fontSize="3"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="select-none pointer-events-none"
                  dominantBaseline="middle"
                >
                  {mission.emoji}
                </text>
              </g>
            );
          })}
          {/* Inner Circle */}
          <circle cx="50" cy="50" r="8" fill="white" className="shadow-inner" />
          <circle cx="50" cy="50" r="5" fill="#45B7AF" />
        </svg>
      </motion.div>

      {/* Center Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-white shadow-xl hover:scale-110 active:scale-95 transition-transform flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <motion.div
          animate={isSpinning ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-nabta-teal flex flex-col items-center"
        >
          <Leaf size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-bold font-display uppercase tracking-tight">لفّي</span>
        </motion.div>
      </button>
    </div>
  );
};

export default function App() {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    if (navigator.share && selectedMission) {
      try {
        await navigator.share({
          title: 'مهمتي السرية من عجلة نبتة 🌱',
          text: `مهمتي النهاردة هي: ${selectedMission.text} ${selectedMission.emoji} 💚`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 opacity-30 w-48 h-48 text-nabta-green pointer-events-none">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" /></svg>
      </div>
      <div className="absolute bottom-[-40px] right-[-40px] opacity-20 w-80 h-80 text-nabta-teal pointer-events-none">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" /></svg>
      </div>
      <div className="absolute top-1/4 right-5 text-nabta-yellow/40 pointer-events-none"><Sparkles size={48} /></div>

      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-50 bg-nabta-beige flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="text-center"
            >
              <CharacterNabta className="w-48 h-48 mx-auto" />
              <h1 className="text-4xl font-display font-bold text-nabta-dark-green mt-4">بيت نبتة 🌱</h1>
              <p className="text-nabta-teal font-medium mt-2">عجلة المهمات السرية...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-lg z-10 space-y-8 py-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 shadow-sm mb-2"
          >
            <Sparkles className="text-nabta-yellow animate-pulse" size={18} />
            <span className="text-sm font-bold text-nabta-dark-green uppercase tracking-wide">بيت نبتة • مكانك الآمن كأم</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-display font-black text-nabta-dark-green tracking-tight leading-tight drop-shadow-sm">
             عجلة نبتة <br /> <span className="text-nabta-green">للمهمات السرية</span> 🌱✨
          </h1>
          <p className="text-xl md:text-2xl text-nabta-dark-green font-medium opacity-80 max-w-md mx-auto">
            لفّي العجلة وخدي مهمتك السرية النهارده 💚
          </p>
        </header>

        {/* Game Area */}
        <section className="relative">
          <Wheel 
            onResult={setSelectedMission} 
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
          
          {/* Character Peeking */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-12 -right-8 w-32 h-32 md:w-44 md:h-44 pointer-events-none drop-shadow-2xl"
          >
            <CharacterNabta />
          </motion.div>
        </section>

        {/* Footer Info */}
        <footer className="text-center pt-8 bg-white/30 backdrop-blur-sm rounded-3xl p-6 border border-white/40">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-nabta-green rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-nabta-dark-green">نبتة • فلفول</span>
            </div>
            <div className="flex items-center gap-4 text-nabta-dark-green">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white/70 shadow-inner flex items-center justify-center mb-1">
                  <Heart size={20} className="text-nabta-red" />
                </div>
                <span className="text-[10px] font-bold uppercase">حبّ</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white/70 shadow-inner flex items-center justify-center mb-1">
                   <CharacterFalfool className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-bold uppercase">فلفول</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Result Modal */}
      <AnimatePresence>
        {selectedMission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nabta-dark-green/20 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-sm frosted-card rounded-[3rem] p-10 overflow-hidden relative text-center border-[6px] border-white/60"
            >
              <button 
                onClick={() => setSelectedMission(null)}
                className="absolute top-4 right-4 p-2 text-nabta-dark-green/40 hover:text-nabta-dark-green transition-colors"
              >
                <X size={28} />
              </button>

              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center text-5xl mb-8 shadow-inner mx-auto border border-white"
              >
                {selectedMission.emoji}
              </motion.div>

              <h2 className="text-2xl font-bold text-nabta-dark-green mb-4">مهمتكِ هي:</h2>
              
              <div className="mb-10">
                 <p className="text-3xl md:text-4xl font-display font-black text-nabta-dark-green leading-snug">
                   {selectedMission.text}
                 </p>
              </div>

              <div className="flex flex-col gap-4 w-full">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-3 w-full py-6 bg-nabta-teal text-white rounded-3xl font-black text-xl shadow-[0_8px_0_#4A8A9A] hover:bg-nabta-teal/90 transition-all hover:scale-[1.02] active:scale-[0.98] active:translate-y-1 active:shadow-none"
                >
                  <Share2 size={24} />
                  مشاركة المهمة
                </button>
                
                <button
                  onClick={() => setSelectedMission(null)}
                  className="flex items-center justify-center gap-3 w-full py-6 chunky-button text-white rounded-3xl font-black text-xl"
                >
                  <RotateCcw size={24} />
                  لفّي العجلة تاني!
                </button>
              </div>

              {/* Character decoration in modal */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 opacity-30 pointer-events-none">
                <CharacterFalfool />
              </div>

              {/* Decorative elements */}
              <div className="absolute top-6 left-8 text-nabta-yellow/60 animate-bounce"><Star size={24} fill="currentColor" /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Floating Emojis */}
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="fixed top-20 right-[15%] text-3xl opacity-20 pointer-events-none"
      >
        🌸
      </motion.div>
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="fixed bottom-32 left-[10%] text-3xl opacity-20 pointer-events-none"
      >
        🍓
      </motion.div>
    </div>
  );
}
