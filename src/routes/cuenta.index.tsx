import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useFavoritos, useVisitas, useChats } from "@/lib/cliente-store";
import { TOURS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, CalendarCheck, MessageCircle, Radio, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cuenta/")({
  component: ClienteHome,
});

function ClienteHome() {
  const { user } = useAuth();
  const { favs } = useFavoritos();
  const { visitas } = useVisitas();
  const { chats } = useChats();
  const favTours = TOURS.filter((t) => favs.includes(t.slug)).slice(0, 3);
  const pendientes = visitas.filter((v) => v.estado === "pendiente").length;

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Mi cuenta</div>
          <h1 className="font-display text-4xl mt-1">Hola, {user?.nombre.split(" ")[0]}</h1>
          <p className="text-muted-foreground mt-1">Tus inmuebles guardados, visitas y conversaciones, en un solo lugar.</p>
        </div>
        <Button asChild><Link to="/explorar">Explorar inmuebles <ArrowRight className="h-4 w-4" /></Link></Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard icon={Heart} label="Favoritos" value={favs.length} to="/cuenta/favoritos" />
        <StatCard icon={CalendarCheck} label="Visitas pendientes" value={pendientes} to="/cuenta/visitas" />
        <StatCard icon={MessageCircle} label="Conversaciones" value={chats.length} to="/cuenta/mensajes" />
        <StatCard icon={Radio} label="En vivo" value={"Entrar"} to="/cuenta/live" />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-2xl">Últimos favoritos</h2>
          <Link to="/cuenta/favoritos" className="text-sm text-muted-foreground hover:text-foreground">Ver todos</Link>
        </div>
        {favTours.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">
            Aún no has guardado inmuebles. <Link to="/explorar" className="underline text-foreground">Explora el catálogo</Link>.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favTours.map((t) => (
              <Link key={t.id} to="/tour/$slug" params={{ slug: t.slug }} className="group block overflow-hidden rounded-xl border border-border bg-card">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={t.portada_url} alt={t.titulo} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground">{t.ubicacion}</div>
                  <div className="font-medium mt-0.5">{t.titulo}</div>
                  <div className="text-accent font-display text-lg mt-1">${t.precio.toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, to }: { icon: any; label: string; value: any; to: string }) {
  return (
    <Link to={to} className="block">
      <Card className="p-5 hover:shadow-elegant transition">
        <Icon className="h-5 w-5 text-accent" />
        <div className="mt-3 text-3xl font-display">{value}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
      </Card>
    </Link>
  );
}