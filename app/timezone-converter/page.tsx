import { TimezoneConverterTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "タイムゾーン検索・変換 - 世界時計・現地時刻変換",
  description:
    "IANAタイムゾーン名をオンラインで検索し、基準日時を複数タイムゾーンの現地時刻へ一括変換。UTCオフセット確認や海外拠点との会議調整に。",
  path: "/timezone-converter/",
})

const Page = () => (
  <ToolArticle href="/timezone-converter/">
    <TimezoneConverterTool />
  </ToolArticle>
)

export default Page
