import { Platform } from "react-native";

/**
 * Tiny cross-platform key/value storage:
 *  - web    → localStorage
 *  - native → AsyncStorage (falls back to in-memory if the module is missing)
 */

let AS: any = null;
if (Platform.OS !== "web") {
  try {
    AS = require("@react-native-async-storage/async-storage").default;
  } catch {
    AS = null;
  }
}

const memory: Record<string, string> = {};

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return (globalThis as any).localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
  if (AS) {
    try {
      return await AS.getItem(key);
    } catch {
      return null;
    }
  }
  return memory[key] ?? null;
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      (globalThis as any).localStorage?.setItem(key, value);
    } catch {}
    return;
  }
  if (AS) {
    try {
      await AS.setItem(key, value);
    } catch {}
    return;
  }
  memory[key] = value;
}
