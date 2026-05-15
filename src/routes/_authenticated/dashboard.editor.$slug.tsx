import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getTourBySlug, type Hotspot, type Scene } from "@/lib/mock-data";
import Pannellum360 from "@/components/site/Pannellum360";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, Save, Trash2, MousePointerClick, Image as ImageIcon, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/editor/$slug")({
  loader: ({ params }) => {
    const tour = getTourBySlug(params.slug);
    if (!tour) throw notFound();
    return { tour };
  },
  component: Editor,
});

function Editor() {
  const { tour } = Route.useLoaderData();
  const [scenes, setScenes] = useState<Scene[]>(tour.scenes);
  const [activeId, setActiveId] = useState(tour.defaultScene);
  const [pending, setPending] = useState<{ pitch: number; yaw: number } | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [hotspotType, setHotspotType] = useState<"info" | "scene">("info");
  const [hotspotText, setHotspotText] = useState("");
  const [hotspotTarget, setHotspotTarget] = useState<string>("");

  const active = scenes.find((s) => s.id === activeId)!;

  const handleCanvasClick = (pitch: number, yaw: number) => {
    setPending({ pitch, yaw });
    setHotspotText("");
    setHotspotTarget("");
    setHotspotType("info");
    setPopoverOpen(true);
  };

  const saveHotspot = () => {
    if (!pending || !hotspotText.trim()) return toast.error("Añade un texto");
    if (hotspotType === "scene" && !hotspotTarget) return toast.error("Selecciona la escena destino");
    const h: Hotspot = {
      id: `h_${Date.now()}`,
      pitch: pending.pitch,
      yaw: pending.yaw,
      type: hotspotType,
      text: hotspotText.trim(),
      sceneId: hotspotType === "scene" ? hotspotTarget : undefined,
    };
    setScenes((prev) => prev.map((s) => (s.id === activeId ? { ...s, hotSpots: [...s.hotSpots, h] } : s)));
    setPending(null);
    setPopoverOpen(false);
    toast.success("Hotspot guardado");
  };

  const removeHotspot = (id: string) => {
    setScenes((prev) => prev.map((s) => (s.id === activeId ? { ...s, hotSpots: s.hotSpots.filter((h) => h.id !== id) } : s)));
  };

  const generateSEO = async () => {
    toast.loading("Analizando con IA…", { id: "seo" });
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("SEO generado: \"Casa Frente al Lago en Táchira | 4 Hab | Cocina Italiana\"", { id: "seo", duration: 4000 });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Topbar */}
      <div className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></Link>
          <div>
            <div className="font-medium text-sm">{tour.titulo}</div>
            <div className="text-xs text-muted-foreground">Editor visual 360° · Doble clic para añadir hotspot</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={generateSEO}><Sparkles className="h-4 w-4" /> Auto-SEO con IA</Button>
          <Button size="sm" onClick={() => toast.success("Cambios guardados")}><Save className="h-4 w-4" /> Guardar</Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Visor */}
        <div className="flex-1 relative bg-neutral-900">
          <Pannellum360
            key={activeId}
            scenes={scenes}
            defaultScene={activeId}
            editable
            onCanvasClick={handleCanvasClick}
          />
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="absolute left-1/2 top-1/2 h-1 w-1 opacity-0 pointer-events-none" aria-hidden />
            </PopoverTrigger>
            <PopoverContent className="w-80" align="center">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Nuevo hotspot</h3>
                  <p className="text-xs text-muted-foreground">
                    pitch {pending?.pitch.toFixed(2)} · yaw {pending?.yaw.toFixed(2)}
                  </p>
                </div>
                <Tabs value={hotspotType} onValueChange={(v) => setHotspotType(v as any)}>
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="scene">Puerta</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="mt-3 space-y-2">
                    <Label>Texto informativo</Label>
                    <Input value={hotspotText} onChange={(e) => setHotspotText(e.target.value)} placeholder="Encimera de mármol…" />
                  </TabsContent>
                  <TabsContent value="scene" className="mt-3 space-y-2">
                    <Label>Etiqueta</Label>
                    <Input value={hotspotText} onChange={(e) => setHotspotText(e.target.value)} placeholder="Ir a la cocina" />
                    <Label>Escena destino</Label>
                    <Select value={hotspotTarget} onValueChange={setHotspotTarget}>
                      <SelectTrigger><SelectValue placeholder="Selecciona…" /></SelectTrigger>
                      <SelectContent>
                        {scenes.filter((s) => s.id !== activeId).map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TabsContent>
                </Tabs>
                <Button className="w-full" onClick={saveHotspot}>Guardar hotspot</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Sidebar derecha */}
        <aside className="w-80 border-l border-border bg-card overflow-y-auto">
          <div className="p-4 border-b border-border">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><ImageIcon className="h-3 w-3" /> Escenas</Label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {scenes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={`relative aspect-video overflow-hidden rounded-md border-2 ${activeId === s.id ? "border-accent" : "border-transparent hover:border-border"}`}
                >
                  <img src={s.panorama} alt={s.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                    <div className="text-[11px] text-white truncate">{s.title}</div>
                  </div>
                </button>
              ))}
              <button className="aspect-video rounded-md border-2 border-dashed border-border text-muted-foreground hover:bg-muted text-xs">+ Subir</button>
            </div>
          </div>

          <div className="p-4">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Hotspots de "{active.title}"</Label>
            <div className="mt-3 space-y-2">
              {active.hotSpots.length === 0 && (
                <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded-md">
                  <MousePointerClick className="h-5 w-5 mx-auto mb-2 opacity-50" />
                  Doble clic en el visor para añadir un hotspot
                </div>
              )}
              {active.hotSpots.map((h) => (
                <div key={h.id} className="flex items-start gap-2 rounded-md border border-border p-2.5 text-sm">
                  <Badge variant={h.type === "scene" ? "default" : "secondary"} className="mt-0.5 text-[10px]">{h.type}</Badge>
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{h.text}</div>
                    <div className="text-[10px] text-muted-foreground">p {h.pitch.toFixed(1)} · y {h.yaw.toFixed(1)}</div>
                  </div>
                  <button onClick={() => removeHotspot(h.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
