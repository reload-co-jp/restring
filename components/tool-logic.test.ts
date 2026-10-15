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
  countText,
  decodeBytes,
  describeCron,
  encodeText,
  formatXml,
  hashText,
  type XmlNodeLike,
  parseDelimited,
  qrToSvg,
  stringifyDelimited,
  valueToXml,
  xmlToValue,
  locateXmlError,
  nextCronRuns,
  parseHexBytes,
  processLines,
  repairMojibake,
  convertWidth,
  toWareki,
  fromWareki,
  parseWareki,
  parseRadix,
  generatePassword,
  parseUrl,
} from "./tool-logic.ts"
import { searchTools } from "./tool-links.ts"

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJlc3RyaW5nIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjQxMDI0NDQ4MDB9.lSacD8mcneUOosKS6cU2e_oVWy5cNGp4d6eYWNyLbQw"

test("text diff", () => {
  assert.deepEqual(
    buildDiff(tokenize("a\nb", "line"), tokenize("a\nc", "line")),
    [
      { text: "a", type: "same" },
      { text: "b", type: "removed" },
      { text: "c", type: "added" },
    ]
  )
})

test("json structural diff ignores key order", () => {
  assert.deepEqual(diffJson({ a: 1, b: [1] }, { b: [1], a: 1 }), [])
  assert.deepEqual(
    diffJson({ a: 1, b: [1, 2] }, { a: 2, b: [1], "c-d": true }),
    [
      { path: "$.a", type: "changed", left: 1, right: 2 },
      { path: "$.b[1]", type: "removed", left: 2 },
      { path: '$["c-d"]', type: "added", right: true },
    ]
  )
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
  assert.ok(
    result.claims.some(
      ([label, text]) => label === "期限状態" && text === "期限内"
    )
  )
  assert.notEqual(parseJwt("abc").error, "")
  assert.equal(await verifyJwtSignature(jwt, "secret"), "署名一致")
  assert.equal(await verifyJwtSignature(jwt, "wrong"), "署名不一致")
})

test("encoders return errors instead of throwing", () => {
  assert.deepEqual(safeEncodeURIComponent("a b&"), {
    value: "a%20b%26",
    error: "",
  })
  assert.equal(safeDecodeURIComponent("%E3%81%82").value, "あ")
  assert.notEqual(safeDecodeURIComponent("%E3%81").error, "")
  assert.notEqual(safeEncodeURIComponent("\ud800").error, "")
  assert.equal(
    safeBase64Decode(safeBase64Encode("日本語").value).value,
    "日本語"
  )
  assert.equal(
    unescapeHtml(escapeHtml(`<a href="x">'&'</a>`)),
    `<a href="x">'&'</a>`
  )
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
    ]
  )
  assert.equal(result.replaced, "a# b#")
  assert.equal(testRegex("(", "", "", "").valid, false)
})

test("sql builder quotes strings only", () => {
  assert.equal(
    buildInsertSql("users", "name: O'Neil\nage: 3\nok: true\nx: null"),
    "INSERT INTO users (name, age, ok, x)\nVALUES ('O''Neil', 3, TRUE, NULL);"
  )
})

test("tool search", () => {
  assert.ok(searchTools("jwt").some((tool) => tool.href === "/jwt-decoder/"))
  assert.ok(
    searchTools("エンコード", "web").every((tool) => tool.category === "web")
  )
  assert.equal(searchTools("存在しないツール").length, 0)
})

test("character count", () => {
  assert.deepEqual(countText("aあ👨‍👩‍👧 b\n"), {
    graphemes: 6,
    withoutSpaces: 4,
    codePoints: 10,
    utf16: 13,
    utf8Bytes: 25,
    shiftJisBytes: 11,
    lines: 2,
    words: 3,
  })
})

test("legacy encodings round trip", () => {
  assert.deepEqual(
    encodeText("あ①ｱ", "shift_jis").bytes,
    [0x82, 0xa0, 0x87, 0x40, 0xb1]
  )
  assert.deepEqual(encodeText("あｱ", "euc-jp").bytes, [0xa4, 0xa2, 0x8e, 0xb1])
  assert.deepEqual(encodeText("😀", "shift_jis").unmappable, ["😀"])
  assert.equal(
    decodeBytes(parseHexBytes("%E3%81%82 0x82,0xa0"), "utf-8"),
    "あ\ufffd\ufffd"
  )
  assert.deepEqual(parseHexBytes("\\x82\\xa0"), [0x82, 0xa0])
  assert.throws(() => parseHexBytes("abc"))
})

test("mojibake repair", () => {
  const garbled = decodeBytes(encodeText("日本", "utf-8").bytes, "shift_jis")
  assert.ok(repairMojibake(garbled).some((item) => item.value === "日本"))
  const latin = decodeBytes(
    encodeText("こんにちは", "utf-8").bytes,
    "windows-1252"
  )
  assert.deepEqual(
    repairMojibake(latin).map((item) => item.value),
    ["こんにちは", "縺薙ｓ縺ｫ縺｡縺ｯ"]
  )
})

test("hash", async () => {
  assert.equal(await hashText("", "MD5"), "d41d8cd98f00b204e9800998ecf8427e")
  assert.equal(
    await hashText("The quick brown fox jumps over the lazy dog", "MD5"),
    "9e107d9d372bb6826bd81d3542a419d6"
  )
  assert.equal(
    await hashText("a".repeat(56), "MD5"),
    "3b0c8ac703f828b04c6c197006d17218"
  )
  assert.equal(
    await hashText("abc", "SHA-256"),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
  )
})

test("line processing", () => {
  const options = {
    order: "asc" as const,
    unique: true,
    removeEmpty: true,
    trim: true,
    ignoreCase: false,
    natural: true,
  }
  assert.deepEqual(processLines("item10\n item2\n\nitem2\nitem1", options), [
    "item1",
    "item2",
    "item10",
  ])
  assert.deepEqual(
    processLines("b\nA\na", { ...options, ignoreCase: true, order: "none" }),
    ["b", "A"]
  )
  assert.deepEqual(processLines("a\nb", { ...options, order: "reverse" }), [
    "b",
    "a",
  ])
})

test("cron", () => {
  const from = new Date(2026, 0, 1, 0, 0)
  const format = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
  assert.deepEqual(nextCronRuns("*/30 9-10 * * MON-FRI", from, 3).map(format), [
    "2026-1-1 9:0",
    "2026-1-1 9:30",
    "2026-1-1 10:0",
  ])
  // 日と曜日の両方指定はOR
  assert.deepEqual(nextCronRuns("0 0 15 * SUN", from, 2).map(format), [
    "2026-1-4 0:0",
    "2026-1-11 0:0",
  ])
  assert.deepEqual(nextCronRuns("@monthly", from, 1).map(format), [
    "2026-2-1 0:0",
  ])
  assert.deepEqual(nextCronRuns("0 0 30 2 *", from, 1), [])
  assert.equal(describeCron("0 9 * * 1-5")[4].value, "月, 火, 水, 木, 金")
  assert.throws(() => describeCron("60 * * * *"))
  assert.throws(() => describeCron("* * *"))
})

test("xml format and error location", () => {
  const text = (value: string): XmlNodeLike => ({
    nodeType: 3,
    nodeName: "#text",
    nodeValue: value,
    childNodes: [],
  })
  const element = (
    name: string,
    childNodes: XmlNodeLike[],
    attributes: XmlNodeLike["attributes"] = []
  ): XmlNodeLike => ({
    nodeType: 1,
    nodeName: name,
    nodeValue: null,
    childNodes,
    attributes,
  })
  const doc: XmlNodeLike = {
    nodeType: 9,
    nodeName: "#document",
    nodeValue: null,
    childNodes: [
      element("root", [
        text("\n  "),
        element("item", [text(" a & b ")], [{ name: "id", value: '1"' }]),
        {
          nodeType: 8,
          nodeName: "#comment",
          nodeValue: " note ",
          childNodes: [],
        },
        {
          nodeType: 4,
          nodeName: "#cdata-section",
          nodeValue: "<raw>",
          childNodes: [],
        },
        element("empty", []),
      ]),
    ],
  }
  const declaration = '<?xml version="1.0"?>'
  assert.equal(
    formatXml(doc, "  ", declaration),
    [
      declaration,
      "<root>",
      '  <item id="1&quot;">a &amp; b</item>',
      "  <!-- note -->",
      "  <![CDATA[<raw>]]>",
      "  <empty/>",
      "</root>",
    ].join("\n")
  )
  assert.equal(
    formatXml(doc, ""),
    '<root><item id="1&quot;">a &amp; b</item><!-- note --><![CDATA[<raw>]]><empty/></root>'
  )
  assert.deepEqual(
    locateXmlError(
      "error on line 3 at column 5: Opening and ending tag mismatch"
    ),
    {
      line: 3,
      column: 5,
    }
  )
  assert.deepEqual(
    locateXmlError(
      "XML Parsing Error: mismatched tag\nLine Number 2, Column 7:"
    ),
    {
      line: 2,
      column: 7,
    }
  )
  assert.deepEqual(
    locateXmlError("XML 解析エラー: タグの不一致\n行番号: 4, 列: 1:"),
    { line: 4, column: 1 }
  )
  assert.equal(locateXmlError("unknown"), null)
})

test("xml value conversion", () => {
  const node = (
    nodeType: number,
    nodeName: string,
    nodeValue: string | null,
    childNodes: XmlNodeLike[] = [],
    attributes: XmlNodeLike["attributes"] = []
  ): XmlNodeLike => ({ nodeType, nodeName, nodeValue, childNodes, attributes })
  const doc = node(9, "#document", null, [
    node(1, "catalog", null, [
      node(3, "#text", "\n  "),
      node(
        1,
        "book",
        null,
        [node(1, "title", null, [node(3, "#text", "A & B")])],
        [{ name: "id", value: "1" }]
      ),
      node(
        1,
        "book",
        null,
        [node(1, "title", null, [node(4, "#cdata-section", "C")])],
        [{ name: "id", value: "2" }]
      ),
      node(
        1,
        "note",
        null,
        [node(3, "#text", "memo")],
        [{ name: "lang", value: "ja" }]
      ),
      node(1, "empty", null),
    ]),
  ])
  const value = {
    catalog: {
      book: [
        { "@id": "1", title: "A & B" },
        { "@id": "2", title: "C" },
      ],
      note: { "@lang": "ja", "#text": "memo" },
      empty: "",
    },
  }
  assert.deepEqual(xmlToValue(doc), value)
  assert.equal(
    valueToXml(value),
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      "<catalog>",
      '  <book id="1">',
      "    <title>A &amp; B</title>",
      "  </book>",
      '  <book id="2">',
      "    <title>C</title>",
      "  </book>",
      '  <note lang="ja">memo</note>',
      "  <empty/>",
      "</catalog>",
    ].join("\n")
  )
  assert.equal(
    valueToXml([1, null]),
    '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <item>1</item>\n  <item/>\n</root>'
  )
  assert.equal(
    valueToXml({ a: 1, b: 2 }),
    '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <a>1</a>\n  <b>2</b>\n</root>'
  )
  assert.throws(() => valueToXml({ "1st": 1 }))
})

test("csv and tsv", () => {
  const rows = parseDelimited(
    '\ufeffname,note\r\n"Doe, J","say ""hi""\nbye"\nA,\n',
    ","
  )
  assert.deepEqual(rows, [
    { name: "Doe, J", note: 'say "hi"\nbye' },
    { name: "A", note: "" },
  ])
  assert.equal(
    stringifyDelimited(rows, ","),
    'name,note\n"Doe, J","say ""hi""\nbye"\nA,'
  )
  assert.deepEqual(parseDelimited(stringifyDelimited(rows, ","), ","), rows)
  assert.equal(
    stringifyDelimited([{ a: 1 }, { b: { c: true } }], "\t"),
    'a\tb\n1\t\n\t{"c":true}'
  )
  assert.throws(() => stringifyDelimited([1, 2], ","))
  assert.equal(
    stringifyDelimited(
      {
        catalog: {
          book: [
            { "@id": "1", title: "A" },
            { "@id": "2", title: "B" },
          ],
        },
      },
      ","
    ),
    "@id,title\n1,A\n2,B"
  )
  assert.equal(stringifyDelimited({ root: { item: { a: "1" } } }, ","), "a\n1")
  assert.equal(stringifyDelimited({ a: "1" }, ","), "a\n1")
  assert.throws(() => parseDelimited('a\n"b', ","))
})

test("qr svg", () => {
  const modules = [
    [true, true, false],
    [false, true, true],
    [true, false, true],
  ]
  assert.equal(
    qrToSvg(modules, "#000000", "#ffffff"),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 3" shape-rendering="crispEdges"><rect width="3" height="3" fill="#ffffff"/><path d="M0 0h2v1h-2zM1 1h2v1h-2zM0 2h1v1h-1zM2 2h1v1h-1z" fill="#000000"/></svg>'
  )
  assert.ok(!qrToSvg(modules, "#000000", "").includes("<rect"))
})

test("width conversion", () => {
  assert.equal(convertWidth("ＡＢＣ１２３！　", "half"), "ABC123! ")
  assert.equal(convertWidth("AB1! ｶﾞｷﾞｸﾞ", "full"), "ＡＢ１！　ガギグ")
  assert.equal(convertWidth("ひらがなゔ", "katakana"), "ヒラガナヴ")
  assert.equal(convertWidth("カタカナー", "hiragana"), "かたかなー")
})

test("wareki", () => {
  assert.equal(toWareki("2019-05-01")?.text, "令和元年5月1日")
  assert.equal(toWareki("2019-04-30")?.text, "平成31年4月30日")
  assert.equal(toWareki("1989-01-07")?.text, "昭和64年1月7日")
  assert.equal(toWareki("1800-01-01"), null)
  assert.equal(fromWareki("平成", 31, 4, 30), "2019-04-30")
  assert.equal(fromWareki("平成", 31, 5, 1), null)
  assert.equal(fromWareki("令和", 1, 2, 30), null)
  assert.equal(parseWareki("令和元年5月1日"), "2019-05-01")
  assert.equal(parseWareki("H31.4.30"), "2019-04-30")
  assert.equal(parseWareki("ｓ６４／１／７"), "1989-01-07")
  assert.equal(parseWareki("令和8年"), null)
})

test("radix parsing", () => {
  assert.equal(parseRadix("0xFF", 16), BigInt(255))
  assert.equal(parseRadix("1111_0000", 2), BigInt(240))
  assert.equal(parseRadix("-17", 8), -BigInt(15))
  assert.equal(parseRadix("12a", 10), null)
  assert.equal(
    parseRadix("ffffffffffffffffffff", 16)?.toString(10),
    "1208925819614629174706175"
  )
})

test("password generation", () => {
  const password = generatePassword(16, ["upper", "digit"], true)
  assert.equal(password.length, 16)
  assert.match(password, /^[A-HJ-NP-Z2-9]+$/)
  assert.match(password, /[A-Z]/)
  assert.match(password, /\d/)
  assert.equal(generatePassword(16, [], false), "")
})

test("url parsing", () => {
  const parsed = parseUrl("https://example.com:8080/a?q=%E6%97%A5&q=2#top")
  assert.equal(parsed?.url.port, "8080")
  assert.deepEqual(parsed?.params, [
    ["q", "日"],
    ["q", "2"],
  ])
  assert.equal(parseUrl("not a url"), null)
})
