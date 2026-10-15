import { CharacterCountTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "文字数カウント（バイト数・行数）",
  description:
    "文字数をオンラインでカウント。絵文字や結合文字も見た目どおり1文字として数え、空白除外の文字数、UTF-8・Shift_JISのバイト数、行数、単語数を同時に表示。",
  path: "/character-count/",
})

const Page = () => (
  <ToolArticle href="/character-count/">
    <CharacterCountTool />
  </ToolArticle>
)

export default Page
