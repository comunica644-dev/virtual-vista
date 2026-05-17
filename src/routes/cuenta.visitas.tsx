import { createFileRoute, Link } from "@tanstack/react-router";
import { useVisitas } from "@/lib/cliente-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Clock, MapPin, Video } from "lucide-react";

export const Route = createFileRoute("/cuenta/visitas")({
  component: Visitas,
});

function Visitas() {
  const { visitas, cancel } = useVisitas();

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <h1 className="font-display text-4xl">Mis visitas</h1>
      <p className="text-muted-foreground mt-1">Solicitudes de visita a inmuebles.</p>

      {visitas.length === 0 ? (
        <Card className="mt-8 p-10 text-center">
          <CalendarCheck className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Aún no has solicitado ninguna visita.</p>
          <Button asChild className="mt-4"><Link to="/explorar">Explorar inmuebles</Link></Button>
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
          {visitas.map((v) => (
            <Card key={v.id} className="p-5 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[240px]">
                <Link to="/tour/$slug" params={{ slug: v.tourSlug }} className="font-medium hover:underline">{v.tourTitulo}</Link>
                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.brokerNombre}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {v.fecha} · {v.hora}</span>
                  <span className="inline-flex items-center gap-1">{v.modalidad === "virtual" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />} {v.modalidad}</span>
                </div>
                {v.mensaje && <p className="text-sm text-muted-foreground mt-2">"{v.mensaje}"</p>}
              </div>
              <Badge variant={v.estado === "confirmada" ? "default" : v.estado === "cancelada" ? "outline" : "secondary"}>{v.estado}</Badge>
              {v.estado === "pendiente" && (
                <Button variant="ghost" size="sm" onClick={() => cancel(v.id)}>Cancelar</Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}