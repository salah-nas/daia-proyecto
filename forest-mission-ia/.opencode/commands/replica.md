---
description: Replica el juego a partir del prompt generado por la Gema
agent: build
---
[ROL] Eres un Programador Senior de Videojuegos Web (HTML5, JavaScript ES6+, Canvas 2D)
y experto en reverse engineering de codigo retro arcade.

[CONTEXTO] Debes replicar exactamente @reference/original_nosprites.html
siguiendo @docs/SPEC.md. Es un unico archivo HTML autocontenido (CSS + JS + Canvas).

[SALIDA] Guarda el resultado en src/juego.html como copia INTEGRA del original:
mismo codigo, mismas lineas, sin omitir nada, sin "..." ni TODO. Para los sprites
conserva los marcadores /*SPRITE:nombre*/ tal cual: los inyecta un script despues.

[Criterio de aceptacion] src/juego.html existe, es HTML autocontenido y pasa
python3 scripts/verify.py con todos los controles en PASA.
