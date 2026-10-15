import Link from "next/link"
import { FC } from "react"
import { terms } from "components/glossary"
import { Icon } from "components/icons"
import {
  absoluteUrl,
  createPageMetadata,
  siteName,
  siteUrl,
} from "components/seo"
import { findTool, toolCategories } from "components/tool-links"

export const metadata = createPageMetadata({
  title: "用語集",
  description:
    "Base64、URLエンコード、JWT、Unicode、UTF-8、正規化、改行コード、UNIX時間、正規表現など、文字列処理ツールで使われる用語をまとめて解説。",
  path: "/glossary/",
})

const Page: FC = () => (
  <div className="toolPage">
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            "@id": absoluteUrl("/glossary/"),
            name: `${siteName} 用語集`,
            url: absoluteUrl("/glossary/"),
            inLanguage: "ja",
            hasDefinedTerm: terms.map((item) => ({
              "@type": "DefinedTerm",
              "@id": absoluteUrl(`/glossary/${item.id}/`),
              termCode: item.id,
              name: item.term,
              description: item.description,
              url: absoluteUrl(`/glossary/${item.id}/`),
            })),
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
                name: "用語集",
                item: absoluteUrl("/glossary/"),
              },
            ],
          },
        ]),
      }}
      type="application/ld+json"
    />
    <header className="toolHeader">
      <nav aria-label="パンくず" className="breadcrumb">
        <ol>
          <li>
            <Link href="/">Restring</Link>
          </li>
          <li aria-current="page">用語集</li>
        </ol>
      </nav>
      <h1>用語集</h1>
      <p className="lead">
        各ツールで使われる文字コード、エンコード、日時、開発関連の用語をまとめて解説。
      </p>
    </header>
    {toolCategories.map((category) => {
      const items = terms.filter((item) => item.category === category.id)
      if (items.length === 0) return null
      return (
        <section className="articleSection" id={category.id} key={category.id}>
          <h2>
            <Icon name={category.id} size={16} /> {category.label}
          </h2>
          <div className="faqList">
            {items.map((item) => {
              const tool = item.tool ? findTool(item.tool) : undefined
              return (
                <section className="faqItem" id={item.id} key={item.id}>
                  <h3>
                    <Link href={`/glossary/${item.id}/`}>{item.term}</Link>
                  </h3>
                  <p>{item.description}</p>
                  {tool && (
                    <p>
                      <Link href={tool.href}>{tool.title}で試す</Link>
                    </p>
                  )}
                </section>
              )
            })}
          </div>
        </section>
      )
    })}
  </div>
)

export default Page
