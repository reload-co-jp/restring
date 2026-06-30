import { FC, ReactNode } from "react"
import { toolLinks } from "components/tool-links"

export const ToolArticle: FC<{ children: ReactNode; href: string }> = ({
  children,
  href,
}) => {
  const tool = toolLinks.find((item) => item.href === href)

  if (!tool) return <>{children}</>

  return (
    <div className="toolPage">
      {children}
      <section className="articleSection">
        <h2>使い方</h2>
        <ol>
          {tool.usage.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
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
          <h2>シェルワンライナー</h2>
          <div className="shellList">
            {tool.shell.map((item) => (
              <div className="shellItem" key={item.command}>
                <p>{item.label}</p>
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
