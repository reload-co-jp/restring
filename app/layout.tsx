import Link from "next/link"
import { Metadata } from "next"
import Script from "next/script"
import {
  defaultOgImage,
  siteDescription,
  siteKeywords,
  siteName,
  siteUrl,
} from "components/seo"
import { Icon } from "components/icons"
import { MobileNav, SideNav, ThemeToggle, ToolSearch } from "components/site-nav"
import { toolCategories, toolLinks } from "components/tool-links"
import "./reset.css"

const googleAnalyticsId = "G-2M289CH9TQ"
const isProduction = process.env.NODE_ENV === "production"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "Restring | 開発者向け文字列処理・比較ツール",
    template: "%s | Restring",
  },
  description: siteDescription,
  keywords: siteKeywords,
  category: "developer tools",
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
    languages: {
      ja: "/",
    },
  },
  openGraph: {
    title: "Restring | 開発者向け文字列処理・比較ツール",
    description: siteDescription,
    url: "/",
    siteName,
    locale: "ja_JP",
    type: "website",
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Restring | 開発者向け文字列処理・比較ツール",
    description: siteDescription,
    images: [defaultOgImage],
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  inLanguage: "ja",
  publisher: {
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
  },
}

// 描画前に保存済みテーマを反映してちらつきを防ぐ
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          type="application/ld+json"
        />
      </head>
      <body>
        {isProduction && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        <a className="skipLink" href="#main">
          本文へスキップ
        </a>
        <header className="siteHeader">
          <div className="siteHeaderInner">
            <MobileNav />
            <Link aria-label="Restring トップ" className="brandLink" href="/">
              <span aria-hidden="true" className="brandMark">
                R
              </span>
              <span className="brandName">Restring</span>
            </Link>
            <ToolSearch />
            <Link className="headerLink" href="/#tools">
              ツール一覧
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <div className="shell">
          <aside className="sidebar">
            <SideNav />
          </aside>
          <main className="main" id="main">
            {children}
          </main>
        </div>
        <footer className="siteFooter">
          <div className="siteFooterInner">
            <section className="footerAbout">
              <p className="footerBrand">Restring</p>
              <p>{siteDescription}</p>
              <h2>データの取り扱い</h2>
              <p>
                入力した文字列はブラウザ内で処理し、サーバーへ送信・保存しない。テーマ設定のみブラウザに保存する。アクセス解析にGoogle
                Analyticsを利用。
              </p>
              <p>
                <Link href="/glossary/">用語集</Link>
              </p>
            </section>
            <nav aria-label="全ツール" className="footerTools">
              {toolCategories.map((category) => (
                <div key={category.id}>
                  <h2>
                    <Icon name={category.id} size={14} />
                    {category.label}
                  </h2>
                  <ul>
                    {toolLinks
                      .filter((tool) => tool.category === category.id)
                      .map((tool) => (
                        <li key={tool.href}>
                          <Link href={tool.href}>{tool.title}</Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <p className="copyright">&copy; Restring</p>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
