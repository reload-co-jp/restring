import { WidthConverterTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "全角・半角・ひらがな・カタカナ変換",
  description:
    "全角英数字・記号を半角へ、半角英数字や半角カナを全角へオンラインで一括変換。ひらがな・カタカナの相互変換にも対応。フォーム入力値やCSVの表記揺れ統一に。",
  path: "/width-converter/",
})

const Page = () => (
  <ToolArticle href="/width-converter/">
    <WidthConverterTool />
  </ToolArticle>
)

export default Page
