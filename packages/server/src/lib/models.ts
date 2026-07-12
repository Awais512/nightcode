import { anthropic } from "@ai-sdk/anthropic";
import { deepseek } from "@ai-sdk/deepseek";
import { openai } from "@ai-sdk/openai";
import {
  findSupportedChatModel,
  type SupportedChatModel,
  type SupportedChatModalId,
  type SupportedProvider,
} from "@nightcode/shared";
import type { LanguageModel } from "ai";

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
};

function assertUnsupportedProvider(provider: never): never {
  throw new Error(`Unsupported provider: ${provider}`);
}

function resolveAnthropicModel(modelId: AnthropicModelId): ResolveModel {
  return {
    model: anthropic(modelId),
    provider: "anthropic",
    modelId,
  };
}

function resolveOpenAiModel(modelId: OpenAIModelId): ResolveModel {
  return {
    model: openai(modelId),
    provider: "openai",
    modelId,
  };
}

function resolveDeepseekModel(modelId: DeepseekModelId): ResolveModel {
  return {
    model: deepseek(modelId),
    provider: "deepseek",
    modelId,
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
