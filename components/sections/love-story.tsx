"use client"

import React from 'react';
import Link from 'next/link';
import { StorySection } from '@/components/StorySection';
import { Cinzel } from "next/font/google";
import { siteConfig } from '@/content/site';

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

// Palette lives in globals.css → @theme inline → --color-motif-*
// Edit there once to update every component.

export function LoveStory() {
  return (
    <div className="min-h-screen bg-motif-cream overflow-x-hidden">


      <div className="text-center text-motif-medium z-0 relative px-4">
        <div className="w-12 sm:w-16 h-[1px] bg-motif-silver mx-auto mb-4 sm:mb-6 opacity-60"></div>
        <h1
           className="lighten-regular text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] leading-tight"
           style={{ color: 'var(--color-motif-deep)' }}
          >
          Our Love Story
          </h1>

        {/* <p className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl tracking-[0.14em] sm:tracking-[0.18em] font-normal leading-tight text-motif-medium mb-1`}>
          Every photograph tells a story of {siteConfig.couple.brideNickname} & {siteConfig.couple.groomNickname}'s journey to forever
        </p> */}
      </div>

      {/* SECTION 1: Top - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isFirst={true}
        title="A Love Meant to Last"
        imageSrc="/mobile-background/couple (2).webp"
        text={
          <>
            <p className="mb-4">
            {siteConfig.couple.brideNickname} and {siteConfig.couple.groomNickname}’s story began in the simplest yet most meaningful way—two hearts crossing paths at just the right moment, unaware that something extraordinary was about to unfold. 
            What started as a connection soon blossomed into a love that felt both natural and destined, growing stronger with every shared smile and conversation.
            </p>
           
          </>
        }
      />

      {/* SECTION 2: Middle - Light */}
      <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/mobile-background/couple (12).webp"
        // title="Became a Couple (2019)"
        text={
          <>
            <p>
            As time passed, their bond deepened into something unshakable. Through life’s highs and lows, they became each other’s constant—finding comfort in presence, strength in unity, and joy in the little things. Their love is built not just on romance, but on genuine friendship and unwavering support.
            </p>
          </>
        }
      />

      {/* SECTION 3: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/mobile-background/couple (13).webp"
        // title="The Proposal (2025)"
        text={
          <>
            <p>
            Together, they have created a journey filled with memories, laughter, and dreams for the future. Each chapter of their story reflects patience, understanding, and a love that continues to evolve. They have learned that true love is not just about finding the right person, but about choosing each other every day.
            </p>
           
          </>
        }
      />
            {/* SECTION 4: Middle - Light */}
            <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/mobile-background/couple (17).webp"
        // title="Became a Couple (2019)"
        text={
          <>
            <p>
            Now, {siteConfig.couple.brideNickname} and {siteConfig.couple.groomNickname} are ready to take the next step—hand in hand, heart to heart. With grateful spirits and hopeful hearts, they choose to turn their love into a lifelong commitment, embracing a future filled with shared dreams and endless possibilities.
            </p>
          </>
        }
      />

      {/* SECTION 5: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/mobile-background/couple (10).webp"
        // title="The Proposal (2025)"
        text={
          <>
            <p>
            With this, they joyfully invite you to witness the beginning of their forever—a celebration of love, unity, and the promise of a beautiful life together.
            </p>
           
          </>
        }
      />
      
      {/* Footer Decoration */}
      <div className="bg-motif-cream pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 text-center text-motif-deep z-0 relative px-4">
        <div className="w-12 sm:w-16 h-[1px] bg-motif-silver mx-auto mb-4 sm:mb-6 opacity-60"></div>
        <Link 
          href="#guest-list"
          className={`${cinzel.className} group relative inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 text-[0.7rem] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase font-normal text-motif-cream bg-motif-deep rounded-sm border border-motif-deep transition-all duration-300 hover:bg-motif-accent hover:border-motif-accent hover:text-motif-cream hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-motif-soft/50 focus-visible:ring-offset-2 focus-visible:ring-offset-motif-cream`}
        >
          <span className="relative z-10">Join us</span>
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-sm bg-motif-soft opacity-0 group-hover:opacity-25 blur-md transition-opacity duration-300 -z-0"></div>
        </Link>
      </div>

    </div>
  );
}

