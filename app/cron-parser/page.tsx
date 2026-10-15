import { CronParserTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "cron式の解説・次回実行日時",
  description:
    "cron式をオンラインで解析し、分・時・日・月・曜日ごとの実行条件と次回以降の実行日時を表示。*/5や1-5、MON-FRI、@dailyなどの記法に対応。crontabの設定確認に。",
  path: "/cron-parser/",
})

const Page = () => (
  <ToolArticle href="/cron-parser/">
    <CronParserTool />
  </ToolArticle>
)

export default Page
