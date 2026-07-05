"use client"

import { ChangeEvent, FC, ReactNode, useEffect, useMemo, useState } from "react"

type DiffPart = {
  text: string
  type: "same" | "added" | "removed"
}

type CompareUnit = "line" | "word" | "char"
type CompareView = "inline" | "side"
type LineEnding = "LF" | "CRLF" | "CR"
type CaseMode =
  | "upper"
  | "lower"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"

const normalizeForCompare = (
  value: string,
  options: {
    ignoreWhitespace: boolean
    ignoreLineBreaks: boolean
    ignoreTabs: boolean
    ignoreCase: boolean
  },
) => {
  let result = value

  if (options.ignoreTabs) result = result.replace(/\t/g, "")
  if (options.ignoreLineBreaks) result = result.replace(/\r?\n|\r/g, "")
  if (options.ignoreWhitespace) result = result.replace(/[ \f\v\u00a0]+/g, "")
  if (options.ignoreCase) result = result.toLowerCase()

  return result
}

const tokenize = (value: string, unit: CompareUnit) => {
  if (unit === "line") return value.split(/\r?\n|\r/)
  if (unit === "word") return value.match(/\S+|\s+/g) ?? []
  return Array.from(value)
}

const buildDiff = (left: string[], right: string[]): DiffPart[] => {
  const dp: number[][] = Array.from({ length: left.length + 1 }, () =>
    Array.from({ length: right.length + 1 }, () => 0),
  )

  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      dp[i][j] =
        left[i] === right[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const parts: DiffPart[] = []
  let i = 0
  let j = 0

  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      parts.push({ text: left[i], type: "same" })
      i += 1
      j += 1
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      parts.push({ text: left[i], type: "removed" })
      i += 1
    } else {
      parts.push({ text: right[j], type: "added" })
      j += 1
    }
  }

  while (i < left.length) {
    parts.push({ text: left[i], type: "removed" })
    i += 1
  }

  while (j < right.length) {
    parts.push({ text: right[j], type: "added" })
    j += 1
  }

  return parts
}

const formatPart = (part: DiffPart, unit: CompareUnit) =>
  unit === "line" ? `${part.text}\n` : part.text

const parseJson = (value: string) => {
  try {
    return { data: JSON.parse(value), error: "" }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "JSONが不正",
    }
  }
}

const stableJson = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stableJson)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, stableJson(child)]),
    )
  }
  return value
}

const normalizeText = (value: string) =>
  value
    .normalize("NFC")
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/\r\n|\r/g, "\n")
    .trim()

const visibleText = (value: string) =>
  Array.from(value)
    .map((char) => {
      if (char === " ") return "スペース"
      if (char === "\t") return "Tab"
      if (char === "\r") return "CR"
      if (char === "\n") return "LF\n"
      if (char === "\u00a0") return "NBSP"
      if (char === "\u200b") return "ゼロ幅スペース"
      return char
    })
    .join(" ")

const convertLineEnding = (value: string, ending: LineEnding) => {
  const normalized = value.replace(/\r\n|\r/g, "\n")
  if (ending === "CRLF") return normalized.replace(/\n/g, "\r\n")
  if (ending === "CR") return normalized.replace(/\n/g, "\r")
  return normalized
}

const words = (value: string) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase())

const toCase = (value: string, mode: CaseMode) => {
  const list = words(value)
  const capitalized = list.map((word) => word.charAt(0).toUpperCase() + word.slice(1))

  if (mode === "upper") return value.toUpperCase()
  if (mode === "lower") return value.toLowerCase()
  if (mode === "camel") return [list[0] ?? "", ...capitalized.slice(1)].join("")
  if (mode === "pascal") return capitalized.join("")
  if (mode === "snake") return list.join("_")
  return list.join("-")
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const unescapeHtml = (value: string) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")

const encodeUtf8 = (char: string) =>
  Array.from(new TextEncoder().encode(char))
    .map((byte) => byte.toString(16).toUpperCase().padStart(2, "0"))
    .join(" ")

const encodeUtf16 = (char: string) =>
  Array.from({ length: char.length }, (_, index) =>
    char.charCodeAt(index).toString(16).toUpperCase().padStart(4, "0"),
  ).join(" ")

const unicodeBlock = (codePoint: number) => {
  const blocks: Array<[number, number, string]> = [
    [0x0000, 0x007f, "Basic Latin"],
    [0x0080, 0x00ff, "Latin-1 Supplement"],
    [0x0100, 0x017f, "Latin Extended-A"],
    [0x3040, 0x309f, "Hiragana"],
    [0x30a0, 0x30ff, "Katakana"],
    [0x3400, 0x4dbf, "CJK Unified Ideographs Extension A"],
    [0x4e00, 0x9fff, "CJK Unified Ideographs"],
    [0xac00, 0xd7af, "Hangul Syllables"],
    [0x1f300, 0x1f5ff, "Miscellaneous Symbols and Pictographs"],
    [0x1f600, 0x1f64f, "Emoticons"],
  ]
  return blocks.find(([start, end]) => codePoint >= start && codePoint <= end)?.[2] ?? "Unknown"
}

const unicodeName = (char: string, codePoint: number) => {
  const names: Record<string, string> = {
    " ": "SPACE",
    "\t": "CHARACTER TABULATION",
    "\n": "LINE FEED",
    "\r": "CARRIAGE RETURN",
    "\u00a0": "NO-BREAK SPACE",
    "\u200b": "ZERO WIDTH SPACE",
  }
  return names[char] ?? `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`
}

const copyText = async (value: string) => {
  await navigator.clipboard.writeText(value)
}

const downloadText = (name: string, value: string) => {
  const blob = new Blob([value], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch (error) {
    return error instanceof Error ? error.message : "URLエンコードが不正"
  }
}

const safeBase64Encode = (value: string) => {
  try {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(value, "utf-8").toString("base64")
    }
    return btoa(String.fromCharCode(...new TextEncoder().encode(value)))
  } catch (error) {
    return error instanceof Error ? error.message : "Base64エンコード失敗"
  }
}

const safeBase64Decode = (value: string) => {
  try {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(value, "base64").toString("utf-8")
    }
    const bytes = Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch (error) {
    return error instanceof Error ? error.message : "Base64が不正"
  }
}

const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8")
  }

  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const toBase64Url = (bytes: ArrayBuffer) => {
  const chars = Array.from(new Uint8Array(bytes), (byte) =>
    String.fromCharCode(byte),
  ).join("")
  return btoa(chars).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

const parseJwt = (value: string) => {
  const parts = value.trim().split(".")

  if (parts.length !== 3) {
    return {
      error: "JWTはHeader.Payload.Signatureの3部構成が必要",
      header: "",
      payload: "",
      signature: "",
      claims: [] as Array<[string, string]>,
    }
  }

  try {
    const header = JSON.parse(decodeBase64Url(parts[0]))
    const payload = JSON.parse(decodeBase64Url(parts[1]))
    const now = Math.floor(Date.now() / 1000)
    const claims: Array<[string, string]> = []

    const pushTimeClaim = (key: "exp" | "nbf" | "iat", label: string) => {
      if (typeof payload[key] !== "number") return
      const date = new Date(payload[key] * 1000).toISOString()
      claims.push([label, `${payload[key]} (${date})`])
    }

    pushTimeClaim("exp", "有効期限 exp")
    pushTimeClaim("nbf", "有効開始 nbf")
    pushTimeClaim("iat", "発行時刻 iat")

    if (typeof payload.exp === "number") {
      claims.push(["期限状態", payload.exp < now ? "期限切れ" : "期限内"])
    }
    if (typeof payload.nbf === "number") {
      claims.push(["開始状態", payload.nbf > now ? "まだ有効化前" : "有効化済み"])
    }

    return {
      error: "",
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      signature: parts[2],
      claims,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "JWT解析失敗",
      header: "",
      payload: "",
      signature: parts[2] ?? "",
      claims: [] as Array<[string, string]>,
    }
  }
}

const verifyJwtSignature = async (token: string, secret: string) => {
  const parts = token.trim().split(".")

  if (parts.length !== 3) return "JWTは3部構成が必要"
  if (!secret) return "秘密鍵を入力すると署名検証できる"

  const header = JSON.parse(decodeBase64Url(parts[0]))
  const algorithmMap: Record<string, "SHA-256" | "SHA-384" | "SHA-512"> = {
    HS256: "SHA-256",
    HS384: "SHA-384",
    HS512: "SHA-512",
  }
  const hash = algorithmMap[header.alg]

  if (!hash) {
    return `${header.alg ?? "unknown"} は未対応。対応: HS256 / HS384 / HS512`
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  )

  return toBase64Url(signature) === parts[2] ? "署名一致" : "署名不一致"
}

const parseFlexibleEpoch = (raw: string) => {
  const trimmed = raw.trim()
  if (trimmed === "") return null

  if (/^-?\d+$/.test(trimmed)) {
    const numeric = Number(trimmed)
    const ms = Math.abs(numeric) >= 1e12 ? numeric : numeric * 1000
    return Number.isNaN(ms) ? null : ms
  }

  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime()
}

const formatEpochResult = (ms: number) => ({
  iso: new Date(ms).toISOString(),
  utc: new Date(ms).toUTCString(),
  local: new Date(ms).toLocaleString("ja-JP", { timeZoneName: "short" }),
  seconds: Math.floor(ms / 1000).toString(),
  milliseconds: Math.round(ms).toString(),
})

const locateJsonError = (value: string, message: string) => {
  const positionMatch = message.match(/position (\d+)/)
  if (positionMatch) {
    const position = Number(positionMatch[1])
    const before = value.slice(0, position)
    const lastNewline = before.lastIndexOf("\n")
    return { line: before.split("\n").length, column: position - lastNewline }
  }

  const lineColumnMatch = message.match(/line (\d+) column (\d+)/)
  if (lineColumnMatch) {
    return { line: Number(lineColumnMatch[1]), column: Number(lineColumnMatch[2]) }
  }

  return null
}

const validateJson = (value: string) => {
  if (value.trim() === "") {
    return { valid: false, error: "入力が空", formatted: "", location: null as ReturnType<typeof locateJsonError> }
  }
  try {
    const data = JSON.parse(value)
    return { valid: true, error: "", formatted: JSON.stringify(data, null, 2), location: null as ReturnType<typeof locateJsonError> }
  } catch (error) {
    const message = error instanceof Error ? error.message : "JSONが不正"
    return { valid: false, error: message, formatted: "", location: locateJsonError(value, message) }
  }
}

type SqlMode = "select" | "insert" | "update" | "create"

const formatSqlValue = (raw: string) => {
  const trimmed = raw.trim()
  if (trimmed === "" || /^null$/i.test(trimmed)) return "NULL"
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return trimmed
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toUpperCase()
  return `'${trimmed.replace(/'/g, "''")}'`
}

const parseKeyValueLines = (raw: string) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf(":")
      if (index === -1) return null
      return { key: line.slice(0, index).trim(), value: line.slice(index + 1).trim() }
    })
    .filter((item): item is { key: string; value: string } => item !== null)

const parseLines = (raw: string) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

const buildSelectSql = (
  table: string,
  columns: string,
  where: string,
  orderBy: string,
) => {
  const cols = columns.trim() || "*"
  const whereClauses = parseLines(where)
  const lines = [`SELECT ${cols}`, `FROM ${table.trim() || "table_name"}`]
  if (whereClauses.length > 0) lines.push(`WHERE ${whereClauses.join("\n  AND ")}`)
  if (orderBy.trim()) lines.push(`ORDER BY ${orderBy.trim()}`)
  return `${lines.join("\n")};`
}

const buildInsertSql = (table: string, pairsRaw: string) => {
  const pairs = parseKeyValueLines(pairsRaw)
  const columns = pairs.map((pair) => pair.key).join(", ")
  const values = pairs.map((pair) => formatSqlValue(pair.value)).join(", ")
  return `INSERT INTO ${table.trim() || "table_name"} (${columns})\nVALUES (${values});`
}

const buildUpdateSql = (table: string, pairsRaw: string, where: string) => {
  const pairs = parseKeyValueLines(pairsRaw)
  const setClause = pairs
    .map((pair) => `${pair.key} = ${formatSqlValue(pair.value)}`)
    .join(",\n  ")
  const whereClauses = parseLines(where)
  const lines = [`UPDATE ${table.trim() || "table_name"}`, `SET ${setClause}`]
  if (whereClauses.length > 0) lines.push(`WHERE ${whereClauses.join("\n  AND ")}`)
  return `${lines.join("\n")};`
}

const buildCreateTableSql = (table: string, columnDefs: string) => {
  const lines = parseLines(columnDefs)
  const body = lines.map((line) => `  ${line}`).join(",\n")
  return `CREATE TABLE ${table.trim() || "table_name"} (\n${body}\n);`
}

const fallbackTimeZones = [
  "UTC",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Seoul",
  "Asia/Singapore",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Australia/Sydney",
  "Pacific/Auckland",
]

const getAllTimeZones = (): string[] => {
  if (typeof Intl.supportedValuesOf === "function") {
    try {
      return Intl.supportedValuesOf("timeZone")
    } catch {
      return fallbackTimeZones
    }
  }
  return fallbackTimeZones
}

const formatInTimeZone = (date: Date, timeZone: string) => {
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "shortOffset",
    }).format(date)
  } catch {
    return "不明なタイムゾーン"
  }
}

export const Panel: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => (
  <section className="panel">
    <h2>{title}</h2>
    {children}
  </section>
)

const ActionButton: FC<{
  children: ReactNode
  onClick: () => void
  title?: string
}> = ({ children, onClick, title }) => (
  <button className="iconButton" onClick={onClick} title={title} type="button">
    {children}
  </button>
)

const Textarea: FC<{
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}> = ({ label, value, onChange, rows = 8 }) => (
  <label className="field">
    <span>{label}</span>
    <textarea
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
        onChange(event.target.value)
      }
      rows={rows}
      spellCheck={false}
      value={value}
    />
  </label>
)

const Result: FC<{ name: string; value: string }> = ({ name, value }) => (
  <div className="result">
    <div className="resultActions">
      <ActionButton onClick={() => copyText(value)} title="コピー">
        コピー
      </ActionButton>
      <ActionButton onClick={() => downloadText(name, value)} title="ダウンロード">
        保存
      </ActionButton>
    </div>
    <pre>{value}</pre>
  </div>
)

const useTextDiff = () => {
  const [left, setLeft] = useState("hello\nworld")
  const [right, setRight] = useState("hello\nRestring")
  const [unit, setUnit] = useState<CompareUnit>("line")
  const [view, setView] = useState<CompareView>("inline")
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreLineBreaks, setIgnoreLineBreaks] = useState(false)
  const [ignoreTabs, setIgnoreTabs] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)

  const normalizedLeft = normalizeForCompare(left, {
    ignoreWhitespace,
    ignoreLineBreaks,
    ignoreTabs,
    ignoreCase,
  })
  const normalizedRight = normalizeForCompare(right, {
    ignoreWhitespace,
    ignoreLineBreaks,
    ignoreTabs,
    ignoreCase,
  })
  const leftTokens = tokenize(normalizedLeft, unit)
  const rightTokens = tokenize(normalizedRight, unit)
  const diff = useMemo(
    () => buildDiff(leftTokens, rightTokens),
    [leftTokens, rightTokens],
  )

  return {
    diff,
    ignoreCase,
    ignoreLineBreaks,
    ignoreTabs,
    ignoreWhitespace,
    left,
    leftTokens,
    right,
    rightTokens,
    setIgnoreCase,
    setIgnoreLineBreaks,
    setIgnoreTabs,
    setIgnoreWhitespace,
    setLeft,
    setRight,
    setUnit,
    setView,
    unit,
    view,
  }
}

export const TextCompareTool: FC = () => {
  const state = useTextDiff()

  return (
    <Panel title="テキスト比較">
      <div className="twoColumn">
        <Textarea label="比較元" onChange={state.setLeft} value={state.left} />
        <Textarea label="比較先" onChange={state.setRight} value={state.right} />
      </div>
      <CompareControls state={state} />
      {state.view === "inline" ? (
        <pre className="diffOutput">
          {state.diff.map((part, index) => (
            <mark className={part.type} key={`${part.type}-${index}`}>
              {formatPart(part, state.unit)}
            </mark>
          ))}
        </pre>
      ) : (
        <div className="twoColumn">
          <pre>{state.leftTokens.join(state.unit === "line" ? "\n" : "")}</pre>
          <pre>{state.rightTokens.join(state.unit === "line" ? "\n" : "")}</pre>
        </div>
      )}
    </Panel>
  )
}

const CompareControls: FC<{ state: ReturnType<typeof useTextDiff> }> = ({
  state,
}) => (
  <div className="toolbar">
    <select onChange={(event) => state.setUnit(event.target.value as CompareUnit)} value={state.unit}>
      <option value="line">行単位</option>
      <option value="word">単語単位</option>
      <option value="char">文字単位</option>
    </select>
    <select onChange={(event) => state.setView(event.target.value as CompareView)} value={state.view}>
      <option value="inline">インライン表示</option>
      <option value="side">左右表示</option>
    </select>
    <label><input checked={state.ignoreWhitespace} onChange={(event) => state.setIgnoreWhitespace(event.target.checked)} type="checkbox" />スペース無視</label>
    <label><input checked={state.ignoreLineBreaks} onChange={(event) => state.setIgnoreLineBreaks(event.target.checked)} type="checkbox" />改行無視</label>
    <label><input checked={state.ignoreTabs} onChange={(event) => state.setIgnoreTabs(event.target.checked)} type="checkbox" />タブ無視</label>
    <label><input checked={state.ignoreCase} onChange={(event) => state.setIgnoreCase(event.target.checked)} type="checkbox" />大文字小文字無視</label>
  </div>
)

export const JsonCompareTool: FC = () => {
  const [left, setLeft] = useState('{"name":"Restring","tools":["diff"]}')
  const [right, setRight] = useState('{"tools":["diff"],"name":"Restring"}')
  const leftJson = parseJson(left)
  const rightJson = parseJson(right)
  const prettyLeft = leftJson.error ? leftJson.error : JSON.stringify(leftJson.data, null, 2)
  const prettyRight = rightJson.error ? rightJson.error : JSON.stringify(rightJson.data, null, 2)
  const jsonEqual =
    !leftJson.error &&
    !rightJson.error &&
    JSON.stringify(stableJson(leftJson.data)) ===
      JSON.stringify(stableJson(rightJson.data))

  return (
    <Panel title="JSON比較">
      <div className="twoColumn">
        <Textarea label="JSON A" onChange={setLeft} value={left} />
        <Textarea label="JSON B" onChange={setRight} value={right} />
      </div>
      <p className={jsonEqual ? "ok" : "warn"}>
        {leftJson.error || rightJson.error
          ? "JSONが不正"
          : jsonEqual
            ? "構造一致"
            : "構造不一致"}
      </p>
      <div className="twoColumn">
        <pre>{prettyLeft}</pre>
        <pre>{prettyRight}</pre>
      </div>
    </Panel>
  )
}

export const JwtDecoderTool: FC = () => {
  const [value, setValue] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJlc3RyaW5nIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjQxMDI0NDQ4MDB9.lSacD8mcneUOosKS6cU2e_oVWy5cNGp4d6eYWNyLbQw",
  )
  const [secret, setSecret] = useState("secret")
  const [verification, setVerification] = useState("検証待ち")
  const result = parseJwt(value)

  useEffect(() => {
    let canceled = false

    verifyJwtSignature(value, secret)
      .then((message) => {
        if (!canceled) setVerification(message)
      })
      .catch((error: unknown) => {
        if (!canceled) {
          setVerification(error instanceof Error ? error.message : "署名検証失敗")
        }
      })

    return () => {
      canceled = true
    }
  }, [secret, value])

  return (
    <Panel title="JWT解析">
      <Textarea label="JWT" onChange={setValue} value={value} />
      <Textarea label="HMAC秘密鍵 (HS256/HS384/HS512)" onChange={setSecret} rows={3} value={secret} />
      <p className={verification === "署名一致" ? "ok" : "warn"}>
        署名検証: {verification}
      </p>
      {result.error ? (
        <pre>{result.error}</pre>
      ) : (
        <>
          {result.claims.length > 0 && (
            <div className="claimList">
              {result.claims.map(([label, text]) => (
                <div className="claimItem" key={label}>
                  <strong>{label}</strong>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          )}
          <div className="twoColumn">
            <Result name="jwt-header.json" value={result.header} />
            <Result name="jwt-payload.json" value={result.payload} />
          </div>
          <Result name="jwt-signature.txt" value={result.signature} />
        </>
      )}
    </Panel>
  )
}

export const TextDiffTool: FC = () => {
  const state = useTextDiff()
  const changedOnly = state.diff.filter((part) => part.type !== "same")

  return (
    <Panel title="テキスト差分">
      <div className="twoColumn">
        <Textarea label="比較元" onChange={state.setLeft} value={state.left} />
        <Textarea label="比較先" onChange={state.setRight} value={state.right} />
      </div>
      <CompareControls state={state} />
      <pre>
        {changedOnly.length === 0
          ? "差分なし"
          : changedOnly.map((part) => `${part.type === "added" ? "追加" : "削除"}: ${part.text}`).join("\n")}
      </pre>
    </Panel>
  )
}

export const TextNormalizeTool: FC = () => {
  const [value, setValue] = useState("  Hello   Restring\r\n")
  return (
    <Panel title="テキスト正規化">
      <Textarea label="入力" onChange={setValue} value={value} />
      <Result name="normalized.txt" value={normalizeText(value)} />
    </Panel>
  )
}

export const InvisibleCharacterViewerTool: FC = () => {
  const [value, setValue] = useState("Hello\t world\u00a0\u200b\n")
  return (
    <Panel title="不可視文字ビューア">
      <Textarea label="入力" onChange={setValue} value={value} />
      <Result name="visible.txt" value={visibleText(value)} />
    </Panel>
  )
}

export const LineEndingConverterTool: FC = () => {
  const [value, setValue] = useState("Hello\r\nRestring\r\n")
  const [lineEnding, setLineEnding] = useState<LineEnding>("LF")
  return (
    <Panel title="改行コード変換">
      <Textarea label="入力" onChange={setValue} value={value} />
      <div className="toolbar">
        <select onChange={(event) => setLineEnding(event.target.value as LineEnding)} value={lineEnding}>
          <option value="LF">LF</option>
          <option value="CRLF">CRLF</option>
          <option value="CR">CR</option>
        </select>
      </div>
      <Result name="line-ending.txt" value={convertLineEnding(value, lineEnding)} />
    </Panel>
  )
}

export const CaseConverterTool: FC = () => {
  const [value, setValue] = useState("hello Restring tool")
  const [caseMode, setCaseMode] = useState<CaseMode>("camel")
  return (
    <Panel title="ケース変換">
      <Textarea label="入力" onChange={setValue} value={value} />
      <div className="toolbar">
        <select onChange={(event) => setCaseMode(event.target.value as CaseMode)} value={caseMode}>
          <option value="upper">UPPERCASE</option>
          <option value="lower">lowercase</option>
          <option value="camel">camelCase</option>
          <option value="pascal">PascalCase</option>
          <option value="snake">snake_case</option>
          <option value="kebab">kebab-case</option>
        </select>
      </div>
      <Result name="case.txt" value={toCase(value, caseMode)} />
    </Panel>
  )
}

export const UrlEncodeDecodeTool: FC = () => {
  const [value, setValue] = useState("hello Restring?x=1&y=2")
  return (
    <Panel title="URLエンコード・デコード">
      <Textarea label="入力" onChange={setValue} value={value} />
      <Result name="url-encoded.txt" value={encodeURIComponent(value)} />
      <Result name="url-decoded.txt" value={safeDecodeURIComponent(value)} />
    </Panel>
  )
}

export const Base64Tool: FC = () => {
  const [value, setValue] = useState("hello Restring")
  return (
    <Panel title="Base64">
      <Textarea label="入力" onChange={setValue} value={value} />
      <Result name="base64-encoded.txt" value={safeBase64Encode(value)} />
      <Result name="base64-decoded.txt" value={safeBase64Decode(value)} />
    </Panel>
  )
}

export const HtmlEscapeTool: FC = () => {
  const [value, setValue] = useState('<a href="/Restring">hello</a>')
  return (
    <Panel title="HTMLエスケープ">
      <Textarea label="入力" onChange={setValue} value={value} />
      <Result name="html-escaped.txt" value={escapeHtml(value)} />
      <Result name="html-unescaped.txt" value={unescapeHtml(value)} />
    </Panel>
  )
}

export const UnicodeInspectorTool: FC = () => {
  const [value, setValue] = useState("Aあ😀")
  const rows = Array.from(value).map((char, index) => {
    const codePoint = char.codePointAt(0) ?? 0
    return {
      block: unicodeBlock(codePoint),
      codePoint: `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
      char,
      index,
      name: unicodeName(char, codePoint),
      utf8: encodeUtf8(char),
      utf16: encodeUtf16(char),
      utf32: codePoint.toString(16).toUpperCase().padStart(8, "0"),
    }
  })

  return (
    <Panel title="Unicodeインスペクタ">
      <Textarea label="入力" onChange={setValue} value={value} />
      <div className="unicodeList">
        {rows.map((row) => (
          <div className="unicodeRow" key={`${row.index}-${row.codePoint}`}>
            <strong>{row.char === "\n" ? "LF" : row.char === " " ? "スペース" : row.char}</strong>
            <span>{row.codePoint}</span>
            <span>{row.name}</span>
            <span>UTF-8 {row.utf8}</span>
            <span>UTF-16 {row.utf16}</span>
            <span>UTF-32 {row.utf32}</span>
            <span>{row.block}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export const EpochConverterTool: FC = () => {
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(Math.floor(Date.now() / 1000).toString())
  }, [])

  const ms = parseFlexibleEpoch(value)
  const result = ms === null ? null : formatEpochResult(ms)

  return (
    <Panel title="エポック時間変換">
      <div className="toolbar">
        <ActionButton onClick={() => setValue(Math.floor(Date.now() / 1000).toString())}>
          現在時刻（秒）
        </ActionButton>
        <ActionButton onClick={() => setValue(Date.now().toString())}>
          現在時刻（ミリ秒）
        </ActionButton>
      </div>
      <Textarea
        label="Unixエポック秒・ミリ秒 または 日時文字列"
        onChange={setValue}
        rows={2}
        value={value}
      />
      {result ? (
        <div className="claimList">
          <div className="claimItem">
            <strong>秒</strong>
            <span>{result.seconds}</span>
          </div>
          <div className="claimItem">
            <strong>ミリ秒</strong>
            <span>{result.milliseconds}</span>
          </div>
          <div className="claimItem">
            <strong>ISO 8601</strong>
            <span>{result.iso}</span>
          </div>
          <div className="claimItem">
            <strong>UTC</strong>
            <span>{result.utc}</span>
          </div>
          <div className="claimItem">
            <strong>ローカル</strong>
            <span>{result.local}</span>
          </div>
        </div>
      ) : (
        <p className="warn">
          数値（エポック秒・ミリ秒）または日時文字列（例: 2024-01-01T00:00:00Z）を入力
        </p>
      )}
    </Panel>
  )
}

export const TimezoneConverterTool: FC = () => {
  const allTimeZones = useMemo(() => getAllTimeZones(), [])
  const [query, setQuery] = useState("Tokyo")
  const [dateTimeValue, setDateTimeValue] = useState("")
  const [zonesValue, setZonesValue] = useState(
    "Asia/Tokyo, America/New_York, Europe/London, UTC",
  )
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const current = new Date()
    setDateTimeValue(`${current.toISOString().slice(0, 19)}Z`)
    setNow(current)
  }, [])

  const matchedZones = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    const zones = trimmed
      ? allTimeZones.filter((zone) => zone.toLowerCase().includes(trimmed))
      : allTimeZones
    return zones.slice(0, 20)
  }, [allTimeZones, query])

  const baseDate = new Date(dateTimeValue.trim())
  const baseDateValid = !Number.isNaN(baseDate.getTime())
  const targetZones = zonesValue
    .split(",")
    .map((zone) => zone.trim())
    .filter(Boolean)

  return (
    <>
      <Panel title="タイムゾーン検索">
        <Textarea
          label="タイムゾーン名検索（例: Tokyo, America, Europe）"
          onChange={setQuery}
          rows={1}
          value={query}
        />
        <div className="claimList">
          {matchedZones.map((zone) => (
            <div className="claimItem" key={zone}>
              <strong>{zone}</strong>
              <span>{now ? formatInTimeZone(now, zone) : "読み込み中"}</span>
            </div>
          ))}
          {matchedZones.length === 0 && (
            <p className="warn">該当タイムゾーンなし</p>
          )}
        </div>
      </Panel>
      <Panel title="タイムゾーン変換">
        <div className="toolbar">
          <ActionButton
            onClick={() => setDateTimeValue(`${new Date().toISOString().slice(0, 19)}Z`)}
          >
            現在時刻（UTC）
          </ActionButton>
        </div>
        <Textarea
          label="基準日時（例: 2024-01-01T12:00:00Z）"
          onChange={setDateTimeValue}
          rows={1}
          value={dateTimeValue}
        />
        <Textarea
          label="変換先タイムゾーン（カンマ区切り）"
          onChange={setZonesValue}
          rows={2}
          value={zonesValue}
        />
        {baseDateValid ? (
          <div className="claimList">
            {targetZones.map((zone) => (
              <div className="claimItem" key={zone}>
                <strong>{zone}</strong>
                <span>{formatInTimeZone(baseDate, zone)}</span>
              </div>
            ))}
            {targetZones.length === 0 && (
              <p className="warn">変換先タイムゾーンを入力</p>
            )}
          </div>
        ) : (
          <p className="warn">日時が不正</p>
        )}
      </Panel>
    </>
  )
}

export const SqlBuilderTool: FC = () => {
  const [mode, setMode] = useState<SqlMode>("select")
  const [table, setTable] = useState("users")
  const [columns, setColumns] = useState("id, name, email")
  const [where, setWhere] = useState("status = 'active'")
  const [orderBy, setOrderBy] = useState("created_at DESC")
  const [insertPairs, setInsertPairs] = useState(
    "name: Restring\nemail: hello@example.com",
  )
  const [updatePairs, setUpdatePairs] = useState("name: Restring")
  const [updateWhere, setUpdateWhere] = useState("id = 1")
  const [columnDefs, setColumnDefs] = useState(
    "id INT PRIMARY KEY\nname VARCHAR(255) NOT NULL\ncreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  )

  const sql =
    mode === "select"
      ? buildSelectSql(table, columns, where, orderBy)
      : mode === "insert"
        ? buildInsertSql(table, insertPairs)
        : mode === "update"
          ? buildUpdateSql(table, updatePairs, updateWhere)
          : buildCreateTableSql(table, columnDefs)

  return (
    <Panel title="SQL文簡易作成">
      <div className="toolbar">
        <select
          onChange={(event) => setMode(event.target.value as SqlMode)}
          value={mode}
        >
          <option value="select">SELECT</option>
          <option value="insert">INSERT</option>
          <option value="update">UPDATE</option>
          <option value="create">CREATE TABLE</option>
        </select>
      </div>
      <Textarea label="テーブル名" onChange={setTable} rows={1} value={table} />
      {mode === "select" && (
        <>
          <Textarea
            label="カラム（カンマ区切り、空なら*）"
            onChange={setColumns}
            rows={1}
            value={columns}
          />
          <Textarea
            label="WHERE条件（1行1条件、AND連結）"
            onChange={setWhere}
            rows={3}
            value={where}
          />
          <Textarea label="ORDER BY" onChange={setOrderBy} rows={1} value={orderBy} />
        </>
      )}
      {mode === "insert" && (
        <Textarea
          label="カラム: 値（1行1ペア）"
          onChange={setInsertPairs}
          rows={5}
          value={insertPairs}
        />
      )}
      {mode === "update" && (
        <>
          <Textarea
            label="カラム: 値（1行1ペア）"
            onChange={setUpdatePairs}
            rows={5}
            value={updatePairs}
          />
          <Textarea
            label="WHERE条件（1行1条件、AND連結）"
            onChange={setUpdateWhere}
            rows={3}
            value={updateWhere}
          />
        </>
      )}
      {mode === "create" && (
        <Textarea
          label="カラム定義（1行1カラム）"
          onChange={setColumnDefs}
          rows={6}
          value={columnDefs}
        />
      )}
      <Result name="query.sql" value={sql} />
    </Panel>
  )
}

export const JsonValidatorTool: FC = () => {
  const [value, setValue] = useState(
    '{"name": "Restring", "tools": ["diff", "compare"]}',
  )
  const result = validateJson(value)

  return (
    <Panel title="JSON構文チェック">
      <Textarea label="JSON" onChange={setValue} rows={10} value={value} />
      <p className={result.valid ? "ok" : "warn"}>
        {result.valid ? "有効なJSON" : `構文エラー: ${result.error}`}
      </p>
      {!result.valid && result.location && (
        <p className="warn">
          {result.location.line}行目 {result.location.column}列目付近を確認
        </p>
      )}
      {result.valid && <Result name="formatted.json" value={result.formatted} />}
    </Panel>
  )
}
