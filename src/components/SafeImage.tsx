import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackText = 'Noel Decore',
  loading = 'lazy',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`bg-gradient-to-br from-[#1b3329] via-[#13241d] to-[#0c1813] border border-[#d4af37]/20 flex flex-col items-center justify-center p-6 text-center text-[#f8f5ee]/80 ${className}`}
      >
        <Sparkles className="w-8 h-8 text-[#d4af37] mb-2 animate-pulse" />
        <span className="text-sm font-serif text-[#d4af37]">{fallbackText}</span>
        {alt && <span className="text-xs text-[#f8f5ee]/60 mt-1 max-w-xs">{alt}</span>}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#13241d] to-[#0c1813] animate-pulse" />
      )}
      <img
        src={src}
        alt={alt || 'Noel Decore'}
        loading={loading}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
