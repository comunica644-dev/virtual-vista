import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Radio } from "lucide-react";

export const Route = createFileRoute("/cuenta/live")({
  component: ClienteLive,
});

function ClienteLive() {
  const nav = useNavigate();
  const [code, setCode] = useState("");

  const join = (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.trim();
    if (c) nav({ to: "/live/$code", params: { code: c } });
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-display text-4xl">Entrar a sesión en vivo</h1>
      <p className="text-muted-foreground mt-1">Tu broker te enviará un código de 6 dígitos para unirte al recorrido en tiempo real.</p>

      <Card className="mt-8 p-8">
        <div className="flex items-center gap-3 text-accent">
          <Radio className="h-5 w-5 animate-pulse" /> <span className="text-sm font-medium uppercase tracking-wider">Sesión en vivo</span>
        </div>
        <form onSubmit={join} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium">Código de sesión</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: ABC123"
              className="mt-1.5 text-center text-2xl font-display tracking-[0.4em] h-14"
              maxLength={8}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={!code.trim()}>Unirme a la sesión</Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Prueba con cualquier código (ej. <button type="button" onClick={() => setCode("DEMO01")} className="underline">DEMO01</button>)
        </p>
      </Card>
    </div>
  );
}