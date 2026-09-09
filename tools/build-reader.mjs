// Builds a single self-contained reader.html from lessons/*.md and the tracking docs.
// Source of truth is always the markdown; this file only renders it.
// Usage:  node tools/build-reader.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync, watch } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LESSONS_DIR = join(ROOT, "lessons");
const OUT = join(ROOT, "reader.html");

/** Minimal front-matter parser: `key: value`, and `key: [a, b]` arrays. */
function parseFrontMatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let [, key, val] = kv;
    val = val.trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      meta[key] = val.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else {
      meta[key] = val.replace(/^["']|["']$/g, "");
    }
  }
  return { meta, body: raw.slice(m[0].length) };
}

// Module scope: the watcher needs this list too.
const REFERENCE_FILES = [
  ["ROADMAP.md", "Roadmap"],
  ["GLOSSARY.md", "Glossary"],
  ["DECISIONS.md", "Decisions"],
  ["LEARNING_LOG.md", "Learning log"],
];

function build() {
const lessons = existsSync(LESSONS_DIR)
  ? readdirSync(LESSONS_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((file) => {
        const { meta, body } = parseFrontMatter(readFileSync(join(LESSONS_DIR, file), "utf8"));
        return { file, meta, body };
      })
      .sort((a, b) => {
        const key = (l) => (l.meta.id || "0").split(".").map(Number);
        const [as, al] = key(a), [bs, bl] = key(b);
        return as - bs || al - bl;
      })
  : [];

const REFERENCE = REFERENCE_FILES
  .filter(([f]) => existsSync(join(ROOT, f)))
  .map(([file, title]) => ({ file, title, body: readFileSync(join(ROOT, file), "utf8") }));

const marked = readFileSync(join(ROOT, "tools/vendor/marked.umd.js"), "utf8");

// Embed as JSON; escape `<` so a `</script>` inside content can't break out of the tag.
const embed = (v) => JSON.stringify(v).replace(/</g, "\\u003c");

const html = `<title>Rust Learning Reader</title>
<style>
:root{
  --bg:#fbfaf8; --panel:#f2efea; --ink:#1c1a17; --muted:#6b6357; --line:#ddd7cd;
  --accent:#9a3412; --accent-soft:#fdf0e7; --code-bg:#f5f2ec;
  --kw:#9a3412; --str:#3f6212; --com:#8a8175; --num:#7c2d12; --typ:#1e4d6b; --mac:#6b21a8;
  --err:#b91c1c; --warn:#a16207; --help:#0e7490;
  --done:#3f6212; --wip:#a16207; --todo:#a8a29e;
}
:root[data-theme=dark]{
  --bg:#16150f; --panel:#1e1d16; --ink:#e8e3d8; --muted:#9a9384; --line:#33312a;
  --accent:#fb923c; --accent-soft:#2a1c12; --code-bg:#1c1b14;
  --kw:#fb923c; --str:#a3d977; --com:#7c7566; --num:#fbbf24; --typ:#7dd3fc; --mac:#d8b4fe;
  --err:#f87171; --warn:#fbbf24; --help:#67e8f9;
  --done:#a3d977; --wip:#fbbf24; --todo:#57534e;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme=light]){
    --bg:#16150f; --panel:#1e1d16; --ink:#e8e3d8; --muted:#9a9384; --line:#33312a;
    --accent:#fb923c; --accent-soft:#2a1c12; --code-bg:#1c1b14;
    --kw:#fb923c; --str:#a3d977; --com:#7c7566; --num:#fbbf24; --typ:#7dd3fc; --mac:#d8b4fe;
    --err:#f87171; --warn:#fbbf24; --help:#67e8f9;
    --done:#a3d977; --wip:#fbbf24; --todo:#57534e;
  }
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
  font:16px/1.65 ui-serif,Georgia,"Iowan Old Style",Palatino,serif;}
code,pre,kbd{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace}
#wrap{display:flex;min-height:100vh;align-items:flex-start}

/* ---- sidebar ---- */
#side{width:280px;flex:none;background:var(--panel);border-right:1px solid var(--line);
  position:sticky;top:0;height:100vh;overflow-y:auto;padding:22px 0 40px}
#side h1{font-size:15px;margin:0 20px 4px;letter-spacing:.02em}
#side .sub{font-size:12px;color:var(--muted);margin:0 20px 18px;font-family:ui-monospace,monospace}
#side .grp{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);
  margin:20px 20px 7px;font-family:ui-monospace,monospace}
#side a{display:flex;gap:8px;align-items:baseline;padding:6px 20px;text-decoration:none;
  color:var(--ink);font-size:13.5px;line-height:1.4;border-left:2px solid transparent}
#side a:hover{background:var(--accent-soft)}
#side a.on{background:var(--accent-soft);border-left-color:var(--accent);font-weight:600}
#side a .n{font-family:ui-monospace,monospace;font-size:11px;color:var(--muted);flex:none;min-width:22px}
.dot{width:7px;height:7px;border-radius:50%;flex:none;align-self:center;background:var(--todo)}
.dot.complete{background:var(--done)} .dot.in-progress{background:var(--wip)}

/* ---- content ---- */
#main{flex:1;min-width:0;display:flex;justify-content:center;padding:44px 40px 120px}
article{max-width:760px;width:100%}
article h1{font-size:29px;line-height:1.25;margin:0 0 6px;letter-spacing:-.01em}
article h2{font-size:20px;margin:38px 0 12px;padding-bottom:6px;border-bottom:1px solid var(--line)}
article h3{font-size:16.5px;margin:26px 0 8px}
article p,article li{font-size:16px}
article a{color:var(--accent)}
article strong{font-weight:650}
.meta{font-family:ui-monospace,monospace;font-size:12px;color:var(--muted);
  margin:0 0 26px;padding-bottom:16px;border-bottom:1px solid var(--line)}
.meta span+span::before{content:"·";margin:0 8px;opacity:.5}
article :not(pre)>code{background:var(--code-bg);border:1px solid var(--line);border-radius:4px;
  padding:.1em .35em;font-size:.86em}
pre{background:var(--code-bg);border:1px solid var(--line);border-radius:7px;
  padding:14px 16px;overflow-x:auto;font-size:13px;line-height:1.55}
pre code{background:none;border:0;padding:0}
blockquote{margin:18px 0;padding:2px 18px;border-left:3px solid var(--accent);color:var(--muted)}
table{border-collapse:collapse;width:100%;margin:18px 0;font-size:14.5px;display:block;overflow-x:auto}
th,td{border:1px solid var(--line);padding:8px 11px;text-align:left;vertical-align:top}
th{background:var(--panel);font-size:12.5px;letter-spacing:.02em}
hr{border:0;border-top:1px solid var(--line);margin:34px 0}
.nav{display:flex;justify-content:space-between;gap:14px;margin-top:56px;
  padding-top:20px;border-top:1px solid var(--line)}
.nav a{text-decoration:none;color:var(--accent);font-size:14px;font-family:ui-monospace,monospace}
#themeBtn{position:fixed;top:14px;right:16px;z-index:10;background:var(--panel);color:var(--muted);
  border:1px solid var(--line);border-radius:6px;padding:5px 9px;cursor:pointer;font-size:13px}

/* ---- rust syntax ---- */
.k{color:var(--kw)}.s{color:var(--str)}.c{color:var(--com);font-style:italic}
.n{color:var(--num)}.t{color:var(--typ)}.m{color:var(--mac)}
/* ---- rustc output ---- */
.oe{color:var(--err);font-weight:600}.ow{color:var(--warn);font-weight:600}
.oh{color:var(--help)}.od{color:var(--muted)}.oc{color:var(--err)}

@media (max-width:880px){
  #wrap{flex-direction:column}
  #side{width:100%;height:auto;position:static;border-right:0;border-bottom:1px solid var(--line)}
  #main{padding:26px 20px 80px}
}
</style>

<button id="themeBtn">◐</button>
<div id="wrap">
  <nav id="side">
    <h1>Rust Learning</h1>
    <p class="sub">from scratch → production</p>
    <div id="nav"></div>
  </nav>
  <div id="main"><article id="doc"></article></div>
</div>

<script>${marked}</script>
<script>
const LESSONS = ${embed(lessons)};
const REFERENCE = ${embed(REFERENCE)};
const BUILT = ${embed(new Date().toISOString().slice(0, 10))};

/* ---------- Rust highlighting: single pass, so tokens can't nest wrongly ---------- */
const KW = new Set(("as async await break const continue crate dyn else enum extern false fn for " +
  "if impl in let loop match mod move mut pub ref return self Self static struct super trait true " +
  "type unsafe use where while").split(" "));
const TY = new Set(("bool char str String Vec Option Result Some None Ok Err Box Rc Arc RefCell " +
  "HashMap BTreeMap u8 u16 u32 u64 u128 usize i8 i16 i32 i64 i128 isize f32 f64").split(" "));
const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

function rust(src){
  let out = "", i = 0;
  const push = (cls, txt) => out += cls ? \`<span class="\${cls}">\${esc(txt)}</span>\` : esc(txt);
  while (i < src.length) {
    const c = src[i], two = src.slice(i, i + 2);
    if (two === "//") { const j = src.indexOf("\\n", i); const e = j < 0 ? src.length : j; push("c", src.slice(i,e)); i = e; continue; }
    if (two === "/*") { const j = src.indexOf("*/", i + 2); const e = j < 0 ? src.length : j + 2; push("c", src.slice(i,e)); i = e; continue; }
    if (c === '"') { let j = i + 1; while (j < src.length && src[j] !== '"') j += src[j] === "\\\\" ? 2 : 1; push("s", src.slice(i, j + 1)); i = j + 1; continue; }
    if (c === "'") {
      // char literal ('a', '\\n') vs lifetime ('a in &'a str)
      const ch = src.slice(i).match(/^'(\\\\.|[^\\\\'])'/);
      if (ch) { push("s", ch[0]); i += ch[0].length; continue; }
      const lt = src.slice(i).match(/^'[a-zA-Z_]\\w*/);
      if (lt) { push("t", lt[0]); i += lt[0].length; continue; }
    }
    if (c === "#" && src[i+1] === "[") { const j = src.indexOf("]", i); const e = j < 0 ? src.length : j + 1; push("m", src.slice(i,e)); i = e; continue; }
    if (/[0-9]/.test(c)) { const m = src.slice(i).match(/^[0-9][0-9_]*(\\.[0-9_]+)?(\\w+)?/); push("n", m[0]); i += m[0].length; continue; }
    if (/[a-zA-Z_]/.test(c)) {
      const m = src.slice(i).match(/^\\w+/)[0]; i += m.length;
      if (src[i] === "!") { push("m", m + "!"); i++; }
      else if (KW.has(m)) push("k", m);
      else if (TY.has(m) || /^[A-Z]/.test(m)) push("t", m);
      else push(null, m);
      continue;
    }
    push(null, c); i++;
  }
  return out;
}

/* ---------- rustc terminal output: colour the parts that matter ---------- */
function rustcOutput(src){
  return src.split("\\n").map((ln) => {
    const e = esc(ln);
    if (/^error/.test(ln))            return \`<span class="oe">\${e}</span>\`;
    if (/^warning/.test(ln))          return \`<span class="ow">\${e}</span>\`;
    if (/^(help|note)/.test(ln))      return \`<span class="oh">\${e}</span>\`;
    if (/^\\s*-->/.test(ln))           return \`<span class="od">\${e}</span>\`;
    if (/\\^\\^/.test(ln))              return \`<span class="oc">\${e}</span>\`;
    return e;
  }).join("\\n");
}

/* ---------- build the page ---------- */
const ALL = [
  ...LESSONS.map((l, i) => ({
    key: "l" + i, num: l.meta.id || "", title: l.meta.title || l.file,
    stage: l.meta.stage ?? "", stageTitle: l.meta.stage_title || ("Stage " + (l.meta.stage ?? "")),
    status: l.meta.status || "not-started", mins: l.meta.estimated_minutes,
    concepts: l.meta.concepts || [], body: l.body,
  })),
  ...REFERENCE.map((r, i) => ({ key: "r" + i, num: "", title: r.title, stage: "ref", body: r.body })),
];

const nav = document.getElementById("nav");
let lastGroup = null;
for (const d of ALL) {
  const group = d.stage === "ref" ? "Reference" : d.stageTitle;
  if (group !== lastGroup) {
    const h = document.createElement("div");
    h.className = "grp";
    h.textContent = d.stage === "ref" ? "Reference" : \`Stage \${d.stage} — \${d.stageTitle}\`;
    nav.appendChild(h); lastGroup = group;
  }
  const a = document.createElement("a");
  a.href = "#" + d.key; a.dataset.key = d.key;
  a.innerHTML = d.stage === "ref"
    ? \`<span class="n"></span><span>\${esc(d.title)}</span>\`
    : \`<span class="dot \${d.status}"></span><span class="n">\${esc(d.num)}</span><span>\${esc(d.title)}</span>\`;
  nav.appendChild(a);
}

marked.setOptions({ gfm: true, breaks: false });

function render(key){
  const idx = ALL.findIndex((d) => d.key === key);
  const d = ALL[idx < 0 ? 0 : idx];
  const doc = document.getElementById("doc");

  let head = "";
  if (d.stage !== "ref") {
    const bits = [\`Lesson \${d.num}\`];
    if (d.mins) bits.push(\`~\${d.mins} min\`);
    bits.push(d.status.replace("-", " "));
    if (d.concepts.length) bits.push(d.concepts.join(", "));
    head = \`<p class="meta">\${bits.map((b) => \`<span>\${esc(b)}</span>\`).join("")}</p>\`;
  }
  doc.innerHTML = head + marked.parse(d.body);

  // Strip the duplicated H1 that markdown files start with (the meta line covers it).
  const h1 = doc.querySelector("h1");
  if (h1 && d.stage !== "ref") { doc.insertBefore(h1, doc.querySelector(".meta")); }

  for (const code of doc.querySelectorAll("pre code")) {
    const cls = code.className || "";
    if (/language-rust/.test(cls)) code.innerHTML = rust(code.textContent);
    else if (/language-(text|console|output)/.test(cls)) code.innerHTML = rustcOutput(code.textContent);
  }

  const prev = ALL[idx - 1], next = ALL[idx + 1];
  const link = (t, x, arrow) => x ? \`<a href="#\${x.key}">\${arrow === "<" ? "← " : ""}\${esc(x.title)}\${arrow === ">" ? " →" : ""}</a>\` : "<span></span>";
  doc.insertAdjacentHTML("beforeend",
    \`<div class="nav">\${link("prev", prev, "<")}\${link("next", next, ">")}</div>\`);

  for (const a of nav.querySelectorAll("a")) a.classList.toggle("on", a.dataset.key === d.key);
  document.getElementById("main").scrollTo(0, 0);
  window.scrollTo(0, 0);
}

// Click handlers render directly; the hash is updated only for bookmarking. Relying on
// hashchange alone breaks in sandboxed contexts where hash assignment is blocked.
nav.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-key]");
  if (!a) return;
  e.preventDefault();
  try { location.hash = a.dataset.key; } catch {}
  render(a.dataset.key);
});
addEventListener("hashchange", () => render(location.hash.slice(1)));
document.addEventListener("click", (e) => {          // prev/next links inside the article
  const a = e.target.closest("#doc .nav a[href^='#']");
  if (!a) return;
  e.preventDefault();
  const key = a.getAttribute("href").slice(1);
  try { location.hash = key; } catch {}
  render(key);
});
render(location.hash.slice(1) || ALL[0].key);

/* ---------- theme ---------- */
const btn = document.getElementById("themeBtn");
try { const t = localStorage.getItem("theme"); if (t) document.documentElement.dataset.theme = t; } catch {}
btn.onclick = () => {
  const cur = document.documentElement.dataset.theme
    || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const nextT = cur === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextT;
  try { localStorage.setItem("theme", nextT); } catch {}
};
</script>`;

writeFileSync(OUT, html);
const stamp = new Date().toLocaleTimeString();
console.log(`[${stamp}] reader.html: ${lessons.length} lesson(s), ${REFERENCE.length} reference doc(s), ${(html.length / 1024).toFixed(0)} KB`);
}

build();

// --watch: rebuild whenever a lesson or tracking doc changes, so the reader is never stale.
if (process.argv.includes("--watch")) {
  let timer = null;
  const rebuild = () => {
    clearTimeout(timer);            // debounce: editors often fire several events per save
    timer = setTimeout(() => {
      try { build(); } catch (e) { console.error("build failed:", e.message); }
    }, 120);
  };
  if (existsSync(LESSONS_DIR)) watch(LESSONS_DIR, rebuild);
  watch(ROOT, (_, file) => { if (REFERENCE_FILES.some(([f]) => f === file)) rebuild(); });
  console.log("watching lessons/ and tracking docs — Ctrl-C to stop");
}
