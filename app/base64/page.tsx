import { Base64Tool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "Base64",
  description: "Base64文字列をエンコード・デコード。",
  path: "/base64/",
})

const Page = () => (
  <ToolArticle href="/base64/">
    <Base64Tool />
  </ToolArticle>
)

export default Page
