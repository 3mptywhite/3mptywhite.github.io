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
    let s = el.state
    const dual = el.dataset.kind === "dual"
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
    })
    const series = dual
      ? [
          ["old", "原生宽灯", "#8eabc7", "7 6"],
          ["wide", "宽分量", "#64b5ff", "3 5"],
          ["core", "核心分量", "#d2a2ff", "10 5"],
          ["sum", "两灯相加", "#ffb85b", ""],
          ["dual", "当前双锥 max", "#66e0bd", ""],
        ]
      : [
          ["raw", "截断后、平方前", "#8eabc7", "7 5"],
          ["old", "最终衰减（平方后）", "#66e0bd", ""],
        ]
    const maxY = dual ? 2 : 1,
      X = (t) => 78 + (t / 65) * 974,
      Y = (v) => 418 - (v / maxY) * 296
    let z =
      '<rect width="1100" height="530" fill="#11151b"/><text x="32" y="34" fill="#f2f7fb" font-size="22">' +
      (dual ? "组合规则对比：相加抬高峰值，max 取较大者" : "原生曲线：余弦空间插值，再平方") +
      "</text>"
    series.forEach((a, i) => {
      let x = 35 + (dual ? 210 : 370) * i
      z += `<line x1="${x}" y1="72" x2="${x + 30}" y2="72" stroke="${a[2]}" stroke-width="3" stroke-dasharray="${a[3]}"/><text x="${x + 38}" y="78" fill="${a[2]}" font-size="16">${a[1]}</text>`
    })
    for (let t = 0; t <= 60; t += 10)
      z += `<line x1="${X(t)}" y1="122" x2="${X(t)}" y2="418" stroke="#262d36"/><text x="${X(t)}" y="449" text-anchor="middle" fill="#bccbd8" font-size="17">${t}°</text>`
    for (let v = 0; v <= maxY + 0.001; v += maxY / 4)
      z += `<line x1="78" y1="${Y(v)}" x2="1052" y2="${Y(v)}" stroke="#262d36"/><text x="64" y="${Y(v) + 6}" text-anchor="end" fill="#bccbd8" font-size="16">${v.toFixed(2)}</text>`
    for (let n of dual ? ["inner", "mid", "outer"] : ["inner", "outer"])
      z += `<line x1="${X(s[n])}" y1="109" x2="${X(s[n])}" y2="418" stroke="#6a7986" stroke-dasharray="3 6"/><text x="${X(s[n])}" y="107" fill="#e0e8ee" font-size="14" text-anchor="middle">${n} ${s[n]}°</text>`
    series.forEach((a) => {
      let d = ""
      for (let j = 0; j <= 650; j++) {
        let t = j / 10
        d += (j ? "L" : "M") + X(t).toFixed(2) + "," + Y(values(t, s)[a[0]]).toFixed(2)
      }
      z += `<path data-series="${a[0]}" d="${d}" fill="none" stroke="${a[2]}" stroke-width="${a[0] === "dual" ? 4 : 2.6}" stroke-dasharray="${a[3]}"/>`
    })
    z +=
      '<text x="540" y="489" text-anchor="middle" fill="#bccbd8" font-size="18">偏离灯轴的半角 θ · 度</text><text x="32" y="516" fill="#9bafc0" font-size="15">线性角度倍率；不含距离、阴影与曝光。示例曲线，不是实测亮度。</text>'
    el.querySelector("svg").innerHTML = z
    el.querySelector(".readout").textContent = dual
      ? "当前宽分量 = saturate(Kw)²；核心 = saturate(c)²；两灯相加 = K²·saturate(w)² + 核心；双锥 = max(当前宽分量, 核心)。注意内锥内乘 K 与截断的顺序差异。"
      : "拖动锥角观察过渡范围。平方使 0.5 变为 0.25，但 0 和 1 不变。"
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
  })
})()
