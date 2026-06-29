import { HtmlEscapeTool } from "components/tools"
import { createPageMetadata } from "components/seo"

export const metadata = createPageMetadata({
  title: "HTMLエスケープ",
  description: "HTML特殊文字をエスケープ・アンエスケープ。",
  path: "/html-escape/",
})

export default HtmlEscapeTool
