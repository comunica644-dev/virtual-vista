import { createFileRoute, Link } from "@tanstack/react-router";
import { TOURS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Plus, ScanEye, TrendingUp, Users, Edit3, Radio } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const totalVistas = TOURS.reduce((s, t) => s + t.vistas, 0);
  const totalLeads = TOURS.reduce((s, t) => s + t.leads, 0);
  const cuotaUsada = TOURS.length;
  const cuotaTotal = 25;

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Resumen de tus inmuebles y métricas.</p>
        </div>
        <Button size="lg" className="gap-2"><Plus className="h-4 w-4" /> Nuevo tour</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Eye} label="Vistas totales" value={totalVistas.toLocaleString()} delta="+12.4% esta semana" tone="positive" />
        <MetricCard icon={Users} label="Leads generados" value={totalLeads.toString()} delta="+5 hoy" tone="positive" />
        <Card className="p-6 border-border/60">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <ScanEye className="h-4 w-4" /> Cuota del plan
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-display text-3xl">{cuotaUsada}</span>
            <span className="text-muted-foreground text-sm">/ {cuotaTotal} tours</span>
          </div>
          <Progress value={(cuotaUsada / cuotaTotal) * 100} className="mt-4 h-1.5" />
          <p className="text-xs text-muted-foreground mt-2">Plan Ultra · renovación 30 jun</p>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl mb-4">Tus tours</h2>
        <div className="space-y-3">
          {TOURS.map((t) => (
            <Card key={t.id} className="p-4 border-border/60 flex items-center gap-4">
              <img src={t.portada_url} alt="" className="h-20 w-28 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{t.titulo}</h3>
                  <Badge variant="secondary" className="text-[10px]">Publicado</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{t.ubicacion} · {t.scenes.length} escenas</p>
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {t.vistas} vistas</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {t.leads} leads</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm"><Link to="/tour/$slug" params={{ slug: t.slug }}><Eye className="h-3.5 w-3.5" /> Ver</Link></Button>
                <Button asChild variant="outline" size="sm"><Link to="/dashboard/editor/$slug" params={{ slug: t.slug }}><Edit3 className="h-3.5 w-3.5" /> Editar</Link></Button>
                <Button asChild size="sm"><Link to="/dashboard/live"><Radio className="h-3.5 w-3.5" /> En vivo</Link></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, delta, tone }: { icon: any; label: string; value: string; delta: string; tone: "positive" | "negative" }) {
  return (
    <Card className="p-6 border-border/60">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="mt-3 font-display text-3xl">{value}</div>
      <div className={`mt-2 text-xs flex items-center gap-1 ${tone === "positive" ? "text-emerald-700" : "text-destructive"}`}>
        <TrendingUp className="h-3 w-3" /> {delta}
      </div>
    </Card>
  );
}
