import { UrlEncodeDecodeTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "URLエンコード・デコード",
  description: "URLコンポーネントをエンコード・デコード。",
  path: "/url-encode-decode/",
})

const Page = () => (
  <ToolArticle href="/url-encode-decode/">
    <UrlEncodeDecodeTool />
  </ToolArticle>
)

export default Page
