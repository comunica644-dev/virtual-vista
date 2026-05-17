import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getTourBySlug, type Scene } from "@/lib/mock-data";
import Pannellum360 from "@/components/site/Pannellum360";
import LeadModal from "@/components/site/LeadModal";
import VisitRequestModal from "@/components/site/VisitRequestModal";
import { useAuth } from "@/lib/auth";
import { useFavoritos, useChats } from "@/lib/cliente-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bath, Bed, CalendarCheck, Heart, Lock, Maximize, MapPin, MessageCircle, Phone, ScanEye, Share2 } from "lucide-react";

export const Route = createFileRoute("/tour/$slug")({
  loader: ({ params }) => {
    const tour = getTourBySlug(params.slug);
    if (!tour) throw notFound();
    return { tour };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.tour.titulo} | Vista360` },
          { name: "description", content: loaderData.tour.descripcion },
          { property: "og:title", content: loaderData.tour.titulo },
          { property: "og:description", content: loaderData.tour.descripcion },
          { property: "og:image", content: loaderData.tour.portada_url },
          { property: "og:type", content: "product" },
        ]
      : [],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              name: loaderData.tour.titulo,
              description: loaderData.tour.descripcion,
              image: loaderData.tour.portada_url,
              offers: {
                "@type": "Offer",
                price: loaderData.tour.precio,
                priceCurrency: "USD",
              },
            }),
          },
        ]
      : [],
  }),
  component: TourPage,
});

function TourPage() {
  const { tour } = Route.useLoaderData();
  const { user, isAuthed } = useAuth();
  const isCliente = isAuthed && user?.rol === "cliente";
  const [unlocked, setUnlocked] = useState(isCliente);
  const [modalOpen, setModalOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const { isFav, toggle } = useFavoritos();
  const { send } = useChats();
  const fav = isFav(tour.slug);

  const startChat = () => {
    send(
      { tourSlug: tour.slug, tourTitulo: tour.titulo, brokerNombre: tour.broker.nombre, brokerAvatar: tour.broker.avatar },
      `Hola, me interesa ${tour.titulo}. ¿Sigue disponible?`,
    );
    window.location.href = "/cuenta/mensajes";
  };

  return (
    <main className="bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 py-4 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Visor 360 */}
        <div className="space-y-3">
          <div className="relative aspect-[16/10] lg:aspect-[16/11] overflow-hidden rounded-xl shadow-elegant border border-border/60">
            <Pannellum360 scenes={tour.scenes} defaultScene={tour.defaultScene} />
            <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur gap-1 border-0">
              <ScanEye className="h-3 w-3" /> Tour 360° libre
            </Badge>
            {isCliente && (
              <button
                onClick={() => toggle(tour.slug)}
                aria-label="Guardar en favoritos"
                className={`absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full backdrop-blur transition ${fav ? "bg-accent text-accent-foreground" : "bg-background/90 text-foreground hover:bg-background"}`}
              >
                <Heart className={`h-5 w-5 ${fav ? "fill-current" : ""}`} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {tour.scenes.map((s: Scene) => (
              <Badge key={s.id} variant="outline" className="text-xs">{s.title}</Badge>
            ))}
          </div>
          {isCliente && (
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => setVisitOpen(true)} size="lg">
                <CalendarCheck className="h-4 w-4" /> Solicitar visita
              </Button>
              <Button onClick={startChat} size="lg" variant="outline">
                <MessageCircle className="h-4 w-4" /> Chatear con el broker
              </Button>
            </div>
          )}
        </div>

        {/* Panel de info con gated content */}
        <aside className="space-y-4">
          <Card className="p-6 border-border/60">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {tour.ubicacion}</span>
              <Button size="icon" variant="ghost" className="h-7 w-7"><Share2 className="h-4 w-4" /></Button>
            </div>
            <h1 className="font-display text-3xl mt-2 leading-tight">{tour.titulo}</h1>
            <div className="mt-2 text-3xl font-display text-accent">${tour.precio.toLocaleString()}</div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <Stat icon={Bed} label="Hab." value={tour.stats.habitaciones} />
              <Stat icon={Bath} label="Baños" value={tour.stats.banos} />
              <Stat icon={Maximize} label="m²" value={tour.stats.m2} />
            </div>
          </Card>

          {/* Bloque bloqueado */}
          <Card className="relative p-6 border-border/60 overflow-hidden">
            <h2 className="font-display text-xl mb-3">Sobre este inmueble</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{tour.descripcion}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tour.extras.map((e: string) => (
                <Badge key={e} variant="secondary">{e}</Badge>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <h3 className="font-medium mb-3">Tu broker</h3>
              <div className="flex items-center gap-3">
                <img src={tour.broker.avatar} alt={tour.broker.nombre} className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-medium">{tour.broker.nombre}</div>
                  <div className="text-xs text-muted-foreground">{tour.broker.telefono}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button className="bg-[#25D366] hover:bg-[#1eb058] text-white"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
                <Button variant="outline"><Phone className="h-4 w-4" /> Llamar</Button>
              </div>
            </div>

            {!unlocked && (
              <button
                onClick={() => setModalOpen(true)}
                aria-label="Desbloquear contenido"
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center group cursor-pointer"
                style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", background: "color-mix(in oklab, var(--card) 55%, transparent)" }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-elegant transition-transform group-hover:scale-110">
                  <Lock className="h-6 w-6" />
                </div>
                <div className="px-6">
                  <div className="font-display text-lg">Contenido bloqueado</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Regístrate gratis para ver descripción, planos y contactar al broker.
                  </p>
                </div>
                <span className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium mt-2">
                  Desbloquear ahora
                </span>
              </button>
            )}
          </Card>
        </aside>
      </div>

      <LeadModal open={modalOpen} onOpenChange={setModalOpen} tourTitle={tour.titulo} onUnlock={() => setUnlocked(true)} />
      <VisitRequestModal
        open={visitOpen}
        onOpenChange={setVisitOpen}
        tourSlug={tour.slug}
        tourTitulo={tour.titulo}
        brokerNombre={tour.broker.nombre}
      />
    </main>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted/50 py-3">
      <Icon className="h-4 w-4 mx-auto text-muted-foreground" />
      <div className="font-display text-xl mt-1">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
