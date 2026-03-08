export type StreamChunk = {
  type: "text" | "image" | "video" | "audio";
  content: string;
};

export function parseStreamChunk(chunk: string): StreamChunk | null {
  try {
    const trimmed = chunk.trim();
    if (!trimmed || trimmed === "[DONE]") return null;

    const lines = trimmed.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") return null;
        const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
        const content = parsed?.choices?.[0]?.delta?.content;
        if (content) {
          return { type: "text", content };
        }
      }
    }
  } catch {
    // Fallback: treat as raw text
    if (chunk.trim()) {
      return { type: "text", content: chunk };
    }
  }
  return null;
}
