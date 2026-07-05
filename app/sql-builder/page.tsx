import { SqlBuilderTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "SQL文簡易作成 - SELECT・INSERT・UPDATE・CREATE TABLE生成",
  description:
    "SELECT・INSERT・UPDATE・CREATE TABLE文をオンラインで組み立て。テーブル名、カラム、WHERE条件を入力するだけでSQLクエリを自動生成。",
  path: "/sql-builder/",
})

const Page = () => (
  <ToolArticle href="/sql-builder/">
    <SqlBuilderTool />
  </ToolArticle>
)

export default Page
