import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { TOURS, ADMIN_USERS, PLANES } from "@/lib/mock-data";
import { Users, Building2, Eye, DollarSign, HardDrive, Activity, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminMetrics,
});

function AdminMetrics() {
  const totalVistas = TOURS.reduce((s, t) => s + t.vistas, 0);
  const totalLeads = TOURS.reduce((s, t) => s + t.leads, 0);
  const brokers = ADMIN_USERS.filter((u) => u.rol === "broker");
  const ingresosMRR = brokers.reduce((s, b) => {
    const plan = PLANES.find((p) => p.id === b.plan);
    return s + (plan?.precio ?? 0);
  }, 0);
  const gbUsados = (TOURS.length * 1.8).toFixed(1);

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-amber-600 font-medium">Administración</div>
        <h1 className="font-display text-4xl mt-1">Monitoreo del sistema</h1>
        <p className="text-muted-foreground text-sm mt-1">Salud general, ingresos y consumo de la plataforma.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric icon={Users} label="Usuarios" value={ADMIN_USERS.length} sub={`${brokers.length} brokers`} />
        <Metric icon={Building2} label="Tours publicados" value={TOURS.length} sub="+4 esta semana" />
        <Metric icon={Eye} label="Vistas totales" value={totalVistas.toLocaleString()} sub={`${totalLeads} leads`} />
        <Metric icon={DollarSign} label="MRR" value={`$${ingresosMRR}`} sub="Suscripciones activas" />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-4">
        <Metric icon={HardDrive} label="Almacenamiento" value={`${gbUsados} GB`} sub="de 500 GB" />
        <Metric icon={Activity} label="Uptime 30d" value="99.98%" sub="0 incidentes críticos" />
        <Metric icon={TrendingUp} label="Conversión leads" value={`${((totalLeads / totalVistas) * 100).toFixed(1)}%`} sub="Promedio plataforma" />
      </div>

      <Card className="p-6 mt-8">
        <h2 className="font-display text-xl">Distribución por plan</h2>
        <div className="mt-4 space-y-3">
          {PLANES.map((p) => {
            const count = brokers.filter((b) => b.plan === p.id).length;
            const pct = brokers.length ? (count / brokers.length) * 100 : 0;
            return (
              <div key={p.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{p.nombre}</span>
                  <span className="text-muted-foreground">{count} brokers · ${p.precio * count}/mes</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${p.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="font-display text-3xl mt-2">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </Card>
  );
}