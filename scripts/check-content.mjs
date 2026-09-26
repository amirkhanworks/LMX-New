import fs from "node:fs/promises";
import path from "node:path";

const DIR=process.argv[2]||"dist";
const strict=process.argv.includes("--strict");
const BASE="/LMX-NEW/";
let fail=0;

const exists=async p=>{try{await fs.access(p);return true;}catch{return false;}};
const err=(file,msg)=>{console.error(`✗ ${file}: ${msg}`);fail++;};

async function walk(dir){
  const out=[];
  for(const e of await fs.readdir(dir,{withFileTypes:true})){
    const p=path.join(dir,e.name);
    if(e.isDirectory())out.push(...await walk(p));
    else if(/\.(html|js)$/.test(e.name))out.push(p);
  }
  return out;
}

for(const file of await walk(DIR)){
  const src=await fs.readFile(file,"utf8");
  const rel=path.relative(DIR,file);

  if(src.includes("\u2014"))err(rel,"em dash found");
  if(/across the GCC/i.test(src))err(rel,'"across the GCC"');
  if(/under an hour|\b2\s?km\+?/i.test(src))err(rel,"unapproved claim");

  if(!file.endsWith(".html"))continue;

  const visible=src.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g,"");
  const h1=(visible.match(/<h1[\s>]/g)||[]).length;
  if(h1!==1)err(rel,`expected exactly one <h1>, found ${h1}`);

  for(const [tag] of visible.matchAll(/<img\b[^>]*>/g)){
    if(!/\salt=/.test(tag))err(rel,"img without alt");
  }

  for(const [tag] of visible.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)){
    if(!/rel="[^"]*noopener/.test(tag))err(rel,"target=_blank without noopener");
  }

  const refs=[];
  for(const m of visible.matchAll(/\b(?:src|href)=["']([^"']+)["']/g))refs.push(m[1]);
  for(const ref of refs){
    if(ref.startsWith("http:")||ref.startsWith("https:")||ref.startsWith("mailto:")||ref.startsWith("tel:")||ref.startsWith("data:")||ref.startsWith("#")||ref.startsWith("javascript:"))continue;
    const clean=ref.split("#")[0].split("?")[0];
    if(!clean)continue;
    if(clean.startsWith(BASE)){
      const target=path.join(DIR,clean.slice(BASE.length));
      if(!(await exists(target)))err(rel,`missing deployed asset: ${clean}`);
    }else if(clean.startsWith("/")){
      err(rel,`root-relative asset/link outside ${BASE}: ${clean}`);
    }else{
      const target=path.join(path.dirname(file),clean);
      const finalTarget=clean.endsWith("/")?path.join(target,"index.html"):target;
      if(!(await exists(finalTarget)))err(rel,`missing local asset/link: ${clean}`);
    }
  }

  const noCode=visible.replace(/<[^>]+>/g," ").replace(/\s+/g," ");
  if(/\bPLACEHOLDER\b/i.test(noCode))err(rel,"visible PLACEHOLDER text found");
}

if(fail){
  console.error(`\n${fail} content check(s) failed.`);
  process.exit(1);
}
console.log("\n✓ content checks passed");
