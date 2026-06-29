import { FC } from "react"
import { toolLinks } from "components/tool-links"
import { absoluteUrl, createPageMetadata, siteDescription } from "components/seo"

export const metadata = createPageMetadata({
  title: "開発者向け文字列処理・比較ツール",
  description: siteDescription,
  path: "/",
})

const Page: FC = () => (
  <div className="workspace">
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: toolLinks.map((tool, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tool.title,
            description: tool.description,
            url: absoluteUrl(tool.href),
          })),
        }),
      }}
      type="application/ld+json"
    />
    <section className="intro">
      <h1>restring</h1>
      <p>開発者向け文字列処理・比較ツール集。</p>
    </section>
  </div>
)

export default Page
