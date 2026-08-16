import assert from "node:assert/strict"
import test from "node:test"
import { normalizeLatexDelimiters } from "./latexDelimiterCompat"

test("converts inline and display LaTeX delimiters", () => {
  const markdown = "沿 \\(\\theta\\) 方向。\n\n\\[\nd\\omega=\\sin\\theta\\,d\\theta\\,d\\phi\n\\]"
  const expected = "沿 $\\theta$ 方向。\n\n$$\nd\\omega=\\sin\\theta\\,d\\theta\\,d\\phi\n$$"

  assert.equal(normalizeLatexDelimiters(markdown), expected)
})

test("preserves existing dollar-delimited math", () => {
  const markdown = "行内 $\\theta$。\n\n$$\nd\\omega=\\sin\\theta\n$$"
  assert.equal(normalizeLatexDelimiters(markdown), markdown)
})

test("does not transform fenced, indented, or inline code", () => {
  const markdown = [
    "`\\(inline\\)`",
    "",
    "    \\(indented\\)",
    "",
    "```text",
    "\\(fenced\\)",
    "```",
  ].join("\n")

  assert.equal(normalizeLatexDelimiters(markdown), markdown)
})

test("does not transform frontmatter, escaped delimiters, or unmatched delimiters", () => {
  const markdown = [
    "---",
    "example: '\\(frontmatter\\)'",
    "---",
    "\\\\(literal\\\\)",
    "\\(unmatched",
    "\\[unmatched",
  ].join("\n")

  assert.equal(normalizeLatexDelimiters(markdown), markdown)
})
