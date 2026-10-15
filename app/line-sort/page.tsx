import { LineSortTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "行の並べ替え・重複削除",
  description:
    "テキストを行単位で昇順・降順・逆順に並べ替え、重複行や空行をオンラインで削除。数値順（自然順）ソートや大文字小文字の無視に対応。リストやログの整理に。",
  path: "/line-sort/",
})

const Page = () => (
  <ToolArticle href="/line-sort/">
    <LineSortTool />
  </ToolArticle>
)

export default Page
