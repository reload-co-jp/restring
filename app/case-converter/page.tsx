import { CaseConverterTool } from "components/tools"
import { createPageMetadata } from "components/seo"

export const metadata = createPageMetadata({
  title: "ケース変換",
  description: "文字列を大文字、小文字、camelCase、snake_caseなどへ変換。",
  path: "/case-converter/",
})

export default CaseConverterTool
