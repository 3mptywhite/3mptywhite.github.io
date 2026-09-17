import { cp, mkdir, access } from "node:fs/promises"
import { fileURLToPath } from "node:url"
const source = fileURLToPath(new URL("../portfolio/", import.meta.url))
const target = fileURLToPath(new URL("../public/portfolio/", import.meta.url))
await access(source)
await mkdir(target, { recursive: true })
await cp(source, target, { recursive: true })
console.log("Copied unlisted portfolio to public/portfolio/")
