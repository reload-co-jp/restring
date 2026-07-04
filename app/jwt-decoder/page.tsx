import { JwtDecoderTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "JWT解析",
  description: "JWTのHeader、Payload、署名部分を分解し、exp、nbf、iatなどのクレームを確認。",
  path: "/jwt-decoder/",
})

const Page = () => (
  <ToolArticle href="/jwt-decoder/">
    <JwtDecoderTool />
  </ToolArticle>
)

export default Page
