import { RadixConverterTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "進数変換（2進数・8進数・10進数・16進数）",
  description:
    "2進数・8進数・10進数・16進数をオンラインで相互変換。桁数の上限なし、負数や0x・0b接頭辞にも対応。ビット演算やカラーコード、メモリアドレスの確認に。",
  path: "/radix-converter/",
})

const Page = () => (
  <ToolArticle href="/radix-converter/">
    <RadixConverterTool />
  </ToolArticle>
)

export default Page
