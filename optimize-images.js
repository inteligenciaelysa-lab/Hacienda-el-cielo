/**
 * optimize-images.js
 *
 * Redimensiona y recomprime imágenes a WebP optimizado.
 * No sobrescribe los originales: guarda los resultados en una carpeta nueva.
 *
 * USO:
 *   1. npm install sharp
 *   2. node optimize-images.js "C:\ruta\a\Nature-Hunting" "C:\ruta\a\Nature-Hunting-opt"
 *
 * Ajusta MAX_WIDTH / MAX_HEIGHT / QUALITY según tus necesidades.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// --- Configuración ---
const MAX_WIDTH = 760;   // ancho máximo de salida (2x el contenedor de 380px, para retina)
const MAX_HEIGHT = 600;  // alto máximo de salida (2x el contenedor de 300px)
const QUALITY = 78;      // calidad WebP (0-100). 75-82 suele ser el punto óptimo.

const [, , inputArg, outputArg] = process.argv;

if (!inputArg) {
  console.error("Uso: node optimize-images.js <carpeta-entrada> [carpeta-salida]");
  process.exit(1);
}

const inputDir = path.resolve(inputArg);
const outputDir = path.resolve(outputArg || inputDir + "-opt");

if (!fs.existsSync(inputDir)) {
  console.error(`No existe la carpeta: ${inputDir}`);
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const VALID_EXT = [".jpg", ".jpeg", ".png", ".webp"];

async function run() {
  const files = fs.readdirSync(inputDir).filter((f) =>
    VALID_EXT.includes(path.extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log("No se encontraron imágenes en la carpeta.");
    return;
  }

  console.log(`Procesando ${files.length} imágenes...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.basename(file, path.extname(file));
    const outputPath = path.join(outputDir, `${baseName}.webp`);

    const beforeSize = fs.statSync(inputPath).size;

    try {
      await sharp(inputPath)
        .resize({
          width: MAX_WIDTH,
          height: MAX_HEIGHT,
          fit: "cover",          // recorta para llenar el tamaño exacto, igual que objectFit: cover en el carrusel
          withoutEnlargement: true, // no agranda imágenes que ya son más chicas
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const afterSize = fs.statSync(outputPath).size;
      totalBefore += beforeSize;
      totalAfter += afterSize;

      const beforeKB = (beforeSize / 1024).toFixed(0);
      const afterKB = (afterSize / 1024).toFixed(0);
      const reduction = (100 - (afterSize / beforeSize) * 100).toFixed(0);

      console.log(`✓ ${file}  ${beforeKB}KB → ${afterKB}KB  (-${reduction}%)`);
    } catch (err) {
      console.error(`✗ Error con ${file}: ${err.message}`);
    }
  }

  console.log("\n--- Resumen ---");
  console.log(`Total antes:  ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total después: ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Reducción total: ${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}%`);
  console.log(`\nImágenes guardadas en: ${outputDir}`);
}

run();