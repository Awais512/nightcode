import { anthropic } from "@ai-sdk/anthropic";
import { deepseek } from "@ai-sdk/deepseek";
import { openai } from "@ai-sdk/openai";
import type { DeepSeekLanguageModelChatOptions } from "@ai-sdk/deepseek";
import {
  findSupportedChatModel,
  type SupportedChatModel,
  type SupportedChatModalId,
  type SupportedProvider,
} from "@nightcode/shared";
import type { LanguageModel } from "ai";
import type { ProviderOptions } from "@ai-sdk/provider-utils";

type AnthropicModelId = Extract<
  SupportedChatModel,
  { provider: "anthropic" }
>["id"];

type OpenAIModelId = Extract<SupportedChatModel, { provider: "openai" }>["id"];

type DeepseekModelId = Extract<
  SupportedChatModel,
  { provider: "deepseek" }
>["id"];

export type ResolveModel = {
  model: LanguageModel;
  provider: SupportedProvider;
  modelId: SupportedChatModalId;
  providerOptions?: ProviderOptions;
};

const ANTHROPIC_PROVIDER_OPTIONS: Partial<
  Record<AnthropicModelId, ProviderOptions>
> = {
  "claude-opus-4-6": {
    anthropic: {
      thinking: {
        type: "enabled",
        budgetTokens: 10000,
      },
    },
  },
  "claude-sonnet-4-6": {
    anthropic: {
      thinking: {
        type: "enabled",
        budgetTokens: 10000,
      },
    },
  },
  "claude-haiku-4-5": {
    anthropic: {
      thinking: {
        type: "enabled",
        budgetTokens: 10000,
      },
    },
  },
};

const OPENAI_PROVIDER_OPTIONS: Partial<Record<OpenAIModelId, ProviderOptions>> =
  {
    "gpt-5-4": {
      openai: {
        thinking: {
          reasoningSummary: "detailed",
        },
      },
    },
  };

const DEEPSEEK_PROVIDER_OPTIONS: Partial<
  Record<DeepseekModelId, ProviderOptions>
> = {
  "deepseek-v4-flash": {
    deepseek: {
      thinking: { type: "enabled" },
      reasoningEffort: "max",
    } satisfies DeepSeekLanguageModelChatOptions,
  },
  "deepseek-v4-pro": {
    deepseek: {
      thinking: { type: "enabled" },
      reasoningEffort: "max",
    } satisfies DeepSeekLanguageModelChatOptions,
  },
};

function assertUnsupportedProvider(provider: never): never {
  throw new Error(`Unsupported provider: ${provider}`);
}

function resolveAnthropicModel(modelId: AnthropicModelId): ResolveModel {
  return {
    model: anthropic(modelId),
    provider: "anthropic",
    modelId,
    providerOptions: ANTHROPIC_PROVIDER_OPTIONS[modelId],
  };
}

function resolveOpenAiModel(modelId: OpenAIModelId): ResolveModel {
  return {
    model: openai(modelId),
    provider: "openai",
    modelId,
    providerOptions: OPENAI_PROVIDER_OPTIONS[modelId],
  };
}

function resolveDeepseekModel(modelId: DeepseekModelId): ResolveModel {
  return {
    model: deepseek(modelId),
    provider: "deepseek",
    modelId,
    providerOptions: DEEPSEEK_PROVIDER_OPTIONS[modelId],
  };
}

function resolveSupportedChatModel(model: SupportedChatModel): ResolveModel {
  const provider = model.provider;

  switch (provider) {
    case "anthropic":
      return resolveAnthropicModel(model.id);
    case "openai":
      return resolveOpenAiModel(model.id);
    case "deepseek":
      return resolveDeepseekModel(model.id);
    default:
      return assertUnsupportedProvider(provider);
  }
}

export function isSupportedChatModel(
  modelId: string,
): modelId is SupportedChatModalId {
  return findSupportedChatModel(modelId) != null;
}

export function resolveChatModel(modelId: string): ResolveModel {
  const model = findSupportedChatModel(modelId);
  if (!model) {
    throw new Error(`Unsupported model: ${model}`);
  }

  return resolveSupportedChatModel(model);
}
