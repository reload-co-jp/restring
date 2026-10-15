"use client"

import Link from "next/link"
import { FC, useState } from "react"
import { Icon } from "components/icons"
import {
  ToolCategoryId,
  findTool,
  popularToolHrefs,
  searchTools,
  toolCategories,
} from "components/tool-links"

export const ToolDirectory: FC = () => {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<ToolCategoryId | undefined>()
  const results = searchTools(query, category)
  const popular = popularToolHrefs
    .map(findTool)
    .filter((tool) => tool !== undefined)

  return (
    <>
      <section className="hero">
        <h1>開発のための、小さなツールボックス</h1>
        <p>
          文字列比較、JSON検証、エンコード、日時変換などをブラウザですばやく処理。入力データは外部へ送信しない。
        </p>
        <div className="heroSearch">
          <Icon name="search" size={20} />
          <input
            aria-controls="tools"
            aria-label="ツール名・説明で絞り込み"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例: JSON, Base64, 差分, タイムゾーン"
            type="search"
            value={query}
          />
        </div>
        <div className="quickLinks">
          <span>よく使われるツール</span>
          {popular.map((tool) => (
            <Link href={tool.href} key={tool.href}>
              {tool.title}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="tools-title" className="directory" id="tools">
        <div className="directoryHead">
          <h2 id="tools-title">ツール一覧</h2>
          <p aria-live="polite" className="muted">
            {results.length}件
          </p>
        </div>
        <div aria-label="カテゴリで絞り込み" className="chips" role="group">
          <button
            aria-pressed={!category}
            className="chip"
            onClick={() => setCategory(undefined)}
            type="button"
          >
            すべて
          </button>
          {toolCategories.map((item) => (
            <button
              aria-pressed={category === item.id}
              className="chip"
              key={item.id}
              onClick={() => setCategory(category === item.id ? undefined : item.id)}
              type="button"
            >
              <Icon name={item.id} size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {results.length === 0 && (
          <div className="emptyState">
            <p>「{query}」に一致するツールなし。</p>
            <button
              className="button secondary"
              onClick={() => {
                setQuery("")
                setCategory(undefined)
              }}
              type="button"
            >
              条件をリセット
            </button>
          </div>
        )}

        {toolCategories.map((item) => {
          const tools = results.filter((tool) => tool.category === item.id)
          if (tools.length === 0) return null
          return (
            <section
              aria-labelledby={`category-${item.id}`}
              className="toolGroup"
              id={item.id}
              key={item.id}
            >
              <h3 id={`category-${item.id}`}>
                <Icon name={item.id} size={16} />
                {item.label}
              </h3>
              <ul className="toolGrid">
                {tools.map((tool) => (
                  <li key={tool.href}>
                    <Link className="toolCard" href={tool.href}>
                      <span className="toolCardIcon">
                        <Icon name={tool.category} />
                      </span>
                      <span className="toolCardBody">
                        <strong>{tool.title}</strong>
                        <span>{tool.description}</span>
                      </span>
                      <Icon name="arrow" size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </section>
    </>
  )
}
