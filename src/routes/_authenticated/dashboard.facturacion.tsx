import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PLANES, TOURS } from "@/lib/mock-data";
import { Check, CreditCard, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/facturacion")({
  component: Facturacion,
});

function Facturacion() {
  const planActual = PLANES[2];
  const usados = TOURS.length;

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <h1 className="font-display text-4xl">Facturación</h1>
      <p className="text-muted-foreground text-sm mt-1">Gestiona tu suscripción y método de pago.</p>

      <Card className="mt-8 p-6 border-border/60">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="bg-amber-100 text-amber-900 border-amber-300">Plan actual</Badge>
            <h2 className="font-display text-3xl mt-2">{planActual.nombre} · ${planActual.precio}/mes</h2>
            <p className="text-sm text-muted-foreground mt-1">Renovación el 30 jun 2026</p>
          </div>
          <Button variant="outline" className="gap-2"><CreditCard className="h-4 w-4" /> Cambiar método de pago</Button>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Tours utilizados</span>
            <span className="font-medium">{usados} / {planActual.tours === 999 ? "∞" : planActual.tours}</span>
          </div>
          <Progress value={(usados / Math.min(planActual.tours, 50)) * 100} />
        </div>
      </Card>

      <h2 className="font-display text-2xl mt-12 mb-4">Cambiar de plan</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {PLANES.map((p) => {
          const actual = p.id === planActual.id;
          return (
            <Card key={p.id} className={`p-6 border-border/60 ${actual ? "ring-2 ring-accent" : ""}`}>
              <div className={`inline-block bg-gradient-to-br ${p.color} text-white text-xs font-semibold px-2.5 py-1 rounded`}>{p.nombre.toUpperCase()}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl">${p.precio}</span>
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />{f}</li>)}
              </ul>
              <Button onClick={() => toast.success(`Cambio a ${p.nombre} simulado`)} disabled={actual} className="w-full mt-6" variant={actual ? "outline" : "default"}>
                {actual ? "Plan actual" : `Cambiar a ${p.nombre}`}
              </Button>
            </Card>
          );
        })}
      </div>

      <h2 className="font-display text-2xl mt-12 mb-4">Historial</h2>
      <Card className="border-border/60 p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr><th className="text-left px-4 py-3">Fecha</th><th className="text-left px-4 py-3">Concepto</th><th className="text-left px-4 py-3">Monto</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {[
              { f: "30 May 2026", c: "Plan Oro - Mensual", m: 119 },
              { f: "30 Abr 2026", c: "Plan Oro - Mensual", m: 119 },
              { f: "30 Mar 2026", c: "Plan Plata - Mensual", m: 49 },
            ].map((r, i) => (
              <tr key={i} className="border-t border-border/60">
                <td className="px-4 py-3">{r.f}</td>
                <td className="px-4 py-3">{r.c}</td>
                <td className="px-4 py-3">${r.m}.00</td>
                <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" />Factura</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}