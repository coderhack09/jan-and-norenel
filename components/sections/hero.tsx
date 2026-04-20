"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { siteConfig } from "@/content/site"

export function Hero() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 360),
      setTimeout(() => setPhase(3), 600),
      setTimeout(() => setPhase(4), 820),
      setTimeout(() => setPhase(5), 1020),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const vis = (minPhase: number, delay = "0ms") => ({
    opacity:    phase >= minPhase ? 1 : 0,
    transform:  phase >= minPhase ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 700ms ease-out ${delay}, transform 700ms ease-out ${delay}`,
  })

  const weddingDate  = new Date(siteConfig.wedding.date)
  const weddingYear  = weddingDate.getFullYear()
  const weddingMonth = weddingDate.toLocaleString("en-US", { month: "long" }).toUpperCase()
  const weddingDay   = weddingDate.getDate()

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 72% 60% at 50% 46%, rgba(236,196,210,0.16) 0%, rgba(248,220,228,0.06) 60%, transparent 84%)",
      }} />

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
          Same max-w + padding system as LoadingScreen.
         ══════════════════════════════════════ */}
      <div className="relative z-10 w-full flex items-center justify-center"
        style={{
          paddingTop:    "clamp(5rem, 13vh, 9rem)",
          paddingBottom: "clamp(5rem, 13vh, 9rem)",
          paddingLeft:   "clamp(1.5rem, 6vw, 4rem)",
          paddingRight:  "clamp(1.5rem, 6vw, 4rem)",
        }}>

        <div className="w-full flex flex-col items-center"
          style={{
            maxWidth: "clamp(280px, 72vw, 520px)",
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

            <h1 className="better-saturday text-center" style={{
              fontSize:      "clamp(2.0rem, 5.8vw, 3.4rem)",
              color:         "#2a2a2a",
              lineHeight:    1.0,
              letterSpacing: "0.01em",
            }}>
              Join Our Wedding
            </h1>

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
              maxWidth:      "32ch",
            }}>
              Together with their families, to celebrate the marriage of
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

              {/* Bride */}
              <span className="better-saturday text-center" style={{
                fontSize:      "clamp(3.2rem, 11.5vw, 6.2rem)",
                color:         "#1e1e1e",
                lineHeight:    1.0,
                letterSpacing: "0.005em",
              }}>
                {siteConfig.couple.groomNickname.trim()}
              </span>

              {/* & — centered between names */}
              <span className="better-saturday text-center" style={{
                fontSize:      "clamp(2.0rem, 7vw, 4.0rem)",
                color:         "rgba(196,124,150,0.78)",
                lineHeight:    1.0,
                letterSpacing: "0.04em",
              }}>
                and
              </span>

              {/* Groom */}
              <span className="better-saturday text-center" style={{
                fontSize:      "clamp(3.2rem, 11.5vw, 6.2rem)",
                color:         "#1e1e1e",
                lineHeight:    1.0,
                letterSpacing: "0.005em",
              }}>
                {siteConfig.couple.brideNickname.trim()}
              </span>
            </div>

            {/* wavy underline */}
            {/* <svg viewBox="0 0 200 14" aria-hidden
              style={{ width: "clamp(140px, 44vw, 300px)", overflow: "visible", display: "block" }}>
              <path d="M0 7 Q25 1 50 7 Q75 13 100 7 Q125 1 150 7 Q175 13 200 7"
                fill="none" stroke="rgba(196,124,150,0.30)" strokeWidth="1.3" strokeLinecap="round" />
            </svg> */}
          </div>

          {/* thin divider */}
          <div style={vis(2, "60ms")} className="w-full flex items-center gap-3">
            {/* <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(196,124,150,0.20))" }} />
            <span style={{ color: "rgba(196,124,150,0.28)", fontSize: "5px" }}>◆</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(196,124,150,0.20))" }} /> */}
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
          <div style={{ ...vis(4, "80ms") }} className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full"
              style={{ gap: "clamp(0.8rem, 2vh, 1.4rem)" }}>

              {/* Ceremony */}
              <div className="flex flex-col items-center" style={{ gap: "0.3rem" }}>
                <p className="quicksand-book uppercase text-center" style={{
                  fontSize:      "clamp(0.50rem, 1.2vw, 0.62rem)",
                  letterSpacing: "0.30em",
                  color:         "rgba(196,124,150,0.70)",
                }}>
                  Ceremony
                </p>
                <div className="h-px w-8" style={{ background: "rgba(196,124,150,0.20)" }} />
                <p className="glacial-indifference text-center" style={{
                  fontSize:      "clamp(0.58rem, 1.5vw, 0.72rem)",
                  letterSpacing: "0.06em",
                  color:         "rgba(80,45,60,0.60)",
                  lineHeight:    1.6,
                }}>
                  {siteConfig.ceremony.location}
                </p>
              </div>

              {/* Reception */}
              <div className="flex flex-col items-center" style={{ gap: "0.3rem" }}>
                <p className="quicksand-book uppercase text-center" style={{
                  fontSize:      "clamp(0.50rem, 1.2vw, 0.62rem)",
                  letterSpacing: "0.30em",
                  color:         "rgba(196,124,150,0.70)",
                }}>
                  Reception
                </p>
                <div className="h-px w-8" style={{ background: "rgba(196,124,150,0.20)" }} />
                <p className="glacial-indifference text-center" style={{
                  fontSize:      "clamp(0.58rem, 1.5vw, 0.72rem)",
                  letterSpacing: "0.05em",
                  color:         "rgba(80,45,60,0.48)",
                  lineHeight:    1.6,
                }}>
                  {siteConfig.reception.location}
                </p>
              </div>
            </div>
          </div>

          {/* ── SECTION 5 · RSVP Button ── */}
          <div style={{ ...vis(5, "80ms"), paddingTop: "0.25rem" }} className="flex justify-center w-full">
            <a
              href="#guest-list"
              className="inline-flex items-center justify-center transition-all duration-300 hover:opacity-85 active:scale-95"
              style={{
                fontFamily:    '"Cinzel", serif',
                fontSize:      "clamp(0.62rem, 1.4vw, 0.76rem)",
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color:         "#FFFFFF",
                padding:       "clamp(0.7rem, 2vh, 0.95rem) clamp(2rem, 5vw, 3.5rem)",
                border:        "1px solid rgba(139,74,98,0.40)",
                background:    "linear-gradient(135deg, #8B4A62 0%, #B56B88 55%, #C47C96 100%)",
                boxShadow:     "0 4px 20px rgba(139,74,98,0.20), inset 0 1px 0 rgba(255,255,255,0.10)",
              }}
            >
              RSVP
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
