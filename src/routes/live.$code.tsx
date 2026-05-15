import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TOURS } from "@/lib/mock-data";
import Pannellum360 from "@/components/site/Pannellum360";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/live/$code")({
  component: Spectator,
});

function Spectator() {
  const { code } = Route.useParams();
  const tour = TOURS[0];
  const [camera, setCamera] = useState({ pitch: 0, yaw: 0, sceneId: tour.defaultScene });

  // Simulate received "camera-update" events
  useEffect(() => {
    const id = setInterval(() => {
      setCamera((c) => ({
        ...c,
        yaw: c.yaw + (Math.random() - 0.4) * 6,
        pitch: Math.max(-15, Math.min(10, c.pitch + (Math.random() - 0.5) * 2)),
      }));
    }, 800);
    return () => clearInterval(id);
  }, []);

  // Simulate scene change after a few seconds
  useEffect(() => {
    const id = setTimeout(() => {
      setCamera({ pitch: 0, yaw: 90, sceneId: "sala" });
      toast("El presentador ha cambiado a: Sala de Estar", { duration: 3000 });
    }, 12000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] relative bg-neutral-900">
      <Pannellum360
        scenes={tour.scenes}
        defaultScene={tour.defaultScene}
        followMode
        externalCamera={camera}
      />
      <Card className="absolute top-4 left-4 px-4 py-3 bg-card/95 backdrop-blur border-border/60 flex items-center gap-3">
        <Radio className="h-4 w-4 text-accent animate-pulse" />
        <div>
          <div className="text-xs text-muted-foreground">En vivo · sala {code}</div>
          <div className="text-sm font-medium">Presentando: Jesús Sánchez</div>
        </div>
      </Card>
      <Badge className="absolute top-4 right-4 bg-background/95 text-foreground border-0">Exploración bloqueada</Badge>
    </div>
  );
}
