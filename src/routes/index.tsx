import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { TOURS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Bed, Bath, Maximize, Sparkles, ScanEye, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vista360 — Tours 360° inmobiliarios" },
      { name: "description", content: "Explora propiedades en recorridos 360° inmersivos. Conecta con brokers verificados." },
    ],
  }),
  component: Index,
});

function Index() {
  const [q, setQ] = useState("");
  const [zona, setZona] = useState("");
  const [maxPrecio, setMaxPrecio] = useState<number[]>([600000]);
  const [minM2, setMinM2] = useState<number[]>([0]);

  const filtrados = useMemo(
    () =>
      TOURS.filter((t) => {
        if (q && !t.titulo.toLowerCase().includes(q.toLowerCase())) return false;
        if (zona && !t.ubicacion.toLowerCase().includes(zona.toLowerCase())) return false;
        if (t.precio > maxPrecio[0]) return false;
        if (t.stats.m2 < minM2[0]) return false;
        return true;
      }),
    [q, zona, maxPrecio, minM2]
  );

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-warm">
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,_black_1px,_transparent_0)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 gap-1.5"><Sparkles className="h-3 w-3" /> Recorridos 360° con IA</Badge>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.05] text-foreground">
              Recorre cada rincón <span className="italic text-accent">antes</span> de visitar.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              La plataforma que convierte tus listados inmobiliarios en experiencias 360° inmersivas, con captura
              automática de leads y presentaciones guiadas en vivo.
            </p>
          </div>

          {/* Buscador */}
          <Card className="mt-10 p-3 shadow-elegant border-border/60">
            <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Casa, penthouse, loft…"
                  className="pl-9 h-12 border-0 bg-muted/40"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  placeholder="Zona o ciudad"
                  className="pl-9 h-12 border-0 bg-muted/40"
                />
              </div>
              <Button size="lg" className="h-12 px-6">Buscar</Button>
            </div>
            <div className="mt-4 grid gap-6 px-2 pb-2 md:grid-cols-2">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Precio máximo</span>
                  <span className="font-medium text-foreground">${maxPrecio[0].toLocaleString()}</span>
                </div>
                <Slider value={maxPrecio} onValueChange={setMaxPrecio} max={1000000} step={10000} />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Mínimo m²</span>
                  <span className="font-medium text-foreground">{minM2[0]} m²</span>
                </div>
                <Slider value={minM2} onValueChange={setMinM2} max={500} step={10} />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl">Inmuebles destacados</h2>
            <p className="text-muted-foreground text-sm mt-1">{filtrados.length} resultado{filtrados.length === 1 ? "" : "s"}</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((t) => (
            <Link key={t.id} to="/tour/$slug" params={{ slug: t.slug }} className="group">
              <Card className="overflow-hidden border-border/60 hover:shadow-elegant transition-all duration-300 group-hover:-translate-y-1 p-0">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={t.portada_url}
                    alt={t.titulo}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <Badge className="absolute top-3 left-3 bg-background/95 text-foreground backdrop-blur gap-1 border-0">
                    <ScanEye className="h-3 w-3" /> Tour 360°
                  </Badge>
                  <div className="absolute bottom-3 right-3 rounded-md bg-background/95 backdrop-blur px-3 py-1.5 text-sm font-semibold">
                    ${t.precio.toLocaleString()}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-medium leading-tight">{t.titulo}</h3>
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
      </section>

      {/* PARA BROKERS */}
      <section id="planes" className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <Badge variant="secondary" className="mb-4 bg-white/10 text-primary-foreground border-0">Para inmobiliarias</Badge>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Convierte cada listado en <span className="italic text-accent">una experiencia.</span>
            </h2>
            <p className="mt-4 text-primary-foreground/75 text-lg">
              Crea tours 360° en minutos, captura leads automáticamente y presenta tus inmuebles en vivo a clientes
              en cualquier parte del mundo.
            </p>
            <div className="mt-8 flex gap-3">
              <Button asChild size="lg" variant="secondary"><Link to="/login">Empezar gratis</Link></Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white/20 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"><a href="#contacto">Hablar con ventas</a></Button>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { i: ScanEye, t: "Editor visual 360°", d: "Sube fotos equirectangulares, coloca hotspots y conecta habitaciones con un clic." },
              { i: Sparkles, t: "SEO con IA", d: "Genera títulos y descripciones optimizadas con Gemini en segundos." },
              { i: Users, t: "Presentación en vivo", d: "Guía a tus clientes en tiempo real con sincronización de cámara." },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 rounded-xl bg-white/5 backdrop-blur p-5 border border-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <f.i className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{f.t}</h3>
                  <p className="text-sm text-primary-foreground/70 mt-0.5">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contacto" className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        © 2026 Vista360 · Recorridos virtuales inmobiliarios
      </footer>
    </main>
  );
}
