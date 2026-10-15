import { QrCodeTool } from "components/qr-code"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "QRコード生成（PNG・SVG）",
  description:
    "URLやテキストからQRコードをオンラインで作成。誤り訂正レベル、余白、色、背景透過を指定し、PNG（最大1024px）またはSVGで保存できる。日本語対応で、入力内容はサーバーへ送信しない。",
  path: "/qr-code-generator/",
})

const Page = () => (
  <ToolArticle href="/qr-code-generator/">
    <QrCodeTool />
  </ToolArticle>
)

export default Page
