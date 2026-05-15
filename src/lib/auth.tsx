import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = {
  id: number;
  nombre: string;
  email: string;
  rol: "broker" | "admin";
  plan: "free" | "pro" | "ultra";
  avatar: string;
};

type AuthCtx = {
  user: User | null;
  isAuthed: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "360_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  const login = async (email: string, _password: string) => {
    const u: User = {
      id: 104,
      nombre: email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()) || "Broker",
      email,
      rol: "broker",
      plan: "ultra",
      avatar: "https://i.pravatar.cc/120?img=12",
    };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, isAuthed: !!user, hydrated, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};
