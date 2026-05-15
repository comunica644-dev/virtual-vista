export type Hotspot = {
  id: string;
  pitch: number;
  yaw: number;
  type: "scene" | "info";
  text: string;
  sceneId?: string;
};

export type Scene = {
  id: string;
  title: string;
  panorama: string;
  hotSpots: Hotspot[];
};

export type Tour = {
  id: string;
  slug: string;
  titulo: string;
  precio: number;
  ubicacion: string;
  portada_url: string;
  descripcion: string;
  stats: { habitaciones: number; banos: number; m2: number };
  broker: { id: number; nombre: string; telefono: string; avatar: string };
  extras: string[];
  vistas: number;
  leads: number;
  defaultScene: string;
  scenes: Scene[];
};

// Free demo equirectangular panoramas (Pannellum samples + open-sourced interiors)
const P1 = "https://pannellum.org/images/alma.jpg";
const P2 = "https://pannellum.org/images/cerro-toco-0.jpg";
const P3 = "https://pannellum.org/images/from-tree.jpg";

export const TOURS: Tour[] = [
  {
    id: "tour_881",
    slug: "casa-lago-tachira",
    titulo: "Casa Frente al Lago en Táchira",
    precio: 285000,
    ubicacion: "Táchira, Venezuela",
    portada_url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80",
    descripcion:
      "Espectacular residencia de 250m² frente al lago, con cocina italiana, cerradura biométrica Samsung y vistas panorámicas en cada habitación.",
    stats: { habitaciones: 4, banos: 3, m2: 250 },
    broker: {
      id: 45,
      nombre: "Jesús Sánchez",
      telefono: "+58 414 555 0188",
      avatar: "https://i.pravatar.cc/120?img=12",
    },
    extras: ["Frente al lago", "Cocina italiana", "Cerradura biométrica", "Piscina infinita"],
    vistas: 1248,
    leads: 37,
    defaultScene: "entrada",
    scenes: [
      {
        id: "entrada",
        title: "Entrada y Jardín",
        panorama: P1,
        hotSpots: [
          { id: "h1", pitch: -2, yaw: 88, type: "scene", text: "Entrar a la Sala", sceneId: "sala" },
          { id: "h2", pitch: -8, yaw: -15, type: "info", text: "Cerradura biométrica Samsung" },
        ],
      },
      {
        id: "sala",
        title: "Sala de Estar",
        panorama: P2,
        hotSpots: [
          { id: "h3", pitch: 0, yaw: 180, type: "scene", text: "Volver al jardín", sceneId: "entrada" },
          { id: "h4", pitch: -5, yaw: 45, type: "scene", text: "Ir a la cocina", sceneId: "cocina" },
        ],
      },
      {
        id: "cocina",
        title: "Cocina Italiana",
        panorama: P3,
        hotSpots: [
          { id: "h5", pitch: -3, yaw: -90, type: "scene", text: "Volver a la sala", sceneId: "sala" },
          { id: "h6", pitch: -10, yaw: 30, type: "info", text: "Encimera de mármol Carrara" },
        ],
      },
    ],
  },
  {
    id: "tour_882",
    slug: "penthouse-las-mercedes",
    titulo: "Penthouse Las Mercedes",
    precio: 540000,
    ubicacion: "Caracas, Venezuela",
    portada_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    descripcion: "Penthouse de lujo de 320m² con terraza, jacuzzi y vistas 360° de la ciudad.",
    stats: { habitaciones: 3, banos: 4, m2: 320 },
    broker: {
      id: 47,
      nombre: "María Fernández",
      telefono: "+58 412 555 0145",
      avatar: "https://i.pravatar.cc/120?img=44",
    },
    extras: ["Terraza panorámica", "Jacuzzi exterior", "Smart home", "2 estacionamientos"],
    vistas: 892,
    leads: 24,
    defaultScene: "entrada",
    scenes: [
      {
        id: "entrada",
        title: "Recibidor",
        panorama: P2,
        hotSpots: [{ id: "h1", pitch: 0, yaw: 90, type: "scene", text: "Sala principal", sceneId: "sala" }],
      },
      {
        id: "sala",
        title: "Sala con vistas",
        panorama: P3,
        hotSpots: [{ id: "h2", pitch: 0, yaw: -90, type: "scene", text: "Recibidor", sceneId: "entrada" }],
      },
    ],
  },
  {
    id: "tour_883",
    slug: "loft-chacao",
    titulo: "Loft moderno en Chacao",
    precio: 145000,
    ubicacion: "Chacao, Caracas",
    portada_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    descripcion: "Loft de diseño con doble altura y acabados industriales.",
    stats: { habitaciones: 1, banos: 2, m2: 95 },
    broker: {
      id: 45,
      nombre: "Jesús Sánchez",
      telefono: "+58 414 555 0188",
      avatar: "https://i.pravatar.cc/120?img=12",
    },
    extras: ["Doble altura", "Cocina abierta", "Pet friendly"],
    vistas: 654,
    leads: 18,
    defaultScene: "loft",
    scenes: [
      { id: "loft", title: "Loft", panorama: P1, hotSpots: [] },
    ],
  },
];

export const getTourBySlug = (slug: string) => TOURS.find((t) => t.slug === slug);
