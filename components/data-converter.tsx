"use client"

import { FC, useState } from "react"
import { parse, stringify } from "yaml"
import {
  parseDelimited,
  stringifyDelimited,
  valueToXml,
  xmlToValue,
} from "components/tool-logic"
import {
  ActionButton,
  Panel,
  Result,
  Segmented,
  TextArea,
  parseXml,
} from "components/tools"

export type DataFormat = "json" | "yaml" | "xml" | "csv" | "tsv"

const formats: Array<{ value: DataFormat; label: string; extension: string }> =
  [
    { value: "json", label: "JSON", extension: "json" },
    { value: "yaml", label: "YAML", extension: "yaml" },
    { value: "xml", label: "XML", extension: "xml" },
    { value: "csv", label: "CSV", extension: "csv" },
    { value: "tsv", label: "TSV", extension: "tsv" },
  ]

const samples: Record<DataFormat, string> = {
  json: '[\n  {"name": "Restring", "category": "dev"},\n  {"name": "YAML", "category": "format"}\n]',
  yaml: "- name: Restring\n  category: dev\n- name: YAML\n  category: format\n",
  xml: '<?xml version="1.0" encoding="UTF-8"?>\n<tools>\n  <tool id="1">\n    <name>Restring</name>\n  </tool>\n  <tool id="2">\n    <name>YAML</name>\n  </tool>\n</tools>',
  csv: "name,category\nRestring,dev\nYAML,format",
  tsv: "name\tcategory\nRestring\tdev\nYAML\tformat",
}

const parsers: Record<DataFormat, (value: string) => unknown> = {
  json: (value) => JSON.parse(value),
  yaml: (value) => parse(value),
  xml: (value) => {
    const parsed = parseXml(value)
    if (!parsed.doc) throw new Error(parsed.error)
    return xmlToValue(parsed.doc)
  },
  csv: (value) => parseDelimited(value, ","),
  tsv: (value) => parseDelimited(value, "\t"),
}

const stringifiers: Record<DataFormat, (value: unknown) => string> = {
  json: (value) => JSON.stringify(value, null, 2) ?? "",
  yaml: (value) => stringify(value),
  xml: (value) => valueToXml(value),
  csv: (value) => stringifyDelimited(value, ","),
  tsv: (value) => stringifyDelimited(value, "\t"),
}

const convert = (value: string, from: DataFormat, to: DataFormat) => {
  try {
    return { value: stringifiers[to](parsers[from](value)), error: "" }
  } catch (error) {
    return {
      value: "",
      error: error instanceof Error ? error.message : "変換失敗",
    }
  }
}

export const DataConverterTool: FC<{ from?: DataFormat; to?: DataFormat }> = ({
  from: initialFrom = "json",
  to: initialTo = "yaml",
}) => {
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)
  const [value, setValue] = useState(samples[initialFrom])
  const result = convert(value, from, to)
  const label = (format: DataFormat) =>
    formats.find((item) => item.value === format)?.label ?? ""

  return (
    <Panel
      description="XMLの属性は「@名前」、テキストは「#text」のキーに対応。CSV・TSVは1行目を見出しとして扱う。"
      title="データ形式変換"
    >
      <div className="toolbar">
        <Segmented
          label="入力形式"
          onChange={(next) => {
            // サンプルのままなら新しい形式のサンプルに差し替える
            if (value === samples[from]) setValue(samples[next])
            setFrom(next)
          }}
          options={formats}
          value={from}
        />
        <ActionButton
          disabled={Boolean(result.error)}
          onClick={() => {
            setFrom(to)
            setTo(from)
            setValue(result.value)
          }}
          title="入力形式と出力形式を入れ替え、変換結果を入力にする"
        >
          ⇄ 入れ替え
        </ActionButton>
        <Segmented
          label="出力形式"
          onChange={setTo}
          options={formats}
          value={to}
        />
      </div>
      <div className="twoColumn">
        <TextArea
          label={`入力（${label(from)}）`}
          onChange={setValue}
          rows={14}
          sample={samples[from]}
          value={value}
        />
        <Result
          error={result.error}
          label={`出力（${label(to)}）`}
          name={`converted.${formats.find((item) => item.value === to)?.extension}`}
          value={result.value}
        />
      </div>
    </Panel>
  )
}
