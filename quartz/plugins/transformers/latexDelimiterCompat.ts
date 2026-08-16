import { QuartzTransformerPlugin } from "../types"

type TransformState = {
  inlineCodeTicks: number
  inDollarDisplay: boolean
  inLatexDisplay: boolean
}

function isEscaped(source: string, index: number): boolean {
  let slashCount = 0
  for (let cursor = index - 1; cursor >= 0 && source[cursor] === "\\"; cursor--) {
    slashCount++
  }
  return slashCount % 2 === 1
}

function countRun(source: string, index: number, character: string): number {
  let length = 0
  while (source[index + length] === character) {
    length++
  }
  return length
}

function findUnescaped(source: string, sequence: string, start: number, end = source.length): number {
  let cursor = source.indexOf(sequence, start)
  while (cursor !== -1 && cursor < end) {
    if (!isEscaped(source, cursor)) {
      return cursor
    }
    cursor = source.indexOf(sequence, cursor + sequence.length)
  }
  return -1
}

function transformLine(
  line: string,
  source: string,
  lineOffset: number,
  state: TransformState,
): string {
  let output = ""

  for (let index = 0; index < line.length; ) {
    if (state.inLatexDisplay) {
      const close = findUnescaped(line, "\\]", index)
      if (close === -1) {
        output += line.slice(index)
        break
      }

      output += line.slice(index, close) + "$$"
      state.inLatexDisplay = false
      index = close + 2
      continue
    }

    if (state.inlineCodeTicks > 0) {
      if (line[index] === "`") {
        const run = countRun(line, index, "`")
        output += line.slice(index, index + run)
        index += run
        if (run === state.inlineCodeTicks) {
          state.inlineCodeTicks = 0
        }
      } else {
        output += line[index]
        index++
      }
      continue
    }

    if (state.inDollarDisplay) {
      if (line.startsWith("$$", index) && !isEscaped(line, index)) {
        output += "$$"
        state.inDollarDisplay = false
        index += 2
      } else {
        output += line[index]
        index++
      }
      continue
    }

    if (line[index] === "`") {
      const run = countRun(line, index, "`")
      output += line.slice(index, index + run)
      state.inlineCodeTicks = run
      index += run
      continue
    }

    if (line[index] === "$" && !isEscaped(line, index)) {
      const run = countRun(line, index, "$")
      if (run >= 2) {
        output += line.slice(index, index + run)
        state.inDollarDisplay = true
        index += run
        continue
      }

      const close = findUnescaped(line, "$", index + 1)
      if (close !== -1) {
        output += line.slice(index, close + 1)
        index = close + 1
        continue
      }
    }

    if (line.startsWith("\\(", index) && !isEscaped(line, index)) {
      const close = findUnescaped(line, "\\)", index + 2)
      if (close !== -1) {
        output += "$" + line.slice(index + 2, close) + "$"
        index = close + 2
        continue
      }
    }

    if (line.startsWith("\\[", index) && !isEscaped(line, index)) {
      const absoluteStart = lineOffset + index + 2
      if (findUnescaped(source, "\\]", absoluteStart) !== -1) {
        output += "$$"
        state.inLatexDisplay = true
        index += 2
        continue
      }
    }

    output += line[index]
    index++
  }

  return output
}

export function normalizeLatexDelimiters(source: string): string {
  const parts = source.split(/(\r?\n)/)
  const state: TransformState = {
    inlineCodeTicks: 0,
    inDollarDisplay: false,
    inLatexDisplay: false,
  }

  let output = ""
  let offset = 0
  let lineNumber = 0
  let inFrontmatter = false
  let fenceCharacter = ""
  let fenceLength = 0

  for (const part of parts) {
    if (/^\r?\n$/.test(part)) {
      output += part
      offset += part.length
      continue
    }

    const line = part
    const frontmatterFence = /^\uFEFF?---\s*$/.test(line)
    if (lineNumber === 0 && frontmatterFence) {
      inFrontmatter = true
      output += line
      offset += line.length
      lineNumber++
      continue
    }

    if (inFrontmatter) {
      output += line
      if (/^(---|\.\.\.)\s*$/.test(line)) {
        inFrontmatter = false
      }
      offset += line.length
      lineNumber++
      continue
    }

    if (!state.inLatexDisplay) {
      const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/)
      if (fenceCharacter) {
        output += line
        const closePattern = new RegExp(`^ {0,3}${fenceCharacter}{${fenceLength},}\\s*$`)
        if (closePattern.test(line)) {
          fenceCharacter = ""
          fenceLength = 0
        }
        offset += line.length
        lineNumber++
        continue
      }

      if (fenceMatch) {
        fenceCharacter = fenceMatch[1][0]
        fenceLength = fenceMatch[1].length
        output += line
        offset += line.length
        lineNumber++
        continue
      }

      if (/^( {4}|\t)/.test(line)) {
        output += line
        offset += line.length
        lineNumber++
        continue
      }
    }

    output += transformLine(line, source, offset, state)
    offset += line.length
    lineNumber++
  }

  return output
}

export const LatexDelimiterCompat: QuartzTransformerPlugin = () => ({
  name: "LatexDelimiterCompat",
  textTransform: (_ctx, source) => normalizeLatexDelimiters(source),
})
