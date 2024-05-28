export function stripHtml(html: string) {
  // 新しいDOMパーサーを作成
  const doc = new DOMParser().parseFromString(html, "text/html");
  // パースされたドキュメントからテキストを取得
  // パースされたドキュメントからテキストを取得し、30文字以上なら省略
  let textContent = doc.body.textContent || "";
  return textContent.length > 200
    ? textContent.substring(0, 200) + "..."
    : textContent;
}
