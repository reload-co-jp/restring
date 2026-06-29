import { TextNormalizeTool } from "components/tools"
import { createPageMetadata } from "components/seo"

export const metadata = createPageMetadata({
  title: "テキスト正規化",
  description: "空白削除、スペース圧縮、Unicode正規化、改行統一。",
  path: "/text-normalize/",
})

export default TextNormalizeTool
