import { llmConfig } from "@/config/llmConfig";
import type { LLMProvider } from "./llmTypes";
import { openaiProvider } from "./providers/openaiProvider";
import { anthropicProvider } from "./providers/anthropicProvider";
import { customProvider } from "./providers/customProvider";

const providers: Record<string, LLMProvider> = {
  openai: openaiProvider,
  anthropic: anthropicProvider,
  custom: customProvider,
};

export function getLLMClient(): LLMProvider {
  const provider = providers[llmConfig.provider] ?? openaiProvider;
  return provider;
}
