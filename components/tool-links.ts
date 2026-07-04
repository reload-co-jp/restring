export const toolLinks = [
  {
    href: "/text-compare/",
    title: "テキスト比較",
    description: "2つの文字列を行・単語・文字単位で比較。インライン表示と左右表示に対応。",
    usage: [
      "比較元と比較先へ文字列を貼り付ける。",
      "行単位、単語単位、文字単位から比較粒度を選ぶ。",
      "必要に応じてスペース、改行、タブ、大文字小文字を無視する。",
    ],
    mechanism: [
      "入力を指定粒度で分割し、共通部分と追加・削除部分を計算。",
      "インライン表示では差分箇所を色分けし、左右表示では正規化後の内容を並べる。",
    ],
    shell: [
      {
        label: "行単位で比較",
        environment: "diff（macOS/Linux標準搭載が多い）",
        command: "diff -u before.txt after.txt",
      },
    ],
  },
  {
    href: "/json-compare/",
    title: "JSON比較",
    description: "JSONを検証し、整形表示。キー順を無視して構造比較。",
    usage: [
      "JSON AとJSON Bへ比較対象を貼り付ける。",
      "構文エラーがある場合はエラーメッセージを確認する。",
      "整形済みJSONと構造一致・不一致を確認する。",
    ],
    mechanism: [
      "JSON.parseで構文検証し、成功した値をインデント付きで表示。",
      "オブジェクトのキーを再帰的にソートしてから比較するため、キー順だけの違いは無視。",
    ],
    shell: [
      {
        label: "キー順を揃えて比較",
        environment: "jq、diff、bash/zshなどプロセス置換に対応したシェル",
        command: "diff -u <(jq -S . a.json) <(jq -S . b.json)",
      },
    ],
  },
  {
    href: "/jwt-decoder/",
    title: "JWT解析",
    description: "JWTのHeader、Payload、署名部分を分解し、exp、nbf、iatなどのクレームを確認。",
    usage: [
      "JWT文字列を入力する。",
      "HeaderとPayloadのJSONを確認する。",
      "exp、nbf、iatなどの時刻クレームと有効期限状態を確認する。",
    ],
    mechanism: [
      "JWTをドット区切りでHeader、Payload、Signatureへ分割。",
      "HeaderとPayloadをBase64URLデコードし、JSONとして整形表示。",
      "署名検証は行わないため、正当性確認には公開鍵または共有シークレットで別途検証が必要。",
    ],
    shell: [
      {
        label: "HeaderとPayloadをデコード",
        environment: "Python 3",
        command:
          "python3 -c 'import base64,json,sys; t=sys.stdin.read().strip().split(\".\"); dec=lambda s: json.dumps(json.loads(base64.urlsafe_b64decode(s+\"=\"*((4-len(s)%4)%4))),ensure_ascii=False,indent=2); print(\"Header:\\n\"+dec(t[0])+\"\\nPayload:\\n\"+dec(t[1]))'",
      },
    ],
  },
  {
    href: "/text-diff/",
    title: "テキスト差分",
    description: "追加・削除された差分だけ抽出。",
    usage: [
      "比較元と比較先を入力する。",
      "比較粒度と無視オプションを選ぶ。",
      "追加・削除された要素だけ確認する。",
    ],
    mechanism: [
      "テキスト比較と同じ差分計算を使い、同一部分を除外。",
      "差分結果を追加・削除ラベル付きで抽出表示。",
    ],
    shell: [
      {
        label: "追加・削除行だけ表示",
        environment: "diff、sed（macOS/Linux標準搭載が多い）",
        command: "diff -u before.txt after.txt | sed -n '/^[+-][^+-]/p'",
      },
    ],
  },
  {
    href: "/text-normalize/",
    title: "テキスト正規化",
    description: "前後空白削除、連続スペース圧縮、Unicode正規化、改行統一。",
    usage: [
      "入力欄へ整えたい文字列を貼り付ける。",
      "出力欄で正規化結果を確認する。",
      "コピーまたは保存で再利用する。",
    ],
    mechanism: [
      "UnicodeをNFCへ正規化。",
      "連続する空白を1文字に圧縮し、CRLF/CRをLFへ統一して前後空白を削除。",
    ],
    shell: [
      {
        label: "空白・改行・Unicodeを正規化",
        environment: "Python 3",
        command:
          "python3 -c 'import re,sys,unicodedata; s=sys.stdin.read().replace(\"\\r\\n\",\"\\n\").replace(\"\\r\",\"\\n\"); s=unicodedata.normalize(\"NFC\",s); print(re.sub(r\"[^\\S\\r\\n]+\",\" \",s).strip())' < input.txt",
      },
    ],
  },
  {
    href: "/invisible-character-viewer/",
    title: "不可視文字ビューア",
    description: "スペース、タブ、CR、LF、NBSP、ゼロ幅スペースを可視化。",
    usage: [
      "不可視文字を含む文字列を入力する。",
      "出力欄でスペース、タブ、改行などの位置を確認する。",
      "コピーして調査メモやレビューに使う。",
    ],
    mechanism: [
      "文字列を1文字ずつ走査し、不可視文字を読みやすい名前へ置換。",
      "通常文字はそのまま残すため、混入箇所を文脈付きで確認可能。",
    ],
    shell: [
      {
        label: "不可視文字を名前へ置換",
        environment: "Python 3",
        command:
          "python3 -c 'import sys; m={\" \":\"<Space>\",\"\\t\":\"<Tab>\",\"\\r\":\"<CR>\",\"\\n\":\"<LF>\\n\",\"\\u00a0\":\"<NBSP>\",\"\\u200b\":\"<ZWSP>\"}; print(\"\".join(m.get(c,c) for c in sys.stdin.read()))' < input.txt",
      },
    ],
  },
  {
    href: "/line-ending-converter/",
    title: "改行コード変換",
    description: "LF、CRLF、CRへ改行コードを変換。",
    usage: [
      "変換したいテキストを入力する。",
      "LF、CRLF、CRから出力形式を選ぶ。",
      "結果をコピーまたは保存する。",
    ],
    mechanism: [
      "入力中のCRLF/CRを一度LFへ統一。",
      "選択された改行コードへLFを置換して出力。",
    ],
    shell: [
      {
        label: "CRLFへ変換",
        environment: "Python 3",
        command:
          "python3 -c 'import sys; s=sys.stdin.read().replace(\"\\r\\n\",\"\\n\").replace(\"\\r\",\"\\n\"); sys.stdout.write(s.replace(\"\\n\",\"\\r\\n\"))' < input.txt > output.txt",
      },
    ],
  },
  {
    href: "/case-converter/",
    title: "ケース変換",
    description: "UPPERCASE、lowercase、camelCase、PascalCase、snake_case、kebab-caseへ変換。",
    usage: [
      "変換したい文字列を入力する。",
      "出力したいケース形式を選ぶ。",
      "変数名、ファイル名、URL slug作成に使う。",
    ],
    mechanism: [
      "空白、ハイフン、アンダースコア、camelCase境界で単語へ分割。",
      "単語を小文字化し、選択形式に応じて連結・大文字化。",
    ],
    shell: [
      {
        label: "snake_caseへ変換",
        environment: "Python 3",
        command:
          "python3 -c 'import re,sys; s=sys.stdin.read().strip(); s=re.sub(r\"([a-z0-9])([A-Z])\",r\"\\1 \\2\",s); print(\"_\".join(w.lower() for w in re.split(r\"[\\s_-]+\",s) if w))'",
      },
    ],
  },
  {
    href: "/url-encode-decode/",
    title: "URLエンコード・デコード",
    description: "URLコンポーネントをエンコード・デコード。",
    usage: [
      "URLパラメータや日本語文字列を入力する。",
      "エンコード結果とデコード結果を確認する。",
      "API検証やクエリ文字列作成に使う。",
    ],
    mechanism: [
      "encodeURIComponentでURLに安全な表現へ変換。",
      "decodeURIComponentでパーセントエンコード文字列を復元。",
    ],
    shell: [
      {
        label: "URLエンコード",
        environment: "Python 3",
        command:
          "python3 -c 'import sys,urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip(), safe=\"\"))'",
      },
      {
        label: "URLデコード",
        environment: "Python 3",
        command:
          "python3 -c 'import sys,urllib.parse; print(urllib.parse.unquote(sys.stdin.read().strip()))'",
      },
    ],
  },
  {
    href: "/base64/",
    title: "Base64",
    description: "Base64文字列をエンコード・デコード。",
    usage: [
      "文字列またはBase64文字列を入力する。",
      "エンコード結果とデコード結果を確認する。",
      "設定値や軽量データの確認に使う。",
    ],
    mechanism: [
      "UTF-8バイト列をBase64へ変換。",
      "Base64入力はバイト列へ戻し、UTF-8文字列として復元。",
    ],
    shell: [
      {
        label: "Base64エンコード",
        environment: "Python 3",
        command:
          "python3 -c 'import base64,sys; print(base64.b64encode(sys.stdin.buffer.read()).decode())'",
      },
      {
        label: "Base64デコード",
        environment: "Python 3",
        command:
          "python3 -c 'import base64,sys; sys.stdout.buffer.write(base64.b64decode(sys.stdin.read()))'",
      },
    ],
  },
  {
    href: "/html-escape/",
    title: "HTMLエスケープ",
    description: "HTML特殊文字をエスケープ・アンエスケープ。",
    usage: [
      "HTMLとして扱いたい文字列を入力する。",
      "エスケープ結果とアンエスケープ結果を確認する。",
      "記事、テンプレート、コード例の表示前確認に使う。",
    ],
    mechanism: [
      "&、<、>、ダブルクォート、シングルクォートをHTMLエンティティへ置換。",
      "既知のHTMLエンティティは対応する文字へ戻す。",
    ],
    shell: [
      {
        label: "HTMLエスケープ",
        environment: "Python 3",
        command:
          "python3 -c 'import html,sys; print(html.escape(sys.stdin.read(), quote=True))'",
      },
      {
        label: "HTMLアンエスケープ",
        environment: "Python 3",
        command:
          "python3 -c 'import html,sys; print(html.unescape(sys.stdin.read()))'",
      },
    ],
  },
  {
    href: "/unicode-inspector/",
    title: "Unicodeインスペクタ",
    description: "コードポイント、UTF表現、文字名、Unicodeブロックを確認。",
    usage: [
      "調べたい文字列を入力する。",
      "各文字のコードポイント、UTF-8、UTF-16、UTF-32を確認する。",
      "文字化け、異体字、不可視文字の調査に使う。",
    ],
    mechanism: [
      "入力をUnicodeコードポイント単位で分解。",
      "各文字をUTF表現へ変換し、代表的なUnicodeブロック名と併せて表示。",
    ],
    shell: [
      {
        label: "コードポイントと文字名を表示",
        environment: "Python 3",
        command:
          "python3 -c 'import sys,unicodedata; [print(f\"{c}\\tU+{ord(c):04X}\\t{unicodedata.name(c, \"UNKNOWN\")}\") for c in sys.stdin.read()]'",
      },
    ],
  },
]
