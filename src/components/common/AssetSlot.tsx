import React, { useState } from 'react';
import { ImageOff, Sparkles, Box, Headphones, Watch, Backpack, Gamepad2, ShoppingBag } from 'lucide-react';

interface AssetSlotProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  category?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
}

export const AssetSlot: React.FC<AssetSlotProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  category,
  width,
  height,
  aspectRatio = 'aspect-square',
}) => {
  const [hasError, setHasError] = useState(false);

  const getCategoryIcon = () => {
    switch (category?.toLowerCase()) {
      case 'headphones':
        return <Headphones className="w-8 h-8 text-[#1A56DB]/70" />;
      case 'watches':
        return <Watch className="w-8 h-8 text-[#1A56DB]/70" />;
      case 'backpacks':
        return <Backpack className="w-8 h-8 text-[#1A56DB]/70" />;
      case 'gaming':
        return <Gamepad2 className="w-8 h-8 text-[#1A56DB]/70" />;
      default:
        return <Box className="w-8 h-8 text-[#1A56DB]/70" />;
    }
  };

  if (hasError) {
    return (
      <div
        className={`w-full ${aspectRatio} bg-[#ECE8E0] border border-[#E3DDD2] rounded-xl flex flex-col items-center justify-center p-3 text-center transition-colors group select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-xl bg-[#FFFEFB] shadow-xs flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
          {getCategoryIcon()}
        </div>
        <p className="text-xs font-semibold text-[#1C1A17] line-clamp-1">{alt}</p>
        {import.meta.env.DEV && (
          <span className="mt-1 text-[10px] font-mono text-[#6B645A] bg-[#FFFEFB]/80 px-2 py-0.5 rounded border border-[#E3DDD2] max-w-[90%] truncate">
            public{src}
          </span>
        )}
      </div>
    );
  }

  const isCover = className.includes('object-cover') || imgClassName.includes('object-cover');

  return (
    <div className={`relative overflow-hidden w-full ${aspectRatio} ${className}`}>
      <img
        src={src}
        alt={alt}
        width={typeof width === 'number' ? width : 400}
        height={typeof height === 'number' ? height : 400}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
          isCover ? 'object-cover' : 'object-contain p-2'
        } ${imgClassName}`}
      />
    </div>
  );
};
