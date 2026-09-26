import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import picture from "./plugins/picture.js";
const r=(p)=>fileURLToPath(new URL(p,import.meta.url));
export default defineConfig({base:"/LMX-New/",plugins:[picture()],build:{target:"es2020",cssCodeSplit:false,rollupOptions:{input:{home:r("./index.html"),about:r("./about.html"),services:r("./services.html"),privacy:r("./privacy.html"),notFound:r("./404.html")}}}});
