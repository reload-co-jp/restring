import { FC } from "react"
import { toolLinks } from "components/tool-links"
import { ToolDirectory } from "components/tool-directory"
import {
  absoluteUrl,
  createPageMetadata,
  siteDescription,
  siteName,
} from "components/seo"

export const metadata = createPageMetadata({
  title: "開発者向け文字列処理・比較ツール",
  description: siteDescription,
  path: "/",
})

const Page: FC = () => (
  <div className="home">
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
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: siteName,
          url: absoluteUrl("/"),
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          inLanguage: "ja",
          isAccessibleForFree: true,
          description: siteDescription,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "JPY",
          },
          hasPart: toolLinks.map((tool) => ({
            "@type": "WebApplication",
            name: `${siteName} ${tool.title}`,
            url: absoluteUrl(tool.href),
            description: tool.description,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
          })),
        }),
      }}
      type="application/ld+json"
    />
    <ToolDirectory />
  </div>
)

export default Page
