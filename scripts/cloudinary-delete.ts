/**
 * Cloudinary delete script.
 *
 * Detects files staged for deletion under public/ and destroys the matching
 * Cloudinary resources before the commit lands.
 *
 * Called automatically by the Husky pre-commit hook.
 * Can also be run manually (dry-run mode supported):
 *   pnpm cloudinary:delete
 *   pnpm cloudinary:delete --dry-run
 *
 * Environment variables required in .env.local:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 */

import { v2 as cloudinary } from "cloudinary"
import { execSync } from "child_process"
import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// ---------------------------------------------------------------------------
// Constants — must stay in sync with lib/cloudinary.ts
// ---------------------------------------------------------------------------

const PROJECT_PREFIX = "wedding-projects/jezel-and-rodel"
const PUBLIC_DIR_PREFIX = "public/"

const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg",
  ".JPG", ".JPEG", ".PNG", ".WEBP",
])

const VIDEO_EXTENSIONS = new Set([
  ".mp4", ".mov", ".webm", ".avi", ".mkv", ".ogv",
  ".MP4", ".MOV", ".WEBM",
])

/** Subfolders inside public/ that were never uploaded to Cloudinary */
const SKIP_FOLDERS = new Set(["favicon_io"])

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isVideoFile(filePath: string): boolean {
  return VIDEO_EXTENSIONS.has(path.extname(filePath))
}

function isMediaFile(filePath: string): boolean {
  const ext = path.extname(filePath)
  return IMAGE_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext)
}

/**
 * Maps a git-relative path like "public/Details/reception.png" to the
 * Cloudinary public ID that was used when uploading it:
 *   "wedding-projects/jennifer-and-patrick/Details/reception"
 *
 * Mirrors the logic in lib/cloudinary.ts (toPublicId) and
 * scripts/upload-to-cloudinary.ts (buildPublicId).
 */
function toCloudinaryPublicId(filePath: string): string {
  const relative = filePath.startsWith(PUBLIC_DIR_PREFIX)
    ? filePath.slice(PUBLIC_DIR_PREFIX.length)
    : filePath
  const withoutExt = relative.replace(/\.[^/.]+$/, "")
  return `${PROJECT_PREFIX}/${withoutExt}`
}

/**
 * Returns the list of files staged for deletion in the current git index.
 */
function getStagedDeletedFiles(): string[] {
  const output = execSync("git diff --cached --name-only --diff-filter=D", {
    encoding: "utf8",
  }).trim()
  if (!output) return []
  return output.split("\n").filter(Boolean)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run")

  const { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env

  if (!NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn(
      "⚠️  Cloudinary credentials missing in .env.local — skipping remote deletion."
    )
    process.exit(0)
  }

  const deletedFiles = getStagedDeletedFiles()

  // Keep only media files under public/, skipping non-Cloudinary subfolders
  const targets = deletedFiles.filter((f) => {
    if (!f.startsWith(PUBLIC_DIR_PREFIX)) return false
    if (!isMediaFile(f)) return false
    // f = "public/<subfolder>/..."  →  parts[1] is the immediate subfolder
    const subfolder = f.split("/")[1]
    if (subfolder && SKIP_FOLDERS.has(subfolder)) return false
    return true
  })

  if (targets.length === 0) {
    console.log("☁️  No public/ media deletions staged — nothing to remove from Cloudinary.")
    process.exit(0)
  }

  if (dryRun) {
    console.log(`\n☁️  Cloudinary delete — DRY RUN (${targets.length} asset(s) would be deleted)\n`)
    for (const f of targets) {
      console.log(`  ~ would delete — ${toCloudinaryPublicId(f)}`)
    }
    console.log()
    process.exit(0)
  }

  console.log(`\n☁️  Cloudinary — deleting ${targets.length} removed asset(s)...\n`)

  let hasFailures = false

  for (const filePath of targets) {
    const publicId = toCloudinaryPublicId(filePath)
    const resourceType = isVideoFile(filePath) ? "video" : "image"

    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })

      if (result.result === "ok") {
        console.log(`  ✓ deleted   — ${publicId}`)
      } else if (result.result === "not found") {
        // Asset was never uploaded or already cleaned up — not an error
        console.log(`  ~ not found — ${publicId}`)
      } else {
        console.warn(`  ⚠ ${result.result} — ${publicId}`)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ failed    — ${publicId}: ${message}`)
      hasFailures = true
    }
  }

  console.log()

  if (hasFailures) {
    console.error("❌  Some Cloudinary deletions failed. Fix the errors above, then commit again.")
    process.exit(1)
  }
}

main()
