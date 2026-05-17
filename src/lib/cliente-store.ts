import { useEffect, useState } from "react";

export type Visita = {
  id: string;
  tourSlug: string;
  tourTitulo: string;
  brokerNombre: string;
  fecha: string; // ISO date
  hora: string;
  modalidad: "presencial" | "virtual";
  mensaje?: string;
  estado: "pendiente" | "confirmada" | "cancelada";
  creada: string;
};

export type Mensaje = {
  id: string;
  autor: "cliente" | "broker";
  texto: string;
  ts: number;
};

export type Conversacion = {
  id: string;
  tourSlug: string;
  tourTitulo: string;
  brokerNombre: string;
  brokerAvatar: string;
  mensajes: Mensaje[];
};

const FAV_KEY = "360_cliente_favs";
const VIS_KEY = "360_cliente_visitas";
const MSG_KEY = "360_cliente_chats";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  } catch {}
}

export function useFavoritos() {
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    setFavs(read<string[]>(FAV_KEY, []));
    const h = () => setFavs(read<string[]>(FAV_KEY, []));
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);
  const toggle = (slug: string) => {
    const next = favs.includes(slug) ? favs.filter((s) => s !== slug) : [...favs, slug];
    setFavs(next);
    write(FAV_KEY, next);
  };
  return { favs, toggle, isFav: (s: string) => favs.includes(s) };
}

export function useVisitas() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  useEffect(() => {
    setVisitas(read<Visita[]>(VIS_KEY, []));
    const h = () => setVisitas(read<Visita[]>(VIS_KEY, []));
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);
  const add = (v: Omit<Visita, "id" | "estado" | "creada">) => {
    const nv: Visita = { ...v, id: crypto.randomUUID(), estado: "pendiente", creada: new Date().toISOString() };
    const next = [nv, ...visitas];
    setVisitas(next);
    write(VIS_KEY, next);
    return nv;
  };
  const cancel = (id: string) => {
    const next = visitas.map((v) => (v.id === id ? { ...v, estado: "cancelada" as const } : v));
    setVisitas(next);
    write(VIS_KEY, next);
  };
  return { visitas, add, cancel };
}

export function useChats() {
  const [chats, setChats] = useState<Conversacion[]>([]);
  useEffect(() => {
    setChats(read<Conversacion[]>(MSG_KEY, []));
    const h = () => setChats(read<Conversacion[]>(MSG_KEY, []));
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);
  const send = (
    conv: { tourSlug: string; tourTitulo: string; brokerNombre: string; brokerAvatar: string },
    texto: string,
  ) => {
    const existing = chats.find((c) => c.tourSlug === conv.tourSlug);
    const msg: Mensaje = { id: crypto.randomUUID(), autor: "cliente", texto, ts: Date.now() };
    let next: Conversacion[];
    if (existing) {
      next = chats.map((c) =>
        c.tourSlug === conv.tourSlug ? { ...c, mensajes: [...c.mensajes, msg] } : c,
      );
    } else {
      next = [
        {
          id: crypto.randomUUID(),
          ...conv,
          mensajes: [
            {
              id: crypto.randomUUID(),
              autor: "broker",
              texto: `¡Hola! Soy ${conv.brokerNombre}. Cuéntame qué te gustaría saber sobre ${conv.tourTitulo}.`,
              ts: Date.now() - 60000,
            },
            msg,
          ],
        },
        ...chats,
      ];
    }
    setChats(next);
    write(MSG_KEY, next);
    // Simulated broker auto-reply
    setTimeout(() => {
      const current = read<Conversacion[]>(MSG_KEY, []);
      const reply: Mensaje = {
        id: crypto.randomUUID(),
        autor: "broker",
        texto: "Gracias por escribir. En unos minutos te respondo con más detalles 🙌",
        ts: Date.now(),
      };
      const updated = current.map((c) =>
        c.tourSlug === conv.tourSlug ? { ...c, mensajes: [...c.mensajes, reply] } : c,
      );
      write(MSG_KEY, updated);
    }, 1400);
  };
  return { chats, send };
}