import { env } from "./env";

export type LLMProviderType = "openai" | "anthropic" | "custom";

export const llmConfig = {
  provider: env.LLM_PROVIDER as LLMProviderType,
  apiBaseUrl: env.API_BASE_URL,
  enableStreaming: env.ENABLE_STREAMING,
} as const;
