export type DiffPart = {
  text: string
  type: "same" | "added" | "removed"
}

export type CompareUnit = "line" | "word" | "char"
export type CompareView = "inline" | "side"
export type LineEnding = "LF" | "CRLF" | "CR"
export type CaseMode =
  | "upper"
  | "lower"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"

export const normalizeForCompare = (
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

export const tokenize = (value: string, unit: CompareUnit) => {
  if (unit === "line") return value.split(/\r?\n|\r/)
  if (unit === "word") return value.match(/\S+|\s+/g) ?? []
  return Array.from(value)
}

export const buildDiff = (left: string[], right: string[]): DiffPart[] => {
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

export const formatPart = (part: DiffPart, unit: CompareUnit) =>
  unit === "line" ? `${part.text}\n` : part.text

export const parseJson = (value: string) => {
  try {
    return { data: JSON.parse(value), error: "" }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "JSONが不正",
    }
  }
}

export const stableJson = (value: unknown): unknown => {
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

export const normalizeText = (value: string) =>
  value
    .normalize("NFC")
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/\r\n|\r/g, "\n")
    .trim()

export const visibleText = (value: string) =>
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

export const convertLineEnding = (value: string, ending: LineEnding) => {
  const normalized = value.replace(/\r\n|\r/g, "\n")
  if (ending === "CRLF") return normalized.replace(/\n/g, "\r\n")
  if (ending === "CR") return normalized.replace(/\n/g, "\r")
  return normalized
}

export const words = (value: string) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase())

export const toCase = (value: string, mode: CaseMode) => {
  const list = words(value)
  const capitalized = list.map((word) => word.charAt(0).toUpperCase() + word.slice(1))

  if (mode === "upper") return value.toUpperCase()
  if (mode === "lower") return value.toLowerCase()
  if (mode === "camel") return [list[0] ?? "", ...capitalized.slice(1)].join("")
  if (mode === "pascal") return capitalized.join("")
  if (mode === "snake") return list.join("_")
  return list.join("-")
}

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

export const unescapeHtml = (value: string) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")

export const encodeUtf8 = (char: string) =>
  Array.from(new TextEncoder().encode(char))
    .map((byte) => byte.toString(16).toUpperCase().padStart(2, "0"))
    .join(" ")

export const encodeUtf16 = (char: string) =>
  Array.from({ length: char.length }, (_, index) =>
    char.charCodeAt(index).toString(16).toUpperCase().padStart(4, "0"),
  ).join(" ")

export const unicodeBlock = (codePoint: number) => {
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

export const unicodeName = (char: string, codePoint: number) => {
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

export const copyText = async (value: string) => {
  await navigator.clipboard.writeText(value)
}

export const downloadText = (name: string, value: string) => {
  const blob = new Blob([value], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

export type SafeResult = { value: string; error: string }

const attempt = (run: () => string, fallback: string): SafeResult => {
  try {
    return { value: run(), error: "" }
  } catch (error) {
    return { value: "", error: error instanceof Error ? error.message : fallback }
  }
}

export const safeEncodeURIComponent = (value: string) =>
  attempt(() => encodeURIComponent(value), "URLエンコード失敗")

export const safeDecodeURIComponent = (value: string) =>
  attempt(() => decodeURIComponent(value), "URLエンコードが不正")

export const safeBase64Encode = (value: string) =>
  attempt(() => {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(value, "utf-8").toString("base64")
    }
    return btoa(String.fromCharCode(...new TextEncoder().encode(value)))
  }, "Base64エンコード失敗")

export const safeBase64Decode = (value: string) =>
  attempt(() => {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(value, "base64").toString("utf-8")
    }
    const bytes = Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }, "Base64が不正")

export const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8")
  }

  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export const toBase64Url = (bytes: ArrayBuffer) => {
  const chars = Array.from(new Uint8Array(bytes), (byte) =>
    String.fromCharCode(byte),
  ).join("")
  return btoa(chars).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export const parseJwt = (value: string) => {
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

export const verifyJwtSignature = async (token: string, secret: string) => {
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

export const parseFlexibleEpoch = (raw: string) => {
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

export const formatEpochResult = (ms: number) => ({
  iso: new Date(ms).toISOString(),
  utc: new Date(ms).toUTCString(),
  local: new Date(ms).toLocaleString("ja-JP", { timeZoneName: "short" }),
  seconds: Math.floor(ms / 1000).toString(),
  milliseconds: Math.round(ms).toString(),
})

export type RegexMatch = {
  match: string
  index: number
  groups: Array<string | undefined>
}

export type RegexResult = {
  valid: boolean
  error: string
  matches: RegexMatch[]
  replaced: string
}

export const testRegex = (
  pattern: string,
  flags: string,
  input: string,
  replacement: string,
): RegexResult => {
  try {
    const execFlags = flags.includes("g") ? flags : `${flags}g`
    const execRegex = new RegExp(pattern, execFlags)
    const matches: RegexMatch[] = []
    let match: RegExpExecArray | null
    let guard = 0

    while ((match = execRegex.exec(input)) !== null && guard < 1000) {
      matches.push({ match: match[0], index: match.index, groups: match.slice(1) })
      if (match[0] === "") execRegex.lastIndex += 1
      guard += 1
    }

    const replaceRegex = new RegExp(pattern, execFlags)
    const replaced = input.replace(replaceRegex, replacement)

    return { valid: true, error: "", matches, replaced }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "正規表現が不正",
      matches: [],
      replaced: "",
    }
  }
}

export const locateJsonError = (value: string, message: string) => {
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

export const validateJson = (value: string) => {
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

export type SqlMode = "select" | "insert" | "update" | "create"

export const formatSqlValue = (raw: string) => {
  const trimmed = raw.trim()
  if (trimmed === "" || /^null$/i.test(trimmed)) return "NULL"
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return trimmed
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toUpperCase()
  return `'${trimmed.replace(/'/g, "''")}'`
}

export const parseKeyValueLines = (raw: string) =>
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

export const parseLines = (raw: string) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

export const buildSelectSql = (
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

export const buildInsertSql = (table: string, pairsRaw: string) => {
  const pairs = parseKeyValueLines(pairsRaw)
  const columns = pairs.map((pair) => pair.key).join(", ")
  const values = pairs.map((pair) => formatSqlValue(pair.value)).join(", ")
  return `INSERT INTO ${table.trim() || "table_name"} (${columns})\nVALUES (${values});`
}

export const buildUpdateSql = (table: string, pairsRaw: string, where: string) => {
  const pairs = parseKeyValueLines(pairsRaw)
  const setClause = pairs
    .map((pair) => `${pair.key} = ${formatSqlValue(pair.value)}`)
    .join(",\n  ")
  const whereClauses = parseLines(where)
  const lines = [`UPDATE ${table.trim() || "table_name"}`, `SET ${setClause}`]
  if (whereClauses.length > 0) lines.push(`WHERE ${whereClauses.join("\n  AND ")}`)
  return `${lines.join("\n")};`
}

export const buildCreateTableSql = (table: string, columnDefs: string) => {
  const lines = parseLines(columnDefs)
  const body = lines.map((line) => `  ${line}`).join(",\n")
  return `CREATE TABLE ${table.trim() || "table_name"} (\n${body}\n);`
}

export const fallbackTimeZones = [
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

export const getAllTimeZones = (): string[] => {
  if (typeof Intl.supportedValuesOf === "function") {
    try {
      return Intl.supportedValuesOf("timeZone")
    } catch {
      return fallbackTimeZones
    }
  }
  return fallbackTimeZones
}

export const formatInTimeZone = (date: Date, timeZone: string) => {
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

export type JsonDiff = {
  path: string
  type: "added" | "removed" | "changed"
  left?: unknown
  right?: unknown
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value)

// キー順を無視した構造差分。配列は添字単位で比較。
export const diffJson = (left: unknown, right: unknown, path = "$"): JsonDiff[] => {
  if (isObject(left) && isObject(right)) {
    const keys = Array.from(new Set([...Object.keys(left), ...Object.keys(right)])).sort()
    return keys.flatMap((key) => {
      const childPath = /^[A-Za-z_$][\w$]*$/.test(key)
        ? `${path}.${key}`
        : `${path}[${JSON.stringify(key)}]`
      if (!(key in right)) return [{ path: childPath, type: "removed" as const, left: left[key] }]
      if (!(key in left)) return [{ path: childPath, type: "added" as const, right: right[key] }]
      return diffJson(left[key], right[key], childPath)
    })
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    return Array.from({ length: Math.max(left.length, right.length) }, (_, index) => {
      const childPath = `${path}[${index}]`
      if (index >= right.length) return [{ path: childPath, type: "removed" as const, left: left[index] }]
      if (index >= left.length) return [{ path: childPath, type: "added" as const, right: right[index] }]
      return diffJson(left[index], right[index], childPath)
    }).flat()
  }
  return JSON.stringify(left) === JSON.stringify(right)
    ? []
    : [{ path, type: "changed", left, right }]
}
