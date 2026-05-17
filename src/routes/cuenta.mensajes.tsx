import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useChats } from "@/lib/cliente-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";

export const Route = createFileRoute("/cuenta/mensajes")({
  component: Mensajes,
});

function Mensajes() {
  const { chats, send } = useChats();
  const [activeSlug, setActiveSlug] = useState<string | null>(chats[0]?.tourSlug ?? null);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeSlug && chats[0]) setActiveSlug(chats[0].tourSlug);
  }, [chats, activeSlug]);

  const active = chats.find((c) => c.tourSlug === activeSlug) ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9 });
  }, [active?.mensajes.length]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !text.trim()) return;
    send({ tourSlug: active.tourSlug, tourTitulo: active.tourTitulo, brokerNombre: active.brokerNombre, brokerAvatar: active.brokerAvatar }, text.trim());
    setText("");
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <h1 className="font-display text-4xl">Mensajes</h1>
      <p className="text-muted-foreground mt-1">Chat directo con los brokers.</p>

      {chats.length === 0 ? (
        <Card className="mt-8 p-10 text-center">
          <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No tienes conversaciones todavía.</p>
          <Button asChild className="mt-4"><Link to="/explorar">Explorar inmuebles</Link></Button>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-[280px_1fr] h-[640px]">
          <Card className="overflow-y-auto p-2">
            {chats.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveSlug(c.tourSlug)}
                className={`w-full text-left flex items-center gap-3 rounded-md p-3 transition ${activeSlug === c.tourSlug ? "bg-muted" : "hover:bg-muted/50"}`}
              >
                <img src={c.brokerAvatar} alt={c.brokerNombre} className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.brokerNombre}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.tourTitulo}</div>
                </div>
              </button>
            ))}
          </Card>
          <Card className="flex flex-col overflow-hidden">
            {active ? (
              <>
                <div className="border-b border-border px-5 py-3 flex items-center gap-3">
                  <img src={active.brokerAvatar} alt={active.brokerNombre} className="h-9 w-9 rounded-full object-cover" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{active.brokerNombre}</div>
                    <Link to="/tour/$slug" params={{ slug: active.tourSlug }} className="text-xs text-muted-foreground hover:text-foreground truncate block">
                      {active.tourTitulo}
                    </Link>
                  </div>
                </div>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
                  {active.mensajes.map((m) => (
                    <div key={m.id} className={`flex ${m.autor === "cliente" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.autor === "cliente" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        {m.texto}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={submit} className="border-t border-border p-3 flex gap-2">
                  <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe tu mensaje…" />
                  <Button type="submit"><Send className="h-4 w-4" /></Button>
                </form>
              </>
            ) : (
              <div className="flex-1 grid place-items-center text-sm text-muted-foreground">Selecciona una conversación</div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}