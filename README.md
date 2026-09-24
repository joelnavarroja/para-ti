# para-ti 🎁

Experiencia web interactiva de cumpleaños: ruleta de casino, quiz de humor interno, un vídeo sorpresa y un reveal final estilo sobre coleccionable.

## Desarrollo

```bash
npm install
npm run dev
```

## Build estático (para desplegar)

```bash
npm run build
```

Genera el sitio 100% estático en `out/`.

## Tests end-to-end (Playwright)

```bash
npx playwright install chromium
npm run build
npx playwright test
```

Corre el recorrido completo, el quiz, el vídeo y comprobaciones responsive en móvil y desktop contra el build de producción.

## Sustituir los assets reales

Ver [`public/assets/README.md`](./public/assets/README.md).

## Despliegue

Conectado a Vercel: cada push a `main` despliega automáticamente.
