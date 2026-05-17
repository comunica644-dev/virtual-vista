import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (user && user.rol !== "admin") nav({ to: "/dashboard" });
  }, [user, nav]);
  if (!user || user.rol !== "admin") {
    return (
      <div className="px-8 py-16 max-w-2xl mx-auto text-center">
        <h1 className="font-display text-3xl">Acceso restringido</h1>
        <p className="text-muted-foreground mt-2">
          Esta sección es solo para administradores. Inicia sesión con un correo que contenga "admin".
        </p>
      </div>
    );
  }
  return <Outlet />;
}