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
const originalPanStart = `l=e=>{if(e.button===0&&!(e.target instanceof HTMLElement&&(e.target.closest("a")||e.target.closest("button")))){if(e.target instanceof HTMLElement){let s=e.target.closest(".canvas-node-content");if(s&&s.scrollHeight>s.clientHeight){let i=s.getBoundingClientRect();if(e.clientX>=i.right-16)return}}Y=!0,D=e.clientX-c,O=e.clientY-a,t.setPointerCapture(e.pointerId)}}`
const legacyPatchedPanStart = `l=e=>{if(e.button===1&&!(e.target instanceof HTMLElement&&e.target.closest("button"))){e.preventDefault(),Y=!0,D=e.clientX-c,O=e.clientY-a,t.classList.add("is-middle-panning"),t.setPointerCapture(e.pointerId)}}`
const patchedPanStart = `l=e=>{if(e.button===1&&!(e.target instanceof Element&&e.target.closest("button"))){e.preventDefault(),Y=!0,D=e.clientX-c,O=e.clientY-a,t.classList.add("is-middle-panning"),t.setPointerCapture(e.pointerId)}}`
const originalPanListeners = `u=e=>{Y&&(c=e.clientX-D,a=e.clientY-O,v(),m())},r=()=>{Y=!1};t.addEventListener("wheel",n,{passive:!1}),t.addEventListener("pointerdown",l),t.addEventListener("pointermove",u),t.addEventListener("pointerup",r);`
const patchedPanListeners = `u=e=>{Y&&(e.preventDefault(),c=e.clientX-D,a=e.clientY-O,v(),m())},r=e=>{Y&&(e.preventDefault(),Y=!1,t.classList.remove("is-middle-panning"))},Q=e=>{e.button===1&&e.preventDefault()};t.addEventListener("wheel",n,{passive:!1}),t.addEventListener("pointerdown",l),t.addEventListener("pointermove",u),t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r),t.addEventListener("auxclick",Q);`
const originalPanCleanup = `t.removeEventListener("pointerup",r),t.removeEventListener("touchstart",U)`
const patchedPanCleanup = `t.removeEventListener("pointerup",r),t.removeEventListener("pointercancel",r),t.removeEventListener("auxclick",Q),t.removeEventListener("touchstart",U)`

let source = readFileSync(canvasPageEntry, "utf8")
const hasPatchedImport = source.includes(patchedImport)
const hasPatchedRenderer = source.includes(patchedRenderer)
let changed = false

if (hasPatchedImport || hasPatchedRenderer) {
  if (!(hasPatchedImport && hasPatchedRenderer)) {
    throw new Error("Canvas math renderer patch is only partially applied")
  }
} else {
  if (!source.includes(originalImport) || !source.includes(originalRenderer)) {
    throw new Error(
      "Canvas page plugin changed upstream; review scripts/patch-canvas-page-math.mjs before installing",
    )
  }

  source = source.replace(originalImport, patchedImport).replace(originalRenderer, patchedRenderer)
  changed = true
}

const hasOriginalPanPatch =
  source.includes(originalPanStart) &&
  source.includes(originalPanListeners) &&
  source.includes(originalPanCleanup)
const hasPatchedPanPatch =
  source.includes(patchedPanStart) &&
  source.includes(patchedPanListeners) &&
  source.includes(patchedPanCleanup)

if (hasOriginalPanPatch && !hasPatchedPanPatch) {
  source = source
    .replace(originalPanStart, patchedPanStart)
    .replace(originalPanListeners, patchedPanListeners)
    .replace(originalPanCleanup, patchedPanCleanup)
  changed = true
} else if (
  source.includes(legacyPatchedPanStart) &&
  source.includes(patchedPanListeners) &&
  source.includes(patchedPanCleanup)
) {
  source = source.replace(legacyPatchedPanStart, patchedPanStart)
  changed = true
} else if (!hasPatchedPanPatch) {
  throw new Error(
    "Canvas pan interaction patch is missing or partially applied; review scripts/patch-canvas-page-math.mjs",
  )
}

if (changed) {
  writeFileSync(canvasPageEntry, source)
  console.log("Applied Canvas renderer patches")
} else {
  console.log("Canvas renderer patches already applied")
}
