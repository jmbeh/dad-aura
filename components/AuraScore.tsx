'use client';

import { useEffect, useState } from 'react';
import { getAuraBackgroundColor, getAuraGlowColor } from '@/lib/emoji-parser';
import { getAuraStatus } from '@/lib/aura-calculator';

interface AuraScoreProps {
  total: number;
  todayTotal: number;
}

export default function AuraScore({ total, todayTotal }: AuraScoreProps) {
  const bgColor = getAuraBackgroundColor(total);
  const glowColor = getAuraGlowColor(total);
  const status = getAuraStatus(total);
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevTotal, setPrevTotal] = useState(total);

  useEffect(() => {
    if (total > prevTotal && total > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [total, prevTotal]);

  useEffect(() => {
    setPrevTotal(total);
  }, [total]);

  const isPositive = total > 0;
  const isHighScore = total >= 50;
  
  return (
    <section 
      className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 relative"
      aria-label="Dad's current aura score"
    >
      {/* Celebration emojis */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(12)].map((_, i) => {
            const delay = i * 0.1;
            const duration = 2 + (i % 3) * 0.3; // More predictable duration
            return (
              <span
                key={i}
                className="absolute text-4xl animate-confetti"
                style={{
                  left: `${(i * 8.33)}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
                role="img"
                aria-hidden="true"
              >
                {['🎉', '✨', '⭐', '🎊', '🌟', '💫'][i % 6]}
              </span>
            );
          })}
        </div>
      )}

      {/* Main Aura Score */}
      <div
        className={`
          ${bgColor}
          ${glowColor}
          rounded-full 
          w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64
          flex flex-col items-center justify-center
          transition-all duration-500 ease-in-out
          ${isHighScore ? 'animate-glow-pulse' : 'animate-pulse-slow'}
          hover:scale-110 hover:rotate-3
          cursor-default
          relative z-10
        `}
        role="img"
        aria-label={`Aura score: ${total} points. Status: ${status}`}
      >
        {/* Sparkle effects for high scores */}
        {isHighScore && (
          <>
            <span className="absolute top-4 left-4 text-2xl animate-sparkle delay-0" role="img" aria-hidden="true">✨</span>
            <span className="absolute top-4 right-4 text-2xl animate-sparkle delay-300" role="img" aria-hidden="true">⭐</span>
            <span className="absolute bottom-4 left-4 text-2xl animate-sparkle delay-600" role="img" aria-hidden="true">🌟</span>
            <span className="absolute bottom-4 right-4 text-2xl animate-sparkle delay-900" role="img" aria-hidden="true">💫</span>
          </>
        )}
        
        <h2 
          className={`text-white text-5xl sm:text-6xl md:text-7xl font-bold mb-1 sm:mb-2 drop-shadow-lg transition-transform duration-300 ${isPositive ? 'hover:scale-110' : ''}`}
          aria-hidden="true"
        >
          {total}
        </h2>
        <span 
          className="text-white text-base sm:text-lg md:text-xl font-semibold drop-shadow-md flex items-center gap-1" 
          aria-hidden="true"
        >
          <span>Aura Points</span>
          {isPositive && <span className="animate-bounce-gentle inline-block">💪</span>}
        </span>
      </div>
      
      {/* Status Label */}
      <p 
        className={`mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-center transition-all duration-300 ${isPositive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
        aria-live="polite"
      >
        <span className="inline-flex items-center gap-2">
          {status}
          {isPositive && total >= 50 && <span className="animate-wiggle inline-block" role="img" aria-hidden="true">🏆</span>}
          {total < 0 && <span className="animate-wiggle inline-block" role="img" aria-hidden="true">😅</span>}
        </span>
      </p>
      
      {/* Today's Change */}
      <div className="mt-3 sm:mt-4 flex items-center gap-2">
        <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">Today:</span>
        <span
          className={`
            text-xl sm:text-2xl font-bold transition-all duration-300
            ${todayTotal > 0 
              ? 'text-green-700 dark:text-green-400 animate-bounce-gentle' 
              : todayTotal < 0 
              ? 'text-red-700 dark:text-red-400' 
              : 'text-gray-700 dark:text-gray-300'
            }
          `}
          aria-label={`Today's change: ${todayTotal > 0 ? 'plus' : todayTotal < 0 ? 'minus' : ''} ${Math.abs(todayTotal)} points`}
        >
          {todayTotal > 0 && <span className="inline-block animate-bounce-gentle" role="img" aria-hidden="true">📈</span>}
          {todayTotal < 0 && <span className="inline-block" role="img" aria-hidden="true">📉</span>}
          <span className="ml-1">{todayTotal > 0 ? '+' : ''}{todayTotal}</span>
        </span>
      </div>
    </section>
  );
}
