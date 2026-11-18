# docs/SPEC.md — Especificación técnica exacta (ingeniería inversa)

**Fuente de verdad:** `reference/original_nosprites.html` (1198 líneas) y `reference/original.html` (1198 líneas).  
**Nota:** `reference/original_nosprites.html` SÍ EXISTE en el repositorio. Contiene los marcadores `/*SPRITE:playerIdleSprite*/`, `/*SPRITE:playerRunSprite*/`, `/*SPRITE:enemyIdleSprite*/`, `/*SPRITE:enemyRunSprite*/` en lugar de los Base64 reales. El script `scripts/extract_sprites.py` extrae los Base64 de `original.html` a `reference/sprites.json` y genera `original_nosprites.html`.

---

## 1. Constantes y valores exactos

### WEAPONS (líneas 203-208)

```js
const WEAPONS = {
  1: { name: 'HANDGUN', fireRate: 14, damage: 25, speed: 15, spread: 0.03, maxAmmo: Infinity, currentAmmo: Infinity, type: 'single' },
  2: { name: 'HEAVY MACHINE GUN', fireRate: 6, damage: 18, speed: 17, spread: 0.08, maxAmmo: 150, currentAmmo: 150, type: 'auto' },
  3: { name: 'SHOTGUN', fireRate: 35, damage: 15, speed: 13, spread: 0.22, maxAmmo: 30, currentAmmo: 30, pellets: 6, type: 'shotgun' },
  4: { name: 'ROCKET LAUNCHER', fireRate: 45, damage: 140, speed: 11, spread: 0.01, maxAmmo: 12, currentAmmo: 12, type: 'grenade' }
};
```

- `weaponKeys = [1, 2, 3, 4]` (línea 210)
- `currentWeaponKey = 1` (línea 211)
- Distancia de boquilla (`muzzleDistance`) por arma (línea 436): `{ 1: 19, 2: 34, 3: 34, 4: 41 }`

### Jugador (líneas 213-227)

```js
const player = {
  x: 100,
  y: 300,
  width: 44,
  height: 62,
  velX: 0,
  velY: 0,
  speed: 5.5,
  jumpPower: -14.5,
  gravity: 0.6,
  onGround: false,
  facingRight: true,
  lastShot: 0,
  animTimer: 0
};
```

- Límite horizontal: `Math.max(0, Math.min(levelWidth - player.width, player.x))` (línea 628)
- Orientación: `player.facingRight = mouse.worldX >= player.x + player.width / 2` (línea 610)
- Dimensiones de sprite: `SPRITE_FRAME_W = 128`, `SPRITE_FRAME_H = 144` (línea 163)
- Dibujo sprite: `drawW = 74`, `drawH = 80`, 6 fotogramas de movimiento (líneas 512-520)

### Tipos de enemigo (líneas 325-355)

Tipos: `['soldier', 'shotgunner', 'grenadier']`

Configuración base por tipo (líneas 335-337):

| Tipo | HP | Velocidad | shootDelay |
|------|-----|-----------|------------|
| soldier | 40 | 1.6 | 85 |
| shotgunner | 75 | 1.1 | 120 |
| grenadier | 100 | 0.8 | 150 |

Escalado por nivel (líneas 344-345):
- `hp = config.hp * (1 + (level - 1) * 0.25)`
- `maxHp = config.hp * (1 + (level - 1) * 0.25)`

Propiedades al spawnear (líneas 339-354): `x, y, type, width: 44, height: 62, hp, maxHp, speed, shootDelay, shootTimer, muzzleFlash: 0, patrolMin, patrolMax, dir, animTimer`

Daño de balas enemigas por tipo (línea 728):
- shotgunner: 9
- grenadier: 25
- soldado (otro): 12
- Velocidad bala enemiga: 7.5 (línea 726)

### Level (línea 188)
- `levelWidth = 3400`

---

## 2. Variables de estado y su nombre exacto

### Globales (líneas 178-186)
- `width`, `height`
- `gameRunning = false`
- `isPaused = false`
- `score = 0`
- `health = 100`
- `level = 1`
- `cameraX = 0`
- `groundY = 0`
- `worldTime = 0`

### Arrays de entidades (líneas 259-271)
- `bullets = []`
- `enemyBullets = []`
- `grenades = []`
- `enemies = []`
- `particles = []`
- `medkits = []`
- `platforms = []`
- `mountains = []`
- `huts = []`
- `vehicles = []`
- `props = []`
- `pigs = []`
- `watchtowers = []`

### Input (líneas 229-230)
- `keys = {}`
- `mouse = { x: 0, y: 0, isDown: false, worldX: 0, worldY: 0 }`

---

## 3. Eventos de entrada y su efecto

### Teclado (líneas 232-241)
- `keydown` / `keyup` por `e.code`
- `KeyA` / `ArrowLeft`: `player.velX = -player.speed` (línea 591)
- `KeyD` / `ArrowRight`: `player.velX = player.speed` (línea 592)
- `KeyW` / `Space` / `ArrowUp`: salto si `player.onGround`, `player.velY = player.jumpPower`, `player.onGround = false` (líneas 601-604)
- `Digit1`–`Digit4`: cambia `currentWeaponKey` (líneas 234-237)
- `Escape`: `togglePause()` (línea 238)

### Ratón (líneas 242-247)
- `mousemove`: `mouse.x = e.clientX`, `mouse.y = e.clientY`
- `mousedown` (button 0): `mouse.isDown = true`
- `mouseup` (button 0): `mouse.isDown = false`
- Coordenadas mundo (líneas 586-587): `mouse.worldX = mouse.x + cameraX`, `mouse.worldY = mouse.y`

### Rueda (líneas 249-257)
- `wheel`: `deltaY > 0` → siguiente arma; `deltaY < 0` → arma anterior (ciclo 1–4)

---

## 4. Fases del game loop: update() y render()

### update() (líneas 583-796)

Orden de ejecución (solo si `gameRunning && !isPaused`, línea 584):

1. Actualiza `mouse.worldX/Y` sumando `cameraX` (líneas 586-587)
2. Movimiento jugador: `velX = 0`; A/D ajusta `±speed` (líneas 590-592)
3. Timer de animación: `animTimer += 0.25` si se mueve, `0` si no (líneas 595-599)
4. Salto: si tecla de salto y `onGround`, `velY = jumpPower`, `onGround = false` (líneas 601-604)
5. Gravedad: `velY += gravity`; `x += velX`; `y += velY` (líneas 606-608)
6. Orientación hacia el ratón (línea 610)
7. Colisión con plataformas (AABB, solo si `velY >= 0`): ajusta `y`, `velY = 0`, `onGround = true` (líneas 613-626)
8. Clamp de `player.x` a `[0, levelWidth - player.width]` (línea 628)
9. Cámara: `cameraX = player.x - width / 3`, clamp a `[0, levelWidth - width]` (líneas 631-632)
10. Disparo jugador si cadencia cumplida: `player.lastShot++`, `shootWeapon()` si `mouse.isDown && player.lastShot >= fireRate` (líneas 635-640)
11. Balas jugador: movimiento, colisión con enemigos (daño, partículas, puntuación +150 al matar), eliminación por rango/límites (líneas 643-669)
12. Granadas: gravedad `0.3`, suelo en `height - 65`, explosión en suelo (daño radial `dist < 140`, `140 * (1 - dist / 140)`), puntuación +150 por enemigo muerto (líneas 672-694)
13. Enemigos: `muzzleFlash--`, persecución/patrulla, disparo si `shootTimer >= shootDelay` y `distToPlayer < 480` (líneas 697-731)
14. Balas enemigas: movimiento, colisión jugador (daño, partículas, game over si `health <= 0`), eliminación por límites (líneas 734-757)
15. Medkits: colisión cura `health = Math.min(100, health + 35)` (líneas 760-772)
16. Partículas: movimiento y decayo de `life` (líneas 775-781)
17. Victoria: `enemies.length === 0 && player.x > levelWidth - 250` → `triggerLevelClear()` (líneas 783-785)
18. Actualiza HUD: salud, barra de salud, puntuación (8 dígitos con `padStart`), nivel, nombre de arma, `data-weapon`, munición (líneas 788-795)
19. `worldTime += 1` (línea 795)

### render() (líneas 1066-1138)

Orden de dibujado:

1. `ctx.clearRect(0, 0, width, height)` (línea 1067)
2. `ctx.imageSmoothingEnabled = false` (línea 1068)
3. `drawPixelBackdrop()`: cielo, nubes, montañas lejanas y cercanas (parallax), treeline, arbustos, cerca, tierra, río con puente y boulders, hierba (línea 1069)
4. `huts.forEach(drawHut)` (línea 1072)
5. `vehicles.forEach(drawVehicle)` (línea 1073)
6. `watchtowers.forEach(drawWatchtower)` (línea 1074)
7. `props.forEach(drawProp)` (línea 1075)
8. `pigs.forEach(drawPig)` (línea 1076)
9. `platforms.forEach(...)`: suelo y madera (líneas 1079-1098)
10. `medkits.forEach(...)`: caja con cruz roja (líneas 1101-1107)
11. `drawPlayer(player.x, player.y, player.facingRight)`: sombra, sprite, arma rotada (línea 1109)
12. `enemies.forEach(drawEnemy)`: sprite, barra de vida, destello (línea 1110)
13. `bullets.forEach(...)`: trazadores rotados (líneas 1113-1122)
14. `enemyBullets.forEach(...)`: trazadores rotados (líneas 1123-1127)
15. `grenades.forEach(...)`: proyectil rotado (líneas 1128-1132)
16. `particles.forEach(...)`: rectángulos de color (líneas 1133-1136)

### gameLoop() (líneas 1188-1192)
```js
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}
```
Inicialización: `restartGame()` (línea 1194), `gameLoop()` (línea 1195)

---

## 5. IDs del DOM del HUD y de los modales, y su CSS clave

### HUD (líneas 114-124, contenedor `#ui` en línea 114)

| ID/Clase | Línea | CSS clave |
|----------|-------|-----------|
| `#ui` | 114 | `position: fixed; inset: 6px 7px auto 7px; z-index: 10; display: flex; gap: 5px; pointer-events: none` |
| `#portrait` | 115 | `flex: 0 0 37px; height: 39px; border: 3px solid #89939a` |
| `.health-panel` | 116 | `min-height: 38px; background: rgba(8,13,18,.88); border: 2px solid #89939a` |
| `#healthFill` | 118 | `height: 100%; width: 100%; background: repeating-linear-gradient(90deg,#ff9b1a 0 7px,#ffc144 7px 10px); transition: width .12s linear` |
| `#health` | 119 | `class="hidden-state"` |
| `.score-panel` | 121 | `min-width: 155px; padding: 3px 9px; color: #ffd45a; font-size: clamp(13px,1.8vw,22px); white-space: nowrap` |
| `#score` | 121 | dentro de `.score-panel` |
| `.weapon-panel` | 122 | `margin-left: auto; min-width: 145px; max-width: 300px; padding: 3px 8px; display: flex; align-items: center; justify-content: flex-end; gap: 8px` |
| `#weaponIcon` | 122 | `display:block; flex:0 0 28px; width:28px; height:24px` |
| `#weaponName` | 122 | `display: none` (línea 59 CSS) |
| `#ammo` | 122 | `color: #e6eaf0; letter-spacing: 1px` (línea 60 CSS) |
| `#level` | 123 | `class="hidden-state"` |
| `#controls` | 126 | `position: fixed; bottom: 6px; left: 7px; ... pointer-events: none; z-index: 9` |

### Modales (líneas 130-145)

| ID | Línea | CSS clave |
|----|-------|-----------|
| `.modal` | 79-93 | `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(20, 25, 20, 0.95); border: 3px solid #d4a300; border-radius: 8px; padding: 30px; color: #fff; text-align: center; display: none; z-index: 100` |
| `#gameOver` | 130 | "MISSION FAILED", `#finalScore`, botón `restartGame()` |
| `#levelClear` | 136 | "MISSION COMPLETE!", botón `nextLevel()` |
| `#pauseMenu` | 142 | "PAUSED", "Presiona ESC para continuar" |

---

## 6. Lista de funciones (una línea de descripción cada una)

| Función | Línea | Descripción |
|---------|-------|-------------|
| `resize()` | 190 | Establece `canvas.width/height` desde `window.innerWidth/Height`, calcula `groundY`, desactiva `imageSmoothing` |
| `generateLevel()` | 273 | Genera plataformas, montañas, chozas, vehículos, props, cerdos, torres, medkits y enemigos según `level` |
| `spawnEnemy(x, y, type)` | 334 | Crea un enemigo con stats, rango de patrulla y temporizador de disparo |
| `createParticle(x, y, color, count, speedFactor)` | 357 | Genera partículas de explosión/impacto |
| `shootWeapon()` | 370 | Dispara el arma actual desde la boquilla (bala simple, escopeta multibala o granada) |
| `pixelRect(x, y, w, h, fill, outline)` | 415 | Dibuja un rectángulo pixelado con contorno oscuro |
| `roundedRect(x, y, w, h, r, fill, stroke)` | 421 | Dibuja rectángulo redondeado (usa `ctx.roundRect` si existe) |
| `getPlayerWeaponPose()` | 430 | Calcula ancla, ángulo hacia el ratón y coordenadas de boquilla del arma |
| `drawSelectedWeapon()` | 447 | Dibuja el arma seleccionada pixel-art rotada hacia el puntero, con destello al disparar |
| `drawPlayer(x, y, facingRight)` | 509 | Dibuja jugador: sombra, sprite idle/run (6 frames), volteo horizontal, arma |
| `drawEnemy(e)` | 537 | Dibuja enemigo: sprite, volteo, barra de vida sobre la cabeza, destello de boca |
| `drawMountain(x, baseY, w, h, color, shade)` | 798 | Dibuja una montaña con manchas de vegetación |
| `drawCloud(x, y, scale)` | 824 | Dibuja una nube pixelada |
| `drawTree(x, baseY, scale, tint)` | 832 | Dibuja un árbol con tronco y hojas |
| `drawHut(h)` | 845 | Dibuja una choza con techo, ventana, puerta y porche |
| `drawVehicle(v)` | 879 | Dibuja jeep o camión con ruedas, chasis y estrella militar |
| `drawWatchtower(t)` | 917 | Dibuja torre de vigilancia |
| `drawProp(prop)` | 928 | Dibuja props: sacos, barril, caja, caja médica, henillo |
| `drawPig(p)` | 958 | Dibuja un cerdo pixelado |
| `drawPixelBackdrop()` | 971 | Dibuja todo el fondo parallax (cielo, nubes, montañas, árboles, arbustos, cerca, tierra, río, puente, hierba) |
| `update()` | 583 | Lógica del juego: input, movimiento, colisiones, disparos, enemigos, partículas, victoria/derrota, HUD |
| `render()` | 1066 | Dibujo completo del frame en el orden especificado |
| `triggerGameOver()` | 1140 | Detiene el juego, muestra puntuación final, abre modal gameOver |
| `triggerLevelClear()` | 1146 | Detiene el juego, abre modal levelClear |
| `nextLevel()` | 1151 | Incrementa nivel, reabastece armas 2–4, resetea jugador, regenera nivel, reanuda |
| `togglePause()` | 1164 | Activa/desactiva pausa, muestra/oculta pauseMenu |
| `restartGame()` | 1170 | Resetea puntuación, salud, nivel, armas, jugador, cámara; regenera nivel; reanuda |
| `gameLoop()` | 1188 | Llama `update()` + `render()` y `requestAnimationFrame(gameLoop)` |

---

## 7. Generación de niveles y escalado de dificultad

### Suelo y plataformas
- `levelWidth = 3400`
- Suelo: `{ x: 0, y: groundY, width: levelWidth, height: 65, type: 'ground' }`
- Chozas decorativas (no son plataformas saltables):
  - `{ x: -45, y: groundY - 112, width: 220, height: 112 }`
  - `{ x: 2050, y: groundY - 108, width: 185, height: 108 }`
- Plataformas flotantes de madera: `for (x = 720; x < levelWidth - 350; x += 1050)`, `pWidth = 120 + random*45`, `pY = groundY - 78 - random*22`, `type: 'wood'`
  - Con probabilidad `0.55` se genera un medkit en `{ x: x + pWidth/2 - 12, y: pY - 25, width: 24, height: 24, active: true }`

### Montañas
- `for (x = -350; x < levelWidth + 900; x += 230)`, semilla determinista con `Math.sin`, color `#1e3828`

### Vehículos
- `{ x: 780, type: 'jeep', scale: 1 }`
- `{ x: 2180, type: 'truck', scale: 1.12 }`
- `{ x: 2920, type: 'jeep', scale: 0.92 }`

### Torres de vigilancia y props
- `watchtowers: { x: 3150, y: groundY - 138, width: 92, height: 138 }`
- Props (fijos): hay, sandbags, crate, barrel, medical-crate en posiciones específicas del nivel

### Cerdos
- `{ x: 24, y: groundY - 24, scale: 0.9 }`
- `{ x: 180, y: groundY - 23, scale: 0.84 }`

### Enemigos
- `enemyCount = 12 + level * 5`
- `enemyX = 480 + Math.random() * (levelWidth - 650)`
- Tipo aleatorio entre `['soldier', 'shotgunner', 'grenadier']`
- HP escalado: `config.hp * (1 + (level - 1) * 0.25)`

### Condición de victoria
- `enemies.length === 0 && player.x > levelWidth - 250`

### Reinicio y siguiente nivel
- `restartGame()`: `score=0`, `health=100`, `level=1`, `player.x=100`, `player.y=300`, reabastece armas 2–4, `cameraX=0`, `generateLevel()`
- `nextLevel()`: `level++`, reabastece armas 2–4, `player.x=100`, `generateLevel()`, `player.y = groundY - player.height`

---

## Script de sprites

- `scripts/extract_sprites.py` (11 líneas): lee `reference/original.html`, extrae los 4 Base64 de `.src = 'data:image/png;base64,...'`, los reemplaza por `/*SPRITE:nombre*/` en `reference/original_nosprites.html`, y guarda los Base64 en `reference/sprites.json`.

---

## Datos NO ENCONTRADOS

- Ruta de archivo del HTML final de salida: NO ENCONTRADO
- Proceso de inyección inversa (de `/*SPRITE:nombre*/` a Base64 en el HTML final): NO ENCONTRADO (solo existe `extract_sprites.py` para extraer, no para inyectar)
