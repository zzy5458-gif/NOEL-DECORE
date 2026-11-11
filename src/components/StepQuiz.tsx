import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../config';

interface StepQuizProps {
  userName: string;
  questionIndex: number;
  currentAnswer?: string;
  onSelectOption: (option: string) => void;
  onBack: () => void;
}

export const StepQuiz: React.FC<StepQuizProps> = ({
  userName,
  questionIndex,
  currentAnswer,
  onSelectOption,
  onBack,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(currentAnswer || null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQ = QUIZ_QUESTIONS[questionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const progressPercent = ((questionIndex + 1) / totalQuestions) * 100;

  // Substitute {nome} in the question
  const formattedQuestion = currentQ.question.replace('{nome}', userName);

  const handleSelect = (option: string) => {
    if (isTransitioning) return;
    setSelectedOption(option);
    setIsTransitioning(true);

    // Auto-advance after 400ms as requested
    setTimeout(() => {
      onSelectOption(option);
      setSelectedOption(null);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-xl mx-auto">
        {/* Navigation / Progress Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#ded3bd]/80 hover:text-[#f3c04d] transition-colors py-2 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#d4af37] uppercase">
            Pergunta {questionIndex + 1} de {totalQuestions}
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-[#1b3329] h-2 rounded-full overflow-hidden mb-6 sm:mb-8 border border-[#d4af37]/20">
          <div
            className="h-full bg-gradient-to-r from-[#7f1d1d] via-[#d4af37] to-[#f3c04d] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Card Container */}
        <div className="bg-[#13241d]/90 backdrop-blur-md border border-[#d4af37]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs text-[#d4af37] font-semibold tracking-widest uppercase">
              Decoração Sob Medida
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7] tracking-tight mb-6 sm:mb-8 leading-snug">
            {formattedQuestion}
          </h2>

          {/* Options Grid */}
          <div className="flex flex-col gap-3 sm:gap-3.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === option;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border text-base sm:text-lg transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3c04d] min-h-[58px] ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#7f1d1d] to-[#4a0c0c] border-[#f3c04d] text-[#fdfbf7] shadow-lg gold-glow scale-[1.01]'
                      : 'bg-[#0c1813]/70 hover:bg-[#1b3329]/80 border-[#d4af37]/25 text-[#ece5d6] hover:border-[#d4af37]/60 active:scale-[0.99]'
                  }`}
                >
                  <span className="font-medium leading-relaxed">{option}</span>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isSelected
                        ? 'border-[#f3c04d] bg-[#f3c04d] text-[#0c1813]'
                        : 'border-[#d4af37]/40 bg-transparent text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-center text-[#ded3bd]/50 mt-6">
            Toque na opção que mais combina com você
          </p>
        </div>
      </div>
    </div>
  );
};
