const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SRC = "./src";
const DIST = "./dist";
const RELEASE = path.join(DIST, "releases");

const ROOT_MANIFEST = "./manifest.json";
const rootManifest = JSON.parse(fs.readFileSync(ROOT_MANIFEST, "utf8"));
const version = rootManifest.version || "1.0.0";

/* ensure folders */
fs.mkdirSync(DIST, { recursive: true });
fs.mkdirSync(RELEASE, { recursive: true });

/* ===== BUNDLE CSS + JS ===== */
const jsFiles = [
  "config/env.js",
  "utils/array-utils.js",
  "utils/browser-storage.js",
  "utils/html-generator.js",
  "networking/fetch-url.js",
  "networking/pfq-service.js",
  "data/repository.js",
  "content.js"
];
const cssFiles = ["styles.css"]; // injected via JS

let bundle = "";

/* inject CSS */
cssFiles.forEach(file => {
  const cssPath = path.join(SRC, file);
  if (!fs.existsSync(cssPath)) {
    console.warn(`CSS file not found: ${file}`);
    return;
  }

  const css = fs.readFileSync(cssPath, "utf8");

  bundle += `
/* ===== ${file} ===== */
(function(){
  if (document.querySelector('style[data-pfq-iv]')) return;

  const css = ${JSON.stringify(css)};
  const style = document.createElement("style");
  style.setAttribute("data-pfq-iv","true");
  style.textContent = css;

  (document.head || document.documentElement || document.body).appendChild(style);
})();
`;
});

/* append JS files in order */
jsFiles.forEach(file => {
  const filePath = path.join(SRC, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`JS file not found: ${file}`);
    return;
  }
  const code = fs.readFileSync(filePath, "utf8");
  bundle += `\n/* ===== ${file} ===== */\n${code}\n`;
});

/* write bundle.js */
fs.writeFileSync(path.join(DIST, "bundle.js"), bundle);
console.log("bundle.js created in dist/");

/* ===== bundle the network-interceptor separately ===== */
const srcInterceptor = path.resolve("src/networking/network-interceptor.js");
const destInterceptor = path.resolve("dist/network-interceptor.js");

if (fs.existsSync(srcInterceptor)) {
  fs.copyFileSync(srcInterceptor, destInterceptor);
  console.log("Copied network-interceptor.js");
} else {
  console.warn("network-interceptor.js not found in src/networking/");
}

/* ===== AUTO-GENERATE MANIFEST FOR DIST ===== */

/* normalize resource paths (strip src/) */
function normalizeResourcePath(p) {
  return p.replace(/^src\/networking\//, "");
}

/* fix web_accessible_resources */
function fixWebAccessibleResources(resources = []) {
  const updated = resources.map(entry => ({
    ...entry,
    resources: (entry.resources || []).map(normalizeResourcePath)
  }));

  // ensure interceptor is included
  const hasInterceptor = updated.some(entry =>
    entry.resources.includes("network-interceptor.js")
  );

  if (!hasInterceptor) {
    updated.push({
      resources: ["network-interceptor.js"],
      matches: ["*://*.pokefarm.com/*"]
    });
  }

  return updated;
}

/* ===== COPY ICONS (SAFE + RESTRICTED) ===== */
function copyIconsFromManifest(manifest) {
  const iconPaths = new Set();

  const collect = (icons) => {
    if (!icons) return;
    Object.values(icons).forEach(file => {
      if (file && file.startsWith("icons/")) {
        iconPaths.add(file);
      }
    });
  };

  collect(manifest.icons);
  collect(manifest.action?.default_icon);

  if (manifest.web_accessible_resources) {
    manifest.web_accessible_resources.forEach(entry => {
      (entry.resources || []).forEach(res => {
        if (res && res.startsWith("icons/")) {
          iconPaths.add(res);
        }
      });
    });
  }

  iconPaths.forEach(iconPath => {
    // 🔥 IMPORTANT: resolve from project ROOT, not SRC
    const srcPath = path.join(".", iconPath);
    const destPath = path.join(DIST, iconPath);

    if (!fs.existsSync(srcPath)) {
      console.warn(`Icon not found: ${iconPath}`);
      return;
    }

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);

    console.log(`Copied icon: ${iconPath}`);
  });
}

const distManifest = {
  ...rootManifest,

  /* fix web_accessible_resources paths automatically */
  web_accessible_resources: fixWebAccessibleResources(
    rootManifest.web_accessible_resources
  ),

  content_scripts: rootManifest.content_scripts.map(cs => ({
    ...cs,
    js: ["bundle.js"], // relative to dist/
    css: []            // remove CSS, already injected
  }))
};

/* write manifest.json to dist */
fs.writeFileSync(
  path.join(DIST, "manifest.json"),
  JSON.stringify(distManifest, null, 2)
);
console.log("dist/manifest.json generated successfully");

/* COPY ICONS AFTER MANIFEST */
copyIconsFromManifest(distManifest);

/* ===== PACKAGE RELEASES ===== */
const zipCmd = `cd ${DIST} && zip -r releases/pfq-${version}.zip bundle.js manifest.json network-interceptor.js icons`;
const xpiCmd = `cd ${DIST} && zip -r releases/pfq-${version}.xpi bundle.js manifest.json network-interceptor.js icons`;

execSync(zipCmd, { stdio: "inherit" });
execSync(xpiCmd, { stdio: "inherit" });

console.log("Build complete:");
console.log(`- ${path.join("dist/releases", `pfq-${version}.zip`)}`);
console.log(`- ${path.join("dist/releases", `pfq-${version}.xpi`)}`);