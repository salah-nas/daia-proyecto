# Proyecto Forest Mission (replica)

## Objetivo
Replicar EXACTAMENTE el juego de reference/original.html en un unico HTML
autocontenido (HTML5 Canvas 2D vanilla, sin librerias externas).

## Reglas inamovibles
- No reinventar mecanicas, valores ni estilo visual.
- Mantener variables de estado: health, level, score, WEAPONS y currentWeaponKey.
- Atajos: A/D, W/Espacio, clic izquierdo, rueda o 1-4, ESC.
- Prohibido alert() y confirm(): usar los modales CSS (gameOver, levelClear, pauseMenu).
- No omitir codigo con "..." en el codigo del juego.

## Sprites (decision de diseno)
- El original lleva 4 sprites en Base64 (~306 KB). NO se reescriben a mano.
- Se trabaja con reference/original.html, donde cada sprite es /*SPRITE:nombre*/.
- scripts/inject_sprites.py inserta el Base64 real en el HTML final.

## Flujo
/analiza -> Plan -> Build (/replica) -> /sprites -> /verifica -> /valida -> /informe
Cada fase escribe un informe en reports/ y no se avanza si falla.

## Estilo
Comentarios explicativos en CSS, configuracion del Canvas, game loop y listeners.
EOF