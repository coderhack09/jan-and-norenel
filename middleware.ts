import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Link-preview, social, and major SEO crawlers. Match is case-insensitive
 * (we normalize the UA to lowercase before testing). Keep in sync with
 * cloudflare/worker.mjs (BOT_UA) when you deploy the Worker in front of Pages.
 */
const LINK_PREVIEW_BOTS =
  /facebookexternalhit|facebot|meta-externalagent|whatsapp|twitterbot|linkedinbot|slackbot|slack-imgproxy|telegrambot|discordbot|googlebot|google-inspectiontool|googlebot-image|bingbot|msnbot|pinterestbot|pinterest|bingpreview|duckduckbot|baiduspider|yandex|yandexbot|applebot|yeti|kakaotalk|iframely|quora|embedly|skypeuripreview|aihitbot|bytespider|ia_archiver|tumblr|bitlybot|outbrain|discord/i

// Static / binary: keep Range (OG images are often fetched with byte-range).
const ASSET_PATH =
  /\.(?:png|jpe?g|gif|webp|svg|ico|avif|css|mjs?|map|json|xml|txt|woff2?|ttf|eot|woff|mp4|webm|mp3|wasm|webmanifest|pdf|zip)(?:\?|#|$)/i

function getUserAgent(request: NextRequest): string {
  return (request.headers.get("user-agent") ?? "").trim()
}

/**
 * @public — use in app code if you add auth later; call this before any 401/302.
 */
export function isLinkPreviewCrawler(ua: string): boolean {
  if (!ua) return false
  return LINK_PREVIEW_BOTS.test(ua.toLowerCase())
}

/**
 * RSC / HTML app routes: not static under /_next and not a file extension.
 */
function isAppDocumentPath(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return false
  if (ASSET_PATH.test(pathname)) return false
  return true
}

export function middleware(request: NextRequest) {
  const ua = getUserAgent(request)
  const isBot = isLinkPreviewCrawler(ua)

  if (isBot) {
    const m = request.method
    if ((m === "GET" || m === "HEAD") && isAppDocumentPath(request.nextUrl.pathname) && request.headers.has("range")) {
      // Some CDNs or origins 403/416 when Facebook sends "Range" on the HTML document.
      // They still fetch og:image with Range separately (unmatched; extension path).
      const requestHeaders = new Headers(request.headers)
      requestHeaders.delete("range")
      return NextResponse.next({ request: { headers: requestHeaders } })
    }
  }

  // No 403, 401, or blocking here. When adding site-wide password / geo gating, always:
  // if (!isLinkPreviewCrawler(ua) && !isExplicitlyAllowed(request)) { ... }
  return NextResponse.next()
}

// Skip static assets and Next internals (faster, predictable 200s for files).
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_vercel|favicon\\.ico|.*\\.(?:svg|png|jpe?g|gif|webp|ico|avif|woff2?|css|mjs?|map|json|txt|xml|webmanifest|pdf|ttf|eot|woff|mp4|webm|mp3|wasm)$).*)",
  ],
}
