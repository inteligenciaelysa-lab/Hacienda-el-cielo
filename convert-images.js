const sharp = require("sharp");
const fg = require("fast-glob");
const fs = require("fs");
const path = require("path");

const QUALITY = 75;

const IMAGE_EXTENSIONS = [".webp", ".webp", ".webp"];
const CODE_EXTENSIONS = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".html",
  ".css",
  ".scss",
];

async function convertImages() {
  const images = await fg([
    "**/*.webp",
    "**/*.webp",
    "**/*.webp",
    "!node_modules/**",
    "!dist/**",
    "!build/**",
    "!.git/**",
  ]);

  console.log(`\n📸 Encontradas ${images.length} imágenes...\n`);

  let converted = 0;

  for (const img of images) {
    const webp = img.replace(/\.(jpg|jpeg|png)$/i, ".webp");

    try {
      await sharp(img)
        .webp({
          quality: QUALITY,
          effort: 6,
        })
        .toFile(webp);

      converted++;
      console.log("✔", webp);
    } catch (err) {
      console.log("❌", img);
    }
  }

  return converted;
}

async function replaceRoutes() {
  const files = await fg([
    "**/*.{js,jsx,ts,tsx,html,css,scss}",
    "!node_modules/**",
    "!dist/**",
    "!build/**",
    "!.git/**",
  ]);

  let replaced = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, "utf8");

    let original = content;

    content = content
      .replace(/\.jpg(["'])/gi, ".webp$1")
      .replace(/\.jpeg(["'])/gi, ".webp$1")
      .replace(/\.png(["'])/gi, ".webp$1");

    if (content !== original) {
      fs.writeFileSync(file, content);

      replaced++;
      console.log("🔄", file);
    }
  }

  return replaced;
}

(async () => {
  console.log("\n🚀 Convirtiendo imágenes...\n");

  const converted = await convertImages();

  console.log("\n📝 Actualizando rutas...\n");

  const files = await replaceRoutes();

  console.log("\n==============================");
  console.log(`✅ ${converted} imágenes convertidas`);
  console.log(`✅ ${files} archivos modificados`);
  console.log("==============================\n");
})();