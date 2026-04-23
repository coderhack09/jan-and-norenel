import React, { useEffect, useRef, useState } from 'react';
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import { CloudinaryImage } from '@/components/ui/cloudinary-image';

import { TornPaperEdge } from './TornPaperEdge';

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

interface StorySectionProps {
  imageSrc: string;
  title?: string;
  text: React.ReactNode;
  layout: 'image-left' | 'image-right';
  theme: 'dark' | 'light';
  isFirst?: boolean;
  isLast?: boolean;
}

export const StorySection: React.FC<StorySectionProps> = ({ 
  imageSrc, 
  title, 
  text, 
  layout, 
  theme,
  isFirst = false,
  isLast = false
}) => {
  const isDark = theme === 'dark';
  // Palette lives in globals.css → @theme inline → --color-motif-*
  const bgColor = isDark ? 'bg-motif-silver' : 'bg-motif-cream relative z-10';
  const textColor = isDark ? 'text-motif-cream' : 'text-motif-deep';
  
  // Animation Hook
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 } 
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Visual Styles
  const imageFrameClass = isDark 
    ? 'bg-motif-soft p-1.5 md:p-3 shadow-lg' 
    : 'bg-motif-silver p-1.5 md:p-3 shadow-md';

  // Rotation
  const rotation = layout === 'image-left' ? 'rotate-1 md:rotate-2' : '-rotate-1 md:-rotate-2';

  // FORCED Side-by-Side Layout (Visual structure preserved on Mobile)
  // Instead of switching to flex-col, we keep flex-row (or reverse)
  const flexDirection = layout === 'image-left' ? 'flex-row' : 'flex-row-reverse';
  const textAlignment = layout === 'image-left' ? 'text-left' : 'text-left md:text-right'; // Keep text left aligned usually looks better in tight columns, or alternate

  return (
    <div className={`${bgColor} relative`}>
      
      {/* Torn Edges (Only on Light Section) */}
      {!isDark && (
        <>
          {/* Top Tear */}
          <div className="absolute top-0 left-0 w-full -mt-[8px] md:-mt-[20px] z-20 text-motif-cream pointer-events-none">
             <TornPaperEdge flipped={true} />
          </div>
          {/* Bottom Tear */}
          <div className="absolute bottom-0 left-0 w-full -mb-[8px] md:-mb-[20px] z-20 text-motif-cream pointer-events-none">
             <TornPaperEdge flipped={false} />
          </div>
        </>
      )}
      <div 
        ref={sectionRef}
        className={`container mx-auto px-2 md:px-12 py-12 md:py-32 relative z-10 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
      >
        {/* Gap is very small on mobile (gap-2) to fit content side-by-side */}
        <div className={`flex ${flexDirection} items-center justify-between gap-3 md:gap-16`}>
          
          {/* Image Column - Approx 45% width on mobile */}
          <div className="w-[45%] md:w-5/12 flex justify-center shrink-0">
            <div className={`
              relative w-full md:max-w-md 
              transition-all duration-1000 delay-300 ease-out
              ${rotation}
              ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
            `}>
               <div className={`${imageFrameClass} w-full`}>
                 <div className="aspect-[3/4] w-full overflow-hidden relative group">
                   <CloudinaryImage
                     src={imageSrc} 
                     alt="Story Moment" 
                     fill
                     sizes="(max-width: 768px) 45vw, (max-width: 1024px) 40vw, 33vw"
                     className="object-cover transition-transform duration-1000 group-hover:scale-105"
                     quality={90}
                     priority={false}
                   />
                   {isDark && <div className="absolute inset-0 bg-black/5 mix-blend-multiply pointer-events-none z-10" />}
                 </div>
               </div>
            </div>
          </div>
          {/* Text Column - Approx 55% width on mobile */}
          <div className={`w-[55%] md:w-5/12 ${textColor}`}>
            {title && (
              <h2 className={`${cinzel.className} text-2xl md:text-6xl mb-2 md:mb-6 tracking-wide leading-none
                transition-all duration-1000 delay-500
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                ${isDark ? 'text-motif-cream' : 'text-motif-deep'}
              `}>
                {title}
              </h2>
            )}
            
            <div className={`font-[family-name:var(--font-crimson)] text-[11px] leading-[1.3] sm:text-sm md:text-2xl md:leading-relaxed space-y-2 md:space-y-6
              transition-all duration-1000 delay-700
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              ${theme === 'light' ? 'italic font-normal' : 'font-light'}
            `}>
              {text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

