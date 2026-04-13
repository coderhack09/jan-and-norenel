import fs from "fs/promises"
import path from "path"
import MasonryGallery from "@/components/masonry-gallery"
import { siteConfig } from "@/content/site"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { Cinzel, Cormorant_Garamond } from "next/font/google"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

// Palette lives in globals.css → @theme inline → --color-motif-*
// Edit there once to update every component.
const GALLERY_TEXT = "var(--color-motif-deep)"
// Filter renders flower decorations in --color-motif-medium (#5F7D6B, classic sage)
const GALLERY_DECO_FILTER =
  "brightness(0) saturate(100%) invert(47%) sepia(18%) saturate(650%) hue-rotate(100deg) brightness(88%) contrast(85%)"

// Generate on each request so newly added images in public/ appear without a rebuild
export const dynamic = "force-dynamic"

async function getImagesFrom(dir: string) {
  const abs = path.join(process.cwd(), "public", dir)
  try {
    const entries = await fs.readdir(abs, { withFileTypes: true })
    return entries
      .filter((e) => e.isFile())
      .map((e) => `/${dir}/${e.name}`)
      .filter((p) => p.match(/\.(jpe?g|png|webp|gif)$/i))
      .sort((a, b) => {
        // Extract numeric part from filename for proper numerical sorting
        const numA = parseInt(a.match(/\/(\d+)\./)?.[1] || "0", 10)
        const numB = parseInt(b.match(/\/(\d+)\./)?.[1] || "0", 10)
        return numA - numB
      })
  } catch {
    return []
  }
}

export default async function GalleryPage() {
  const mobileImages = await getImagesFrom("mobile-background")
  const desktopImages = await getImagesFrom("desktop-background")
  const allImages = [...mobileImages, ...desktopImages]
  const images = allImages.map((src) => {
    const category = src.includes("mobile-background") ? "mobile" as const : "desktop" as const
    return { src, category }
  })

  return (
    <main className="min-h-screen relative overflow-hidden bg-motif-cream">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-motif-cream" />
      
      {/* Flower decoration - top left corner */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25 scale-y-[-1]"
          priority={false}
          style={{ filter: GALLERY_DECO_FILTER }}
        />
      </div>
      
      {/* Flower decoration - top right corner */}
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25 scale-x-[-1] scale-y-[-1]"
          priority={false}
          style={{ filter: GALLERY_DECO_FILTER }}
        />
      </div>
      
      {/* Flower decoration - left bottom corner */}
      <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25"
          priority={false}
          style={{ filter: GALLERY_DECO_FILTER }}
        />
      </div>
      
      {/* Flower decoration - right bottom corner */}
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25 scale-x-[-1]"
          priority={false}
          style={{ filter: GALLERY_DECO_FILTER }}
        />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 px-3 sm:px-4">
          {/* Decorative element above title - match Details/Gallery */}
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div
              className="w-8 sm:w-12 md:w-16 h-px"
              style={{ background: `linear-gradient(to right, transparent, var(--color-motif-accent), transparent)` }}
            />
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: GALLERY_TEXT }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: GALLERY_TEXT }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: GALLERY_TEXT }} />
            <div
              className="w-8 sm:w-12 md:w-16 h-px"
              style={{ background: `linear-gradient(to right, transparent, var(--color-motif-accent), transparent)` }}
            />
          </div>

          <h1
            className={`${cinzel.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-2 sm:mb-3 md:mb-4`}
            style={{ color: GALLERY_TEXT }}
          >
            Our Love Story Gallery
          </h1>
          <p
            className={`${cormorant.className} text-xs sm:text-sm md:text-base lg:text-lg font-light max-w-xl mx-auto leading-relaxed px-2`}
            style={{ color: GALLERY_TEXT }}
          >
            Every photograph tells a story of {siteConfig.couple.groomNickname} & {siteConfig.couple.brideNickname}'s journey to
            forever
          </p>

          {/* Decorative element below subtitle */}
          <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: GALLERY_TEXT }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: GALLERY_TEXT }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: GALLERY_TEXT }} />
          </div>
        </div>

        {images.length === 0 ? (
          <div className={`${cormorant.className} text-center opacity-90`} style={{ color: GALLERY_TEXT }}>
            <p className="font-light">
              No images found. Add files to{" "}
              <code
                className="px-2 py-1 rounded border"
                style={{ backgroundColor: "var(--color-motif-soft)", borderColor: "var(--color-motif-silver)", color: GALLERY_TEXT }}
              >
                public/mobile-background or public/desktop-background
              </code>
              .
            </p>
          </div>
        ) : (
          <MasonryGallery images={images} />
        )}


      </section>
    </main>
  )
}