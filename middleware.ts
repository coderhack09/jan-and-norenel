import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Match Facebook’s link-preview and common social/SEO crawlers.
// If you add password protection or auth, keep this check first and skip auth for
// these user agents so they always get 200 + public HTML and static assets.
const LINK_PREVIEW_BOTS =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|meta-externalagent|WhatsApp|Slackbot|TelegramBot|Discordbot|Googlebot|Google-InspectionTool|bingbot/i

export function isLinkPreviewCrawler(ua: string) {
  return LINK_PREVIEW_BOTS.test(ua)
}

export function middleware(request: NextRequest) {
  if (isLinkPreviewCrawler(request.headers.get("user-agent") ?? "")) {
    return NextResponse.next()
  }
  // Add auth / gating here — only after the bot branch above.
  return NextResponse.next()
}

// Skip middleware for static assets and Next internals (faster, predictable 200s for files).
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|avif|woff2?|css|js)$).*)"],
}
