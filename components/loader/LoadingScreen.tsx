"use client"

import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { siteConfig } from "@/content/site"

interface LoadingScreenProps {
  onComplete: () => void
}

// ── Bubble particle system ──────────────────────────────────────────────────

interface Bubble {
  x: number
  y: number
  vy: number
  radius: number
  opacity: number
  phase: number
  phaseSpeed: number
  wobbleAmp: number
  colorIdx: number
}

const BUBBLE_COLORS = [
  "216, 152, 172",
  "238, 198, 210",
  "196, 124, 150",
  "248, 220, 228",
]

function createBubbles(width: number, height: number): Bubble[] {
  const count = Math.min(38, Math.max(16, Math.floor((width * height) / 16000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vy: -(Math.random() * 0.20 + 0.07),
    radius: Math.random() * 13 + 3,
    opacity: Math.random() * 0.30 + 0.10,
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: Math.random() * 0.014 + 0.005,
    wobbleAmp: Math.random() * 0.55 + 0.15,
    colorIdx: Math.floor(Math.random() * BUBBLE_COLORS.length),
  }))
}

const SCATTER_DOTS = [
  { x: 8,  y: 32, r: 3.5, o: 0.20 },
  { x: 14, y: 10, r: 5,   o: 0.12 },
  { x: 21, y: 70, r: 2.5, o: 0.24 },
  { x: 28, y: 48, r: 4,   o: 0.15 },
  { x: 38, y: 85, r: 6,   o: 0.10 },
  { x: 44, y: 20, r: 3,   o: 0.18 },
  { x: 52, y: 92, r: 2,   o: 0.26 },
  { x: 58, y: 14, r: 4.5, o: 0.13 },
  { x: 65, y: 58, r: 2.5, o: 0.20 },
  { x: 73, y: 78, r: 4,   o: 0.15 },
  { x: 80, y: 22, r: 5.5, o: 0.12 },
  { x: 87, y: 65, r: 3,   o: 0.18 },
  { x: 92, y: 40, r: 2,   o: 0.23 },
  { x: 94, y: 80, r: 4.5, o: 0.13 },
  { x: 18, y: 88, r: 3,   o: 0.18 },
  { x: 34, y: 36, r: 2,   o: 0.22 },
  { x: 50, y: 55, r: 6,   o: 0.08 },
  { x: 76, y: 42, r: 2.5, o: 0.20 },
  { x: 6,  y: 60, r: 4,   o: 0.15 },
  { x: 96, y: 18, r: 3,   o: 0.17 },
]

// ── Component ───────────────────────────────────────────────────────────────

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase]       = useState(0)

  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const bubblesRef   = useRef<Bubble[]>([])

  const TOTAL_LOAD_MS = 12000
  const FADE_MS       = 700

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      bubblesRef.current = createBubbles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let running = true

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      SCATTER_DOTS.forEach((dot) => {
        const px = (dot.x / 100) * canvas.width
        const py = (dot.y / 100) * canvas.height
        const g  = ctx.createRadialGradient(px, py, 0, px, py, dot.r * 2.8)
        g.addColorStop(0,   `rgba(216, 140, 168, ${dot.o})`)
        g.addColorStop(0.5, `rgba(238, 198, 210, ${dot.o * 0.5})`)
        g.addColorStop(1,   `rgba(248, 220, 228, 0)`)
        ctx.beginPath()
        ctx.arc(px, py, dot.r * 2.8, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })

      bubblesRef.current.forEach((b) => {
        b.phase += b.phaseSpeed
        const swayX = Math.sin(b.phase) * b.wobbleAmp
        const pulse  = 0.75 + Math.sin(b.phase * 0.6) * 0.25
        const alpha  = b.opacity * pulse
        const color  = BUBBLE_COLORS[b.colorIdx]

        const fill = ctx.createRadialGradient(
          b.x - b.radius * 0.32, b.y - b.radius * 0.32, 0,
          b.x, b.y, b.radius,
        )
        fill.addColorStop(0,    `rgba(255, 255, 255, ${alpha * 0.55})`)
        fill.addColorStop(0.55, `rgba(${color}, ${alpha * 0.18})`)
        fill.addColorStop(1,    `rgba(${color}, ${alpha * 0.07})`)

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
        ctx.fillStyle = fill
        ctx.fill()

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${color}, ${alpha * 0.60})`
        ctx.lineWidth   = 0.9
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(b.x - b.radius * 0.30, b.y - b.radius * 0.30, b.radius * 0.20, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`
        ctx.fill()

        b.x += swayX * 0.06
        b.y += b.vy

        const { width, height } = canvas
        if (b.y < -(b.radius * 2))       { b.y = height + b.radius; b.x = Math.random() * width }
        if (b.x < -b.radius)               b.x = width + b.radius
        if (b.x > width + b.radius)        b.x = -b.radius
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

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 120),
      setTimeout(() => setPhase(2), 480),
      setTimeout(() => setPhase(3), 820),
      setTimeout(() => setPhase(4), 1100),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

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

  const vis = (minPhase: number, delay = "0ms") => ({
    opacity:    phase >= minPhase ? 1 : 0,
    transform:  phase >= minPhase ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 800ms ease-out ${delay}, transform 800ms ease-out ${delay}`,
  })

  const weddingDate  = new Date(siteConfig.wedding.date)
  const weddingYear  = weddingDate.getFullYear()
  const weddingMonth = weddingDate.toLocaleString("en-US", { month: "long" }).toUpperCase()
  const weddingDay   = weddingDate.getDate()

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-700 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading invitation"
    >
      {/* ── Backgrounds ── */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 72% 60% at 50% 46%, rgba(236,196,210,0.16) 0%, rgba(248,220,228,0.06) 60%, transparent 84%)",
      }} />

      {/* ── Particle canvas ── */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden />

      {/* ── Corner florals ── */}
      <Image src="/decoration/new/left-top.png"     alt="" width={320} height={320} priority aria-hidden
        className="absolute top-0 left-0 pointer-events-none select-none w-28 sm:w-40 md:w-56 lg:w-64" />
      <Image src="/decoration/new/right-top.png"    alt="" width={320} height={320} priority aria-hidden
        className="absolute top-0 right-0 pointer-events-none select-none w-28 sm:w-40 md:w-56 lg:w-64" />
      <Image src="/decoration/new/left-bottom.png"  alt="" width={320} height={320} aria-hidden
        className="absolute bottom-0 left-0 pointer-events-none select-none w-28 sm:w-40 md:w-56 lg:w-64" />
      <Image src="/decoration/new/right-bottom.png" alt="" width={320} height={320} aria-hidden
        className="absolute bottom-0 right-0 pointer-events-none select-none w-28 sm:w-40 md:w-56 lg:w-64" />

      {/* ══════════════════════════════════════
          MAIN CARD — single centered column
          max-w keeps it from over-stretching;
          padding clears the corner florals.
         ══════════════════════════════════════ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          paddingTop:    "clamp(5rem, 13vh, 9rem)",
          paddingBottom: "clamp(5rem, 13vh, 9rem)",
          paddingLeft:   "clamp(1.5rem, 6vw, 4rem)",
          paddingRight:  "clamp(1.5rem, 6vw, 4rem)",
        }}>

        <div className="w-full flex flex-col items-center"
          style={{
            maxWidth: "clamp(260px, 68vw, 480px)",
            gap:      "clamp(1.0rem, 2.6vh, 1.8rem)",
          }}>

          {/* ── SECTION 1 · Eyebrow + Title ── */}
          <div style={{ ...vis(1), gap: "clamp(0.25rem, 0.8vh, 0.5rem)" }} className="flex flex-col items-center w-full">

            <p className="quicksand-book tracking-[0.30em] uppercase text-center" style={{
              fontSize: "clamp(0.50rem, 1.3vw, 0.62rem)",
              color:    "rgba(196,124,150,0.62)",
            }}>
              You are cordially invited
            </p>

            <h2 className="better-saturday text-center" style={{
              fontSize:      "clamp(2.0rem, 5.8vw, 3.4rem)",
              color:         "#2a2a2a",
              lineHeight:    1.0,
              letterSpacing: "0.01em",
            }}>
              Join Our Wedding
            </h2>

            {/* wavy rule */}
            <svg viewBox="0 0 140 14" aria-hidden
              style={{ width: "clamp(80px, 20vw, 140px)", overflow: "visible", display: "block", margin: "0.2rem auto 0" }}>
              <path d="M0 7 Q17.5 1 35 7 Q52.5 13 70 7 Q87.5 1 105 7 Q122.5 13 140 7"
                fill="none" stroke="rgba(196,124,150,0.40)" strokeWidth="1.4" strokeLinecap="round" />
            </svg>

            <p className="glacial-indifference text-center" style={{
              fontSize:      "clamp(0.58rem, 1.5vw, 0.72rem)",
              letterSpacing: "0.04em",
              color:         "rgba(80,45,60,0.52)",
              lineHeight:    1.7,
              marginTop:     "0.1rem",
              maxWidth:      "30ch",
            }}>
              With great pleasure, we invite you to our wedding celebration.
            </p>
          </div>

          {/* thin divider */}
          <div style={vis(1)} className="w-full flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(196,124,150,0.22))" }} />
            <span style={{ color: "rgba(196,124,150,0.30)", fontSize: "5px" }}>◆</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(196,124,150,0.22))" }} />
          </div>

          {/* ── SECTION 2 · Couple Names ── */}
          <div style={{ ...vis(2, "60ms"), gap: "0.4rem" }} className="flex flex-col items-center w-full">

            <div className="flex flex-col items-center w-full"
              style={{ gap: "clamp(0.1rem, 0.6vh, 0.4rem)" }}>

              {/* Name 1 */}
              <span className="better-saturday text-center" style={{
                fontSize:      "clamp(3.2rem, 11.5vw, 8.2rem)",
                color:         "#1e1e1e",
                lineHeight:    1.0,
                letterSpacing: "0.005em",
              }}>
                {siteConfig.couple.groomNickname.trim()}
              </span>

              {/* & — horizontally centered between names */}
              <span className="better-saturday text-center" style={{
                fontSize:      "clamp(2.0rem, 7vw, 4.0rem)",
                color:         "rgba(196,124,150,0.78)",
                lineHeight:    1.5,
                letterSpacing: "0.04em",
              }}>
                and
              </span>

              {/* Name 2 */}
              <span className="better-saturday text-center" style={{
                fontSize:      "clamp(3.2rem, 11.5vw, 6.2rem)",
                color:         "#1e1e1e",
                lineHeight:    1.5,
                letterSpacing: "0.005em",
              }}>
                {siteConfig.couple.brideNickname.trim()}
              </span>
            </div>

            {/* wavy underline */}
            <svg viewBox="0 0 200 14" aria-hidden
              style={{ width: "clamp(140px, 44vw, 300px)", overflow: "visible", display: "block" }}>
              <path d="M0 7 Q25 1 50 7 Q75 13 100 7 Q125 1 150 7 Q175 13 200 7"
                fill="none" stroke="rgba(196,124,150,0.30)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>

          {/* thin divider */}
          <div style={vis(2, "60ms")} className="w-full flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(196,124,150,0.20))" }} />
            <span style={{ color: "rgba(196,124,150,0.28)", fontSize: "5px" }}>◆</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(196,124,150,0.20))" }} />
          </div>

          {/* ── SECTION 3 · Date ── */}
          <div style={{ ...vis(3, "60ms"), gap: "clamp(0.35rem, 1vh, 0.6rem)" }} className="flex flex-col items-center w-full"
            aria-label={`${siteConfig.ceremony.day}, ${siteConfig.wedding.date} at ${siteConfig.ceremony.time}`}>

            {/* MONTH */}
            <p className="quicksand-book text-center" style={{
              fontSize:      "clamp(0.60rem, 1.7vw, 0.82rem)",
              letterSpacing: "0.40em",
              textTransform: "uppercase",
              color:         "rgba(35,35,35,0.72)",
            }}>
              {weddingMonth}
            </p>

            {/* FRIDAY · [30] · AT 4:00 PM */}
            <div className="flex items-center justify-center w-full"
              style={{ gap: "clamp(0.9rem, 3vw, 1.8rem)" }}>

              <span className="quicksand-book uppercase" style={{
                fontSize:      "clamp(0.55rem, 1.5vw, 0.72rem)",
                letterSpacing: "0.26em",
                color:         "rgba(35,35,35,0.56)",
              }}>
                {siteConfig.ceremony.day}
              </span>

              {/* date circle */}
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{
                width:      "clamp(2.6rem, 7.5vw, 3.8rem)",
                height:     "clamp(2.6rem, 7.5vw, 3.8rem)",
                background: "linear-gradient(135deg, rgba(238,172,196,0.95) 0%, rgba(210,110,148,0.88) 100%)",
                boxShadow:  "0 3px 16px rgba(196,124,150,0.28), 0 1px 4px rgba(196,124,150,0.18)",
              }}>
                <span className="quicksand-book tabular-nums" style={{
                  fontSize:   "clamp(1.05rem, 3.2vw, 1.65rem)",
                  color:      "#fff",
                  lineHeight: 1,
                  fontWeight: 600,
                }}>
                  {weddingDay}
                </span>
              </div>

              <span className="quicksand-book uppercase" style={{
                fontSize:      "clamp(0.55rem, 1.5vw, 0.72rem)",
                letterSpacing: "0.18em",
                color:         "rgba(35,35,35,0.56)",
              }}>
                at {siteConfig.ceremony.time}
              </span>
            </div>

            {/* YEAR */}
            <p className="quicksand-book tabular-nums text-center" style={{
              fontSize:      "clamp(0.56rem, 1.5vw, 0.72rem)",
              letterSpacing: "0.30em",
              color:         "rgba(35,35,35,0.50)",
            }}>
              {weddingYear}
            </p>
          </div>

          {/* ── SECTION 4 · Venues ── */}
          <div style={{ ...vis(3, "120ms"), gap: "0.18rem" }} className="flex flex-col items-center w-full">
            <p className="glacial-indifference text-center" style={{
              fontSize:      "clamp(0.58rem, 1.5vw, 0.72rem)",
              letterSpacing: "0.06em",
              color:         "rgba(80,45,60,0.54)",
              lineHeight:    1.6,
            }}>
              {siteConfig.ceremony.location}
            </p>
            <p className="glacial-indifference text-center" style={{
              fontSize:      "clamp(0.55rem, 1.4vw, 0.68rem)",
              letterSpacing: "0.05em",
              color:         "rgba(80,45,60,0.40)",
              lineHeight:    1.6,
            }}>
              {siteConfig.reception.location}
            </p>
          </div>

          {/* ── SECTION 5 · Progress ── */}
          <div style={{ ...vis(4, "80ms"), gap: "0.5rem", paddingTop: "0.25rem" }} className="flex flex-col items-center w-full">

            <p className="glacial-indifference text-center" style={{
              fontSize:      "clamp(0.50rem, 1.3vw, 0.60rem)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color:         "rgba(196,124,150,0.58)",
            }}>
              Preparing your invitation
            </p>

            {/* progress track */}
            <div className="relative mx-auto"
              style={{ width: "clamp(120px, 36vw, 200px)", height: "2px" }}
              role="presentation">
              <div className="absolute inset-0 rounded-full"
                style={{ backgroundColor: "rgba(216,152,172,0.18)" }} />
              <div className="absolute inset-y-0 left-0 rounded-full overflow-hidden" style={{
                width:      `${Math.max(progress, 2)}%`,
                transition: "width 200ms linear",
                background: "linear-gradient(to right, rgba(139,74,98,0.60), rgba(216,152,172,0.90))",
              }}>
                <div className="absolute inset-y-0 animate-loader-shimmer" style={{
                  width:      "50px",
                  background: "linear-gradient(90deg, transparent 0%, rgba(248,220,228,0.60) 50%, transparent 100%)",
                }} />
              </div>
            </div>

            <p className="quicksand-book tabular-nums text-center" style={{
              fontSize:      "clamp(0.48rem, 1.2vw, 0.58rem)",
              letterSpacing: "0.28em",
              color:         "rgba(139,74,98,0.36)",
            }} aria-live="polite">
              {progress}%
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
