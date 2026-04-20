/**
 * Cloudinary sync script — uploads local public/ files to Cloudinary.
 *
 * 1. Lists every asset under this project's Cloudinary folder.
 * 2. Compares against local public/ files.
 * 3. Uploads local files that are missing from Cloudinary.
 *
 * Usage:
 *   pnpm sync:cloudinary
 *   pnpm sync:cloudinary:dry-run
 *
 * Environment variables required in .env.local:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 */

import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
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

const PROJECT_PREFIX = "wedding-projects/jan-and-norenel"
const SOURCE_DIR = path.resolve(process.cwd(), "public")

const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg",
  ".JPG", ".JPEG", ".PNG", ".WEBP",
])

const VIDEO_EXTENSIONS = new Set([
  ".mp4", ".mov", ".webm", ".avi", ".mkv", ".ogv",
  ".MP4", ".MOV", ".WEBM",
])

/** Subfolders inside public/ that are never synced to Cloudinary */
const SKIP_FOLDERS = new Set(["favicon_io"])

const BATCH_SIZE = 5

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

/** Walks public/ and returns all media file paths, skipping SKIP_FOLDERS. */
function collectLocalFiles(dir: string): string[] {
  const results: string[] = []
  function walk(current: string): void {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (!SKIP_FOLDERS.has(entry.name)) walk(full)
      } else if (entry.isFile() && isMediaFile(full)) {
        results.push(full)
      }
    }
  }
  walk(dir)
  return results
}

/**
 * Converts an absolute local file path to a Cloudinary public ID.
 * "/abs/path/to/public/Details/reception.png"
 *   → "wedding-projects/jennifer-and-patrick/Details/reception"
 */
function toPublicId(absPath: string): string {
  const rel = path.relative(SOURCE_DIR, absPath)
  const withoutExt = rel.replace(/\.[^/.]+$/, "")
  return `${PROJECT_PREFIX}/${withoutExt.split(path.sep).join("/")}`
}

/**
 * Fetches every resource public_id under PROJECT_PREFIX from Cloudinary
 * for a given resource type, handling pagination automatically.
 */
async function listCloudinaryIds(resourceType: "image" | "video"): Promise<Set<string>> {
  const ids = new Set<string>()
  let nextCursor: string | undefined

  do {
    const res = await cloudinary.api.resources({
      resource_type: resourceType,
      type: "upload",
      prefix: PROJECT_PREFIX,
      max_results: 500,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    })
    for (const r of res.resources) {
      ids.add(r.public_id as string)
    }
    nextCursor = res.next_cursor as string | undefined
  } while (nextCursor)

  return ids
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

async function uploadFile(
  absPath: string,
  publicId: string,
  dryRun: boolean
): Promise<"uploaded" | "failed"> {
  if (dryRun) {
    console.log(`  + would upload — ${publicId}`)
    return "uploaded"
  }
  try {
    const resourceType = isVideoFile(absPath) ? "video" : "image"
    await cloudinary.uploader.upload(absPath, {
      public_id: publicId,
      resource_type: resourceType,
      overwrite: false,
      use_filename: false,
      unique_filename: false,
    })
    console.log(`  ↑ uploaded  — ${publicId}`)
    return "uploaded"
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  ✗ failed    — ${publicId}: ${msg}`)
    return "failed"
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run")

  const { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env

  if (!NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error(
      "❌  Missing Cloudinary credentials.\n" +
        "    Ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and\n" +
        "    CLOUDINARY_API_SECRET are set in .env.local"
    )
    process.exit(1)
  }

  console.log(`\n☁️  Cloudinary sync${dryRun ? " (DRY RUN)" : ""}`)
  console.log(`   Project : ${PROJECT_PREFIX}`)
  console.log(`   Source  : ${SOURCE_DIR}\n`)

  // ── Step 1: Collect local media files ─────────────────────────────────────
  const localFiles = collectLocalFiles(SOURCE_DIR)
  // Map publicId → absPath for O(1) lookups
  const localById = new Map<string, string>(
    localFiles.map((f) => [toPublicId(f), f])
  )

  console.log(`   Local media files : ${localFiles.length}`)

  // ── Step 2: Fetch remote assets ────────────────────────────────────────────
  console.log("   Fetching Cloudinary index...")
  const [remoteImages, remoteVideos] = await Promise.all([
    listCloudinaryIds("image"),
    listCloudinaryIds("video"),
  ])

  const remoteAll = new Set<string>([...remoteImages, ...remoteVideos])

  console.log(`   Cloudinary assets : ${remoteAll.size}\n`)

  // ── Step 3: Diff ───────────────────────────────────────────────────────────
  const toUpload = Array.from(localById.entries()).filter(([id]) => !remoteAll.has(id))

  if (toUpload.length === 0) {
    console.log("✅  Already in sync — nothing to do.\n")
    process.exit(0)
  }

  console.log(`   To upload : ${toUpload.length}\n`)

  let failures = 0

  // ── Step 4: Upload new files ───────────────────────────────────────────────
  if (toUpload.length > 0) {
    console.log(`${dryRun ? "[DRY RUN] " : ""}Uploading ${toUpload.length} new asset(s)...\n`)
    for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
      const batch = toUpload.slice(i, i + BATCH_SIZE)
      const results = await Promise.all(
        batch.map(([publicId, absPath]) => uploadFile(absPath, publicId, dryRun))
      )
      failures += results.filter((r) => r === "failed").length
    }
    console.log()
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("─────────────────────────────────────────")
  if (dryRun) {
    console.log(`  DRY RUN — no changes were made`)
    console.log(`  Would upload : ${toUpload.length}`)
  } else {
    console.log(`  Uploaded : ${toUpload.length - failures}`)
    if (failures > 0) console.log(`  Failed   : ${failures}`)
  }
  console.log("─────────────────────────────────────────\n")

  if (failures > 0) process.exit(1)
}

main()
