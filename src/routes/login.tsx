import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Compass } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Ingresar | Vista360" }, { name: "description", content: "Accede a tu panel de broker." }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthed, hydrated } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("broker@empresa.com");
  const [pwd, setPwd] = useState("Password123");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && isAuthed) nav({ to: "/dashboard" });
  }, [hydrated, isAuthed, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, pwd);
    const isAdmin = /admin/i.test(email);
    const isBroker = /broker|inmo|bienes|realtor/i.test(email);
    nav({ to: isAdmin || isBroker ? "/dashboard" : "/cuenta" });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-primary text-primary-foreground p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6" />
          <span className="font-display text-2xl">Vista360</span>
        </Link>
        <div>
          <h1 className="font-display text-5xl leading-tight">
            Bienvenido de vuelta a tu <span className="italic text-accent">cuartel general</span>.
          </h1>
          <p className="mt-4 text-primary-foreground/70 max-w-md">
            Gestiona tus tours, captura leads y presenta inmuebles en vivo desde un solo lugar.
          </p>
        </div>
        <div className="text-xs text-primary-foreground/50">© 2026 Vista360</div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12 bg-gradient-warm">
        <Card className="w-full max-w-md p-8 shadow-elegant border-border/60">
          <h2 className="font-display text-3xl">Ingresar</h2>
          <p className="text-sm text-muted-foreground mt-1">Usa cualquier credencial — esta es una demo.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="flex gap-2 text-xs">
              <button type="button" onClick={() => setEmail("broker@empresa.com")} className="rounded-md border border-border px-2.5 py-1 hover:bg-muted">Broker demo</button>
              <button type="button" onClick={() => setEmail("cliente@correo.com")} className="rounded-md border border-border px-2.5 py-1 hover:bg-muted">Cliente demo</button>
              <button type="button" onClick={() => setEmail("admin@vista360.com")} className="rounded-md border border-border px-2.5 py-1 hover:bg-muted">Admin demo</button>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e">Email</Label>
              <Input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p">Contraseña</Label>
              <Input id="p" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Ingresando…" : "Ingresar"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-6">
            ¿Sin cuenta? <a href="#" className="text-foreground underline">Crea una gratis</a>
          </p>
        </Card>
      </div>
    </main>
  );
}
