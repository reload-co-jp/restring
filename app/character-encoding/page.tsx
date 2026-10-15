import { CharacterEncodingTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "文字コード変換・文字化け復元（Shift_JIS・EUC-JP）",
  description:
    "文字列をUTF-8・Shift_JIS・EUC-JPのバイト列へ変換し、16進数のバイト列を文字列へ復号。「縺薙ｓ縺ｫ縺｡縺ｯ」のような文字化けを元の文字列へ復元する候補も表示。",
  path: "/character-encoding/",
})

const Page = () => (
  <ToolArticle href="/character-encoding/">
    <CharacterEncodingTool />
  </ToolArticle>
)

export default Page
