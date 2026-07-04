import { LineEndingConverterTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "改行コード変換 - LF・CRLF・CR相互変換",
  description:
    "テキストの改行コード（LF・CRLF・CR）をオンラインで相互変換。WindowsとmacOS・Linux間のファイル受け渡しやGitでの改行トラブル解消に。",
  path: "/line-ending-converter/",
})

const Page = () => (
  <ToolArticle href="/line-ending-converter/">
    <LineEndingConverterTool />
  </ToolArticle>
)

export default Page
