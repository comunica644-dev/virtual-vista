import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tourTitle: string;
  onUnlock: () => void;
};

export default function LeadModal({ open, onOpenChange, tourTitle, onUnlock }: Props) {
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("¡Listo! Hemos desbloqueado los detalles.");
    onUnlock();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Lock className="h-5 w-5" />
          </div>
          <DialogTitle className="font-display text-2xl text-center">Desbloquea los detalles</DialogTitle>
          <DialogDescription className="text-center">
            Déjanos tus datos para acceder a la información completa de <b>{tourTitle}</b> y contactar al broker.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="n">Nombre completo</Label>
            <Input id="n" required placeholder="Juan Pérez" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="e">Email</Label>
              <Input id="e" type="email" required placeholder="tu@email.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t">Teléfono</Label>
              <Input id="t" required placeholder="+58 414…" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p">Crea una contraseña</Label>
            <Input id="p" type="password" required minLength={6} placeholder="Mínimo 6 caracteres" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Desbloqueando…" : "Acceder al inmueble"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Al continuar aceptas nuestros términos y la política de privacidad.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
