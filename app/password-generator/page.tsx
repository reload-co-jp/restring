import { PasswordGeneratorTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "パスワード生成",
  description:
    "安全なランダムパスワードをオンラインで生成。文字数、大文字・小文字・数字・記号の文字種、紛らわしい文字の除外を指定可能。生成はブラウザ内で完結。",
  path: "/password-generator/",
})

const Page = () => (
  <ToolArticle href="/password-generator/">
    <PasswordGeneratorTool />
  </ToolArticle>
)

export default Page
