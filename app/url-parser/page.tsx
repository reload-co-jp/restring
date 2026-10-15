import { UrlParserTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "URL解析・クエリパラメータ分解",
  description:
    "URLをプロトコル、ホスト、ポート、パス、クエリ、フラグメントに分解。クエリパラメータをデコードして一覧表示。APIのリクエストURLやトラッキングURLの確認に。",
  path: "/url-parser/",
})

const Page = () => (
  <ToolArticle href="/url-parser/">
    <UrlParserTool />
  </ToolArticle>
)

export default Page
