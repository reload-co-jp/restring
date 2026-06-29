import { TextDiffTool } from "components/tools"
import { createPageMetadata } from "components/seo"

export const metadata = createPageMetadata({
  title: "テキスト差分",
  description: "追加・削除されたテキスト差分を抽出。",
  path: "/text-diff/",
})

export default TextDiffTool
