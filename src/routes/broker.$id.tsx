import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getBroker, toursDeBroker, type Tour } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bath, Bed, Globe, Instagram, Facebook, MapPin, Maximize, Phone, Mail, ScanEye } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";

export const Route = createFileRoute("/broker/$id")({
  loader: ({ params }) => {
    const broker = getBroker(Number(params.id));
    if (!broker) throw notFound();
    return { broker, tours: toursDeBroker(broker.id) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.broker.nombre} — Vista360` },
      { name: "description", content: loaderData?.broker.bio ?? "" },
    ],
  }),
  notFoundComponent: () => <div className="p-12 text-center">Broker no encontrado.</div>,
  errorComponent: ({ error }) => <div className="p-12 text-center text-destructive">{error.message}</div>,
  component: BrokerPage,
});

function BrokerPage() {
  const { broker, tours } = Route.useLoaderData();
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={broker.portada} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="mx-auto max-w-6xl px-6 -mt-20 relative">
          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            <img src={broker.avatar} alt={broker.nombre} className="h-32 w-32 rounded-2xl border-4 border-background object-cover shadow-elegant" />
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2 capitalize">Plan {broker.plan}</Badge>
              <h1 className="font-display text-4xl md:text-5xl">{broker.nombre}</h1>
              {broker.empresa && <p className="text-muted-foreground mt-1">{broker.empresa}</p>}
              <p className="mt-4 max-w-2xl text-foreground/80">{broker.bio}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <a href={`tel:${broker.telefono}`} className="flex items-center gap-1.5 hover:text-foreground"><Phone className="h-4 w-4" />{broker.telefono}</a>
                <a href={`mailto:${broker.email}`} className="flex items-center gap-1.5 hover:text-foreground"><Mail className="h-4 w-4" />{broker.email}</a>
                {broker.redes.instagram && <span className="flex items-center gap-1.5"><Instagram className="h-4 w-4" />{broker.redes.instagram}</span>}
                {broker.redes.facebook && <span className="flex items-center gap-1.5"><Facebook className="h-4 w-4" />{broker.redes.facebook}</span>}
                {broker.redes.web && <span className="flex items-center gap-1.5"><Globe className="h-4 w-4" />{broker.redes.web}</span>}
              </div>
            </div>
            <Button size="lg">Contactar</Button>
          </div>

          <section className="mt-16 pb-20">
            <h2 className="font-display text-2xl mb-6">Catálogo ({tours.length})</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tours.map((t: Tour) => (
                <Link key={t.id} to="/tour/$slug" params={{ slug: t.slug }} className="group">
                  <Card className="overflow-hidden border-border/60 hover:shadow-elegant transition group-hover:-translate-y-1 p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={t.portada_url} alt={t.titulo} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <Badge className="absolute top-3 left-3 bg-background/95 text-foreground border-0 gap-1"><ScanEye className="h-3 w-3" /> 360°</Badge>
                      <div className="absolute bottom-3 right-3 rounded-md bg-background/95 px-3 py-1.5 text-sm font-semibold">${t.precio.toLocaleString()}</div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg">{t.titulo}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{t.ubicacion}</p>
                      <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Bed className="h-4 w-4" />{t.stats.habitaciones}</span>
                        <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{t.stats.banos}</span>
                        <span className="flex items-center gap-1"><Maximize className="h-4 w-4" />{t.stats.m2}m²</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}