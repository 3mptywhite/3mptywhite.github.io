import { componentRegistry } from "./quartz/components/registry"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"
import { QuartzPluginData } from "./quartz/plugins/vfile"
import { LatexDelimiterCompat } from "./quartz/plugins/transformers/latexDelimiterCompat"

registerCondition("index-only", (props) => props.fileData.slug === "index")
componentRegistry.setOptionOverrides("@quartz-community/recent-notes", {
  filter: (page: QuartzPluginData) => page.slug !== "about",
})

const config = await loadQuartzConfig()
config.plugins.transformers.unshift(LatexDelimiterCompat())
export default config
export const layout = await loadQuartzLayout()
