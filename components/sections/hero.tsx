"use client"

import { useEffect, useState } from "react"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { siteConfig } from "@/content/site"

export function Hero() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 380),
      setTimeout(() => setPhase(3), 640),
      setTimeout(() => setPhase(4), 860),
      setTimeout(() => setPhase(5), 1060),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const vis = (minPhase: number) =>
    phase >= minPhase
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-5 transition-all duration-700 ease-out"

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >

      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16">
        {/* Card container */}
        <div
          className={`w-full max-w-lg sm:max-w-xl rounded-[24px] sm:rounded-[28px] px-7 sm:px-12 py-10 sm:py-14 text-center transition-all duration-700 ease-out ${
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{
            background: "linear-gradient(155deg, #F4F6F2 0%, #EDF1EC 40%, #F0F4EF 70%, #F4F6F2 100%)",
            border: "1px solid rgba(95, 125, 107, 0.20)",
            boxShadow: "0 24px 80px rgba(47, 79, 62, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.70)",
          }}
        >

          {/* Monogram + glow ring */}
          <div className="flex justify-center mb-8">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute rounded-full animate-loader-glow"
                style={{
                  width: "160px",
                  height: "160px",
                  background:
                    "radial-gradient(circle, rgba(95, 125, 107, 0.12) 0%, transparent 65%)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: "90px",
                  height: "90px",
                  border: "1px solid rgba(95, 125, 107, 0.25)",
                }}
              />
              <CloudinaryImage
                src={siteConfig.couple.monogram}
                alt={`${siteConfig.couple.brideNickname} & ${siteConfig.couple.groomNickname} monogram`}
                width={160}
                height={160}
                className="relative h-20 w-20 sm:h-24 sm:w-24 object-contain object-center brightness-0"
                style={{ opacity: 0.75 }}
                priority
              />
            </div>
          </div>

          {/* Together with their families */}
          <p
            className={`lora-regular ${vis(2)}`}
            style={{
              fontSize: "clamp(0.85rem, 2.2vw, 1.05rem)",
              letterSpacing: "0.08em",
              color: "rgba(47, 79, 62, 0.78)",
              lineHeight: 1.6,
            }}
          >
            Together with their families
          </p>

          {/* Thin rule */}
          {/* <div className={`flex items-center gap-3 justify-center mt-3 mb-2 ${vis(2)}`}>
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(47, 79, 62, 0.30), transparent)" }} />
            <span style={{ color: "rgba(47, 79, 62, 0.35)", fontSize: "4px" }}>◆</span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(47, 79, 62, 0.30), transparent)" }} />
          </div> */}

          {/* "to celebrate the marriage of" */}
          <p
            className={`lora-regular ${vis(2)}`}
            style={{
              fontSize: "clamp(0.80rem, 2vw, 1rem)",
              letterSpacing: "0.06em",
              color: "rgba(47, 79, 62, 0.68)",
              lineHeight: 1.6,
            }}
          >
            to celebrate the marriage of
          </p>

          {/* Couple names */}
          <div className={`mt-5 ${vis(3)}`}>
            <p
              className="symphony-pro-regular"
              style={{
                fontSize: "clamp(4rem, 13.5vw, 7.5rem)",
                color: "#2F4F3E",
                lineHeight: 1.05,
                textShadow: "0 2px 28px rgba(47, 79, 62, 0.18)",
              }}
            >
              {siteConfig.couple.brideNickname.trim()}
            </p>

            {/* Ampersand divider */}
            <div className="flex items-center gap-3 justify-center my-1">
              <div
                className="h-px flex-1 max-w-[55px]"
                style={{ background: "linear-gradient(to left, rgba(47, 79, 62, 0.30), transparent)" }}
              />
              <span
                className="symphony-pro-regular"
                style={{
                  fontSize: "clamp(1.5rem, 4.5vw, 2.1rem)",
                  color: "rgba(95, 125, 107, 0.80)",
                  lineHeight: 1,
                }}
              >
                &amp;
              </span>
              <div
                className="h-px flex-1 max-w-[55px]"
                style={{ background: "linear-gradient(to right, rgba(47, 79, 62, 0.30), transparent)" }}
              />
            </div>

            <p
              className="awesome-lathusca"
              style={{
                fontSize: "clamp(4rem, 13.5vw, 7.5rem)",
                color: "#2F4F3E",
                lineHeight: 1.05,
                textShadow: "0 2px 28px rgba(47, 79, 62, 0.18)",
              }}
            >
              {siteConfig.couple.groomNickname.trim()}
            </p>
          </div>

          {/* Diamond rule */}
          {/* <div className={`flex items-center gap-3 justify-center mt-6 mb-1 ${vis(4)}`}>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to left, rgba(47, 79, 62, 0.30), transparent)" }}
            />
            <span style={{ color: "rgba(47, 79, 62, 0.45)", fontSize: "5px" }}>◆</span>
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(to right, rgba(47, 79, 62, 0.30), transparent)" }}
            />
          </div> */}

          {/* ── Date Block ── */}
          <div className={`mt-7 flex flex-col items-center gap-1.5 ${vis(4)}`}>

            {/* Month */}
            <p
              className="lora-regular"
              style={{
                fontSize: "clamp(0.65rem, 1.6vw, 0.78rem)",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(47, 79, 62, 0.60)",
              }}
            >
              {siteConfig.ceremony.date.split(" ")[0]}
            </p>

            {/* Row: day of week · big day number · time */}
            <div className="flex items-center" style={{ lineHeight: 1 }}>

              {/* Day of week */}
              <p
                className="lora-regular"
                style={{
                  fontSize: "clamp(0.58rem, 1.4vw, 0.70rem)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(47, 79, 62, 0.55)",
                  paddingRight: "clamp(0.7rem, 2.2vw, 1.1rem)",
                }}
              >
                {siteConfig.ceremony.day}
              </p>

              {/* Vertical rule */}
              <div style={{
                width: "1px",
                height: "clamp(2.4rem, 6.5vw, 3.4rem)",
                background: "linear-gradient(to bottom, transparent, rgba(47, 79, 62, 0.28), transparent)",
                flexShrink: 0,
              }} />

              {/* Day number — sage accent */}
              <p
                className="lora-bold"
                style={{
                  fontSize: "clamp(2.8rem, 9vw, 4rem)",
                  letterSpacing: "-0.02em",
                  color: "#2F4F3E",
                  padding: "0 clamp(0.7rem, 2.2vw, 1.1rem)",
                  lineHeight: 1,
                }}
              >
                {siteConfig.ceremony.date.split(" ")[1]?.replace(",", "")}
              </p>

              {/* Vertical rule */}
              <div style={{
                width: "1px",
                height: "clamp(2.4rem, 6.5vw, 3.4rem)",
                background: "linear-gradient(to bottom, transparent, rgba(47, 79, 62, 0.28), transparent)",
                flexShrink: 0,
              }} />

              {/* Time */}
              <p
                className="lora-regular"
                style={{
                  fontSize: "clamp(0.58rem, 1.4vw, 0.70rem)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(47, 79, 62, 0.55)",
                  paddingLeft: "clamp(0.7rem, 2.2vw, 1.1rem)",
                }}
              >
                At {siteConfig.ceremony.time}
              </p>
            </div>

            {/* Year */}
            <p
              className="lora-regular"
              style={{
                fontSize: "clamp(0.65rem, 1.6vw, 0.78rem)",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(47, 79, 62, 0.45)",
              }}
            >
              {siteConfig.ceremony.date.split(" ")[2]}
            </p>
          </div>

          {/* Ceremony & reception details */}
          <div className={`mt-6 space-y-5 ${vis(5)}`}>
            <div className="space-y-1.5">
              <p
                className="lora-regular"
                style={{
                  fontSize: "clamp(0.62rem, 1.5vw, 0.74rem)",
                  letterSpacing: "0.30em",
                  textTransform: "uppercase",
                  color: "rgba(47, 79, 62, 0.55)",
                }}
              >
                Ceremony
              </p>
              <p
                className="lora-regular"
                style={{
                  fontSize: "clamp(0.82rem, 2.2vw, 1rem)",
                  color: "rgba(47, 79, 62, 0.82)",
                  lineHeight: 1.5,
                }}
              >
                {siteConfig.ceremony.location}
              </p>
            </div>

            <div
              className="h-px w-16 mx-auto"
              style={{ background: "rgba(95, 125, 107, 0.25)" }}
            />

            <div className="space-y-1.5">
              <p
                className="lora-regular"
                style={{
                  fontSize: "clamp(0.62rem, 1.5vw, 0.74rem)",
                  letterSpacing: "0.30em",
                  textTransform: "uppercase",
                  color: "rgba(47, 79, 62, 0.55)",
                }}
              >
                Reception to follow
              </p>
              <p
                className="lora-regular"
                style={{
                  fontSize: "clamp(0.82rem, 2.2vw, 1rem)",
                  color: "rgba(47, 79, 62, 0.82)",
                  lineHeight: 1.5,
                }}
              >
                {siteConfig.reception.location}
              </p>
            </div>
          </div>

          {/* RSVP button */}
          <div className={`mt-9 flex justify-center ${vis(5)}`}>
            <a
              href="#guest-list"
              className="inline-flex items-center justify-center px-10 py-3 rounded-sm transition-all duration-300 hover:bg-[#3d6b54] active:scale-95"
              style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "0.62rem",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "#F4F6F2",
                border: "1px solid rgba(47, 79, 62, 0.60)",
                background: "#5F7D6B",
                boxShadow: "0 8px 24px rgba(47, 79, 62, 0.25)",
              }}
            >
              RSVP
            </a>
          </div>

        </div>{/* end card */}
      </div>
    </section>
  )
}
