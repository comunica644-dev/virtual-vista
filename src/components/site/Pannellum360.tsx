import { useEffect, useRef, useState } from "react";
import type { Scene, Hotspot } from "@/lib/mock-data";

declare global {
  interface Window {
    pannellum?: any;
    __pannellumLoading?: Promise<void>;
  }
}

const PNLM_CSS = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
const PNLM_JS = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";

function loadPannellum(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.pannellum) return Promise.resolve();
  if (window.__pannellumLoading) return window.__pannellumLoading;
  window.__pannellumLoading = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${PNLM_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = PNLM_CSS;
      document.head.appendChild(link);
    }
    const s = document.createElement("script");
    s.src = PNLM_JS;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Pannellum failed to load"));
    document.body.appendChild(s);
  });
  return window.__pannellumLoading;
}

type Props = {
  scenes: Scene[];
  defaultScene: string;
  className?: string;
  editable?: boolean;
  followMode?: boolean; // hide controls if forced-follow
  onSceneChange?: (sceneId: string) => void;
  onCameraMove?: (pitch: number, yaw: number) => void;
  onCanvasClick?: (pitch: number, yaw: number) => void;
  externalCamera?: { pitch: number; yaw: number; sceneId?: string } | null;
  viewerRef?: (v: any) => void;
};

export default function Pannellum360({
  scenes,
  defaultScene,
  className,
  editable = false,
  followMode = false,
  onSceneChange,
  onCameraMove,
  onCanvasClick,
  externalCamera,
  viewerRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewer = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    loadPannellum()
      .then(() => {
        if (!mounted || !containerRef.current || !window.pannellum) return;

        const sceneConfig: Record<string, any> = {};
        for (const s of scenes) {
          sceneConfig[s.id] = {
            title: s.title,
            type: "equirectangular",
            panorama: s.panorama,
            autoLoad: true,
            hotSpots: s.hotSpots.map((h: Hotspot) => ({
              pitch: h.pitch,
              yaw: h.yaw,
              type: h.type,
              text: h.text,
              sceneId: h.sceneId,
            })),
          };
        }

        viewer.current = window.pannellum.viewer(containerRef.current, {
          default: {
            firstScene: defaultScene,
            sceneFadeDuration: 1000,
            autoLoad: true,
            showControls: !followMode,
            showZoomCtrl: !followMode,
            showFullscreenCtrl: !followMode,
            mouseZoom: !followMode,
            draggable: !followMode,
            friction: 0.15,
            touchPanSpeed: 1.2,
            hotSpotDebug: editable,
            backgroundColor: [0.08, 0.08, 0.08],
          },
          scenes: sceneConfig,
        });

        viewer.current.on("load", () => setLoading(false));
        viewer.current.on("error", (e: any) => setError(String(e)));
        viewer.current.on("scenechange", (id: string) => onSceneChange?.(id));
        if (onCameraMove) {
          let last = 0;
          viewer.current.on("mouseup", () => {
            const p = viewer.current.getPitch();
            const y = viewer.current.getYaw();
            onCameraMove(p, y);
          });
          viewer.current.on("touchend", () => {
            const p = viewer.current.getPitch();
            const y = viewer.current.getYaw();
            onCameraMove(p, y);
          });
        }
        if (onCanvasClick) {
          containerRef.current.addEventListener("dblclick", (e: MouseEvent) => {
            try {
              const coords = viewer.current.mouseEventToCoords(e);
              onCanvasClick(coords[0], coords[1]);
            } catch {}
          });
        }
        viewerRef?.(viewer.current);
      })
      .catch((e) => setError(e.message));

    return () => {
      mounted = false;
      try {
        viewer.current?.destroy();
      } catch {}
      viewer.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultScene, scenes.length, editable, followMode]);

  // External camera sync (spectator)
  useEffect(() => {
    if (!externalCamera || !viewer.current) return;
    try {
      if (externalCamera.sceneId && viewer.current.getScene() !== externalCamera.sceneId) {
        viewer.current.loadScene(externalCamera.sceneId, externalCamera.pitch, externalCamera.yaw);
      } else {
        viewer.current.setPitch(externalCamera.pitch, false);
        viewer.current.setYaw(externalCamera.yaw, false);
      }
    } catch {}
  }, [externalCamera]);

  return (
    <div className={`relative w-full h-full bg-neutral-900 ${className ?? ""}`}>
      <div ref={containerRef} className="absolute inset-0" />
      {loading && (
        <div className="absolute inset-0 pano-skeleton flex items-center justify-center text-neutral-400 text-sm">
          Cargando recorrido 360°…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-300 text-sm bg-black/60">
          Error: {error}
        </div>
      )}
    </div>
  );
}
