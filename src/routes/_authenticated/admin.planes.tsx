import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PLANES } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Plan = {
  id: string;
  nombre: string;
  precio: number;
  tours: number;
  color: string;
  features: string[];
};

export const Route = createFileRoute("/_authenticated/admin/planes")({
  component: AdminPlanes,
});

function AdminPlanes() {
  const [planes, setPlanes] = useState<Plan[]>(
    PLANES.map((p) => ({ ...p, features: [...p.features] }))
  );

  const update = (id: string, patch: Partial<Plan>) => {
    setPlanes((l) => l.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };
  const addFeature = (id: string) => update(id, { features: [...planes.find((p) => p.id === id)!.features, "Nueva característica"] });
  const removeFeature = (id: string, i: number) => {
    const p = planes.find((x) => x.id === id)!;
    update(id, { features: p.features.filter((_, idx) => idx !== i) });
  };
  const save = () => toast.success("Planes guardados");

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl">Planes de suscripción</h1>
          <p className="text-muted-foreground text-sm mt-1">Modifica precios, cuotas y beneficios sin tocar código.</p>
        </div>
        <Button size="lg" onClick={save}>Guardar cambios</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {planes.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${p.color}`} />
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Input className="font-display text-xl h-10 max-w-[60%]" value={p.nombre} onChange={(e) => update(p.id, { nombre: e.target.value })} />
                <Badge variant="outline">{p.id}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Precio (USD/mes)</Label>
                  <Input type="number" value={p.precio} onChange={(e) => update(p.id, { precio: Number(e.target.value) })} />
                </div>
                <div>
                  <Label className="text-xs">Tours incluidos</Label>
                  <Input type="number" value={p.tours} onChange={(e) => update(p.id, { tours: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs">Características</Label>
                  <Button variant="ghost" size="sm" onClick={() => addFeature(p.id)} className="h-7 gap-1 text-xs">
                    <Plus className="h-3 w-3" /> Añadir
                  </Button>
                </div>
                <div className="space-y-2">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex gap-1">
                      <Input
                        value={f}
                        onChange={(e) => {
                          const next = [...p.features];
                          next[i] = e.target.value;
                          update(p.id, { features: next });
                        }}
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeFeature(p.id, i)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}