"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FC, KeyboardEvent, useEffect, useId, useRef, useState } from "react"
import { Icon } from "components/icons"
import { searchTools, toolCategories, toolLinks } from "components/tool-links"

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname === href.slice(0, -1)

export const SideNav: FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const pathname = usePathname()

  return (
    <nav aria-label="ツール一覧" className="sideNav">
      {toolCategories.map((category) => (
        <div className="sideNavGroup" key={category.id}>
          <p className="sideNavTitle">
            <Icon name={category.id} size={16} />
            {category.label}
          </p>
          <ul>
            {toolLinks
              .filter((tool) => tool.category === category.id)
              .map((tool) => {
                const active = isActive(pathname, tool.href)
                return (
                  <li key={tool.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={active ? "sideNavLink active" : "sideNavLink"}
                      href={tool.href}
                      onClick={onNavigate}
                    >
                      {tool.title}
                    </Link>
                  </li>
                )
              })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export const MobileNav: FC = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <div className="mobileNav">
      <button
        aria-controls="mobile-nav-panel"
        aria-expanded={open}
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        className="iconOnlyButton"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
      {open && (
        <div className="mobileNavPanel" id="mobile-nav-panel">
          <SideNav onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}

export const ToolSearch: FC = () => {
  const router = useRouter()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const results = query.trim() ? searchTools(query).slice(0, 8) : []
  const expanded = open && query.trim() !== ""

  // 「/」でどこからでも検索へフォーカス
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        event.key !== "/" ||
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      )
        return
      event.preventDefault()
      inputRef.current?.focus()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const go = (href: string) => {
    setQuery("")
    setOpen(false)
    router.push(href)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((activeIndex + 1) % results.length)
    } else if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault()
      setActiveIndex((activeIndex - 1 + results.length) % results.length)
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault()
      go(results[activeIndex].href)
    } else if (event.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div className="toolSearch">
      <Icon name="search" size={16} />
      <input
        aria-activedescendant={
          expanded && results[activeIndex] ? `${listId}-${activeIndex}` : undefined
        }
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={expanded}
        aria-label="ツールを検索"
        autoComplete="off"
        onBlur={() => setOpen(false)}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="ツールを検索"
        ref={inputRef}
        role="combobox"
        type="search"
        value={query}
      />
      <kbd aria-hidden="true">/</kbd>
      {expanded && (
        <ul className="searchResults" id={listId} role="listbox">
          {results.map((tool, index) => (
            <li
              aria-selected={index === activeIndex}
              className={index === activeIndex ? "active" : undefined}
              id={`${listId}-${index}`}
              key={tool.href}
              // blurより先に遷移させる
              onMouseDown={(event) => {
                event.preventDefault()
                go(tool.href)
              }}
              role="option"
            >
              <Icon name={tool.category} size={16} />
              <span>{tool.title}</span>
            </li>
          ))}
          {results.length === 0 && <li className="searchEmpty">該当するツールなし</li>}
        </ul>
      )}
    </div>
  )
}

export const ThemeToggle: FC = () => (
  <button
    aria-label="ライト・ダークテーマを切り替え"
    className="iconOnlyButton themeToggle"
    onClick={() => {
      const root = document.documentElement
      const current =
        root.dataset.theme ??
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      const next = current === "dark" ? "light" : "dark"
      root.dataset.theme = next
      try {
        localStorage.setItem("theme", next)
      } catch {
        // 保存不可でも切り替えは有効
      }
    }}
    title="テーマ切り替え"
    type="button"
  >
    <span className="iconMoon">
      <Icon name="moon" />
    </span>
    <span className="iconSun">
      <Icon name="sun" />
    </span>
  </button>
)
