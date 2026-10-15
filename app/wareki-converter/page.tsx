import { WarekiConverterTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "和暦・西暦変換（令和・平成・昭和）",
  description:
    "西暦と和暦（令和・平成・昭和・大正・明治）をオンラインで相互変換。元年表記、R8.10.15のような略記にも対応。書類作成や生年月日の確認に。",
  path: "/wareki-converter/",
})

const Page = () => (
  <ToolArticle href="/wareki-converter/">
    <WarekiConverterTool />
  </ToolArticle>
)

export default Page
