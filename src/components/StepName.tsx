import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, User, Sparkles } from 'lucide-react';

interface StepNameProps {
  initialName: string;
  onContinue: (name: string) => void;
  onBack: () => void;
}

export const StepName: React.FC<StepNameProps> = ({ initialName, onContinue, onBack }) => {
  const [name, setName] = useState(initialName);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Validation: only letters and spaces, min 2 chars, supports Portuguese accents
  const trimmed = name.trim().replace(/\s+/g, ' ');
  const isValidLetterRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(trimmed);
  const isValid = trimmed.length >= 2 && isValidLetterRegex;

  // Format with title case
  const formatName = (str: string): string => {
    return str
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onContinue(formatName(trimmed));
    } else {
      setTouched(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md mx-auto">
        {/* Subtle Back Button */}
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#ded3bd]/80 hover:text-[#f3c04d] transition-colors mb-6 py-2 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao início</span>
        </button>

        {/* Card Container */}
        <div className="bg-[#13241d]/85 backdrop-blur-md border border-[#d4af37]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Top Golden Accent Light */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

          {/* Decorative Sparkle */}
          <div className="w-12 h-12 rounded-full bg-[#7f1d1d]/40 border border-[#d4af37]/30 flex items-center justify-center text-[#f3c04d] mb-5">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7] tracking-tight mb-2">
            Antes de começar, como podemos te chamar?
          </h2>

          <p className="text-sm text-[#ece5d6]/80 mb-6">
            Queremos preparar uma experiência natalina personalizada e única para você.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="user-name" className="sr-only">
                Seu primeiro nome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#d4af37]">
                  <User className="w-5 h-5" />
                </div>
                <input
                  ref={inputRef}
                  id="user-name"
                  type="text"
                  autoComplete="given-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!touched) setTouched(true);
                  }}
                  placeholder="Digite seu primeiro nome..."
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0c1813]/80 border border-[#d4af37]/40 rounded-xl text-base text-[#fdfbf7] placeholder-[#ece5d6]/40 focus:outline-none focus:ring-2 focus:ring-[#f3c04d] focus:border-[#f3c04d] transition-all shadow-inner"
                />
              </div>

              {touched && !isValid && trimmed.length > 0 && (
                <p className="text-xs text-rose-300 mt-2 pl-1">
                  Por favor, digite pelo menos 2 letras válidas.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 min-h-[48px] cursor-pointer ${
                isValid
                  ? 'bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-[#fdfbf7] hover:brightness-110 shadow-lg wine-glow border border-[#d4af37]/40 active:scale-[0.99]'
                  : 'bg-[#1b3329] text-[#ece5d6]/40 border border-white/5 cursor-not-allowed'
              }`}
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4 text-[#f3c04d]" />
            </button>
          </form>

          <p className="text-[11px] text-center text-[#ded3bd]/50 mt-4">
            Leva menos de 1 minuto para descobrir o kit ideal
          </p>
        </div>
      </div>
    </div>
  );
};
