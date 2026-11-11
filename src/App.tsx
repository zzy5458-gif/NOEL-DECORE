/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { SnowEffect } from './components/SnowEffect';
import { StepHome } from './components/StepHome';
import { StepName } from './components/StepName';
import { StepQuiz } from './components/StepQuiz';
import { StepTransition } from './components/StepTransition';
import { StepOffer } from './components/StepOffer';
import { Step, QuizState } from './types';
import { QUIZ_QUESTIONS } from './config';

export default function App() {
  const [state, setState] = useState<QuizState>({
    step: 'home',
    userName: '',
    answers: {},
    currentQuestionIndex: 0,
  });

  // Handlers for step progression
  const handleStart = () => {
    setState((prev) => ({ ...prev, step: 'name' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNameContinue = (formattedName: string) => {
    setState((prev) => ({
      ...prev,
      userName: formattedName,
      step: 'quiz',
      currentQuestionIndex: 0,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (option: string) => {
    setState((prev) => {
      const nextAnswers = { ...prev.answers, [prev.currentQuestionIndex]: option };
      const nextIndex = prev.currentQuestionIndex + 1;

      if (nextIndex < QUIZ_QUESTIONS.length) {
        return {
          ...prev,
          answers: nextAnswers,
          currentQuestionIndex: nextIndex,
        };
      } else {
        // All 3 questions answered -> Move to Transition screen
        return {
          ...prev,
          answers: nextAnswers,
          step: 'transition',
        };
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizBack = () => {
    setState((prev) => {
      if (prev.currentQuestionIndex > 0) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
        };
      } else {
        return {
          ...prev,
          step: 'name',
        };
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTransitionComplete = () => {
    setState((prev) => ({ ...prev, step: 'offer' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    if (state.step !== 'home') {
      const confirmReset = window.confirm('Deseja voltar para a página inicial da Noel Decore?');
      if (confirmReset) {
        setState({
          step: 'home',
          userName: '',
          answers: {},
          currentQuestionIndex: 0,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1813] text-[#f8f5ee] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#f3c04d] relative overflow-x-hidden">
      {/* Gentle holiday snowfall overlay */}
      <SnowEffect />

      {/* Top navigation header */}
      <Header onLogoClick={handleLogoClick} />

      {/* Dynamic step rendering with smooth state transitions */}
      <main className="flex-1">
        {state.step === 'home' && (
          <div className="animate-fadeIn">
            <StepHome onStart={handleStart} />
          </div>
        )}

        {state.step === 'name' && (
          <div className="animate-fadeIn">
            <StepName
              initialName={state.userName}
              onContinue={handleNameContinue}
              onBack={() => setState((prev) => ({ ...prev, step: 'home' }))}
            />
          </div>
        )}

        {state.step === 'quiz' && (
          <div className="animate-fadeIn">
            <StepQuiz
              key={state.currentQuestionIndex}
              userName={state.userName}
              questionIndex={state.currentQuestionIndex}
              currentAnswer={state.answers[state.currentQuestionIndex]}
              onSelectOption={handleSelectOption}
              onBack={handleQuizBack}
            />
          </div>
        )}

        {state.step === 'transition' && (
          <div className="animate-fadeIn">
            <StepTransition
              userName={state.userName}
              onComplete={handleTransitionComplete}
            />
          </div>
        )}

        {state.step === 'offer' && (
          <div className="animate-fadeIn">
            <StepOffer userName={state.userName} />
          </div>
        )}
      </main>
    </div>
  );
}
