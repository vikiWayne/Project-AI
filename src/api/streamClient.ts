/**
 * Streaming HTTP client using axios config (baseURL, headers).
 * Uses fetch for the stream body (axios does not support ReadableStream in browser).
 */
import { apiClient } from "./client";

function getBaseUrl(): string {
  const base = apiClient.defaults.baseURL ?? "";
  return base.startsWith("http") ? base : `${window.location.origin}${base}`;
}

/** Yields raw SSE data strings (content after "data: "). Caller parses JSON. */
export async function* streamPost(path: string, body: unknown): AsyncGenerator<string> {
  const url = `${getBaseUrl()}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(apiClient.defaults.headers.common as Record<string, string>),
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`Stream failed: ${response.status}`);
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") return;
        yield data;
      }
    }
  }
}
