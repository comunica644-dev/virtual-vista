import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useVisitas } from "@/lib/cliente-store";
import { toast } from "sonner";

export default function VisitRequestModal({
  open,
  onOpenChange,
  tourSlug,
  tourTitulo,
  brokerNombre,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tourSlug: string;
  tourTitulo: string;
  brokerNombre: string;
}) {
  const { add } = useVisitas();
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("10:00");
  const [modalidad, setModalidad] = useState<"presencial" | "virtual">("presencial");
  const [mensaje, setMensaje] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha) return;
    add({ tourSlug, tourTitulo, brokerNombre, fecha, hora, modalidad, mensaje });
    toast.success("Solicitud enviada", { description: `Te confirmaremos la visita a ${tourTitulo}.` });
    onOpenChange(false);
    setMensaje("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitar visita</DialogTitle>
          <DialogDescription>{tourTitulo} · {brokerNombre}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="f">Fecha</Label>
              <Input id="f" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required min={new Date().toISOString().split("T")[0]} />
            </div>
            <div>
              <Label htmlFor="h">Hora</Label>
              <Input id="h" type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label>Modalidad</Label>
            <div className="mt-1.5 flex gap-2">
              {(["presencial", "virtual"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setModalidad(m)}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm capitalize ${modalidad === m ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="m">Mensaje (opcional)</Label>
            <Textarea id="m" value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Cuéntale al broker qué te interesa ver…" maxLength={400} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Enviar solicitud</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}