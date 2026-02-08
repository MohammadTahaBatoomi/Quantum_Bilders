import { Platform } from "react-native";
import type { User } from "../lib/api";

const USER_KEY = "qb:user";

export const loadStoredUser = async (): Promise<User | null> => {
  try {
    if (Platform.OS === "web") {
      if (typeof window === "undefined" || !window.localStorage) return null;
      const raw = window.localStorage.getItem(USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    }

    const SecureStore = (await import("expo-secure-store")) as any;
    const raw = await SecureStore.getItemAsync(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const storeUser = async (user: User | null): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      if (typeof window === "undefined" || !window.localStorage) return;
      if (!user) {
        window.localStorage.removeItem(USER_KEY);
        return;
      }
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      return;
    }

    const SecureStore = (await import("expo-secure-store")) as any;
    if (!user) {
      await SecureStore.deleteItemAsync(USER_KEY);
      return;
    }

    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch {
    // ignore persistence errors (app should still work)
  }
};
