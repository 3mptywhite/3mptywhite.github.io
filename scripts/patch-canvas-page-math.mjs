import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const canvasPageEntry = join(
  projectRoot,
  "node_modules",
  "@quartz-community",
  "canvas-page",
  "dist",
  "index.js",
)

const originalImport = "import { join } from 'path';"
const patchedImport = `${originalImport}\nimport { math, mathHtml } from 'micromark-extension-math';`
const originalRenderer = `    extensions: [gfm()],
    htmlExtensions: [gfmHtml()]`
const patchedRenderer = `    extensions: [gfm(), math()],
    htmlExtensions: [gfmHtml(), mathHtml()]`

let source = readFileSync(canvasPageEntry, "utf8")
const hasPatchedImport = source.includes(patchedImport)
const hasPatchedRenderer = source.includes(patchedRenderer)

if (hasPatchedImport && hasPatchedRenderer) {
  console.log("Canvas math renderer patch already applied")
  process.exit(0)
}

if (hasPatchedImport || hasPatchedRenderer) {
  throw new Error("Canvas math renderer patch is only partially applied")
}

if (!source.includes(originalImport) || !source.includes(originalRenderer)) {
  throw new Error(
    "Canvas page plugin changed upstream; review scripts/patch-canvas-page-math.mjs before installing",
  )
}

source = source.replace(originalImport, patchedImport).replace(originalRenderer, patchedRenderer)
writeFileSync(canvasPageEntry, source)
console.log("Applied Canvas math renderer patch")
