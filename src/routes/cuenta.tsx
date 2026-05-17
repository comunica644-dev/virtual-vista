import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Compass, Heart, CalendarCheck, MessageCircle, Radio, LogOut, Search, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/cuenta")({
  component: ClienteLayout,
});

function ClienteLayout() {
  const { isAuthed, hydrated, user, logout } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (hydrated && !isAuthed) nav({ to: "/login" });
    if (hydrated && isAuthed && user && user.rol !== "cliente") nav({ to: "/dashboard" });
  }, [hydrated, isAuthed, user, nav]);

  if (!hydrated || !isAuthed || !user || user.rol !== "cliente") {
    return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Cargando…</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed left-0 top-0 h-screen w-60 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col">
        <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-display text-lg">Vista360</span>
        </Link>
        <nav className="flex-1 p-3 space-y-1 text-sm">
          <NavLink to="/cuenta" active={path === "/cuenta"} icon={LayoutDashboard}>Resumen</NavLink>
          <NavLink to="/cuenta/favoritos" active={path.startsWith("/cuenta/favoritos")} icon={Heart}>Favoritos</NavLink>
          <NavLink to="/cuenta/visitas" active={path.startsWith("/cuenta/visitas")} icon={CalendarCheck}>Mis visitas</NavLink>
          <NavLink to="/cuenta/mensajes" active={path.startsWith("/cuenta/mensajes")} icon={MessageCircle}>Mensajes</NavLink>
          <NavLink to="/cuenta/live" active={path.startsWith("/cuenta/live")} icon={Radio}>Sesión en vivo</NavLink>
          <div className="pt-4 pb-1 px-3 text-[10px] uppercase tracking-wider text-muted-foreground/70">Descubrir</div>
          <NavLink to="/explorar" active={false} icon={Search}>Explorar inmuebles</NavLink>
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <img src={user.avatar} alt={user.nombre} className="h-9 w-9 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.nombre}</div>
              <div className="text-xs text-muted-foreground">Cliente</div>
            </div>
            <button onClick={() => { logout(); nav({ to: "/" }); }} className="text-muted-foreground hover:text-foreground" aria-label="Salir">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      <main className="ml-60"><Outlet /></main>
    </div>
  );
}

function NavLink({ to, active, icon: Icon, children }: { to: string; active: boolean; icon: any; children: React.ReactNode }) {
  return (
    <Link to={to} className={`flex items-center gap-2.5 rounded-md px-3 py-2 transition ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"}`}>
      <Icon className="h-4 w-4" /> {children}
    </Link>
  );
}