import { createFileRoute, Link } from "@tanstack/react-router";
import { useFavoritos } from "@/lib/cliente-store";
import { TOURS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ScanEye } from "lucide-react";

export const Route = createFileRoute("/cuenta/favoritos")({
  component: Favoritos,
});

function Favoritos() {
  const { favs, toggle } = useFavoritos();
  const list = TOURS.filter((t) => favs.includes(t.slug));

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <h1 className="font-display text-4xl">Mis favoritos</h1>
      <p className="text-muted-foreground mt-1">{list.length} inmuebles guardados.</p>

      {list.length === 0 ? (
        <Card className="mt-8 p-10 text-center">
          <Heart className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Aún no has guardado ningún inmueble.</p>
          <Button asChild className="mt-4"><Link to="/explorar">Explorar inmuebles</Link></Button>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <Card key={t.id} className="overflow-hidden">
              <Link to="/tour/$slug" params={{ slug: t.slug }} className="block aspect-[16/10] overflow-hidden">
                <img src={t.portada_url} alt={t.titulo} className="h-full w-full object-cover" />
              </Link>
              <div className="p-4">
                <div className="text-xs text-muted-foreground">{t.ubicacion}</div>
                <div className="font-medium mt-0.5">{t.titulo}</div>
                <div className="text-accent font-display text-lg mt-1">${t.precio.toLocaleString()}</div>
                <div className="mt-3 flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/tour/$slug" params={{ slug: t.slug }}><ScanEye className="h-4 w-4" /> Ver tour</Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggle(t.slug)}>
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}