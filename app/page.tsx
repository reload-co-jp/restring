import { FC } from "react"
import Link from "next/link"
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
      <h1>Restring</h1>
      <p>開発者向け文字列処理・比較ツール集。</p>
    </section>
    <section className="featureSection" aria-labelledby="features-title">
      <h2 id="features-title">機能一覧</h2>
      <div className="featureGrid">
        {toolLinks.map((tool) => (
          <Link className="featureLink" href={tool.href} key={tool.href}>
            <strong>{tool.title}</strong>
            <span>{tool.description}</span>
          </Link>
        ))}
      </div>
    </section>
  </div>
)

export default Page
