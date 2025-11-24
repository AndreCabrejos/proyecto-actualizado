/*
  Script: generar presentación PPTX con las diapositivas para exponer
  Uso:
    cd c:\Users\JEAN\Desktop\AAAA\proyecto-actualizado-main
    npm install pptxgenjs
    node .\scripts\generate_slides.js
  Resultado: crea "progreso_niveles.pptx" en la carpeta actual.
*/
const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();

const slides = [
  { title: "Objetivo", bullets: [
      "Mostrar cómo se obtiene y muestra el progreso de horas y niveles.",
      "Ver llamadas al backend, cálculo de progreso y actualización UI."
    ]},
  { title: "Preparar y arrancar", bullets: [
      "Configurar .env en protectoweb-back (DB_*, JWT_SECRET, PORT).",
      "Migraciones y seeds: npx sequelize-cli db:migrate + node insert-seeds.js",
      "Arrancar backend y frontend (npm run dev)."
    ]},
  { title: "Archivos clave (backend)", bullets: [
      "bin/www → arranque y conexión Sequelize",
      "app.js → Express, CORS y montaje de /api",
      "routes/canales.js → rutas públicas/privadas",
      "controllers/statsController.js → getProgress",
      "controllers/viewerLevelController.js → getAll"
    ]},
  { title: "Archivos clave (frontend)", bullets: [
      "src/pages/ViewerPage.jsx → pinta barra y llamadas",
      "src/pages/StreamerPage.jsx → tiempo en vivo (setInterval)",
      "src/services/api.js → cliente Axios y endpoints"
    ]},
  { title: "Flujo de datos al abrir la página", bullets: [
      "GET /api/auth/me (si hay token)",
      "GET /api/viewer-levels → niveles y puntos",
      "GET /api/viewer-stats/:userId → progreso del usuario"
    ]},
  { title: "Cálculo del progreso", bullets: [
      "Niveles: tabla ViewerLevel (DB) → backend expone /api/viewer-levels",
      "Progreso: statsController.getProgress lee ViewerStat y calcula % y faltante",
      "UI: pinta barra con JSON recibido; tiempo en vivo se calcula en cliente"
    ]},
  { title: "Enviar regalo (demostración)", bullets: [
      "UI hace POST /api/regalos/enviar (con token)",
      "giftController actualiza ViewerStat y User.monedas en DB",
      "Respuesta JSON actualizada → frontend actualiza barra y contador"
    ]},
  { title: "Comprobaciones rápidas", bullets: [
      "Si backend no arranca → revisar errores en bin/www y .env",
      "Si /api/viewer-levels vacío → revisar seeds y migraciones",
      "Si CORS → revisar app.js"
    ]},
  { title: "Comandos útiles", bullets: [
      "curl http://localhost:3001/api/viewer-levels",
      "curl http://localhost:3001/api/viewer-stats/1",
      "npx ngrok http 3001 → exponer temporalmente"
    ]}
];

slides.forEach(s => {
  const slide = pptx.addSlide();
  slide.background = { color: "1f1f1f" };
  slide.addText(s.title, { x: 0.5, y: 0.3, fontSize: 28, bold: true, color: "ffffff" });
  slide.addText(s.bullets.map(b => "• " + b).join("\n"), {
    x: 0.5, y: 1.0, fontSize: 16, color: "ffffff", w: 9, h: 4.5, wrap: true
  });
});

pptx.writeFile({ fileName: "progreso_niveles.pptx" })
  .then(() => console.log("Presentación creada: progreso_niveles.pptx"))
  .catch(err => console.error("Error creando PPTX:", err));
