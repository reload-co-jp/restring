import { DataConverterTool } from "components/data-converter"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "JSON・CSV変換",
  description:
    "JSONとCSVをオンラインで相互変換。オブジェクトの配列を表にしてExcelやスプレッドシートで開いたり、CSVの表データをJSONの配列に書き換えたりできる。",
  path: "/json-csv-converter/",
})

const Page = () => (
  <ToolArticle href="/json-csv-converter/">
    <DataConverterTool from="json" to="csv" />
  </ToolArticle>
)

export default Page
