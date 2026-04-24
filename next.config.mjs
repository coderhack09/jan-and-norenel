import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/**
 * Open https + same-origin, but explicit script/style rules so Next.js (inline
 * hydration, CSS-in-JS) still works. Broad img/connect (https:) helps crawlers
 * and tools (e.g. Facebook Sharing Debugger) that run your page in a browser.
 */
function buildContentSecurityPolicy(isDevelopment) {
  const connectSrc = isDevelopment
    ? [
        "'self'",
        "https:",
        "wss:",
        "ws:",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "ws://127.0.0.1:3000",
        "ws://localhost:3000",
        "https://vercel.live",
      ]
    : ["'self'", "https:", "wss:"]

  return [
    "default-src 'self' https: data: blob:",
    "base-uri 'self'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https:",
    `connect-src ${connectSrc.join(" ")}`,
    "media-src 'self' https: data: blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "frame-src 'self' https:",
    "frame-ancestors 'self'",
    isDevelopment ? "" : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ")
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Images are optimized by Cloudinary (f_auto, q_auto) via cloudinaryLoader
    unoptimized: false,
  },
  experimental: {
    optimizePackageImports: [
      'date-fns',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
    ],
  },
  headers: async () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const contentSecurityPolicy = buildContentSecurityPolicy(isDevelopment)

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Add cache-control for HTML pages
          ...(isDevelopment
            ? [
                {
                  key: "Cache-Control",
                  value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
                },
              ]
            : [
                {
                  key: "Cache-Control",
                  value: "public, s-maxage=10, stale-while-revalidate=59",
                },
              ]),
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { 
            key: "Cache-Control", 
            value: isDevelopment 
              ? "no-store, no-cache, must-revalidate" 
              : "public, max-age=31536000, immutable" 
          }
        ],
      },
      {
        source: "/:all*\\.(js|css|svg|png|jpg|jpeg|gif|webp|ico|woff2?)",
        headers: [
          { 
            key: "Cache-Control", 
            value: isDevelopment 
              ? "no-store, no-cache, must-revalidate" 
              : "public, max-age=31536000, immutable" 
          }
        ],
      },
    ]
  },
};

export default withBundleAnalyzer(nextConfig);
