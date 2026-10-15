"use client"

import { FC, useState } from "react"
import { parse, stringify } from "yaml"
import { Panel, Result, Segmented, TextArea } from "components/tools"

type Direction = "yaml-to-json" | "json-to-yaml"

const samples: Record<Direction, string> = {
  "yaml-to-json": "name: Restring\ntools:\n  - diff\n  - yaml\n",
  "json-to-yaml": '{"name": "Restring", "tools": ["diff", "yaml"]}',
}

const convert = (value: string, direction: Direction) => {
  try {
    const output =
      direction === "yaml-to-json"
        ? JSON.stringify(parse(value), null, 2)
        : stringify(JSON.parse(value))
    return { value: output ?? "", error: "" }
  } catch (error) {
    return {
      value: "",
      error: error instanceof Error ? error.message : "変換失敗",
    }
  }
}

export const YamlJsonConverterTool: FC = () => {
  const [direction, setDirection] = useState<Direction>("yaml-to-json")
  const [value, setValue] = useState(samples["yaml-to-json"])
  const result = convert(value, direction)

  return (
    <Panel title="YAML・JSON変換">
      <Segmented
        label="変換方向"
        onChange={(next) => {
          // 変換結果を次の入力に引き継ぐ
          setDirection(next)
          setValue(result.error ? samples[next] : result.value)
        }}
        options={[
          { value: "yaml-to-json", label: "YAML → JSON" },
          { value: "json-to-yaml", label: "JSON → YAML" },
        ]}
        value={direction}
      />
      <div className="twoColumn">
        <TextArea
          label={direction === "yaml-to-json" ? "YAML" : "JSON"}
          onChange={setValue}
          rows={12}
          sample={samples[direction]}
          value={value}
        />
        <Result
          error={result.error}
          label={direction === "yaml-to-json" ? "JSON" : "YAML"}
          name={
            direction === "yaml-to-json" ? "converted.json" : "converted.yaml"
          }
          value={result.value}
        />
      </div>
    </Panel>
  )
}
