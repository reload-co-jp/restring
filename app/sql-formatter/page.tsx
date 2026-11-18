import { SqlFormatterTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "SQL整形 - クエリを読みやすくフォーマット",
  description:
    "SQL文をオンラインで整形。SELECT・FROM・WHEREなどの句ごとに改行し、キーワードを大文字に統一。1行に詰まったクエリを読みやすくできる。",
  path: "/sql-formatter/",
})

const Page = () => (
  <ToolArticle href="/sql-formatter/">
    <SqlFormatterTool />
  </ToolArticle>
)

export default Page
