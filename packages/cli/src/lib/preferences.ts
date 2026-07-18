import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".nightcode");
const PREFERENCES_PATH = join(CONFIG_DIR, "preferences.json");

export type Preferences = {
  themeName?: string;
  modelId?: string;
};

export function readPreferences(): Preferences {
  try {
    return JSON.parse(readFileSync(PREFERENCES_PATH, "utf8")) as Preferences;
  } catch (error) {
    return {};
  }
}

export function writePreferences(preferences: Preferences) {
  try {
    mkdirSync(CONFIG_DIR, { recursive: true });
    writeFileSync(
      PREFERENCES_PATH,
      JSON.stringify({ ...readPreferences(), ...preferences }, null, 2),
      "utf8",
    );
  } catch (error) {}
}
