;(() => {
  const sat = (x) => Math.min(1, Math.max(0, x)),
    cos = (a) => Math.cos((a * Math.PI) / 180)
  function values(t, s) {
    const w = (cos(t) - cos(s.outer)) / (cos(s.inner) - cos(s.outer)),
      c = (cos(t) - cos(s.mid)) / (cos(s.inner) - cos(s.mid))
    const W = sat(s.k * w) ** 2,
      C = sat(c) ** 2
    return {
      raw: sat(w),
      old: sat(w) ** 2,
      wide: W,
      core: C,
      dual: sat(Math.max(s.k * w, c)) ** 2,
      sum: s.k * s.k * sat(w) ** 2 + C,
    }
  }

  function draw(el, changed) {
    const s = el.state,
      dual = el.dataset.kind === "dual"
    if (changed === "inner") {
      s.outer = Math.max(s.outer, s.inner + 2)
      s.mid = Math.max(s.mid, s.inner + 1)
    }
    if (changed === "outer") {
      s.inner = Math.min(s.inner, s.outer - 2)
      s.mid = Math.min(s.mid, s.outer - 1)
    }
    s.mid = Math.max(s.inner + 1, Math.min(s.outer - 1, s.mid))
    el.querySelectorAll("input").forEach((i) => {
      i.value = s[i.dataset.key]
      el.querySelector(`[data-value="${i.dataset.key}"]`).textContent =
        i.dataset.key === "k" ? s.k.toFixed(2) : s[i.dataset.key] + "°"
      i.style.setProperty("--fill", (100 * (+i.value - +i.min)) / (+i.max - +i.min) + "%")
    })
    const series = dual
      ? [
          ["old", "原生宽灯", "#7a7a7a", "8 5"],
          ["wide", "宽分量", "#b0b0b0", "2 5"],
          ["core", "核心分量", "#d4d4d4", "10 4 2 4"],
          ["sum", "两灯相加", "#b9d8ff", "7 3"],
          ["dual", "当前双锥 max", "#60a5fa", ""],
        ]
      : [
          ["raw", "平方前", "#929292", "7 5"],
          ["old", "平方后", "#60a5fa", ""],
        ]
    let legend = el.querySelector(".curve-legend")
    if (!legend) {
      legend = document.createElement("div")
      legend.className = "curve-legend"
      el.querySelector(".curve-scroll").before(legend)
    }
    legend.innerHTML = series
      .map(
        (a) =>
          `<span><svg viewBox="0 0 28 12" aria-hidden="true"><line x1="0" x2="28" y1="6" y2="6" stroke="${a[2]}" stroke-width="2" stroke-dasharray="${a[3]}"/></svg>${a[1]}</span>`,
      )
      .join("")
    const width = Math.max(300, Math.round(el.querySelector(".curve-scroll").clientWidth)),
      mobile = width < 520,
      height = mobile ? 260 : 340,
      left = 46,
      right = 14,
      top = 28,
      bottom = 38,
      maxY = dual ? 2 : 1
    const X = (t) => left + (t / 65) * (width - left - right),
      Y = (v) => height - bottom - (v / maxY) * (height - top - bottom)
    let z = ""
    for (let t = 0; t <= 60; t += mobile ? 20 : 10)
      z += `<line x1="${X(t)}" x2="${X(t)}" y1="${top}" y2="${height - bottom}" stroke="#242424"/><text x="${X(t)}" y="${height - 13}" text-anchor="middle">${t}°</text>`
    for (let v = 0; v <= maxY + 0.001; v += maxY / 4)
      z += `<line x1="${left}" x2="${width - right}" y1="${Y(v)}" y2="${Y(v)}" stroke="#242424"/><text x="${left - 9}" y="${Y(v) + 4}" text-anchor="end">${v.toFixed(2)}</text>`
    for (let n of dual ? ["inner", "mid", "outer"] : ["inner", "outer"])
      z += `<line x1="${X(s[n])}" x2="${X(s[n])}" y1="${top}" y2="${height - bottom}" stroke="#444" stroke-dasharray="3 5"/>`
    series.forEach((a) => {
      let d = ""
      for (let j = 0; j <= 650; j++) {
        let t = j / 10
        d += (j ? "L" : "M") + X(t).toFixed(2) + "," + Y(values(t, s)[a[0]]).toFixed(2)
      }
      z += `<path data-series="${a[0]}" d="${d}" fill="none" stroke="${a[2]}" stroke-width="${a[0] === "dual" || (!dual && a[0] === "old") ? 2.6 : 1.6}" stroke-dasharray="${a[3]}"/>`
    })
    const svg = el.querySelector(".curve-scroll svg")
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
    svg.innerHTML = z
    el.querySelector(".readout").textContent = dual
      ? "两灯相加会抬高重叠区；max 保留较强的一项。"
      : "平方保留 0 和 1，将中间值压低。"
  }
  document.querySelectorAll(".demo").forEach((el) => {
    el.state = { inner: 10, mid: 22, outer: 35, k: 0.55 }
    el.querySelectorAll("input").forEach(
      (i) =>
        (i.oninput = () => {
          el.state[i.dataset.key] = +i.value
          draw(el, i.dataset.key)
        }),
    )
    el.querySelector("button").onclick = () => {
      el.state = { inner: 10, mid: 22, outer: 35, k: 0.55 }
      draw(el)
    }
    draw(el)
    new ResizeObserver(() => draw(el)).observe(el.querySelector(".curve-scroll"))
  })
})()
