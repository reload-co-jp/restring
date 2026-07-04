import { Base64Tool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "Base64エンコード・デコード",
  description:
    "文字列をオンラインでBase64エンコード・デコード。UTF-8対応で日本語も文字化けなし。Basic認証やデータURIの確認、設定値のデコードに。インストール不要でブラウザ上で完結。",
  path: "/base64/",
})

const Page = () => (
  <ToolArticle href="/base64/">
    <Base64Tool />
  </ToolArticle>
)

export default Page
