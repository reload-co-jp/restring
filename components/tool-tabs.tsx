"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC } from "react"
import { toolLinks } from "components/tool-links"

export const ToolTabs: FC = () => {
  const pathname = usePathname()

  return (
    <nav className="toolTabs" aria-label="機能">
      {toolLinks.map((tool) => {
        const active = pathname === tool.href || pathname === tool.href.slice(0, -1)
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={active ? "toolTab active" : "toolTab"}
            href={tool.href}
            key={tool.href}
            title={tool.description}
          >
            {tool.title}
          </Link>
        )
      })}
    </nav>
  )
}
