import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, UploadCloud, Check, Image as ImageIcon, Star } from "lucide-react";
import Pannellum360 from "@/components/site/Pannellum360";

export const Route = createFileRoute("/_authenticated/dashboard/nuevo")({
  component: Wizard,
});

type Escena = { id: string; nombre: string; url: string };

function Wizard() {
  const nav = useNavigate();
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState({ titulo: "", descripcion: "", precio: "", ubicacion: "", m2: "", hab: "", banos: "" });
  const [iaCargando, setIaCargando] = useState(false);
  const [escenas, setEscenas] = useState<Escena[]>([]);
  const [inicio, setInicio] = useState<string | null>(null);

  const generarIA = async () => {
    setIaCargando(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDatos((d) => ({
      ...d,
      titulo: d.titulo || `${d.hab || "3"} hab · ${d.ubicacion || "Caracas"} · ${d.m2 || "180"}m²`,
      descripcion: `Espectacular propiedad de ${d.m2 || "180"}m² en ${d.ubicacion || "Caracas"}. Cuenta con ${d.hab || "3"} habitaciones, ${d.banos || "2"} baños y acabados premium. Una oportunidad única en el mercado actual.`,
    }));
    setIaCargando(false);
    toast.success("Descripción generada con IA ✨");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    add(Array.from(e.dataTransfer.files));
  };
  const add = (files: File[]) => {
    const nuevas: Escena[] = files.map((f, i) => ({ id: `e_${Date.now()}_${i}`, nombre: f.name.replace(/\.[^.]+$/, ""), url: URL.createObjectURL(f) }));
    setEscenas((prev) => {
      const all = [...prev, ...nuevas];
      if (!inicio && all[0]) setInicio(all[0].id);
      return all;
    });
  };

  const finalizar = () => { toast.success("Tour creado (mock). Redirigiendo…"); setTimeout(() => nav({ to: "/dashboard/inmuebles" }), 600); };

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto">
      <h1 className="font-display text-4xl">Nuevo tour</h1>
      <p className="text-muted-foreground text-sm mt-1">Crea tu recorrido 360° en tres pasos.</p>

      <div className="mt-8 flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${paso >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {paso > n ? <Check className="h-4 w-4" /> : n}
            </div>
            <span className={`text-sm ${paso >= n ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {n === 1 ? "Datos + IA" : n === 2 ? "Escenas" : "Editor 360°"}
            </span>
            {n < 3 && <div className={`flex-1 h-px ${paso > n ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {paso === 1 && (
        <Card className="mt-8 p-6 border-border/60 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Ubicación</Label><Input value={datos.ubicacion} onChange={(e) => setDatos({ ...datos, ubicacion: e.target.value })} placeholder="Las Mercedes, Caracas" /></div>
            <div><Label>Precio (USD)</Label><Input type="number" value={datos.precio} onChange={(e) => setDatos({ ...datos, precio: e.target.value })} /></div>
            <div><Label>Metros cuadrados</Label><Input type="number" value={datos.m2} onChange={(e) => setDatos({ ...datos, m2: e.target.value })} /></div>
            <div><Label>Habitaciones</Label><Input type="number" value={datos.hab} onChange={(e) => setDatos({ ...datos, hab: e.target.value })} /></div>
            <div><Label>Baños</Label><Input type="number" value={datos.banos} onChange={(e) => setDatos({ ...datos, banos: e.target.value })} /></div>
          </div>
          <div className="rounded-lg border border-dashed border-accent/40 bg-accent/5 p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium text-sm">Asistente IA</p>
                  <p className="text-xs text-muted-foreground">Genera título y descripción optimizados para SEO.</p>
                </div>
              </div>
              <Button type="button" onClick={generarIA} disabled={iaCargando} variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" /> {iaCargando ? "Generando…" : "Generar con IA"}
              </Button>
            </div>
          </div>
          <div><Label>Título</Label><Input value={datos.titulo} onChange={(e) => setDatos({ ...datos, titulo: e.target.value })} /></div>
          <div><Label>Descripción</Label><Textarea rows={4} value={datos.descripcion} onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })} /></div>
        </Card>
      )}

      {paso === 2 && (
        <Card className="mt-8 p-6 border-border/60">
          <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-12 text-center hover:border-accent/60 transition">
            <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-3 font-medium">Arrastra tus fotos equirectangulares 360°</p>
            <p className="text-sm text-muted-foreground mt-1">o</p>
            <label className="inline-block mt-2">
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && add(Array.from(e.target.files))} />
              <span className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium cursor-pointer hover:opacity-90"><ImageIcon className="h-4 w-4" />Seleccionar archivos</span>
            </label>
          </div>

          {escenas.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Escenas ({escenas.length})</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {escenas.map((s) => (
                  <Card key={s.id} className="p-3 border-border/60">
                    <img src={s.url} alt="" className="w-full h-24 object-cover rounded mb-2" />
                    <Input value={s.nombre} onChange={(e) => setEscenas(escenas.map((x) => x.id === s.id ? { ...x, nombre: e.target.value } : x))} className="text-sm" />
                    <Button type="button" variant={inicio === s.id ? "default" : "outline"} size="sm" className="w-full mt-2 gap-1.5" onClick={() => setInicio(s.id)}>
                      <Star className="h-3.5 w-3.5" /> {inicio === s.id ? "Escena de inicio" : "Marcar como inicio"}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {paso === 3 && (
        <Card className="mt-8 p-6 border-border/60">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Editor visual</h3>
            <Badge variant="secondary">Doble clic en la escena para añadir hotspot</Badge>
          </div>
          <div className="aspect-[16/9] rounded-lg overflow-hidden bg-muted">
            {escenas[0] ? (
              <Pannellum360
                scenes={escenas.map((e) => ({ id: e.id, title: e.nombre, panorama: e.url, hotSpots: [] }))}
                defaultScene={inicio ?? escenas[0].id}
                editable
                onCanvasClick={() => toast("Hotspot creado en la posición seleccionada")}
              />
            ) : (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">Sube escenas en el paso anterior</div>
            )}
          </div>
        </Card>
      )}

      <div className="mt-6 flex justify-between">
        <Button variant="outline" disabled={paso === 1} onClick={() => setPaso((p) => p - 1)}>Atrás</Button>
        {paso < 3 ? (
          <Button onClick={() => setPaso((p) => p + 1)}>Continuar</Button>
        ) : (
          <Button onClick={finalizar} className="gap-2"><Check className="h-4 w-4" /> Publicar tour</Button>
        )}
      </div>
    </div>
  );
}