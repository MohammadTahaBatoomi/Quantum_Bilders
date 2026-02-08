import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "../lib/api";
import { loadStoredUser, storeUser } from "./authStorage";

type UserContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  isHydrated: boolean;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    loadStoredUser()
      .then((stored) => {
        if (!isMounted) return;
        if (stored) {
          setUser(stored);
        }
      })
      .finally(() => {
        if (!isMounted) return;
        setIsHydrated(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    storeUser(user).catch(() => {});
  }, [isHydrated, user]);

  const value = useMemo(() => ({ user, setUser, isHydrated }), [isHydrated, user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
