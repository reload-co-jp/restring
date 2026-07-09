import { FC, ReactNode } from "react"
import Link from "next/link"
import { toolLinks } from "components/tool-links"
import { absoluteUrl, siteName, siteUrl } from "components/seo"

const relatedToolHrefs: Record<string, string[]> = {
  "/text-compare/": [
    "/text-diff/",
    "/text-normalize/",
    "/invisible-character-viewer/",
  ],
  "/json-compare/": ["/json-validator/", "/jwt-decoder/", "/text-compare/"],
  "/jwt-decoder/": ["/base64/", "/json-validator/", "/url-encode-decode/"],
  "/text-diff/": [
    "/text-compare/",
    "/text-normalize/",
    "/line-ending-converter/",
  ],
  "/text-normalize/": [
    "/invisible-character-viewer/",
    "/line-ending-converter/",
    "/text-compare/",
  ],
  "/invisible-character-viewer/": [
    "/text-normalize/",
    "/unicode-inspector/",
    "/text-compare/",
  ],
  "/line-ending-converter/": [
    "/text-normalize/",
    "/text-diff/",
    "/text-compare/",
  ],
  "/case-converter/": [
    "/url-encode-decode/",
    "/text-normalize/",
    "/regex-tester/",
  ],
  "/url-encode-decode/": ["/base64/", "/html-escape/", "/jwt-decoder/"],
  "/base64/": ["/jwt-decoder/", "/url-encode-decode/", "/json-validator/"],
  "/html-escape/": [
    "/url-encode-decode/",
    "/unicode-inspector/",
    "/text-normalize/",
  ],
  "/unicode-inspector/": [
    "/invisible-character-viewer/",
    "/html-escape/",
    "/text-normalize/",
  ],
  "/epoch-converter/": [
    "/timezone-converter/",
    "/json-validator/",
    "/sql-builder/",
  ],
  "/timezone-converter/": [
    "/epoch-converter/",
    "/json-validator/",
    "/text-normalize/",
  ],
  "/sql-builder/": ["/json-validator/", "/regex-tester/", "/text-normalize/"],
  "/json-validator/": ["/json-compare/", "/jwt-decoder/", "/sql-builder/"],
  "/regex-tester/": ["/text-compare/", "/case-converter/", "/text-normalize/"],
}

export const ToolArticle: FC<{ children: ReactNode; href: string }> = ({
  children,
  href,
}) => {
  const tool = toolLinks.find((item) => item.href === href)

  if (!tool) return <>{children}</>

  const relatedTools = (relatedToolHrefs[tool.href] ?? [])
    .map((relatedHref) => toolLinks.find((item) => item.href === relatedHref))
    .filter((item): item is (typeof toolLinks)[number] => Boolean(item))

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
      featureList: [...tool.usage, ...tool.mechanism],
      isPartOf: {
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
      },
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
        <nav aria-label="パンくず" className="breadcrumb">
          <Link href="/">Restring</Link>
          <span aria-hidden="true">/</span>
          <span>{tool.title}</span>
        </nav>
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
      {relatedTools.length > 0 && (
        <section className="articleSection">
          <h2>関連ツール</h2>
          <div className="relatedToolGrid">
            {relatedTools.map((relatedTool) => (
              <Link
                className="relatedToolLink"
                href={relatedTool.href}
                key={relatedTool.href}
              >
                <strong>{relatedTool.title}</strong>
                <span>{relatedTool.description}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
