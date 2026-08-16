import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { LatexDelimiterCompat } from "./quartz/plugins/transformers/latexDelimiterCompat"

const config = await loadQuartzConfig()
config.plugins.transformers.unshift(LatexDelimiterCompat())
export default config
export const layout = await loadQuartzLayout()
