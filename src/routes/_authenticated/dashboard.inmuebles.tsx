import { createFileRoute, Link } from "@tanstack/react-router";
import { TOURS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, Edit3, Eye, Link2, Share2, Trash2, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/inmuebles")({
  component: Inmuebles,
});

function Inmuebles() {
  const [q, setQ] = useState("");
  const data = TOURS.filter((t) => t.titulo.toLowerCase().includes(q.toLowerCase()));

  const copiar = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/tour/${slug}`);
    toast.success("Enlace copiado");
  };
  const wsp = (slug: string, titulo: string) => {
    const url = `${window.location.origin}/tour/${slug}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(`Mira este tour 360°: ${titulo} ${url}`)}`, "_blank");
  };

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl">Mis inmuebles</h1>
          <p className="text-muted-foreground text-sm mt-1">{data.length} propiedades</p>
        </div>
        <Button asChild size="lg" className="gap-2"><Link to="/dashboard/nuevo"><Plus className="h-4 w-4" /> Nuevo tour</Link></Button>
      </div>
      <Card className="p-3 mb-4 border-border/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por título…" className="pl-9 border-0 bg-muted/40" />
        </div>
      </Card>
      <Card className="border-border/60 overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Inmueble</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-left px-4 py-3">Vistas</th>
              <th className="text-left px-4 py-3">Leads</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((t) => (
              <tr key={t.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={t.portada_url} alt="" className="h-12 w-16 rounded object-cover" />
                    <div>
                      <div className="font-medium">{t.titulo}</div>
                      <div className="text-xs text-muted-foreground">{t.ubicacion}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant="secondary">Publicado</Badge></td>
                <td className="px-4 py-3">{t.vistas.toLocaleString()}</td>
                <td className="px-4 py-3">{t.leads}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon"><Link to="/dashboard/editor/$slug" params={{ slug: t.slug }}><Edit3 className="h-4 w-4" /></Link></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link to="/tour/$slug" params={{ slug: t.slug }}><Eye className="h-4 w-4 mr-2" />Ver público</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copiar(t.slug)}><Link2 className="h-4 w-4 mr-2" />Copiar enlace</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => wsp(t.slug, t.titulo)}><Share2 className="h-4 w-4 mr-2" />WhatsApp</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast("Cambiado a borrador")}><EyeOff className="h-4 w-4 mr-2" />Cambiar a borrador</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => toast("Eliminado (mock)")}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}