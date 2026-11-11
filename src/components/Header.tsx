import React from 'react';
import { BRAND_CONFIG } from '../config';

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#0c1813]/85 border-b border-[#d4af37]/20 transition-all">
      <div className="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Wordmark with Tasteful Festive Icon */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded-md px-1 py-1"
          aria-label="Noel Decore - Página inicial"
        >
          {/* Custom refined Christmas star / tree ribbon icon */}
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7f1d1d] to-[#4a0c0c] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-sm group-hover:border-[#d4af37] transition-colors">
            <svg
              className="w-4 h-4 fill-current text-[#f3c04d]"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2L14.4 8.6L21.5 9.1L16 13.7L17.7 20.6L12 17.1L6.3 20.6L8 13.7L2.5 9.1L9.6 8.6L12 2Z" />
            </svg>
          </span>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#fdfbf7] group-hover:text-[#f3c04d] transition-colors">
              {BRAND_CONFIG.name}
            </span>
          </div>
        </button>

        {/* Subtle decorative holiday indicator */}
        <div className="flex items-center gap-1.5 text-xs text-[#d4af37]/80 font-medium tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/70" />
          <span>Coleção 2026</span>
        </div>
      </div>
    </header>
  );
};
