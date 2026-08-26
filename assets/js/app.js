const projects = [
  {
    repo: "plg_content_fgautolightbox",
    name: "FG AutoLightbox",
    category: "Content",
    logo: "https://raw.githubusercontent.com/ferino75/plg_content_fgautolightbox/master/assets/logo.png",
    preview: null,
    compatibility: ["J3.10","J4","J5","J6"],
    php: "7.4+ / 8.3+ native",
    description: "Automatically turns article images into a responsive, accessible lightbox without changing the editor workflow.",
    tags: ["Joomla 3.10–6"],
    jed: null,
    featured: true
  },
  {
    repo: "pkg_fgbackendlangswitcher",
    name: "FG Backend LangSwitcher",
    category: "Administration",
    logo: "https://raw.githubusercontent.com/ferino75/pkg_fgbackendlangswitcher/master/assets/logo.png",
    preview: null,
    compatibility: ["J4","J5","J6"],
    php: "7.4+",
    description: "Lets each Joomla administrator switch the backend language for their own session without changing the site's global language.",
    tags: ["Joomla 4–6"],
    jed: null
  },
  {
    repo: "plg_system_fgadminlogincustom",
    name: "FG Admin Login Customizer",
    category: "Administration",
    logo: "https://raw.githubusercontent.com/ferino75/plg_system_fgadminlogincustom/master/assets/logo.png",
    preview: null,
    compatibility: ["J6"],
    php: "8.1+",
    description: "Customize the Joomla administrator login screen with your own branding, colours, background and front-end styling.",
    tags: ["Joomla 6"],
    jed: null
  },
  {
    repo: "plg_system_fgofflineipwhitelist",
    name: "FG Offline IP Whitelist",
    category: "Security",
    logo: "https://raw.githubusercontent.com/ferino75/plg_system_fgofflineipwhitelist/master/assets/logo.png",
    preview: null,
    compatibility: ["J4","J5","J6"],
    php: "8.0+",
    description: "Allow trusted IP addresses or networks to access a Joomla site while the public frontend is in Offline mode.",
    tags: ["IPv4 · IPv6 · CIDR"],
    jed: null
  },
  {
    repo: "plg_system_fgemailremover",
    name: "FG Email Remover",
    category: "Privacy",
    logo: "https://raw.githubusercontent.com/ferino75/plg_system_fgemailremover/master/assets/logo.png",
    preview: "https://raw.githubusercontent.com/ferino75/plg_system_fgemailremover/refs/heads/master/assets/banner_jed.png",
    compatibility: ["J3.10","J4","J5","J6"],
    php: "7.4+ / 8.1+ native",
    description: "Removes email addresses from public HTML output so literal addresses do not reach automated spam harvesters.",
    tags: ["Joomla 3.10–6"],
    jed: "https://extensions.joomla.org/extension/access-a-security/site-security/email-remover/"
  },
  {
    repo: "plg_fgeditorswitcher",
    name: "FG Editor Switcher",
    category: "Administration",
    logo: "https://raw.githubusercontent.com/ferino75/plg_fgeditorswitcher/master/assets/logo.png",
    preview: null,
    compatibility: ["J4","J5","J6"],
    php: "7.4+",
    description: "Switch between installed Joomla editors directly from the edit screen while preserving unsaved content and your preferred editor choice.",
    tags: ["Joomla 4.2–6"],
    jed: null
  },
  {
    repo: "plg_system_fgremovegenerator",
    name: "FG Remove Generator",
    category: "Security",
    logo: "https://raw.githubusercontent.com/ferino75/plg_system_fgremovegenerator/master/assets/logo.png",
    preview: "https://raw.githubusercontent.com/ferino75/plg_system_fgremovegenerator/master/assets/banner.png",
    compatibility: ["J5","J6"],
    php: "8.1+",
    description: "Removes Joomla generator metadata and optional fingerprinting HTTP response headers to reduce passive CMS and platform identification.",
    tags: ["Joomla 5–6"],
    jed: null
  },
  {
    repo: "plg_system_fgstripcomments",
    name: "FG Strip Comments",
    category: "Administration",
    logo: "https://raw.githubusercontent.com/ferino75/plg_system_fgstripcomments/master/assets/logo.png",
    preview: "https://raw.githubusercontent.com/ferino75/plg_system_fgstripcomments/master/assets/fgstripcomments_banner.svg",
    compatibility: ["J5","J6"],
    php: "8.1+",
    description: "Adds private markers to Joomla content that remain visible to administrators but are removed from the public frontend.",
    tags: ["Joomla 5–6"],
    jed: "https://extensions.joomla.org/extension/extension-specific/extensions-specific-non-sorted/strip-comments/"
  }
];

const projectGrid = document.getElementById("projectGrid");
const compatibilityBody = document.getElementById("compatibilityBody");
const filters = document.getElementById("filters");
const dataStatus = document.getElementById("dataStatus");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined,{year:"numeric",month:"short",day:"numeric"}).format(d);
}

function formatNumber(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number)
    ? new Intl.NumberFormat().format(number)
    : "0";
}

function cardTemplate(project, repoData = {}) {
  const repoUrl = repoData.html_url || `https://github.com/ferino75/${project.repo}`;
  const release = repoData.release_tag || "No release";
  const language = repoData.language || "PHP";
  const stars = repoData.stargazers_count ?? 0;
  const downloads = repoData.download_count ?? 0;
  const updated = formatDate(repoData.pushed_at || repoData.updated_at);

  const preview = project.preview
    ? `<div class="preview has-image"><img src="${escapeHtml(project.preview)}" alt="${escapeHtml(project.name)} screenshot" loading="lazy" decoding="async"></div>`
    : "";

  const downloadButton = repoData.release_zip_url
    ? `<a class="btn btn-primary btn-small" href="${escapeHtml(repoData.release_zip_url)}">Download ZIP</a>`
    : "";

  const releaseButton = repoData.release_html_url
    ? `<a class="btn btn-secondary btn-small" href="${escapeHtml(repoData.release_html_url)}" target="_blank" rel="noopener">Release</a>`
    : "";

  const jedButton = project.jed
    ? `<a class="btn btn-secondary btn-small" href="${escapeHtml(project.jed)}" target="_blank" rel="noopener">JED</a>`
    : "";

  return `
    <article class="card ${project.featured ? "featured" : ""}" data-category="${escapeHtml(project.category)}">
      <div class="card-top">
        <div class="project-logo">
          <img src="${escapeHtml(project.logo)}" alt="${escapeHtml(project.name)} logo" loading="lazy" decoding="async">
        </div>
        <div class="badges">
          <span class="badge accent">${escapeHtml(project.category)}</span>
          ${project.tags.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>

      ${preview}

      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="card-spacer"></div>

      <div class="meta">
        <span><strong>${escapeHtml(release)}</strong> latest release</span>
        <span>★ ${escapeHtml(stars)}</span>
        <span>↓ ${escapeHtml(formatNumber(downloads))} downloads</span>
        <span>${escapeHtml(language)}</span>
        <span>Updated ${escapeHtml(updated)}</span>
      </div>

      <div class="card-actions">
        <span class="compat">
          <span class="compat-item" title="Supported Joomla versions">
            <img
              src="./assets/images/joomla.svg"
              alt="Joomla"
              class="joomla-compat-logo"
              loading="lazy"
              decoding="async"
            >
            <span>${project.compatibility.map(version => version.replace(/^J/, "")).join(" · ")}</span>
          </span>

          <span class="compat-separator" aria-hidden="true">|</span>

          <span class="compat-item" title="Minimum supported PHP version">
            <img
              src="./assets/images/php.svg"
              alt="PHP"
              class="php-compat-logo"
              loading="lazy"
              decoding="async"
            >
            <span>${escapeHtml(project.php || language)}</span>
          </span>
        </span>
        ${downloadButton}
        ${releaseButton}
        ${jedButton}
        <a class="btn btn-secondary btn-small" href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener">GitHub</a>
      </div>
    </article>
  `;
}

function renderProjects(repoMap = {}) {
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = repoMap[a.repo]?.pushed_at || repoMap[a.repo]?.updated_at || "";
    const dateB = repoMap[b.repo]?.pushed_at || repoMap[b.repo]?.updated_at || "";

    // Projects without live metadata stay below projects with a known push date.
    if (!dateA && !dateB) return a.name.localeCompare(b.name);
    if (!dateA) return 1;
    if (!dateB) return -1;

    return new Date(dateB) - new Date(dateA);
  });

  projectGrid.innerHTML = sortedProjects
    .map(p => cardTemplate(p, repoMap[p.repo] || {}))
    .join("");
}

function renderCompatibility() {
  compatibilityBody.innerHTML = projects.map(p => `
    <tr>
      <td>${escapeHtml(p.name)}</td>
      <td>${p.compatibility.includes("J3.10") ? '<span class="yes">✓</span>' : "—"}</td>
      <td>${p.compatibility.includes("J4") ? '<span class="yes">✓</span>' : "—"}</td>
      <td>${p.compatibility.includes("J5") ? '<span class="yes">✓</span>' : "—"}</td>
      <td>${p.compatibility.includes("J6") ? '<span class="yes">✓</span>' : "—"}</td>
    </tr>
  `).join("");
}

function renderFilters() {
  const categories = ["All", ...new Set(projects.map(p => p.category))];
  filters.innerHTML = categories.map((c,i) =>
    `<button class="filter ${i===0 ? "active" : ""}" type="button" data-filter="${escapeHtml(c)}">${escapeHtml(c)}</button>`
  ).join("");

  filters.addEventListener("click", e => {
    const button = e.target.closest(".filter");
    if (!button) return;
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    const category = button.dataset.filter;
    document.querySelectorAll(".card[data-category]").forEach(card => {
      card.classList.toggle("hidden", category !== "All" && card.dataset.category !== category);
    });
  });
}

async function loadProjectData() {
  renderProjects();
  renderCompatibility();
  renderFilters();

  try {
    const response = await fetch("./projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`projects.json ${response.status}`);
    const data = await response.json();
    renderProjects(data.projects || {});

    const generated = data._meta?.generated_at ? formatDate(data._meta.generated_at) : "unknown";
    dataStatus.innerHTML = `<span class="status-dot"></span><span>Repository data refreshed ${escapeHtml(generated)}</span>`;
  } catch {
    dataStatus.innerHTML = `<span class="status-dot"></span><span>Live repository metadata unavailable · static project information shown</span>`;
  }
}

const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("fg-theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("fg-theme", theme);
  themeToggle.textContent = theme === "light" ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
}
setTheme(savedTheme || (prefersLight ? "light" : "dark"));
themeToggle.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));

document.getElementById("year").textContent = new Date().getFullYear();
loadProjectData();
