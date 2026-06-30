import { LineEndingConverterTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "改行コード変換",
  description: "LF、CRLF、CRへ改行コードを変換。",
  path: "/line-ending-converter/",
})

const Page = () => (
  <ToolArticle href="/line-ending-converter/">
    <LineEndingConverterTool />
  </ToolArticle>
)

export default Page
