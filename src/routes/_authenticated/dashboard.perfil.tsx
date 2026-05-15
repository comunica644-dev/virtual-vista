import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";
import { Crown, Globe, Palette, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/perfil")({
  component: Perfil,
});

function Perfil() {
  const { user } = useAuth();
  const [color, setColor] = useState("#9b6b3f");
  const isOro = user?.plan === "ultra" || user?.plan === "pro";
  const save = (e: React.FormEvent) => { e.preventDefault(); toast.success("Cambios guardados"); };

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">
      <h1 className="font-display text-4xl">Perfil</h1>
      <p className="text-muted-foreground text-sm mt-1">Gestiona cómo te ven tus clientes.</p>

      <form onSubmit={save} className="mt-8 space-y-6">
        <Card className="p-6 border-border/60 space-y-4">
          <h2 className="font-display text-xl">Información pública</h2>
          <div className="flex items-center gap-4">
            <img src={user?.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
            <Button type="button" variant="outline" size="sm" className="gap-2"><Upload className="h-4 w-4" />Cambiar foto</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Nombre completo</Label><Input defaultValue={user?.nombre} /></div>
            <div><Label>Empresa</Label><Input placeholder="Nombre de tu inmobiliaria" /></div>
            <div className="md:col-span-2"><Label>Bio</Label><Textarea rows={3} defaultValue="Especialista en propiedades de lujo." /></div>
            <div><Label>Email</Label><Input defaultValue={user?.email} /></div>
            <div><Label>Teléfono</Label><Input placeholder="+58…" /></div>
          </div>
          <Separator />
          <h3 className="font-medium text-sm">Redes sociales</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <Input placeholder="Instagram" />
            <Input placeholder="Facebook" />
            <Input placeholder="Sitio web" />
          </div>
        </Card>

        <Card className="p-6 border-border/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl flex items-center gap-2"><Palette className="h-5 w-5" /> Marca blanca</h2>
              <p className="text-sm text-muted-foreground mt-1">Personaliza la apariencia de tus tours.</p>
            </div>
            {!isOro && <Badge className="gap-1 bg-amber-100 text-amber-900 border-amber-300"><Crown className="h-3 w-3" /> Plan Oro</Badge>}
          </div>
          <div className={!isOro ? "opacity-50 pointer-events-none" : ""}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Color principal</Label>
                <div className="flex items-center gap-3 mt-1">
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-14 rounded border border-border bg-transparent" />
                  <Input value={color} onChange={(e) => setColor(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Logo corporativo</Label>
                <Button type="button" variant="outline" className="w-full mt-1 gap-2"><Upload className="h-4 w-4" /> Subir logo (SVG/PNG)</Button>
              </div>
              <div className="md:col-span-2">
                <Label className="flex items-center gap-1.5"><Globe className="h-4 w-4" /> Dominio personalizado</Label>
                <Input placeholder="tours.tuinmobiliaria.com" className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1.5">Configura un registro CNAME apuntando a vista360.app</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">Cancelar</Button>
          <Button type="submit">Guardar cambios</Button>
        </div>
      </form>
    </div>
  );
}