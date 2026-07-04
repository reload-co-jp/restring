import { JwtDecoderTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "JWT解析",
  description: "JWTのHeader、Payload、署名部分を分解し、時刻クレーム確認とHMAC署名検証を行う。",
  path: "/jwt-decoder/",
})

const Page = () => (
  <ToolArticle href="/jwt-decoder/">
    <JwtDecoderTool />
  </ToolArticle>
)

export default Page
