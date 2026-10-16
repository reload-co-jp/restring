import { CurlBuilderTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "curlコマンド生成",
  description:
    "メソッド、URL、ヘッダー、ボディを入力してcurlコマンドを組み立て。シングルクォートを含む値も安全にエスケープ。APIの動作確認や手順書の作成に。",
  path: "/curl-builder/",
})

const Page = () => (
  <ToolArticle href="/curl-builder/">
    <CurlBuilderTool />
  </ToolArticle>
)

export default Page
