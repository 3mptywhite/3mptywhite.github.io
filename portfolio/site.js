document.querySelectorAll(".compare input").forEach((input) =>
  input.addEventListener("input", () => {
    input.closest(".compare").style.setProperty("--split", `${input.value}%`)
    input.setAttribute(
      "aria-valuetext",
      `左侧调整前 ${input.value}%，右侧调整后 ${100 - input.value}%`,
    )
  }),
)
document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("play", () =>
    document.querySelectorAll("video").forEach((other) => {
      if (other !== video) other.pause()
    }),
  )
  video.addEventListener("error", () => {
    if (video.parentElement.querySelector(".video-error")) return
    const p = document.createElement("p")
    p.className = "video-error"
    p.append("视频暂时无法播放，可 ")
    const a = document.createElement("a")
    a.href = video.currentSrc || video.querySelector("source")?.src
    a.textContent = "打开原视频"
    p.append(a, "，或刷新后重试。")
    video.insertAdjacentElement("afterend", p)
  })
})
const dialog = document.querySelector("#image-viewer")
document.querySelectorAll(".zoom").forEach((button) =>
  button.addEventListener("click", () => {
    const source = button.querySelector("img")
    const target = dialog.querySelector("img")
    target.src = source.src
    target.alt = source.alt
    dialog.showModal()
  }),
)
dialog?.querySelector(".close").addEventListener("click", () => dialog.close())
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close()
})
