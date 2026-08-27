const projectGrid=document.getElementById("projectGrid");
const compatibilityBody=document.getElementById("compatibilityBody");
const filters=document.getElementById("filters");
const dataStatus=document.getElementById("dataStatus");
let projects=[];

function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function formatDate(v){if(!v)return"—";const d=new Date(v);if(Number.isNaN(d.getTime()))return"—";return new Intl.DateTimeFormat(undefined,{year:"numeric",month:"short",day:"numeric"}).format(d);}
function formatNumber(v){const n=Number(v??0);return Number.isFinite(n)?new Intl.NumberFormat().format(n):"0";}

function cardTemplate(p){
 const repoUrl=p.html_url||`https://github.com/ferino75/${p.repo}`;
 const preview=p.preview?`<div class="preview has-image"><img src="${escapeHtml(p.preview)}" alt="${escapeHtml(p.name)} screenshot" loading="lazy" decoding="async"></div>`:"";
 const download=p.release_zip_url?`<a class="btn btn-primary btn-small" href="${escapeHtml(p.release_zip_url)}">Download ZIP</a>`:"";
 const release=p.release_html_url?`<a class="btn btn-secondary btn-small" href="${escapeHtml(p.release_html_url)}" target="_blank" rel="noopener">Release</a>`:"";
 const jed=p.jed?`<a class="btn btn-secondary btn-small" href="${escapeHtml(p.jed)}" target="_blank" rel="noopener">JED</a>`:"";
 const php=p.php?`<span class="compat-separator" aria-hidden="true">|</span><span class="compat-item"><img src="./assets/images/php.svg" alt="PHP" class="php-compat-logo"><span>${escapeHtml(p.php)}</span></span>`:"";
 return `<article class="card ${p.featured?"featured":""}" data-category="${escapeHtml(p.category)}">
 <div class="card-top"><div class="project-logo"><img src="${escapeHtml(p.logo)}" alt="${escapeHtml(p.name)} logo" loading="lazy" decoding="async"></div>
 <div class="badges"><span class="badge accent">${escapeHtml(p.category)}</span>${(p.tags||[]).map(t=>`<span class="badge">${escapeHtml(t)}</span>`).join("")}</div></div>
 ${preview}<h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description)}</p><div class="card-spacer"></div>
 <div class="meta"><span><strong>${escapeHtml(p.release_tag||"No release")}</strong> latest release</span><span>★ ${escapeHtml(p.stargazers_count??0)}</span><span>↓ ${escapeHtml(formatNumber(p.download_count??0))} downloads</span><span>Updated ${escapeHtml(formatDate(p.pushed_at||p.updated_at))}</span></div>
 <div class="card-actions"><span class="compat"><span class="compat-item"><img src="./assets/images/joomla.svg" alt="Joomla" class="joomla-compat-logo"><span>${(p.compatibility||[]).map(v=>escapeHtml(v.replace(/^J/,""))).join(" · ")}</span></span>${php}</span>${download}${release}${jed}<a class="btn btn-secondary btn-small" href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener">GitHub</a></div>
 </article>`;
}

function sortProjects(a){return[...a].sort((x,y)=>{const A=x.pushed_at||x.updated_at||"",B=y.pushed_at||y.updated_at||"";if(!A&&!B)return x.name.localeCompare(y.name);if(!A)return 1;if(!B)return-1;return new Date(B)-new Date(A);});}
function renderProjects(){projectGrid.innerHTML=sortProjects(projects).map(cardTemplate).join("");}
function getJoomlaVersions(){const pref=["J3.10","J4","J5","J6"];const used=new Set(projects.flatMap(p=>p.compatibility||[]));return[...pref.filter(v=>used.has(v)),...[...used].filter(v=>!pref.includes(v)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}))];}
function renderCompatibility(){const versions=getJoomlaVersions();const row=compatibilityBody.closest("table")?.querySelector("thead tr");if(row)row.innerHTML=`<th>Extension</th>${versions.map(v=>`<th><span class="compat-table-version"><img src="./assets/images/joomla.svg" alt="Joomla" class="compat-table-logo"><span>${escapeHtml(v.replace(/^J/,""))}</span></span></th>`).join("")}`;compatibilityBody.innerHTML=projects.map(p=>`<tr><td>${escapeHtml(p.name)}</td>${versions.map(v=>`<td>${(p.compatibility||[]).includes(v)?'<span class="yes">✓</span>':"—"}</td>`).join("")}</tr>`).join("");}
function renderFilters(){const cats=["All",...new Set(projects.map(p=>p.category).filter(Boolean))];filters.innerHTML=cats.map((c,i)=>`<button class="filter ${i===0?"active":""}" type="button" data-filter="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("");filters.onclick=e=>{const b=e.target.closest(".filter");if(!b)return;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".card[data-category]").forEach(card=>card.classList.toggle("hidden",b.dataset.filter!=="All"&&card.dataset.category!==b.dataset.filter));};}

async function loadProjectData(){
 try{
  const r=await fetch("./projects.json",{cache:"no-store"});if(!r.ok)throw new Error(`projects.json ${r.status}`);
  const d=await r.json();projects=Object.entries(d.projects||{}).map(([repo,p])=>({repo,...p}));
  renderProjects();renderCompatibility();renderFilters();
  dataStatus.innerHTML=`<span class="status-dot"></span><span>Repository data refreshed ${escapeHtml(d._meta?.generated_at?formatDate(d._meta.generated_at):"unknown")}</span>`;
 }catch(e){console.error(e);projectGrid.innerHTML=`<article class="card"><h3>Project data unavailable</h3><p>Could not load projects.json.</p></article>`;dataStatus.innerHTML=`<span class="status-dot"></span><span>Repository data is temporarily unavailable</span>`;}
}
const themeToggle=document.getElementById("themeToggle"),savedTheme=localStorage.getItem("fg-theme"),prefersLight=window.matchMedia("(prefers-color-scheme: light)").matches;
function setTheme(t){document.documentElement.dataset.theme=t;localStorage.setItem("fg-theme",t);themeToggle.textContent=t==="light"?"☀":"☾";themeToggle.setAttribute("aria-label",t==="light"?"Switch to dark theme":"Switch to light theme");}
setTheme(savedTheme||(prefersLight?"light":"dark"));themeToggle.addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="light"?"dark":"light"));
document.getElementById("year").textContent=new Date().getFullYear();
loadProjectData();
