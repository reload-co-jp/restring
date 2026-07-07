import { FC, ReactNode } from "react"
import { toolLinks } from "components/tool-links"
import { absoluteUrl, siteName, siteUrl } from "components/seo"

export const ToolArticle: FC<{ children: ReactNode; href: string }> = ({
  children,
  href,
}) => {
  const tool = toolLinks.find((item) => item.href === href)

  if (!tool) return <>{children}</>

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${siteName} ${tool.title}`,
      url: absoluteUrl(tool.href),
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      inLanguage: "ja",
      isAccessibleForFree: true,
      description: tool.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: siteName,
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: tool.title,
          item: absoluteUrl(tool.href),
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `${tool.title}の使い方は？`,
          acceptedAnswer: {
            "@type": "Answer",
            text: tool.usage.join(" "),
          },
        },
        {
          "@type": "Question",
          name: `${tool.title}の仕組みは？`,
          acceptedAnswer: {
            "@type": "Answer",
            text: tool.mechanism.join(" "),
          },
        },
      ],
    },
  ]

  return (
    <div className="toolPage">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <section className="toolIntro">
        <h1>{tool.title}</h1>
        <p className="toolIntroduction">{tool.introduction}</p>
        <h2>使い方</h2>
        <ol>
          {tool.usage.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
      {children}
      <section className="articleSection">
        <h2>仕組み</h2>
        <ul>
          {tool.mechanism.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      {tool.shell.length > 0 && (
        <section className="articleSection">
          <h2>手元でやるには</h2>
          <div className="shellList">
            {tool.shell.map((item) => (
              <div className="shellItem" key={item.command}>
                <p>{item.label}</p>
                <span>必要環境: {item.environment}</span>
                <pre>
                  <code>{item.command}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
