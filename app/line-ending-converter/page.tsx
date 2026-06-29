import { LineEndingConverterTool } from "components/tools"
import { createPageMetadata } from "components/seo"

export const metadata = createPageMetadata({
  title: "改行コード変換",
  description: "LF、CRLF、CRへ改行コードを変換。",
  path: "/line-ending-converter/",
})

export default LineEndingConverterTool
