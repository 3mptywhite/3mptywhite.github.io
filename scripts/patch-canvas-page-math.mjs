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
const originalEdgePath = `  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const midX = from.x + dx / 2;
  const midY = from.y + dy / 2;
  const pathD = \`M \${from.x} \${from.y} Q \${midX} \${from.y}, \${midX} \${midY} T \${to.x} \${to.y}\`;`
const patchedEdgePath = `  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  const controlDistance = Math.min(360, Math.max(72, distance * 0.5));
  const getControlPoint = (point, side) => {
    switch (side) {
      case "top":
        return { x: point.x, y: point.y - controlDistance };
      case "bottom":
        return { x: point.x, y: point.y + controlDistance };
      case "left":
        return { x: point.x - controlDistance, y: point.y };
      case "right":
        return { x: point.x + controlDistance, y: point.y };
      default:
        return point;
    }
  };
  const fromControl = getControlPoint(from, edge.fromSide);
  const toControl = getControlPoint(to, edge.toSide);
  const midX = from.x + dx / 2;
  const midY = from.y + dy / 2;
  const pathD = \`M \${from.x} \${from.y} C \${fromControl.x} \${fromControl.y}, \${toControl.x} \${toControl.y}, \${to.x} \${to.y}\`;`
const originalWheelHandler = `let n=e=>{let s=e.target instanceof HTMLElement?e.target.closest(".canvas-node-content"):null;if(s&&s.scrollHeight>s.clientHeight){let b=s.scrollTop<=0,A=s.scrollTop+s.clientHeight>=s.scrollHeight-1,x=e.deltaY>0,J=e.deltaY<0;if(!(b&&J)&&!(A&&x))return}e.preventDefault();let i=t.getBoundingClientRect(),T=e.clientX-i.left,p=e.clientY-i.top,g=o,X=e.deltaY>0?.9:1.1;o=Math.max(w,Math.min(H,o*X)),c=T-(T-c)*(o/g),a=p-(p-a)*(o/g),v(),m()},`
const obsidianWheelHandler = `let spaceHeld=!1,isEditable=e=>{let s=e.target;return s instanceof HTMLElement&&(s.isContentEditable||s.closest("input,textarea,select"))},n=e=>{let s=e.target instanceof HTMLElement?e.target.closest(".canvas-node-content"):null,i=e.ctrlKey||e.metaKey||spaceHeld;if(s&&!i&&!e.shiftKey&&Math.abs(e.deltaY)>=Math.abs(e.deltaX)&&s.scrollHeight>s.clientHeight){let T=s.scrollTop<=0,p=s.scrollTop+s.clientHeight>=s.scrollHeight-1,g=e.deltaY>0,X=e.deltaY<0;if(!(T&&X)&&!(p&&g))return}e.preventDefault();if(i){let T=t.getBoundingClientRect(),p=e.clientX-T.left,g=e.clientY-T.top,X=o,P=Math.max(.8,Math.min(1.25,Math.exp(-e.deltaY*.0015)));o=Math.max(w,Math.min(H,o*P)),c=p-(p-c)*(o/X),a=g-(g-a)*(o/X)}else{let T=e.deltaMode===1?16:e.deltaMode===2?t.clientHeight:1;e.shiftKey?c-=(Math.abs(e.deltaX)>0?e.deltaX:e.deltaY)*T:(c-=e.deltaX*T,a-=e.deltaY*T)}v(),m()},`
const originalPanStart = `l=e=>{if(e.button===0&&!(e.target instanceof HTMLElement&&(e.target.closest("a")||e.target.closest("button")))){if(e.target instanceof HTMLElement){let s=e.target.closest(".canvas-node-content");if(s&&s.scrollHeight>s.clientHeight){let i=s.getBoundingClientRect();if(e.clientX>=i.right-16)return}}Y=!0,D=e.clientX-c,O=e.clientY-a,t.setPointerCapture(e.pointerId)}}`
const legacyPatchedPanStart = `l=e=>{if(e.button===1&&!(e.target instanceof HTMLElement&&e.target.closest("button"))){e.preventDefault(),Y=!0,D=e.clientX-c,O=e.clientY-a,t.classList.add("is-middle-panning"),t.setPointerCapture(e.pointerId)}}`
const currentPatchedPanStart = `l=e=>{if(e.button===1&&!(e.target instanceof Element&&e.target.closest("button"))){e.preventDefault(),Y=!0,D=e.clientX-c,O=e.clientY-a,t.classList.add("is-middle-panning"),t.setPointerCapture(e.pointerId)}}`
const patchedPanStart = `l=e=>{let s=e.button===1||e.button===0&&spaceHeld;s&&!(e.target instanceof Element&&e.target.closest("button"))&&(e.preventDefault(),Y=!0,D=e.clientX-c,O=e.clientY-a,t.classList.add("is-canvas-panning"),t.setPointerCapture(e.pointerId))}`
const originalPanListeners = `u=e=>{Y&&(c=e.clientX-D,a=e.clientY-O,v(),m())},r=()=>{Y=!1};t.addEventListener("wheel",n,{passive:!1}),t.addEventListener("pointerdown",l),t.addEventListener("pointermove",u),t.addEventListener("pointerup",r);`
const legacyPatchedPanListeners = `u=e=>{Y&&(e.preventDefault(),c=e.clientX-D,a=e.clientY-O,v(),m())},r=e=>{Y&&(e.preventDefault(),Y=!1,t.classList.remove("is-middle-panning"))},Q=e=>{e.button===1&&e.preventDefault()};t.addEventListener("wheel",n,{passive:!1}),t.addEventListener("pointerdown",l),t.addEventListener("pointermove",u),t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r),t.addEventListener("auxclick",Q);`
const patchedPanListeners = `u=e=>{Y&&(e.preventDefault(),c=e.clientX-D,a=e.clientY-O,v(),m())},r=e=>{Y&&(e.preventDefault(),Y=!1,t.classList.remove("is-canvas-panning"))},Q=e=>{e.button===1&&e.preventDefault()},A=e=>{if(!isEditable(e)){if(e.code==="Space"&&(spaceHeld=!0,t.classList.add("is-space-panning"),e.preventDefault()),e.shiftKey&&e.code==="Digit1"){e.preventDefault(),q(),m()}}},X=e=>{e.code==="Space"&&(spaceHeld=!1,t.classList.remove("is-space-panning"))},P=()=>{spaceHeld=!1,t.classList.remove("is-space-panning"),t.classList.remove("is-canvas-panning")};document.addEventListener("keydown",A),document.addEventListener("keyup",X),window.addEventListener("blur",P),t.addEventListener("wheel",n,{passive:!1}),t.addEventListener("pointerdown",l),t.addEventListener("pointermove",u),t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r),t.addEventListener("auxclick",Q);`
const originalPanCleanup = `t.removeEventListener("pointerup",r),t.removeEventListener("touchstart",U)`
const legacyPatchedPanCleanup = `t.removeEventListener("pointerup",r),t.removeEventListener("pointercancel",r),t.removeEventListener("auxclick",Q),t.removeEventListener("touchstart",U)`
const patchedPanCleanup = `t.removeEventListener("pointerup",r),t.removeEventListener("pointercancel",r),t.removeEventListener("auxclick",Q),document.removeEventListener("keydown",A),document.removeEventListener("keyup",X),window.removeEventListener("blur",P),t.removeEventListener("touchstart",U)`
const originalInspectorHook = `let C=t.closest(\\'.page[data-frame="canvas"]\\'),R=C?.querySelector(".canvas-sidebar-toggle");`
const legacyAutoInspectorHook = `let C=t.closest(".page[data-frame=canvas]"),R=C?.querySelector(".canvas-sidebar-toggle"),ee=null;if(C){let e=document.createElement("aside"),s=document.createElement("button");e.className="canvas-node-inspector",e.setAttribute("aria-hidden","true"),e.innerHTML="<div class=canvas-node-inspector-header><span>节点详情</span><button class=canvas-node-inspector-close type=button aria-label=折叠节点详情>×</button></div><div class=canvas-node-inspector-content></div>",s.className="canvas-node-inspector-toggle",s.type="button",s.hidden=!0,s.setAttribute("aria-expanded","false"),s.setAttribute("aria-label","展开节点详情"),s.textContent="‹",t.append(e,s);let i=e.querySelector(".canvas-node-inspector-content"),T=e.querySelector(".canvas-node-inspector-close"),p=()=>{t.classList.remove("is-node-inspector-open"),e.setAttribute("aria-hidden","true"),s.setAttribute("aria-expanded","false"),s.setAttribute("aria-label","展开节点详情"),s.textContent="‹"},g=n=>{ee&&ee.classList.remove("is-selected"),ee=n,ee.classList.add("is-selected"),i.replaceChildren();let l=n.querySelector(".canvas-node-content"),u=n.querySelector(":scope > img");if(l){let r=l.cloneNode(!0);r.classList.add("canvas-node-inspector-document"),i.append(r)}else if(u)i.append(u.cloneNode(!0));else{let r=n.querySelector(".canvas-group-label")?.textContent?.trim();r&&(i.textContent=r)}s.hidden=!1,t.classList.add("is-node-inspector-open"),e.setAttribute("aria-hidden","false"),s.setAttribute("aria-expanded","true"),s.setAttribute("aria-label","折叠节点详情"),s.textContent="›"},X=n=>{let l=n.currentTarget;n.target instanceof Element&&n.target.closest("a,button")||g(l)},P=n=>{n.target instanceof Element&&!n.target.closest(".canvas-node,.canvas-node-inspector,.canvas-node-inspector-toggle,.canvas-controls")&&(ee?.classList.remove("is-selected"),ee=null,s.hidden=!0,i.replaceChildren(),p())},be=n=>{n.key==="Escape"&&t.classList.contains("is-node-inspector-open")&&p()},xe=Array.from(t.querySelectorAll(".canvas-node:not(.canvas-node-group)"));for(let n of xe)n.addEventListener("click",X);T?.addEventListener("click",p),s.addEventListener("click",()=>{ee&&(t.classList.contains("is-node-inspector-open")?p():g(ee))}),t.addEventListener("click",P),document.addEventListener("keydown",be),f.push(()=>{for(let n of xe)n.removeEventListener("click",X);t.removeEventListener("click",P),document.removeEventListener("keydown",be),e.remove(),s.remove()})}`
const patchedInspectorHook = `let C=t.closest(".page[data-frame=canvas]"),R=C?.querySelector(".canvas-sidebar-toggle"),ee=null;if(C){let e=document.createElement("aside"),s=document.createElement("button");e.className="canvas-node-inspector",e.setAttribute("aria-hidden","true"),e.innerHTML="<div class=canvas-node-inspector-header><span>节点详情</span><button class=canvas-node-inspector-close type=button aria-label=折叠节点详情>×</button></div><div class=canvas-node-inspector-content></div>",s.className="canvas-node-inspector-toggle",s.type="button",s.setAttribute("aria-expanded","false"),s.setAttribute("aria-label","展开节点详情"),s.textContent="‹",t.append(e,s);let i=e.querySelector(".canvas-node-inspector-content"),T=e.querySelector(".canvas-node-inspector-close"),p=()=>{t.classList.remove("is-node-inspector-open"),e.setAttribute("aria-hidden","true"),s.setAttribute("aria-expanded","false"),s.setAttribute("aria-label","展开节点详情"),s.textContent="‹"},h=()=>{t.classList.add("is-node-inspector-open"),e.setAttribute("aria-hidden","false"),s.setAttribute("aria-expanded","true"),s.setAttribute("aria-label","折叠节点详情"),s.textContent="›"},g=n=>{ee&&ee.classList.remove("is-selected"),ee=n,ee.classList.add("is-selected"),i.replaceChildren();let l=n.querySelector(".canvas-node-content"),u=n.querySelector(":scope > img");if(l){let r=l.cloneNode(!0);r.classList.add("canvas-node-inspector-document"),i.append(r)}else if(u)i.append(u.cloneNode(!0));else{let r=n.querySelector(".canvas-group-label")?.textContent?.trim();r&&(i.textContent=r)}},X=n=>{let l=n.currentTarget;n.target instanceof Element&&n.target.closest("a,button")||g(l)},P=n=>{n.target instanceof Element&&!n.target.closest(".canvas-node,.canvas-node-inspector,.canvas-node-inspector-toggle,.canvas-controls")&&(ee?.classList.remove("is-selected"),ee=null,i.replaceChildren())},be=n=>{n.key==="Escape"&&t.classList.contains("is-node-inspector-open")&&p()},xe=Array.from(t.querySelectorAll(".canvas-node:not(.canvas-node-group)"));for(let n of xe)n.addEventListener("click",X);T?.addEventListener("click",p),s.addEventListener("click",()=>{t.classList.contains("is-node-inspector-open")?p():h()}),t.addEventListener("click",P),document.addEventListener("keydown",be),f.push(()=>{for(let n of xe)n.removeEventListener("click",X);t.removeEventListener("click",P),document.removeEventListener("keydown",be),e.remove(),s.remove()})}`

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

const hasPatchedEdgePath = source.includes(patchedEdgePath)
if (!hasPatchedEdgePath && source.includes(originalEdgePath)) {
  source = source.replace(originalEdgePath, patchedEdgePath)
  changed = true
} else if (!hasPatchedEdgePath) {
  throw new Error(
    "Canvas edge renderer patch is missing or partially applied; review scripts/patch-canvas-page-math.mjs",
  )
}

const hasOriginalPanPatch =
  source.includes(originalWheelHandler) &&
  source.includes(originalPanStart) &&
  source.includes(originalPanListeners) &&
  source.includes(originalPanCleanup)
const hasLegacyPanPatch =
  source.includes(originalWheelHandler) &&
  (source.includes(legacyPatchedPanStart) || source.includes(currentPatchedPanStart)) &&
  source.includes(legacyPatchedPanListeners) &&
  source.includes(legacyPatchedPanCleanup)
const hasPatchedPanPatch =
  source.includes(obsidianWheelHandler) &&
  source.includes(patchedPanStart) &&
  source.includes(patchedPanListeners) &&
  source.includes(patchedPanCleanup)

if (hasOriginalPanPatch && !hasPatchedPanPatch) {
  source = source
    .replace(originalWheelHandler, obsidianWheelHandler)
    .replace(originalPanStart, patchedPanStart)
    .replace(originalPanListeners, patchedPanListeners)
    .replace(originalPanCleanup, patchedPanCleanup)
  changed = true
} else if (hasLegacyPanPatch && !hasPatchedPanPatch) {
  source = source
    .replace(originalWheelHandler, obsidianWheelHandler)
    .replace(legacyPatchedPanStart, patchedPanStart)
    .replace(currentPatchedPanStart, patchedPanStart)
    .replace(legacyPatchedPanListeners, patchedPanListeners)
    .replace(legacyPatchedPanCleanup, patchedPanCleanup)
  changed = true
} else if (!hasPatchedPanPatch) {
  throw new Error(
    "Canvas pan interaction patch is missing or partially applied; review scripts/patch-canvas-page-math.mjs",
  )
}

const hasPatchedInspector = source.includes(patchedInspectorHook)
if (!hasPatchedInspector && source.includes(originalInspectorHook)) {
  source = source.replace(originalInspectorHook, patchedInspectorHook)
  changed = true
} else if (!hasPatchedInspector && source.includes(legacyAutoInspectorHook)) {
  source = source.replace(legacyAutoInspectorHook, patchedInspectorHook)
  changed = true
} else if (!hasPatchedInspector) {
  throw new Error(
    "Canvas node inspector patch is missing or partially applied; review scripts/patch-canvas-page-math.mjs",
  )
}

if (changed) {
  writeFileSync(canvasPageEntry, source)
  console.log("Applied Canvas renderer patches")
} else {
  console.log("Canvas renderer patches already applied")
}
