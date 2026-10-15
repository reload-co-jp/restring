import { YamlJsonConverterTool } from "components/yaml-json-converter"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "YAML・JSON変換",
  description:
    "YAMLとJSONをオンラインで相互変換。設定ファイル、Kubernetesマニフェスト、GitHub ActionsのワークフローをJSONで確認したり、JSONをYAMLへ書き換えたりできる。",
  path: "/yaml-json-converter/",
})

const Page = () => (
  <ToolArticle href="/yaml-json-converter/">
    <YamlJsonConverterTool />
  </ToolArticle>
)

export default Page
