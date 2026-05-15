import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Compass, LayoutDashboard, LogOut, Radio } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthed, hydrated, user, logout } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (hydrated && !isAuthed) nav({ to: "/login" });
  }, [hydrated, isAuthed, nav]);

  if (!hydrated || !isAuthed) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-sm text-muted-foreground">Cargando…</div>
      </div>
    );
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
          <NavLink to="/dashboard" active={path === "/dashboard"} icon={LayoutDashboard}>Panel</NavLink>
          <NavLink to="/dashboard/live" active={path.startsWith("/dashboard/live")} icon={Radio}>Sesiones en vivo</NavLink>
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <img src={user!.avatar} alt={user!.nombre} className="h-9 w-9 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user!.nombre}</div>
              <div className="text-xs text-muted-foreground capitalize">Plan {user!.plan}</div>
            </div>
            <button onClick={() => { logout(); nav({ to: "/" }); }} className="text-muted-foreground hover:text-foreground" aria-label="Salir">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      <main className="ml-60">
        <Outlet />
      </main>
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
