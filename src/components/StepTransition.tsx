import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { TRANSITION_CONFIG } from '../config';

interface StepTransitionProps {
  userName: string;
  onComplete: () => void;
}

export const StepTransition: React.FC<StepTransitionProps> = ({ userName, onComplete }) => {
  const [phase, setPhase] = useState<1 | 2>(1);

  useEffect(() => {
    // Switch to message 2 at 1.8s
    const messageTimer = setTimeout(() => {
      setPhase(2);
    }, 1800);

    // Complete transition at 3.6s and advance to the offer
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 3600);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  const msg1 = TRANSITION_CONFIG.message1.replace('{nome}', userName);
  const msg2 = TRANSITION_CONFIG.message2;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-8 text-center">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Animated Festive Emblem with Golden Rays and Twinkling Lights */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Pulsing ambient glow rings */}
          <div className="absolute w-36 h-36 rounded-full bg-[#d4af37]/15 blur-2xl animate-pulse" />
          <div className="absolute w-24 h-24 rounded-full bg-[#7f1d1d]/30 blur-xl" />

          {/* Central Ornament / Glowing Star Ring */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#7f1d1d] via-[#4a0c0c] to-[#0c1813] border-2 border-[#f3c04d] flex items-center justify-center shadow-2xl gold-glow-lg transition-transform duration-700 scale-105">
            <svg
              className="w-12 h-12 text-[#f3c04d] fill-current animate-spin"
              style={{ animationDuration: '14s' }}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2L14.4 8.6L21.5 9.1L16 13.7L17.7 20.6L12 17.1L6.3 20.6L8 13.7L2.5 9.1L9.6 8.6L12 2Z" />
            </svg>
          </div>

          {/* Floating Sparkles */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#f3c04d] animate-bounce" />
          <Sparkles className="absolute -bottom-1 -left-2 w-5 h-5 text-[#d4af37] animate-pulse" />
        </div>

        {/* Dynamic Messages */}
        <div className="min-h-[100px] flex items-center justify-center px-2">
          {phase === 1 ? (
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#fdfbf7] tracking-tight leading-snug animate-fadeIn">
              {msg1}
            </p>
          ) : (
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#f3c04d] tracking-tight leading-snug animate-fadeIn">
              {msg2}
            </p>
          )}
        </div>

        {/* Subtle Decorative Dots (Quiet indicator, no fake percentages) */}
        <div className="flex items-center gap-2 mt-6">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
          <span className="text-xs text-[#ded3bd]/70 font-medium tracking-widest uppercase">
            Preparando seu kit...
          </span>
        </div>
      </div>
    </div>
  );
};
