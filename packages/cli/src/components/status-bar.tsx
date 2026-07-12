import { TextAttributes } from "@opentui/core";
import { DEFAULT_CHAT_MODEL_ID } from "@nightcode/shared";
import { useTheme } from "../providers/theme";

export function StatusBar() {
  const { colors } = useTheme();
  return (
    <box flexDirection="row" gap={1}>
      <text fg={colors.primary}>Build</text>
      <text attributes={TextAttributes.DIM} fg={colors.dimSeparator}>
        &#8250;
      </text>
      <text>{DEFAULT_CHAT_MODEL_ID}</text>
    </box>
  );
}
