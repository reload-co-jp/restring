import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { findTerm, terms } from "components/glossary"
import {
  absoluteUrl,
  createPageMetadata,
  siteName,
  siteUrl,
} from "components/seo"
import { findTool, toolCategories } from "components/tool-links"

type Props = { params: Promise<{ id: string }> }

export const dynamicParams = false

export const generateStaticParams = () => terms.map((item) => ({ id: item.id }))

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const term = findTerm((await params).id)
  if (!term) return {}
  return createPageMetadata({
    title: `${term.term}とは`,
    description: term.description,
    path: `/glossary/${term.id}/`,
  })
}

const Page = async ({ params }: Props) => {
  const term = findTerm((await params).id)
  if (!term) notFound()

  const url = absoluteUrl(`/glossary/${term.id}/`)
  const tool = term.tool ? findTool(term.tool) : undefined
  const category = toolCategories.find((item) => item.id === term.category)
  const related = terms.filter(
    (item) => item.category === term.category && item.id !== term.id
  )

  return (
    <div className="toolPage">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "DefinedTerm",
              "@id": url,
              termCode: term.id,
              name: term.term,
              description: term.description,
              url,
              inLanguage: "ja",
              inDefinedTermSet: {
                "@type": "DefinedTermSet",
                "@id": absoluteUrl("/glossary/"),
                name: `${siteName} 用語集`,
                url: absoluteUrl("/glossary/"),
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
                  name: "用語集",
                  item: absoluteUrl("/glossary/"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: term.term,
                  item: url,
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
            <li>
              <Link href="/glossary/">用語集</Link>
            </li>
            <li aria-current="page">{term.term}</li>
          </ol>
        </nav>
        <h1>{term.term}</h1>
        <p className="lead">{term.description}</p>
        {tool && (
          <p>
            <Link href={tool.href}>{tool.title}で試す</Link>
          </p>
        )}
      </header>
      {related.length > 0 && (
        <section className="articleSection">
          <h2>{category?.label ?? "関連"}の用語</h2>
          <ul>
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/glossary/${item.id}/`}>{item.term}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default Page
