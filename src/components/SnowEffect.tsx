import React, { useMemo } from 'react';

export const SnowEffect: React.FC = () => {
  // Pre-generate static snow properties for pure CSS animation without re-renders
  const flakes = useMemo(() => {
    return Array.from({ length: 18 }).map((_, index) => ({
      id: index,
      left: `${(index * 5.8 + 2) % 100}%`,
      size: `${2 + (index % 4)}px`,
      duration: `${7 + (index % 6) * 1.5}s`,
      delay: `${(index % 8) * 0.9}s`,
      opacity: 0.2 + (index % 5) * 0.12,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
    >
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
            opacity: flake.opacity,
          }}
        />
      ))}
    </div>
  );
};
