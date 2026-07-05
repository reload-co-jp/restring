import { JwtDecoderTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "JWTデコード・解析",
  description:
    "JWT（JSON Web Token）をオンラインでデコード。Header・Payload・署名を分解し、有効期限確認とHMAC署名検証を行う。",
  path: "/jwt-decoder/",
})

const Page = () => (
  <ToolArticle href="/jwt-decoder/">
    <JwtDecoderTool />
  </ToolArticle>
)

export default Page
