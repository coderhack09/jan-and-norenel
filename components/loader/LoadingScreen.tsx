"use client"

import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { siteConfig } from "@/content/site"

interface LoadingScreenProps {
  onComplete: () => void
}

/** Splits a date string like "May 8, 2026" into ["05", "08", "26"] */
function getDateSegments(dateStr: string): string[] {
  const d = new Date(dateStr)
  return [
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
    String(d.getFullYear()).slice(-2),
  ]
}

const GHOST_NUMBERS = getDateSegments(siteConfig.wedding.date)

// ── Canvas particle system ──────────────────────────────────────────────────

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  twinklePhase: number
  twinkleSpeed: number
  colorIdx: number
}

/** Darker sage tones for visibility on light cream background */
const PARTICLE_COLORS = [
  "95,  125, 107",  // --color-motif-medium #5F7D6B
  "47,  79,  62",   // --color-motif-deep   #2F4F3E
  "167, 191, 169",  // --color-motif-accent #A7BFA9
  "221, 230, 221",  // --color-motif-soft   #DDE6DD
]

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(45, Math.max(20, Math.floor((width * height) / 15000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -(Math.random() * 0.18 + 0.06),   // slow upward drift
    radius: Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.35 + 0.20,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.012 + 0.004,
    colorIdx: Math.floor(Math.random() * PARTICLE_COLORS.length),
  }))
}

// ── Component ───────────────────────────────────────────────────────────────

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut]           = useState(false)
  const [progress, setProgress]         = useState(0)
  // phase gates: 0=hidden · 1=monogram · 2=names · 3=tagline · 4=date · 5=progress
  const [phase, setPhase]               = useState(0)

  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const animFrameRef  = useRef<number>(0)
  const particlesRef  = useRef<Particle[]>([])

  const TOTAL_LOAD_MS = 12000
  const FADE_MS       = 700

  // ── Canvas particle animation ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = createParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let running = true

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        // Gentle twinkle
        p.twinklePhase += p.twinkleSpeed
        const twinkle   = (Math.sin(p.twinklePhase) + 1) * 0.5
        const alpha     = p.opacity * (0.3 + twinkle * 0.7)
        const color     = PARTICLE_COLORS[p.colorIdx]
        const blurR     = p.radius * 3.5

        // Soft glow circle via radial gradient
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blurR)
        g.addColorStop(0,   `rgba(${color}, ${alpha})`)
        g.addColorStop(0.4, `rgba(${color}, ${alpha * 0.45})`)
        g.addColorStop(1,   `rgba(${color}, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, blurR, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        // Drift
        p.x += p.vx
        p.y += p.vy

        // Wrap
        const { width, height } = canvas
        if (p.y < -20)          { p.y = height + 10; p.x = Math.random() * width }
        if (p.x < -20)            p.x = width + 20
        if (p.x > width + 20)     p.x = -20
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  // ── Staggered content reveal ─────────────────────────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 460),
      setTimeout(() => setPhase(3), 760),
      setTimeout(() => setPhase(4), 990),
      setTimeout(() => setPhase(5), 1220),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // ── Progress counter ─────────────────────────────────────────────────────
  useEffect(() => {
    let rafId = 0
    const start        = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const t    = Math.min(1, (now - start) / TOTAL_LOAD_MS)
      const next = Math.round(easeOutCubic(t) * 100)
      setProgress((prev) => (next > prev ? next : prev))
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const fadeTimer = setTimeout(() => setFadeOut(true), TOTAL_LOAD_MS - FADE_MS)
    const doneTimer = setTimeout(() => { setProgress(100); onComplete() }, TOTAL_LOAD_MS)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  // Helper: CSS transition classes based on phase gate
  const vis = (minPhase: number) =>
    phase >= minPhase
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-5 transition-all duration-700 ease-out"

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading invitation"
    >
      {/* ── Layer 1: Soft cream watercolor base ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(155deg, #F4F6F2 0%, #EDF1EC 40%, #F0F4EF 70%, #F4F6F2 100%)",
        }}
      />

      {/* ── Layer 2: Subtle sage wash at center ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 52%, rgba(95, 125, 107, 0.07) 0%, transparent 75%)",
        }}
      />

      {/* ── Layer 3: Canvas particle field ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
        aria-hidden
      />

      {/* ── Layer 4: Soft sage edge vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 40%, rgba(167, 191, 169, 0.18) 100%)",
        }}
      />

      {/* ── Layer 5: Corner floral decorations ── */}
      <Image
        src="/decoration/top-left.png"
        alt=""
        width={280}
        height={280}
        className="absolute top-0 left-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
        priority
      />
      <Image
        src="/decoration/top-right.png"
        alt=""
        width={280}
        height={280}
        className="absolute top-0 right-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
        priority
      />
      <Image
        src="/decoration/bottom-left.png"
        alt=""
        width={280}
        height={280}
        className="absolute bottom-0 left-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
      />
      <Image
        src="/decoration/right-bottom.png"
        alt=""
        width={280}
        height={280}
        className="absolute bottom-0 right-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
      />

      {/* ── Layer 6: Ghost wedding-date watermark (right side) ── */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col items-end justify-center pr-4 sm:pr-8 md:pr-12 lg:pr-16 select-none"
        aria-hidden
      >
        {GHOST_NUMBERS.map((num, i) => (
          <span
            key={`ghost-${num}-${i}`}
            className="lora-bold leading-[0.82]"
            style={{
              fontSize: "clamp(5rem, 14vw, 12rem)",
              color: "rgba(47, 79, 62, 0.06)",
              letterSpacing: "-0.04em",
              opacity: phase >= 2 ? 1 : 0,
              transition: `opacity 1.6s ease-out ${i * 150}ms`,
            }}
          >
            {num}
          </span>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 sm:px-8 text-center">

        {/* Monogram + glow ring */}
        <div
          className={`mb-8 flex justify-center ${
            phase >= 1
              ? "opacity-100 translate-y-0 scale-100 transition-all duration-700 ease-out"
              : "opacity-0 -translate-y-4 scale-95 transition-all duration-700 ease-out"
          }`}
        >
          <div className="relative flex items-center justify-center">
            {/* Soft pulsing glow */}
            <div
              className="absolute rounded-full animate-loader-glow"
              style={{
                width: "176px",
                height: "176px",
                background:
                  "radial-gradient(circle, rgba(95, 125, 107, 0.12) 0%, transparent 65%)",
              }}
            />
            {/* Thin ring accent */}
            <div
              className="absolute rounded-full"
              style={{
                width: "96px",
                height: "96px",
                border: "1px solid rgba(95, 125, 107, 0.25)",
              }}
            />
            <CloudinaryImage
              src={siteConfig.couple.monogram}
              alt="Monogram"
              width={240}
              height={240}
              className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain object-center brightness-0"
              style={{ opacity: 0.75 }}
              priority
            />
          </div>
        </div>

        {/* Year ornament rule */}
        {/* <div className={`flex items-center gap-3 justify-center mb-5 ${vis(2)}`}>
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to left, rgba(47, 79, 62, 0.28), transparent)" }}
          />
          <span
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "0.5rem",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "rgba(47, 79, 62, 0.55)",
            }}
          >
            Est. {new Date(siteConfig.wedding.date).getFullYear()}
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to right, rgba(47, 79, 62, 0.28), transparent)" }}
          />
        </div> */}

        {/* Couple names — Lighten font */}
        <h1
          className={`${vis(2)}`}
          style={{ transitionDelay: "60ms" }}
        >
          <span
            className="symphony-pro-regular block"
            style={{
              fontSize: "clamp(3.8rem, 13vw, 6.5rem)",
              color: "#2F4F3E",
              lineHeight: 1.1,
              textShadow: "0 2px 24px rgba(95, 125, 107, 0.18)",
            }}
          >
            {siteConfig.couple.brideNickname.trim()}
          </span>

          <span
            className="symphony-pro-regular block"
            style={{
              fontSize: "clamp(2.2rem, 7vw, 3.5rem)",
              color: "rgba(95, 125, 107, 0.70)",
              lineHeight: 1,
              marginTop: "0.1em",
              marginBottom: "0.05em",
            }}
          >
            &amp;
          </span>

          <span
            className="awesome-lathusca block"
            style={{
              fontSize: "clamp(3.8rem, 13vw, 6.5rem)",
              color: "#2F4F3E",
              lineHeight: 1.1,
              textShadow: "0 2px 24px rgba(95, 125, 107, 0.18)",
            }}
          >
            {siteConfig.couple.groomNickname.trim()}
          </span>
        </h1>

        {/* Diamond divider */}
        <div
          className={`flex items-center gap-3 justify-center mt-5 mb-2 ${vis(3)}`}
        >
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to left, rgba(47, 79, 62, 0.22), transparent)" }}
          />
          <span
            style={{
              color: "rgba(47, 79, 62, 0.40)",
              fontSize: "5px",
              letterSpacing: "0.25em",
            }}
          >
            ◆
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to right, rgba(47, 79, 62, 0.22), transparent)" }}
          />
        </div>

        {/* Supporting line */}
        {/* <p
          className={`${vis(3)}`}
          style={{
            fontFamily: '"Great Vibes", cursive',
            fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
            color: "rgba(255, 255, 255, 0.48)",
            transitionDelay: "80ms",
          }}
        >
          Together with their families
        </p> */}

        {/* Wedding date */}
        <p
          className={`mt-3 mb-9 leading-none ${vis(4)}`}
          style={{
            fontFamily: '"lora-bold", serif',
            fontSize: "clamp(0.52rem, 1.4vw, 0.62rem)",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "rgba(47, 79, 62, 0.58)",
          }}
          aria-label={`${siteConfig.ceremony.day}, ${siteConfig.wedding.date} · ${siteConfig.ceremony.time}`}
        >
          <span>{siteConfig.ceremony.day}</span>
          <span className="mx-2" style={{ opacity: 0.5 }} aria-hidden>·</span>
          <span className="tabular-nums">{siteConfig.wedding.date}</span>
          <span className="mx-2" style={{ opacity: 0.5 }} aria-hidden>·</span>
          <span className="tabular-nums">{siteConfig.ceremony.time}</span>
        </p>

        {/* Progress section */}
        <div className={`${vis(5)}`}>
          <p
            style={{
              fontFamily: '"Great Vibes", cursive',
            fontSize: "clamp(1.2rem, 3.5vw, 1.55rem)",
            color: "rgba(95, 125, 107, 0.75)",
              marginBottom: "14px",
            }}
          >
            Preparing your invitation
          </p>

          {/* Hairline progress bar with shimmer */}
          <div
            className="w-full max-w-[200px] mx-auto relative"
            style={{ height: "1px" }}
            role="presentation"
          >
            {/* Track */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "rgba(95, 125, 107, 0.20)" }}
            />
            {/* Filled portion */}
            <div
              className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
              style={{
                width: `${Math.max(progress, 2)}%`,
                transition: "width 200ms linear",
                background:
                  "linear-gradient(to right, rgba(47, 79, 62, 0.65), rgba(95, 125, 107, 0.90))",
              }}
            >
              {/* Travelling shimmer sweep */}
              <div
                className="absolute inset-y-0 animate-loader-shimmer"
                style={{
                  width: "50px",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(167,191,169,0.50) 50%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* Percentage counter */}
          <p
            className="tabular-nums mt-4"
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.52rem, 1.4vw, 0.62rem)",
              letterSpacing: "0.35em",
              color: "rgba(47, 79, 62, 0.50)",
            }}
            aria-live="polite"
          >
            {progress}%
          </p>
        </div>
      </div>
    </div>
  )
}
