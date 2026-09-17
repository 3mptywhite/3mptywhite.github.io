let logoClicks = 0

// Reset between page visits, including navigation through Quartz's SPA router.
document.addEventListener("nav", () => {
  logoClicks = 0
})

document.addEventListener(
  "click",
  (event: MouseEvent) => {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      !["/", "/index", "/index.html"].includes(window.location.pathname) ||
      !(event.target instanceof Element) ||
      !event.target.closest(".page-title a")
    ) {
      return
    }

    // Keep home-logo clicks from reloading or triggering the SPA router.
    event.preventDefault()
    event.stopImmediatePropagation()
    logoClicks += 1

    if (logoClicks === 15) {
      logoClicks = 0
      // The portfolio is a standalone page, so leave the Quartz SPA entirely.
      window.location.assign("/portfolio/")
    }
  },
  true,
)
