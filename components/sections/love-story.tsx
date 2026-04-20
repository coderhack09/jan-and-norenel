"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="relative min-h-screen bg-motif-cream overflow-x-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/decoration/new/left-top.png"
          alt=""
          width={260}
          height={260}
          className="absolute top-0 left-0 w-24 sm:w-32 md:w-40 lg:w-48 opacity-70"
        />
        <Image
          src="/decoration/new/right-top.png"
          alt=""
          width={260}
          height={260}
          className="absolute top-0 right-0 w-24 sm:w-32 md:w-40 lg:w-48 opacity-70"
        />
        <Image
          src="/decoration/new/left-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 left-0 w-28 sm:w-36 md:w-44 lg:w-52 opacity-75"
        />
        <Image
          src="/decoration/new/right-bottom.png"
          alt=""
          width={300}
          height={300}
          className="absolute bottom-0 right-0 w-28 sm:w-36 md:w-44 lg:w-52 opacity-75"
        />

        <span className="absolute top-[8%] left-[10%] h-6 w-6 rounded-full bg-motif-soft/35 blur-[1px]" />
        <span className="absolute top-[18%] right-[14%] h-4 w-4 rounded-full bg-motif-accent/25 blur-[1px]" />
        <span className="absolute top-[42%] left-[6%] h-8 w-8 rounded-full bg-motif-soft/25 blur-[2px]" />
        <span className="absolute top-[58%] right-[8%] h-7 w-7 rounded-full bg-motif-accent/20 blur-[2px]" />
        <span className="absolute bottom-[28%] left-[12%] h-5 w-5 rounded-full bg-motif-soft/30 blur-[1px]" />
        <span className="absolute bottom-[16%] right-[16%] h-9 w-9 rounded-full bg-motif-accent/20 blur-[2px]" />
      </div>


      <div className="text-center text-motif-medium z-10 relative px-4">
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
        title="Two Souls Shaped by the Past"
        imageSrc="/mobile-background/couple (3).webp"
        text={
          <>
            <p className="mb-4">
            Two travelers and adventure seekers, both shaped by their pasts, never expected to find love again. Life had already taken them through different journeys, teaching them lessons they never thought would lead them back to love.
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
            Years before, their paths briefly crossed at the beach—a simple moment that quietly faded into time, leaving no hint of what the future had in store.
            </p>
          </>
        }
      />

      {/* SECTION 3: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/mobile-background/couple (15).webp"
        // title="The Proposal (2025)"
        text={
          <>
            <p>
            Life carried them in completely different directions, across oceans and time zones.
            Jan Chael Joven, or Jan, found himself in Indianapolis, U.S.A., while Norenel, or Babi, built her life in Laguna, Philippines.
            </p>
           
          </>
        }
      />
            {/* SECTION 4: Middle - Light */}
            <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/mobile-background/couple (13).webp"
        // title="Became a Couple (2019)"
        text={
          <>
            <p>
            Unexpectedly, through a mutual friend, their paths crossed once more. What started as simple, easy, and honest conversations quickly grew into something deeper and undeniably real.
            They discovered how much they shared—the same energy, the same interests, the same love for adventures, sunsets, quiet moments, and the courage to love again.
            </p>
          </>
        }
      />

      {/* SECTION 5: Bottom - Dark */}
      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        imageSrc="/mobile-background/couple (11).webp"
        // title="The Proposal (2025)"
        text={
          <>
            <p>
            Together, they found a connection that felt natural yet exciting—a rare kind of comfort, peace, and understanding. And the rest is history.
            Now engaged and ready to begin a new chapter of their lives, they stand as proof that everything truly happens for a reason. When you least expect it, love finds its way back—more beautiful than you ever imagined.
            </p>
           
          </>
        }
      />
      
      {/* Footer Decoration */}
      <div className="bg-motif-cream pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 text-center text-motif-deep z-10 relative px-4">
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

