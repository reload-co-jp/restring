import Link from "next/link"
import { Title } from "components/elements/layout"
import { ToolTabs } from "components/tool-tabs"
import "./reset.css"

export const metadata = {
  title: "restring",
  description: "開発者向け文字列処理・比較ツール集。",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <header
          style={{
            backgroundColor: "#111827",
            borderBottom: "1px solid #334155",
            padding: ".75rem 1rem",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Link className="brandLink" href="/">
            <Title>restring</Title>
          </Link>
          <ToolTabs />
        </header>
        <main
          style={{
            background: "#0f172a",
            minHeight: "calc(100dvh - 6.25rem)",
            padding: "1rem",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            backgroundColor: "#111827",
            borderTop: "1px solid #334155",
            fontSize: ".75rem",
            padding: "1rem",
          }}
        >
          <p>&copy; restring</p>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
