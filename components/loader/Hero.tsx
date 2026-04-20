import React, { useEffect, useState } from 'react';
import { siteConfig } from '@/content/site';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';

interface HeroProps {
  onOpen: () => void;
  visible: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onOpen, visible }) => {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setContentVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setContentVisible(false);
    }
  }, [visible]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gentleFloat {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-8px);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
      <div className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${visible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
        >
          <source src="/background_music/Rotating Sparkles on Pink Purple Free Background Videos, No Copyright All Background Videos - All Background Videos (720p, h264) (online-video-cutter.com).mp4" type="video/mp4" />
        </video>
        
        {/* Subtle tint keeps text readable while preserving video visibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(14,34,46,0.22) 0%, rgba(28,53,69,0.15) 50%, rgba(51,35,62,0.25) 100%)',
          }}
        />

        {/* Soft color bloom for a subtle premium look */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(142, 184, 214, 0.18) 0%, rgba(142, 184, 214, 0) 45%), radial-gradient(circle at 85% 80%, rgba(194, 163, 216, 0.14) 0%, rgba(194, 163, 216, 0) 42%)',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 w-full max-w-md mx-auto h-full">
        
        {/* Top Logo/Monogram */}
        <div 
          className={`mb-auto mt-8 transition-all duration-1000 ease-out ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center">
            {/* Monogram Image with subtle animation */}
            <div 
              className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 transition-transform duration-700 ease-out hover:scale-105"
              style={{
                animation: contentVisible ? 'gentleFloat 3s ease-in-out infinite' : 'none'
              }}
            >
              <CloudinaryImage
                src={siteConfig.couple.monogram}
                alt="Monogram"
                fill
                className="object-contain"
                priority
                style={{
                  filter: "brightness(0) invert(1) drop-shadow(0 0 18px rgba(255,255,255,0.7))",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col items-center justify-end w-full gap-5 sm:gap-6 pb-14 sm:pb-16 md:pb-20">
          <h2
            className={`text-6xl md:text-8xl transform -rotate-6 transition-all duration-1000 ease-out delay-200 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontWeight: 400,
              color: 'var(--color-motif-cream)',
              textShadow: '0 2px 16px rgba(47,79,62,0.5)',
            }}
          >
            You are
          </h2>
          
          <h1
            className={`text-5xl md:text-7xl font-bold tracking-wider uppercase transition-all duration-1000 ease-out delay-300 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              color: 'var(--color-motif-cream)',
              textShadow: '0 2px 20px rgba(47,79,62,0.5)',
              letterSpacing: '0.05em',
            }}
          >
            Invited!
          </h1>

          <button 
            onClick={() => {
              onOpen();
            }}
            className={`px-10 py-4 font-serif text-sm tracking-[0.2em] uppercase rounded-sm border transition-all duration-500 ease-out delay-500 shadow-lg hover:shadow-xl ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              backgroundColor: 'var(--color-motif-cream)',
              borderColor: 'var(--color-motif-deep)',
              color: 'var(--color-motif-deep)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-motif-cream)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--color-motif-deep)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-motif-cream)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--color-motif-deep)';
            }}
          >
            <span
              style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, color: 'var(--color-motif-deep)' }}
            >
              Open Invitation
            </span>
          </button>
        </div>

        {/* Bottom Spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
};