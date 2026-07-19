import { RegexTesterTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "正規表現チェック - 正規表現テスター",
  description:
    "正規表現パターンをオンラインでテスト。マッチ箇所・位置・キャプチャグループを一覧表示し、置換結果も確認。",
  path: "/regex-tester/",
})

const Page = () => (
  <ToolArticle href="/regex-tester/">
    <RegexTesterTool />
  </ToolArticle>
)

export default Page
