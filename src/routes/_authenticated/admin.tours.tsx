import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TOURS, type Tour } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Edit3, Trash2, EyeOff, Eye, ExternalLink } from "lucide-react";

type Row = Tour & { suspendido?: boolean };

export const Route = createFileRoute("/_authenticated/admin/tours")({
  component: AdminTours,
});

function AdminTours() {
  const [rows, setRows] = useState<Row[]>(TOURS);
  const [q, setQ] = useState("");

  const filtered = rows.filter((t) =>
    !q || `${t.titulo} ${t.ciudad} ${t.broker.nombre}`.toLowerCase().includes(q.toLowerCase())
  );

  const suspender = (id: string) => {
    setRows((r) => r.map((t) => (t.id === id ? { ...t, suspendido: !t.suspendido } : t)));
    toast.success("Estado del tour actualizado");
  };
  const eliminar = (id: string) => {
    setRows((r) => r.filter((t) => t.id !== id));
    toast.success("Tour eliminado");
  };

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-4xl">Tours de la plataforma</h1>
        <p className="text-muted-foreground text-sm mt-1">Modera, edita o suspende cualquier recorrido publicado.</p>
      </div>

      <Card className="p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por título, ciudad o broker…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Tour</th>
                <th className="text-left px-4 py-3">Broker</th>
                <th className="text-left px-4 py-3">Precio</th>
                <th className="text-left px-4 py-3">Vistas</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={t.portada_url} alt={t.titulo} className="h-12 w-16 object-cover rounded" />
                      <div>
                        <div className="font-medium">{t.titulo}</div>
                        <div className="text-xs text-muted-foreground">{t.ciudad} · {t.tipo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{t.broker.nombre}</td>
                  <td className="px-4 py-3">${t.precio.toLocaleString()}</td>
                  <td className="px-4 py-3">{t.vistas.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {t.suspendido ? <Badge variant="destructive">Suspendido</Badge> : <Badge>Activo</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link to="/tour/$slug" params={{ slug: t.slug }} target="_blank">
                        <Button variant="ghost" size="sm" title="Ver"><ExternalLink className="h-4 w-4" /></Button>
                      </Link>
                      <Link to="/dashboard/editor/$slug" params={{ slug: t.slug }}>
                        <Button variant="ghost" size="sm" title="Editar"><Edit3 className="h-4 w-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => suspender(t.id)} title="Suspender / activar">
                        {t.suspendido ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => eliminar(t.id)} title="Eliminar">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Sin tours</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}