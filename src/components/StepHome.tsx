import React from 'react';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { BRAND_CONFIG, IMAGES_CONFIG } from '../config';
import { SafeImage } from './SafeImage';

interface StepHomeProps {
  onStart: () => void;
}

export const StepHome: React.FC<StepHomeProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-8 sm:py-12 overflow-hidden">
      {/* Background Image with Dark Atmospheric Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={IMAGES_CONFIG.heroBackground}
          alt="Ambiente natalino acolhedor"
          loading="eager"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1813] via-[#0c1813]/85 to-[#0c1813]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Pill-free Kicker */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest text-[#f3c04d] uppercase mb-4 sm:mb-6">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span>Experiência Exclusiva Noel Decore</span>
        </div>

        {/* Emotional Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#fdfbf7] tracking-tight leading-[1.15] mb-4 sm:mb-6 text-balance drop-shadow-md">
          {BRAND_CONFIG.tagline}
        </h1>

        {/* Short Subtitle */}
        <p className="text-base sm:text-lg text-[#ece5d6] max-w-lg mb-8 sm:mb-10 leading-relaxed font-normal text-balance">
          {BRAND_CONFIG.subtitle}
        </p>

        {/* Visual Preview Card of the Cozy Holiday Spirit */}
        <div className="w-full max-w-md mb-8 sm:mb-10 rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-[#13241d]/70 backdrop-blur-md p-3 shadow-2xl transition-transform hover:scale-[1.01]">
          <div className="relative rounded-xl overflow-hidden aspect-[16/10]">
            <SafeImage
              src={IMAGES_CONFIG.treeShowcase}
              alt="Árvore de Natal decorada e iluminada"
              loading="eager"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1813]/90 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-left">
              <div>
                <p className="text-xs text-[#d4af37] font-medium tracking-wide">Coleção Natalina</p>
                <p className="text-sm font-serif font-bold text-[#fdfbf7]">Árvore Completa e Iluminada</p>
              </div>
              <span className="text-xs bg-[#7f1d1d]/80 text-[#fdfbf7] px-2.5 py-1 rounded-full border border-[#d4af37]/40 font-medium">
                Pronta em minutos
              </span>
            </div>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="w-full max-w-md flex flex-col items-center gap-3">
          <button
            onClick={onStart}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] hover:from-[#991b1b] hover:to-[#651313] text-[#fdfbf7] px-6 py-4 sm:py-4.5 font-sans font-semibold text-base sm:text-lg tracking-wide shadow-xl wine-glow border border-[#f3c04d]/40 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer min-h-[48px]"
          >
            {/* Shimmer light effect */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
            <span className="relative z-10">{BRAND_CONFIG.ctaHome}</span>
            <ArrowRight className="relative z-10 w-5 h-5 text-[#f3c04d] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Time commitment indicator */}
          <div className="flex items-center gap-1.5 text-xs text-[#ded3bd]/80 font-medium pt-1">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{BRAND_CONFIG.durationBadge}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
