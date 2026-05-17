import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ADMIN_USERS, PLANES, type AdminUser } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Ban, CheckCircle2, Search, Trash2, Gift } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/usuarios")({
  component: AdminUsers,
});

function AdminUsers() {
  const [list, setList] = useState<AdminUser[]>(ADMIN_USERS);
  const [q, setQ] = useState("");
  const [rol, setRol] = useState<string>("todos");

  const filtered = list.filter((u) => {
    if (rol !== "todos" && u.rol !== rol) return false;
    if (q && !`${u.nombre} ${u.email}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const toggle = (id: number) => {
    setList((l) => l.map((u) => (u.id === id ? { ...u, estado: u.estado === "activo" ? "bloqueado" : "activo" } : u)));
    toast.success("Estado actualizado");
  };
  const remove = (id: number) => {
    setList((l) => l.filter((u) => u.id !== id));
    toast.success("Usuario eliminado");
  };
  const changePlan = (id: number, plan: AdminUser["plan"]) => {
    setList((l) => l.map((u) => (u.id === id ? { ...u, plan } : u)));
    toast.success("Plan actualizado");
  };

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-4xl">Usuarios</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestiona roles, planes y acceso de cada cuenta.</p>
      </div>

      <Card className="p-4 mb-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por nombre o email…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={rol} onValueChange={setRol}>
          <SelectTrigger className="w-full md:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los roles</SelectItem>
            <SelectItem value="broker">Brokers</SelectItem>
            <SelectItem value="cliente">Clientes</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Usuario</th>
                <th className="text-left px-4 py-3">Rol</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Registro</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.nombre}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{u.rol}</td>
                  <td className="px-4 py-3">
                    {u.rol === "broker" ? (
                      <Select value={u.plan} onValueChange={(v) => changePlan(u.id, v as AdminUser["plan"])}>
                        <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PLANES.map((p) => <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.estado === "activo" ? "default" : "destructive"}>{u.estado}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.registro}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toast.success("7 días regalados a " + u.nombre)} title="Regalar días">
                        <Gift className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggle(u.id)} title="Bloquear / activar">
                        {u.estado === "activo" ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => remove(u.id)} title="Eliminar">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}