import { test } from "node:test"
import assert from "node:assert/strict"
import {
  buildDiff,
  buildInsertSql,
  convertLineEnding,
  diffJson,
  escapeHtml,
  normalizeText,
  parseFlexibleEpoch,
  parseJwt,
  safeBase64Decode,
  safeBase64Encode,
  safeDecodeURIComponent,
  safeEncodeURIComponent,
  testRegex,
  toCase,
  tokenize,
  unescapeHtml,
  validateJson,
  verifyJwtSignature,
} from "./tool-logic.ts"
import { searchTools } from "./tool-links.ts"

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJlc3RyaW5nIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjQxMDI0NDQ4MDB9.lSacD8mcneUOosKS6cU2e_oVWy5cNGp4d6eYWNyLbQw"

test("text diff", () => {
  assert.deepEqual(buildDiff(tokenize("a\nb", "line"), tokenize("a\nc", "line")), [
    { text: "a", type: "same" },
    { text: "b", type: "removed" },
    { text: "c", type: "added" },
  ])
})

test("json structural diff ignores key order", () => {
  assert.deepEqual(diffJson({ a: 1, b: [1] }, { b: [1], a: 1 }), [])
  assert.deepEqual(diffJson({ a: 1, b: [1, 2] }, { a: 2, b: [1], "c-d": true }), [
    { path: "$.a", type: "changed", left: 1, right: 2 },
    { path: "$.b[1]", type: "removed", left: 2 },
    { path: '$["c-d"]', type: "added", right: true },
  ])
})

test("json validator reports line and column", () => {
  assert.equal(validateJson('{"a":1}').valid, true)
  const result = validateJson('{\n  "a": 1,\n}')
  assert.equal(result.valid, false)
  assert.equal(result.location?.line, 3)
  assert.equal(validateJson("  ").error, "入力が空")
})

test("jwt decode and HMAC verification", async () => {
  const result = parseJwt(jwt)
  assert.equal(result.error, "")
  assert.equal(JSON.parse(result.payload).name, "Restring")
  assert.ok(result.claims.some(([label, text]) => label === "期限状態" && text === "期限内"))
  assert.notEqual(parseJwt("abc").error, "")
  assert.equal(await verifyJwtSignature(jwt, "secret"), "署名一致")
  assert.equal(await verifyJwtSignature(jwt, "wrong"), "署名不一致")
})

test("encoders return errors instead of throwing", () => {
  assert.deepEqual(safeEncodeURIComponent("a b&"), { value: "a%20b%26", error: "" })
  assert.equal(safeDecodeURIComponent("%E3%81%82").value, "あ")
  assert.notEqual(safeDecodeURIComponent("%E3%81").error, "")
  assert.notEqual(safeEncodeURIComponent("\ud800").error, "")
  assert.equal(safeBase64Decode(safeBase64Encode("日本語").value).value, "日本語")
  assert.equal(unescapeHtml(escapeHtml(`<a href="x">'&'</a>`)), `<a href="x">'&'</a>`)
})

test("string conversions", () => {
  assert.equal(normalizeText("  a   b\r\n"), "a b")
  assert.equal(convertLineEnding("a\r\nb\rc", "CRLF"), "a\r\nb\r\nc")
  assert.equal(toCase("hello Restring tool", "camel"), "helloRestringTool")
  assert.equal(toCase("helloRestring", "snake"), "hello_restring")
})

test("epoch parsing", () => {
  assert.equal(parseFlexibleEpoch("1700000000"), 1700000000000)
  assert.equal(parseFlexibleEpoch("1700000000000"), 1700000000000)
  assert.equal(parseFlexibleEpoch("2024-01-01T00:00:00Z"), 1704067200000)
  assert.equal(parseFlexibleEpoch("nope"), null)
})

test("regex tester", () => {
  const result = testRegex("(\\d)(\\d)?", "", "a12 b3", "#")
  assert.deepEqual(
    result.matches.map((m) => [m.match, m.index]),
    [
      ["12", 1],
      ["3", 5],
    ],
  )
  assert.equal(result.replaced, "a# b#")
  assert.equal(testRegex("(", "", "", "").valid, false)
})

test("sql builder quotes strings only", () => {
  assert.equal(
    buildInsertSql("users", "name: O'Neil\nage: 3\nok: true\nx: null"),
    "INSERT INTO users (name, age, ok, x)\nVALUES ('O''Neil', 3, TRUE, NULL);",
  )
})

test("tool search", () => {
  assert.ok(searchTools("jwt").some((tool) => tool.href === "/jwt-decoder/"))
  assert.ok(searchTools("エンコード", "web").every((tool) => tool.category === "web"))
  assert.equal(searchTools("存在しないツール").length, 0)
})
