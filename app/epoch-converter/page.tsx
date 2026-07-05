import { EpochConverterTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "エポック時間変換 - Unixタイムスタンプ変換",
  description:
    "Unixエポック秒・ミリ秒をオンラインで日時に変換。ISO 8601・UTC・ローカル時刻表示に対応。ログ調査やAPIレスポンスのタイムスタンプ確認に。",
  path: "/epoch-converter/",
})

const Page = () => (
  <ToolArticle href="/epoch-converter/">
    <EpochConverterTool />
  </ToolArticle>
)

export default Page
