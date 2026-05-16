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
  tipo: "casa" | "apartamento" | "penthouse" | "loft" | "local" | "oficina";
  operacion: "venta" | "alquiler";
  precio: number;
  ubicacion: string;
  ciudad: string;
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
    tipo: "casa",
    operacion: "venta",
    precio: 285000,
    ubicacion: "Táchira, Venezuela",
    ciudad: "Táchira",
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
    tipo: "penthouse",
    operacion: "venta",
    precio: 540000,
    ubicacion: "Caracas, Venezuela",
    ciudad: "Caracas",
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
    tipo: "loft",
    operacion: "alquiler",
    precio: 145000,
    ubicacion: "Chacao, Caracas",
    ciudad: "Caracas",
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
  {
    id: "tour_884",
    slug: "apto-centro-valencia",
    titulo: "Apartamento Centro Valencia",
    tipo: "apartamento",
    operacion: "venta",
    precio: 89000,
    ubicacion: "Valencia, Carabobo",
    ciudad: "Valencia",
    portada_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    descripcion: "Apartamento luminoso de 3 habitaciones cerca de todo.",
    stats: { habitaciones: 3, banos: 2, m2: 110 },
    broker: { id: 47, nombre: "María Fernández", telefono: "+58 412 555 0145", avatar: "https://i.pravatar.cc/120?img=44" },
    extras: ["Piscina común", "Gimnasio", "Vigilancia 24h"],
    vistas: 412,
    leads: 9,
    defaultScene: "sala",
    scenes: [
      { id: "sala", title: "Sala", panorama: P2, hotSpots: [{ id: "hh1", pitch: 0, yaw: 90, type: "scene", text: "Cocina", sceneId: "cocina" }] },
      { id: "cocina", title: "Cocina", panorama: P3, hotSpots: [{ id: "hh2", pitch: 0, yaw: -90, type: "scene", text: "Sala", sceneId: "sala" }] },
    ],
  },
  {
    id: "tour_885",
    slug: "local-comercial-maracaibo",
    titulo: "Local Comercial Av. 5 de Julio",
    tipo: "local",
    operacion: "alquiler",
    precio: 1800,
    ubicacion: "Maracaibo, Zulia",
    ciudad: "Maracaibo",
    portada_url: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=80",
    descripcion: "Local comercial 80m² en avenida principal con alto tráfico.",
    stats: { habitaciones: 0, banos: 1, m2: 80 },
    broker: { id: 45, nombre: "Jesús Sánchez", telefono: "+58 414 555 0188", avatar: "https://i.pravatar.cc/120?img=12" },
    extras: ["Esquina", "Vidriera amplia", "Estacionamiento"],
    vistas: 220,
    leads: 5,
    defaultScene: "local",
    scenes: [{ id: "local", title: "Local", panorama: P3, hotSpots: [] }],
  },
  {
    id: "tour_886",
    slug: "oficina-altamira",
    titulo: "Oficina Premium Altamira",
    tipo: "oficina",
    operacion: "alquiler",
    precio: 2200,
    ubicacion: "Altamira, Caracas",
    ciudad: "Caracas",
    portada_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    descripcion: "Oficina amoblada de 140m² en torre ejecutiva.",
    stats: { habitaciones: 0, banos: 2, m2: 140 },
    broker: { id: 47, nombre: "María Fernández", telefono: "+58 412 555 0145", avatar: "https://i.pravatar.cc/120?img=44" },
    extras: ["Amoblada", "Sala de juntas", "Vigilancia 24h"],
    vistas: 311,
    leads: 12,
    defaultScene: "oficina",
    scenes: [{ id: "oficina", title: "Oficina", panorama: P1, hotSpots: [] }],
  },
];

export const getTourBySlug = (slug: string) => TOURS.find((t) => t.slug === slug);

export type BrokerProfile = {
  id: number;
  nombre: string;
  empresa?: string;
  bio: string;
  telefono: string;
  email: string;
  avatar: string;
  portada: string;
  redes: { instagram?: string; facebook?: string; web?: string };
  marca: { color: string; logo?: string; dominio?: string };
  plan: "bronce" | "plata" | "oro";
};

export const BROKERS: BrokerProfile[] = [
  {
    id: 45,
    nombre: "Jesús Sánchez",
    empresa: "Sánchez & Asociados",
    bio: "Especialista en propiedades de lujo en el occidente de Venezuela. 12 años conectando familias con su próximo hogar.",
    telefono: "+58 414 555 0188",
    email: "jesus@sanchezbienes.com",
    avatar: "https://i.pravatar.cc/200?img=12",
    portada: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    redes: { instagram: "@sanchezbienes", facebook: "sanchezbienes", web: "sanchezbienes.com" },
    marca: { color: "#9b6b3f", logo: "", dominio: "sanchezbienes.com" },
    plan: "oro",
  },
  {
    id: 47,
    nombre: "María Fernández",
    empresa: "MF Inmobiliaria",
    bio: "Penthouses, áticos y propiedades exclusivas en Caracas.",
    telefono: "+58 412 555 0145",
    email: "maria@mfinmo.com",
    avatar: "https://i.pravatar.cc/200?img=44",
    portada: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
    redes: { instagram: "@mariafernandez_mf" },
    marca: { color: "#3f6b9b" },
    plan: "plata",
  },
];

export const getBroker = (id: number) => BROKERS.find((b) => b.id === id);
export const toursDeBroker = (id: number) => TOURS.filter((t) => t.broker.id === id);

// Admin mock
export type AdminUser = {
  id: number;
  nombre: string;
  email: string;
  rol: "broker" | "cliente" | "admin";
  plan?: "bronce" | "plata" | "oro";
  estado: "activo" | "bloqueado";
  registro: string;
};

export const ADMIN_USERS: AdminUser[] = [
  { id: 45, nombre: "Jesús Sánchez", email: "jesus@sanchezbienes.com", rol: "broker", plan: "oro", estado: "activo", registro: "2024-08-12" },
  { id: 47, nombre: "María Fernández", email: "maria@mfinmo.com", rol: "broker", plan: "plata", estado: "activo", registro: "2025-01-04" },
  { id: 88, nombre: "Carlos Pérez", email: "carlos@gmail.com", rol: "cliente", estado: "activo", registro: "2025-03-19" },
  { id: 91, nombre: "Lucía Ríos", email: "lucia.rios@hotmail.com", rol: "cliente", estado: "bloqueado", registro: "2025-04-02" },
  { id: 102, nombre: "Pedro Maldonado", email: "pmal@empresa.com", rol: "broker", plan: "bronce", estado: "activo", registro: "2025-05-15" },
];

export const PLANES = [
  { id: "bronce", nombre: "Bronce", precio: 19, tours: 5, color: "from-amber-700/80 to-amber-900", features: ["5 tours activos", "Captura de leads", "Soporte por email"] },
  { id: "plata", nombre: "Plata", precio: 49, tours: 25, color: "from-zinc-400 to-zinc-600", features: ["25 tours activos", "Presentación en vivo", "SEO con IA", "Subdominio personalizado"] },
  { id: "oro", nombre: "Oro", precio: 119, tours: 999, color: "from-amber-400 to-amber-600", features: ["Tours ilimitados", "Marca blanca completa", "Dominio propio", "Analítica avanzada", "Soporte prioritario"] },
] as const;
