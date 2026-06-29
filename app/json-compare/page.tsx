import { JsonCompareTool } from "components/tools"
import { createPageMetadata } from "components/seo"

export const metadata = createPageMetadata({
  title: "JSON比較",
  description: "JSONを検証し、整形表示と構造比較。",
  path: "/json-compare/",
})

export default JsonCompareTool
