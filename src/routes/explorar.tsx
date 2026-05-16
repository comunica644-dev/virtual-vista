import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TOURS, type Tour } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Bed, Bath, Maximize, ScanEye, SlidersHorizontal, X } from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const TIPOS = ["casa", "apartamento", "penthouse", "loft", "local", "oficina"] as const;
const OPERACIONES = ["venta", "alquiler"] as const;
const ALL_EXTRAS = Array.from(new Set(TOURS.flatMap((t) => t.extras))).sort();
const CIUDADES = Array.from(new Set(TOURS.map((t) => t.ciudad))).sort();

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  ciudad: fallback(z.string(), "").default(""),
  op: fallback(z.enum(["todas", ...OPERACIONES]), "todas").default("todas"),
  orden: fallback(z.enum(["recientes", "precio_asc", "precio_desc", "m2_desc"]), "recientes").default("recientes"),
});

export const Route = createFileRoute("/explorar")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Explorar inmuebles 360° — Vista360" },
      { name: "description", content: "Marketplace de propiedades con tours virtuales 360°. Filtra por tipo, ciudad, precio y más." },
    ],
  }),
  component: Explorar,
});

function Explorar() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/explorar" });

  // Local filter state (advanced)
  const [tipos, setTipos] = useState<string[]>([]);
  const [precio, setPrecio] = useState<number[]>([0, 1000000]);
  const [m2, setM2] = useState<number[]>([0, 500]);
  const [habs, setHabs] = useState<number>(0);
  const [banos, setBanos] = useState<number>(0);
  const [extras, setExtras] = useState<string[]>([]);

  const toggle = <T,>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtrados: Tour[] = useMemo(() => {
    let r = TOURS.filter((t) => {
      if (search.q && !`${t.titulo} ${t.ubicacion} ${t.descripcion}`.toLowerCase().includes(search.q.toLowerCase())) return false;
      if (search.ciudad && t.ciudad !== search.ciudad) return false;
      if (search.op !== "todas" && t.operacion !== search.op) return false;
      if (tipos.length && !tipos.includes(t.tipo)) return false;
      if (t.precio < precio[0] || t.precio > precio[1]) return false;
      if (t.stats.m2 < m2[0] || t.stats.m2 > m2[1]) return false;
      if (habs && t.stats.habitaciones < habs) return false;
      if (banos && t.stats.banos < banos) return false;
      if (extras.length && !extras.every((e) => t.extras.includes(e))) return false;
      return true;
    });
    switch (search.orden) {
      case "precio_asc": r = [...r].sort((a, b) => a.precio - b.precio); break;
      case "precio_desc": r = [...r].sort((a, b) => b.precio - a.precio); break;
      case "m2_desc": r = [...r].sort((a, b) => b.stats.m2 - a.stats.m2); break;
      default: r = [...r].sort((a, b) => b.vistas - a.vistas);
    }
    return r;
  }, [search, tipos, precio, m2, habs, banos, extras]);

  const setSearch = (patch: Partial<typeof search>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const resetAll = () => {
    setTipos([]); setPrecio([0, 1000000]); setM2([0, 500]); setHabs(0); setBanos(0); setExtras([]);
    navigate({ search: { q: "", ciudad: "", op: "todas", orden: "recientes" } });
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Top search bar */}
      <div className="mb-8">
        <h1 className="font-display text-4xl">Explorar inmuebles</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {filtrados.length} de {TOURS.length} propiedades con tour 360°
        </p>
        <Card className="mt-6 p-3 shadow-elegant border-border/60">
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search.q} onChange={(e) => setSearch({ q: e.target.value })}
                placeholder="Casa, penthouse, loft…" className="pl-9 h-11 border-0 bg-muted/40" />
            </div>
            <Select value={search.ciudad || "all"} onValueChange={(v) => setSearch({ ciudad: v === "all" ? "" : v })}>
              <SelectTrigger className="h-11 border-0 bg-muted/40"><MapPin className="h-4 w-4 mr-1" /><SelectValue placeholder="Ciudad" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {CIUDADES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={search.op} onValueChange={(v) => setSearch({ op: v as any })}>
              <SelectTrigger className="h-11 border-0 bg-muted/40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Venta y alquiler</SelectItem>
                <SelectItem value="venta">En venta</SelectItem>
                <SelectItem value="alquiler">En alquiler</SelectItem>
              </SelectContent>
            </Select>
            <Select value={search.orden} onValueChange={(v) => setSearch({ orden: v as any })}>
              <SelectTrigger className="h-11 border-0 bg-muted/40 min-w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recientes">Más populares</SelectItem>
                <SelectItem value="precio_asc">Precio: menor</SelectItem>
                <SelectItem value="precio_desc">Precio: mayor</SelectItem>
                <SelectItem value="m2_desc">Más grandes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar de filtros */}
        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium"><SlidersHorizontal className="h-4 w-4" /> Filtros</Label>
            <Button variant="ghost" size="sm" onClick={resetAll} className="h-7 text-xs"><X className="h-3 w-3" /> Limpiar</Button>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tipo de propiedad</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {TIPOS.map((t) => (
                <button key={t} onClick={() => setTipos((p) => toggle(p, t))}
                  className={`text-xs px-3 py-1.5 rounded-full border capitalize transition ${
                    tipos.includes(t) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                  }`}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <Label className="uppercase tracking-wider">Precio (USD)</Label>
              <span className="font-medium text-foreground">${precio[0].toLocaleString()} – ${precio[1].toLocaleString()}</span>
            </div>
            <Slider value={precio} onValueChange={setPrecio} min={0} max={1000000} step={5000} />
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <Label className="uppercase tracking-wider">Superficie</Label>
              <span className="font-medium text-foreground">{m2[0]} – {m2[1]} m²</span>
            </div>
            <Slider value={m2} onValueChange={setM2} min={0} max={500} step={10} />
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Habitaciones (mín)</Label>
            <div className="mt-2 flex gap-1.5">
              {[0, 1, 2, 3, 4].map((n) => (
                <button key={n} onClick={() => setHabs(n)}
                  className={`flex-1 text-sm py-1.5 rounded-md border ${habs === n ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                  {n === 0 ? "Cualq." : `${n}+`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Baños (mín)</Label>
            <div className="mt-2 flex gap-1.5">
              {[0, 1, 2, 3, 4].map((n) => (
                <button key={n} onClick={() => setBanos(n)}
                  className={`flex-1 text-sm py-1.5 rounded-md border ${banos === n ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                  {n === 0 ? "Cualq." : `${n}+`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Extras</Label>
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-2">
              {ALL_EXTRAS.map((e) => (
                <label key={e} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={extras.includes(e)} onCheckedChange={() => setExtras((p) => toggle(p, e))} />
                  <span>{e}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Resultados */}
        <section>
          {filtrados.length === 0 ? (
            <div className="border border-dashed rounded-lg py-20 text-center">
              <p className="text-muted-foreground">No hay resultados con esos filtros.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={resetAll}>Limpiar filtros</Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtrados.map((t) => (
                <Link key={t.id} to="/tour/$slug" params={{ slug: t.slug }} className="group">
                  <Card className="overflow-hidden border-border/60 hover:shadow-elegant transition-all duration-300 group-hover:-translate-y-1 p-0">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img src={t.portada_url} alt={t.titulo} loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <Badge className="absolute top-3 left-3 bg-background/95 text-foreground backdrop-blur gap-1 border-0">
                        <ScanEye className="h-3 w-3" /> 360°
                      </Badge>
                      <Badge variant="secondary" className="absolute top-3 right-3 capitalize">{t.operacion}</Badge>
                      <div className="absolute bottom-3 right-3 rounded-md bg-background/95 backdrop-blur px-3 py-1.5 text-sm font-semibold">
                        ${t.precio.toLocaleString()}{t.operacion === "alquiler" && <span className="text-xs text-muted-foreground">/mes</span>}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-lg font-medium leading-tight truncate">{t.titulo}</h3>
                        <Badge variant="outline" className="capitalize text-[10px] shrink-0">{t.tipo}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {t.ubicacion}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Bed className="h-4 w-4" /> {t.stats.habitaciones}</span>
                        <span className="flex items-center gap-1.5"><Bath className="h-4 w-4" /> {t.stats.banos}</span>
                        <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4" /> {t.stats.m2} m²</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}