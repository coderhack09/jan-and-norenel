"use client"

import Link from "next/link"
import { useEffect } from "react"

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hide the global navbar while on /gallery
    const navbar = document.querySelector("nav") as HTMLElement | null
    if (navbar) navbar.style.display = "none"
    return () => {
      if (navbar) navbar.style.display = ""
    }
  }, [])

  return (
    <div className="min-h-screen bg-motif-cream">
      {/* Simple top bar with only Back link, themed to motif palette */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-motif-cream/95 border-b border-motif-silver shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
          <Link
            href="/#gallery"
            onClick={() => sessionStorage.setItem("returnFromGallery", "true")}
            className="inline-flex items-center gap-1.5 sm:gap-2 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 transition-all duration-200 font-sans text-sm sm:text-base"
            style={{
              backgroundColor: "var(--color-motif-deep)",
              borderColor: "var(--color-motif-deep)",
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-motif-medium)"
              e.currentTarget.style.borderColor = "var(--color-motif-medium)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-motif-deep)"
              e.currentTarget.style.borderColor = "var(--color-motif-deep)"
            }}
          >
            <span className="text-base sm:text-lg">←</span>
            <span className="hidden xs:inline">Back to main page</span>
            <span className="xs:hidden">Back</span>
          </Link>
          <div className="text-xs sm:text-sm font-sans font-medium" style={{ color: "var(--color-motif-deep)" }}>
            Gallery
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}