import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  Crosshair,
  Cpu,
  Flame,
  Gauge,
  Keyboard,
  Layers,
  Leaf,
  Menu,
  MousePointerClick,
  Play,
  Shield,
  Skull,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Weapon = {
  id: string;
  code: string;
  label: string;
  name: string;
  role: string;
  fireRate: number;
  damage: number;
  ammo: string;
  spread: number;
  description: string;
  bestFor: string;
};

const WEAPONS: Weapon[] = [
  {
    id: "1",
    code: "01",
    label: "HANDGUN",
    name: "Handgun",
    role: "Precisión",
    fireRate: 14,
    damage: 25,
    ammo: "∞",
    spread: 0.03,
    description:
      "Arma base de la misión. Cadencia equilibrada, munición infinita y total control a media distancia.",
    bestFor: "Reconocimiento y avanzadilla",
  },
  {
    id: "2",
    code: "02",
    label: "HEAVY MACHINE GUN",
    name: "Heavy MG",
    role: "Supresión",
    fireRate: 6,
    damage: 18,
    ammo: "150",
    spread: 0.08,
    description:
      "Fuego automático sostenido. Mantén el gatillo y limpia oleadas completas en pasillos estrechos.",
    bestFor: "Asalto frontal y cobertura",
  },
  {
    id: "3",
    code: "03",
    label: "SHOTGUN",
    name: "Shotgun",
    role: "Cercanía",
    fireRate: 35,
    damage: 15,
    ammo: "30",
    spread: 0.22,
    description:
      "Seis perdigones por disparo con una dispersión amplia. Devastadora cuando el enemigo ya está encima.",
    bestFor: "Emboscadas y esquinas",
  },
  {
    id: "4",
    code: "04",
    label: "ROCKET LAUNCHER",
    name: "Rocket",
    role: "Área",
    fireRate: 45,
    damage: 140,
    ammo: "12",
    spread: 0.01,
    description:
      "Explosión con daño radial que decae con la distancia. Reservada para objetivos duros y grupos compactos.",
    bestFor: "Objetivos blindados",
  },
];

const ENEMIES = [
  {
    type: "Soldier",
    hp: 40,
    speed: "1.6",
    delay: "85",
    threat: "Baja",
    variant: "success" as const,
    note: "Patrulla y dispara en ráfagas cortas.",
  },
  {
    type: "Shotgunner",
    hp: 75,
    speed: "1.1",
    delay: "120",
    threat: "Media",
    variant: "outline" as const,
    note: "Cierra distancia; peligroso en espacios abiertos.",
  },
  {
    type: "Grenadier",
    hp: 100,
    speed: "0.8",
    delay: "150",
    threat: "Alta",
    variant: "danger" as const,
    note: "Lento pero letal: 25 de daño por impacto.",
  },
];

const CONTROLS = [
  { keys: ["A", "D"], alt: "o flechas", action: "Moverse a izquierda y derecha" },
  { keys: ["W", "Space"], alt: "o flecha arriba", action: "Saltar sobre plataformas" },
  { keys: ["Click izq."], alt: "mantener", action: "Disparar el arma activa" },
  { keys: ["1", "2", "3", "4"], alt: "", action: "Cambiar de arma al instante" },
  { keys: ["Rueda"], alt: "del ratón", action: "Ciclar el arsenal" },
  { keys: ["ESC"], alt: "", action: "Pausar o reanudar la partida" },
];

const NAV = [
  { href: "#mision", label: "Campaña" },
  { href: "#arsenal", label: "Arsenal" },
  { href: "#enemigos", label: "Enemigos" },
  { href: "#controles", label: "Controles" },
  { href: "#proyecto", label: "Proyecto" },
];

function PixelPortrait() {
  return (
    <svg
      viewBox="0 0 32 38"
      className="h-full w-full"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="38" fill="#17251f" />
      <rect x="7" y="2" width="18" height="5" fill="#2f4a30" />
      <rect x="5" y="7" width="22" height="3" fill="#3d5c38" />
      <rect x="7" y="10" width="18" height="13" fill="#c79a66" />
      <rect x="7" y="10" width="18" height="4" fill="#2f4a30" />
      <rect x="10" y="16" width="3" height="3" fill="#1a1f1c" />
      <rect x="19" y="16" width="3" height="3" fill="#1a1f1c" />
      <rect x="13" y="21" width="6" height="2" fill="#8a5a3b" />
      <rect x="4" y="23" width="24" height="13" fill="#3d5c38" />
      <rect x="4" y="27" width="24" height="3" fill="#2f4a30" />
      <rect x="14" y="23" width="4" height="13" fill="#56603a" />
      <rect x="1" y="24" width="4" height="10" fill="#c79a66" />
      <rect x="27" y="24" width="4" height="10" fill="#c79a66" />
    </svg>
  );
}

function Keycap({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[2.25rem] items-center justify-center rounded-sm border border-border bg-secondary px-2 py-1 font-mono text-xs font-semibold text-secondary-foreground shadow-[inset_0_-2px_0_hsl(var(--border))]">
      {children}
    </kbd>
  );
}

function StatBar({
  label,
  value,
  max,
  suffix,
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-xs font-semibold text-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-sm bg-secondary">
        <div
          className="h-full bg-primary transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function App() {
  const [activeWeapon, setActiveWeapon] = useState<Weapon>(WEAPONS[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-svh flex-col overflow-x-clip">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 sm:px-8 lg:px-10">
          <a href="#mision" className="group flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center border border-primary/50 bg-forest-800 text-primary">
              <Leaf className="h-4 w-4" aria-hidden="true" />
              <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-primary" />
            </span>
            <span className="leading-none">
              <span className="block font-mono text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                Forest
              </span>
              <span className="mt-1 block font-display text-lg font-bold tracking-tight text-foreground">
                Mission <span className="text-primary">IA</span>
              </span>
            </span>
          </a>

          <nav aria-label="Navegación principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href="#controles">
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                Iniciar misión
              </a>
            </Button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-accent lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="movil-nav"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="movil-nav"
            aria-label="Navegación móvil"
            className="border-t border-border bg-background px-6 py-4 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-sm px-3 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="contenido">
        <section
          id="mision"
          aria-labelledby="mision-title"
          className="hero-field relative overflow-hidden border-b border-border"
        >
          <div
            className="pixel-grid pointer-events-none absolute inset-0 opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:py-28">
            <div className="animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-sm border border-border bg-card/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse-line bg-primary" />
                Operación Verdant · Build 1.0
              </p>
              <h1
                id="mision-title"
                className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl"
              >
                Sobrevive al bosque.{" "}
                <span className="text-primary">Recupera el frente.</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Un pixel arcade de acción lateral donde cada avance cuenta:
                cuatro armas, tres clases enemigas y un terreno de 3.400 píxeles
                que no perdona la indecisión.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <a href="#controles">
                    <Play className="h-4 w-4" aria-hidden="true" />
                    Iniciar misión
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#arsenal">
                    <Crosshair className="h-4 w-4" aria-hidden="true" />
                    Ver arsenal
                  </a>
                </Button>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-5">
                {[
                  { value: "04", label: "Armas" },
                  { value: "17+", label: "Enemigos" },
                  { value: "3400", label: "Px de nivel" },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="mt-1 font-display text-2xl font-bold text-foreground">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <Card className="scanlines relative overflow-hidden border-border/80 bg-card/80 shadow-lg backdrop-blur-sm">
              <div className="relative z-10 flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-1.5 w-1.5 bg-primary" />
                  <span className="h-1.5 w-1.5 bg-muted-foreground/50" />
                  <span className="h-1.5 w-1.5 bg-muted-foreground/30" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Mission Console
                </span>
                <Badge variant="success">En vivo</Badge>
              </div>

              <div className="relative z-10 flex items-stretch gap-3 border-b border-border p-4">
                <div className="h-16 w-14 shrink-0 overflow-hidden border-2 border-muted-foreground/50 bg-forest-800">
                  <PixelPortrait />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Vida
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      100 / 100
                    </span>
                  </div>
                  <div className="health-stripes h-2.5 w-full overflow-hidden rounded-sm bg-secondary">
                    <div className="h-full w-full" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Puntuación
                    </span>
                    <span className="font-mono text-sm font-bold tracking-widest text-primary">
                      00000450
                    </span>
                  </div>
                </div>
              </div>

              <dl className="relative z-10 grid grid-cols-2 divide-x divide-border border-b border-border">
                <div className="p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Nivel
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-bold">01</dd>
                </div>
                <div className="min-w-0 p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Arma activa
                  </dt>
                  <dd className="mt-1 truncate font-display text-lg font-bold text-primary">
                    {activeWeapon.label}
                  </dd>
                </div>
              </dl>

              <div className="relative z-10 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Amenazas cercanas
                  </span>
                  <Shield
                    className="h-3.5 w-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <ul className="mt-3 space-y-2.5">
                  {ENEMIES.map((enemy) => (
                    <li
                      key={enemy.type}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                        <Skull
                          className="h-3 w-3 text-destructive"
                          aria-hidden="true"
                        />
                        {enemy.type}
                      </span>
                      <Badge variant={enemy.variant}>{enemy.threat}</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 flex items-center justify-between gap-3 border-t border-border bg-background/40 px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  ESC · pausar
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Sprites IA
                </span>
              </div>
            </Card>
          </div>
        </section>

        <section
          aria-label="Resumen de la misión"
          className="border-b border-border bg-forest-900/40"
        >
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 divide-x divide-border border-x border-border md:grid-cols-4">
            {[
              { value: "3400", unit: "px", label: "Terreno jugable" },
              { value: "04", unit: "", label: "Armas" },
              { value: "03", unit: "", label: "Clases enemigas" },
              { value: "∞", unit: "", label: "Niveles" },
            ].map((item) => (
              <div key={item.label} className="px-6 py-8 sm:px-8">
                <p className="font-display text-3xl font-bold leading-none text-foreground">
                  {item.value}
                  {item.unit && (
                    <span className="ml-1 font-mono text-xs font-normal text-muted-foreground">
                      {item.unit}
                    </span>
                  )}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="arsenal"
          aria-labelledby="arsenal-title"
          className="border-b border-border py-20 sm:py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
                  02 — Arsenal
                </p>
                <h2
                  id="arsenal-title"
                  className="mt-3 max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl"
                >
                  Cuatro formas de abrirse paso.
                </h2>
                <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                  Cada arma impone un ritmo distinto. Cambia sobre la marcha sin
                  detener la partida: el inventario se adapta al enemigo, no al
                  revés.
                </p>
              </div>
              <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground lg:block">
                Selecciona un arma
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[300px_1fr]">
              <div
                role="group"
                aria-label="Seleccionar arma"
                className="flex flex-col gap-2"
              >
                {WEAPONS.map((weapon) => {
                  const selected = weapon.id === activeWeapon.id;
                  return (
                    <button
                      key={weapon.id}
                      type="button"
                      onClick={() => setActiveWeapon(weapon)}
                      aria-pressed={selected}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-sm border p-4 text-left transition-colors",
                        selected
                          ? "border-primary/70 bg-card"
                          : "border-border bg-transparent hover:bg-accent/60",
                      )}
                    >
                      <span className="border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {weapon.code}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {weapon.name}
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          {weapon.role}
                        </span>
                      </span>
                      <ArrowRight
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          selected ? "text-primary" : "text-muted-foreground",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>

              <Card className="overflow-hidden" aria-live="polite">
                <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border pb-6">
                  <div>
                    <Badge variant="outline">Arma {activeWeapon.code}</Badge>
                    <CardTitle className="mt-3 text-2xl">
                      {activeWeapon.label}
                    </CardTitle>
                    <CardDescription className="mt-2 max-w-lg">
                      {activeWeapon.description}
                    </CardDescription>
                  </div>
                  <span className="hidden h-12 w-12 shrink-0 place-items-center border border-border bg-secondary text-primary sm:grid">
                    {activeWeapon.id === "4" ? (
                      <Flame className="h-5 w-5" aria-hidden="true" />
                    ) : activeWeapon.id === "3" ? (
                      <Crosshair className="h-5 w-5" aria-hidden="true" />
                    ) : activeWeapon.id === "2" ? (
                      <Zap className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Target className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </CardHeader>
                <CardContent className="pt-6">
                  <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
                    {[
                      { label: "Daño", value: activeWeapon.damage },
                      { label: "Cadencia", value: activeWeapon.fireRate },
                      { label: "Munición", value: activeWeapon.ammo },
                      { label: "Dispersión", value: activeWeapon.spread },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          {stat.label}
                        </dt>
                        <dd className="mt-1 font-display text-2xl font-bold text-foreground">
                          {stat.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
                    <StatBar
                      label="Potencial de daño"
                      value={activeWeapon.damage}
                      max={140}
                    />
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        Uso recomendado
                      </span>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {activeWeapon.bestFor}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="enemigos"
          aria-labelledby="enemigos-title"
          className="border-b border-border bg-forest-900/40 py-20 sm:py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
                  03 — Amenazas
                </p>
                <h2
                  id="enemigos-title"
                  className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
                >
                  Tres perfiles, tres respuestas.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                La dificultad escala con cada nivel:{" "}
                <code className="rounded-sm border border-border bg-background px-1.5 py-0.5 font-mono text-[11px] text-primary">
                  hp × (1 + (nivel − 1) × 0.25)
                </code>
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-md border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Estadísticas base de las clases enemigas
                  </caption>
                  <thead>
                    <tr className="border-b border-border bg-background/40">
                      {[
                        "Clase",
                        "Puntos de vida",
                        "Velocidad",
                        "Retardo de disparo",
                        "Amenaza",
                      ].map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="whitespace-nowrap px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ENEMIES.map((enemy) => (
                      <tr
                        key={enemy.type}
                        className="border-b border-border last:border-0"
                      >
                        <th scope="row" className="px-5 py-4 text-left">
                          <span className="block font-semibold text-foreground">
                            {enemy.type}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {enemy.note}
                          </span>
                        </th>
                        <td className="px-5 py-4 font-mono text-sm text-foreground">
                          {enemy.hp}
                        </td>
                        <td className="px-5 py-4 font-mono text-sm text-foreground">
                          {enemy.speed}
                        </td>
                        <td className="px-5 py-4 font-mono text-sm text-foreground">
                          {enemy.delay} f
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={enemy.variant}>{enemy.threat}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section
          id="controles"
          aria-labelledby="controles-title"
          className="border-b border-border py-20 sm:py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
                04 — Controles
              </p>
              <h2
                id="controles-title"
                className="mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Teclado y ratón. Nada más.
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                Sin curvas de aprendizaje artificiales: muévete, salta, dispara
                y cambia de arma. La misión empieza en cuanto pulsas una tecla.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr_0.9fr]">
              <Card>
                <CardHeader className="pb-4">
                  <span className="mb-2 grid h-9 w-9 place-items-center border border-border bg-secondary text-primary">
                    <Keyboard className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <CardTitle className="text-lg">Movimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    {CONTROLS.slice(0, 2).map((control) => (
                      <div key={control.action}>
                        <dt className="flex flex-wrap items-center gap-1.5">
                          {control.keys.map((key) => (
                            <Keycap key={key}>{key}</Keycap>
                          ))}
                          {control.alt && (
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                              {control.alt}
                            </span>
                          )}
                        </dt>
                        <dd className="mt-1.5 text-sm text-muted-foreground">
                          {control.action}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <span className="mb-2 grid h-9 w-9 place-items-center border border-border bg-secondary text-primary">
                    <MousePointerClick className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <CardTitle className="text-lg">Combate</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    {CONTROLS.slice(2).map((control) => (
                      <div key={control.action}>
                        <dt className="flex flex-wrap items-center gap-1.5">
                          {control.keys.map((key) => (
                            <Keycap key={key}>{key}</Keycap>
                          ))}
                          {control.alt && (
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                              {control.alt}
                            </span>
                          )}
                        </dt>
                        <dd className="mt-1.5 text-sm text-muted-foreground">
                          {control.action}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>

              <Card className="flex flex-col justify-between border-primary/30 bg-forest-800/60">
                <CardHeader>
                  <span className="mb-2 grid h-9 w-9 place-items-center border border-primary/40 bg-primary/10 text-primary">
                    <Trophy className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <CardTitle className="text-lg">Objetivo</CardTitle>
                  <CardDescription>
                    Elimina a todos los enemigos del sector y alcanza el extremo
                    derecho del nivel para completar la misión.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Meta
                    </span>
                    <span className="font-mono text-xs font-semibold text-primary">
                      x &gt; 3150 px
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="proyecto"
          aria-labelledby="proyecto-title"
          className="py-20 sm:py-24"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:px-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
                05 — Proyecto
              </p>
              <h2
                id="proyecto-title"
                className="mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Replica autocontenida, sin dependencias externas.
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Forest Mission IA nace como ingeniería inversa de un pixel
                arcade original. La especificación se extrajo línea a línea y el
                resultado se empaqueta en un único archivo HTML: portable,
                reproducible y listo para abrir en cualquier navegador.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  {
                    icon: Layers,
                    title: "Canvas 2D nativo",
                    text: "Render pixel-art con imageSmoothing desactivado y fondo parallax por capas.",
                  },
                  {
                    icon: Cpu,
                    title: "Sprites generados con IA",
                    text: "Fotogramas idle y run para jugador y enemigos, embebidos como Base64.",
                  },
                  {
                    icon: Gauge,
                    title: "Un solo archivo",
                    text: "JS, CSS y assets inlined. Cero peticiones externas en tiempo de ejecución.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center border border-border bg-secondary text-primary">
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Card>
              <CardHeader className="border-b border-border pb-5">
                <CardTitle className="text-lg">Ficha técnica</CardTitle>
                <CardDescription>
                  Stack del artifact generado con Web Artifacts Builder.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <dl className="divide-y divide-border">
                  {[
                    ["Motor de juego", "Canvas 2D"],
                    ["Estética", "Pixel art · 16 bits"],
                    ["Interfaz", "React 19 + TypeScript"],
                    ["Estilos", "Tailwind CSS + shadcn/ui"],
                    ["Empaquetado", "Vite single-file"],
                    ["Entrada", "Teclado + ratón"],
                  ].map(([term, value]) => (
                    <div
                      key={term}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {term}
                      </dt>
                      <dd className="text-right text-sm font-medium text-foreground">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-forest-950">
        <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center border border-primary/40 bg-forest-800 text-primary">
                <Leaf className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-lg font-bold leading-none">
                  Forest Mission <span className="text-primary">IA</span>
                </p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Pixel arcade · Replica autocontenida
                </p>
              </div>
            </div>
            <nav aria-label="Enlaces del pie de página">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              © 2026 Forest Mission IA. Todos los derechos reservados.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Construido con Web Artifacts Builder
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
