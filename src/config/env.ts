export const env = {
  LLM_PROVIDER: import.meta.env.VITE_LLM_PROVIDER || "openai",
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",
  ENABLE_STREAMING: import.meta.env.VITE_ENABLE_STREAMING !== "false",
} as const;
