export function splitTextByDash(text: string): string[] {
  if (!text.includes("-")) {
    return [text];
  }
  return text
    .split("-")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

export function formatTextWithNewlines(text: string): string {
  return splitTextByDash(text).join("\n");
}

