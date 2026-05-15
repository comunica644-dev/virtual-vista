import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TOURS } from "@/lib/mock-data";
import Pannellum360 from "@/components/site/Pannellum360";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, Lock, Unlock, Copy, Users, Radio, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/live")({
  component: LivePresenter,
});

const FAKE_USERS = [
  { id: 1, name: "Ana López", avatar: "https://i.pravatar.cc/40?img=5" },
  { id: 2, name: "Carlos R.", avatar: "https://i.pravatar.cc/40?img=15" },
  { id: 3, name: "María G.", avatar: "https://i.pravatar.cc/40?img=25" },
];

function makeCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function LivePresenter() {
  const [tour, setTour] = useState(TOURS[0]);
  const [code] = useState(makeCode);
  const [muted, setMuted] = useState(false);
  const [forceFollow, setForceFollow] = useState(true);
  const [users] = useState(FAKE_USERS);
  const [messages, setMessages] = useState<{ id: number; user: string; text: string }[]>([
    { id: 1, user: "Ana López", text: "¡Listos para el tour!" },
  ]);
  const [draft, setDraft] = useState("");
  const viewerRef = useRef<any>(null);
  const [emittedFrames, setEmittedFrames] = useState(0);

  useEffect(() => {
    if (!forceFollow) return;
    const id = setInterval(() => setEmittedFrames((n) => n + 1), 100);
    return () => clearInterval(id);
  }, [forceFollow]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), user: "Tú (presentador)", text: draft.trim() }]);
    setDraft("");
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Radio className="h-4 w-4 text-accent animate-pulse" />
          <div>
            <div className="font-medium text-sm">Sesión guiada en vivo</div>
            <div className="text-xs text-muted-foreground">{tour.titulo}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5"><Users className="h-3 w-3" /> {users.length} conectados</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { navigator.clipboard.writeText(code); toast.success(`Código copiado: ${code}`); }}
          >
            <Copy className="h-3.5 w-3.5" /> Código: <span className="font-mono ml-1">{code}</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative bg-neutral-900">
          <Pannellum360
            scenes={tour.scenes}
            defaultScene={tour.defaultScene}
            viewerRef={(v) => (viewerRef.current = v)}
            onSceneChange={(id) => toast(`Cambio de escena emitido: ${id}`, { duration: 1500 })}
          />

          {/* Floating presenter bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[min(900px,92%)]">
            <Card className="px-4 py-3 shadow-elegant border-border/60 bg-card/95 backdrop-blur flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Sala</span>
                <span className="font-mono font-semibold tracking-wider">{code}</span>
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="flex -space-x-2">
                {users.map((u) => (
                  <img key={u.id} src={u.avatar} alt={u.name} title={u.name} className="h-7 w-7 rounded-full border-2 border-card object-cover" />
                ))}
              </div>
              <div className="h-6 w-px bg-border" />
              <Button variant={muted ? "destructive" : "outline"} size="sm" onClick={() => setMuted(!muted)}>
                {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {muted ? "Activar mic" : "Mutear"}
              </Button>
              <div className="flex items-center gap-2">
                <Switch id="force" checked={forceFollow} onCheckedChange={setForceFollow} />
                <Label htmlFor="force" className="text-xs flex items-center gap-1.5 cursor-pointer">
                  {forceFollow ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />} Forzar seguimiento
                </Label>
              </div>
              <div className="ml-auto text-[10px] text-muted-foreground font-mono">
                sync · {emittedFrames} frames
              </div>
            </Card>
          </div>
        </div>

        <aside className="w-80 border-l border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Inmueble</Label>
            <div className="mt-2 space-y-2">
              {TOURS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTour(t)}
                  className={`w-full flex items-center gap-2 rounded-md p-2 text-left text-sm transition ${tour.id === t.id ? "bg-accent/10 ring-1 ring-accent" : "hover:bg-muted"}`}
                >
                  <img src={t.portada_url} alt="" className="h-10 w-14 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{t.titulo}</div>
                    <div className="text-[10px] text-muted-foreground">{t.scenes.length} escenas</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-b border-border">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Compartir</Label>
            <p className="mt-2 text-xs text-muted-foreground">
              Comparte este enlace para que los espectadores se unan a la sesión:
            </p>
            <div className="mt-2 rounded-md bg-muted p-2 font-mono text-xs break-all">
              {typeof window !== "undefined" ? `${window.location.origin}/live/${code}` : `/live/${code}`}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-2 w-full">
              <Link to="/live/$code" params={{ code }} target="_blank">Abrir vista espectador</Link>
            </Button>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <Label className="px-4 pt-4 text-xs uppercase tracking-wider text-muted-foreground">Chat</Label>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {messages.map((m) => (
                <div key={m.id} className="text-sm">
                  <span className="text-xs font-medium text-muted-foreground">{m.user}: </span>
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={send} className="p-3 border-t border-border flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Mensaje…"
                className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button size="icon" type="submit"><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
