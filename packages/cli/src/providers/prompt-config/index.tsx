import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import {
  DEFAULT_CHAT_MODEL_ID,
  findSupportedChatModel,
  type SupportedChatModalId,
} from "@nightcode/shared";
import { Mode } from "@nightcode/database";
import { readPreferences, writePreferences } from "../../lib/preferences";

type PromptConfigContextValue = {
  mode: Mode;
  toggleMode: () => void;
  setMode: (mode: Mode) => void;
  model: SupportedChatModalId;
  setModel: (model: SupportedChatModalId) => void;
};

const PromptConfigContext = createContext<PromptConfigContextValue | null>(
  null,
);

export function usePromptConfig(): PromptConfigContextValue {
  const value = useContext(PromptConfigContext);
  if (!value) {
    throw new Error(
      "usePromptConfig must be used within a PromptConfigProvider",
    );
  }

  return value;
}

type PromptConfigProviderProps = {
  children: ReactNode;
};

function getInitialModel(): SupportedChatModalId {
  const { modelId } = readPreferences();
  const model = modelId ? findSupportedChatModel(modelId) : null;

  return model ? model.id : DEFAULT_CHAT_MODEL_ID;
}

export function PromptConfigProvider({ children }: PromptConfigProviderProps) {
  const [mode, setMode] = useState<Mode>(Mode.BUILD);
  const [model, setModelState] = useState<SupportedChatModalId>(getInitialModel);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === Mode.BUILD ? Mode.PLAN : Mode.BUILD));
  }, []);

  const setModel = useCallback((nextModel: SupportedChatModalId) => {
    setModelState(nextModel);
    writePreferences({ modelId: nextModel });
  }, []);

  return (
    <PromptConfigContext.Provider
      value={{ mode, toggleMode, setMode, model, setModel }}
    >
      {children}
    </PromptConfigContext.Provider>
  );
}
