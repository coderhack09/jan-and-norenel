/**
 * Cloudflare Worker — use when a Worker in front of your site must not 403
 * link-preview crawlers and must serve a correct plain-text /robots.txt.
 *
 * Route: yourdomain.com/* (or zone-wide). Does not fix WAF / Bot Fight
 * if those run *before* the Worker; pair with dashboard rules (see repo docs / user).
 */

// Keep in sync with middleware.ts (LINK_PREVIEW_BOTS).
const BOT_UA =
  /facebookexternalhit|facebot|meta-externalagent|whatsapp|twitterbot|linkedinbot|slackbot|slack-imgproxy|telegrambot|discordbot|googlebot|google-inspectiontool|googlebot-image|bingbot|msnbot|pinterestbot|pinterest|bingpreview|duckduckbot|baiduspider|yandex|yandexbot|applebot|yeti|kakaotalk|iframely|quora|embedly|skypeuripreview|aihitbot|bytespider|ia_archiver|tumblr|bitlybot|outbrain|discord/i

const IS_IMAGE = /\.(png|jpe?g|gif|webp|svg|ico|avif|bmp)(\?|#|$)/i

/**
 * @param {Request} request
 * @param {{ ORIGIN?: string, SITE_HOST?: string }} env
 * @param {ExecutionContext} _ctx
 */
export default {
  async fetch(request, env, _ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return passThrough(request, env)
    }

    const url = new URL(request.url)
    const ua = (request.headers.get("User-Agent") || "").toLowerCase()
    const allowBot = BOT_UA.test(ua)
    const isPublicAsset = IS_IMAGE.test(url.pathname) || url.pathname === "/favicon.ico"

    // Plain-text robots — explicit allows for social crawlers; always 200
    if (url.pathname === "/robots.txt") {
      return robotsResponse(request, env)
    }

    // This worker never returns 403; origin/WAF may still. Dashboard rules required for CF bot blocks.
    if (allowBot || isPublicAsset) {
      return passThrough(request, env)
    }

    return passThrough(request, env)
  },
}

/**
 * @param {Request} request
 * @param {{ SITE_HOST?: string }} env
 */
function robotsResponse(request, env) {
  const base = publicBase(request, env)
  const body = `User-agent: facebookexternalhit
Allow: /

User-agent: Facebot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

/**
 * @param {Request} request
 * @param {{ ORIGIN?: string, SITE_HOST?: string }} env
 */
function publicBase(request, env) {
  if (env.SITE_HOST) {
    return `https://${env.SITE_HOST.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  }
  if (env.ORIGIN) {
    return new URL(env.ORIGIN).origin
  }
  return new URL(request.url).origin
}

/**
 * Forward to the origin. Set ORIGIN in wrangler/dashboard if the Worker host
 * differs from the upstream (e.g. custom domain to Vercel).
 *
 * @param {Request} request
 * @param {{ ORIGIN?: string }} env
 */
function passThrough(request, env) {
  if (env.ORIGIN) {
    const url = new URL(request.url)
    const target = new URL(url.pathname + url.search + url.hash, env.ORIGIN)
    const h = new Headers(request.headers)
    h.set("Host", new URL(env.ORIGIN).host)
    return fetch(new Request(target, { method: request.method, headers: h, redirect: "follow" }))
  }
  return fetch(request)
}
