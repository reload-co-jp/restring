import { HashGeneratorTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "ハッシュ生成（MD5・SHA-256）",
  description:
    "文字列のハッシュ値をオンラインで生成。MD5、SHA-1、SHA-256、SHA-384、SHA-512を同時に計算。UTF-8対応で日本語も可。ファイル改ざん確認やキャッシュキーの作成に。",
  path: "/hash-generator/",
})

const Page = () => (
  <ToolArticle href="/hash-generator/">
    <HashGeneratorTool />
  </ToolArticle>
)

export default Page
