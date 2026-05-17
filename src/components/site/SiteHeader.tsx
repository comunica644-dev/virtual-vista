import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function SiteHeader() {
  const { isAuthed, hydrated, user } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isDash = path.startsWith("/dashboard") || path.startsWith("/cuenta") || path.startsWith("/admin");
  if (isDash) return null;
  const panelTo = user?.rol === "cliente" ? "/cuenta" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Compass className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">Vista360</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex text-sm text-muted-foreground">
          <Link to="/explorar" className="hover:text-foreground transition">Explorar</Link>
          <a href="#planes" className="hover:text-foreground transition">Para brokers</a>
          <a href="#contacto" className="hover:text-foreground transition">Contacto</a>
        </nav>
        <div className="flex items-center gap-2">
          {hydrated && isAuthed ? (
            <Button asChild size="sm"><Link to={panelTo}>Mi cuenta</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/login">Ingresar</Link></Button>
              <Button asChild size="sm"><Link to="/login">Crear cuenta</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
