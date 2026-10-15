import { DataConverterTool } from "components/data-converter"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "データ形式変換（JSON・YAML・XML・CSV）",
  description:
    "JSON、YAML、XML、CSV、TSVをオンラインで相互変換。XMLの属性やCSVの見出し行にも対応し、APIレスポンスや設定ファイル、表データを別の形式へ書き換えられる。",
  path: "/data-converter/",
})

const Page = () => (
  <ToolArticle href="/data-converter/">
    <DataConverterTool />
  </ToolArticle>
)

export default Page
