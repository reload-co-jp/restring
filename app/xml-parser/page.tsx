import { XmlParserTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "XML構文チェック・整形・XPath検索",
  description:
    "XMLをオンラインで解析。構文エラー時は行番号・列番号を表示し、整形式のXMLはインデント整形・1行圧縮。XPathで要素・属性・テキストを抽出できる。RSS、SOAP、設定ファイルの確認に。",
  path: "/xml-parser/",
})

const Page = () => (
  <ToolArticle href="/xml-parser/">
    <XmlParserTool />
  </ToolArticle>
)

export default Page
