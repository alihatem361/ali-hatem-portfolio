/**
 * Renders the CV (from src/data/cvData.js) as a standalone, print-ready HTML
 * document. scripts/build-cv.js prints it to a text-based PDF with headless
 * Chrome, so recruiters' ATS software can read it — the previous in-browser
 * html2pdf export rasterised the whole page into an image.
 *
 * Pure string templating with no Node or browser APIs, so it can be shared.
 */

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Links back to the portfolio carry UTMs so visits from the PDF are attributable. */
const withCvUtm = (url, lang) => {
  if (!url || !/alihatem\.me/.test(url)) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}utm_source=cv&utm_medium=pdf&utm_content=${lang}`;
};

const link = (href, text, lang) =>
  href
    ? `<a href="${escapeHtml(withCvUtm(href, lang))}">${escapeHtml(text)}</a>`
    : escapeHtml(text);

const LABELS = {
  en: {
    summary: "Summary",
    experience: "Work Experience",
    skills: "Skills",
    projects: "Selected Projects",
    education: "Education",
    certificates: "Certificates",
    awards: "Awards",
    volunteering: "Volunteering",
    live: "Live",
    demo: "Demo",
    certificate: "Certificate",
  },
  ar: {
    summary: "نبذة",
    experience: "الخبرات العملية",
    skills: "المهارات",
    projects: "مشاريع مختارة",
    education: "التعليم",
    certificates: "الشهادات",
    awards: "الجوائز",
    volunteering: "العمل التطوعي",
    live: "الموقع",
    demo: "عرض",
    certificate: "الشهادة",
  },
};

const section = (title, body) =>
  body ? `<section><h2>${escapeHtml(title)}</h2>${body}</section>` : "";

export const renderCVDocument = (cv, lang = "en") => {
  const L = LABELS[lang] || LABELS.en;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const p = cv.personal;

  const experience = (cv.experience || [])
    .map(
      (exp) => `
      <div class="item">
        <div class="row"><strong>${escapeHtml(exp.title)}</strong><span class="muted">${escapeHtml(exp.period)}</span></div>
        <div class="muted">${link(exp.companyLink, exp.company, lang)}${exp.location ? ` · ${escapeHtml(exp.location)}` : ""}</div>
        ${exp.description ? `<p>${escapeHtml(exp.description)}</p>` : ""}
        ${
          exp.highlights?.length
            ? `<ul>${exp.highlights
                .map(
                  (h) =>
                    `<li>${escapeHtml(h.text)}${h.link ? ` (${link(h.link, h.linkText || L.demo, lang)})` : ""}</li>`,
                )
                .join("")}</ul>`
            : ""
        }
      </div>`,
    )
    .join("");

  const projects = (cv.projects || [])
    .map(
      (proj) => `
      <div class="item">
        <div class="row"><strong>${escapeHtml(proj.title)}</strong>${proj.link ? `<span>${link(proj.link, proj.linkType === "live" ? L.live : L.demo, lang)}</span>` : ""}</div>
        ${proj.description ? `<p>${escapeHtml(proj.description)}</p>` : ""}
      </div>`,
    )
    .join("");

  const education = cv.education
    ? `<div class="item">
        <div class="row"><strong>${escapeHtml(cv.education.degree)}</strong><span class="muted">${escapeHtml(cv.education.period)}</span></div>
        <div class="muted">${escapeHtml(cv.education.university)}${cv.education.location ? ` · ${escapeHtml(cv.education.location)}` : ""}${cv.education.major ? ` · ${escapeHtml(cv.education.major)}` : ""}${cv.education.grade ? ` · ${escapeHtml(cv.education.grade)}` : ""}</div>
      </div>`
    : "";

  const certificates = (cv.certificates || [])
    .map(
      (c) =>
        `<li>${link(c.link, c.title, lang)}${c.issuer ? ` — ${escapeHtml(c.issuer)}` : ""}${c.description ? `: ${escapeHtml(c.description)}` : ""}</li>`,
    )
    .join("");

  const awards = (cv.awards || [])
    .map(
      (a) =>
        `<li>${link(a.link, a.title, lang)}${a.description ? `: ${escapeHtml(a.description)}` : ""}</li>`,
    )
    .join("");

  const volunteering = (cv.volunteering || [])
    .map(
      (v) =>
        `<li><strong>${escapeHtml(v.title)}</strong>${v.organization ? ` — ${escapeHtml(v.organization)}` : ""}${v.period ? ` <span class="muted">(${escapeHtml(v.period)})</span>` : ""}</li>`,
    )
    .join("");

  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(p.name)} — CV</title>
<style>
  @page { size: A4; margin: 14mm 14mm 14mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, "Noto Sans Arabic", sans-serif; color: #222; font-size: 10.5pt; line-height: 1.45; margin: 0; }
  header { border-bottom: 2px solid #b8962e; padding-bottom: 8px; margin-bottom: 10px; }
  h1 { font-size: 20pt; margin: 0; color: #111; }
  .title { font-size: 11.5pt; margin: 2px 0 6px; color: #444; }
  .contact { font-size: 9.5pt; color: #333; }
  .contact span + span::before { content: " · "; color: #999; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: .04em; color: #111; border-bottom: 1px solid #ddd; padding-bottom: 2px; margin: 12px 0 6px; }
  .item { margin-bottom: 7px; break-inside: avoid; }
  .row { display: flex; justify-content: space-between; gap: 12px; }
  .muted { color: #666; font-size: 9.5pt; }
  p { margin: 2px 0 0; }
  ul { margin: 3px 0 0; padding-inline-start: 18px; }
  li { margin-bottom: 2px; }
  a { color: #1a4fb5; text-decoration: none; }
</style>
</head>
<body>
<header>
  <h1>${escapeHtml(p.name)}</h1>
  <div class="title">${escapeHtml(p.title)}</div>
  <div class="contact">
    <span><a href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a></span>
    <span>${escapeHtml(p.phone)}</span>
    <span>${escapeHtml(p.location)}</span>
  </div>
  <div class="contact">
    <span>${link(p.portfolio, "alihatem.me", lang)}</span>
    <span>${link(p.linkedin, "LinkedIn", lang)}</span>
    <span>${link(p.github, "GitHub", lang)}</span>
  </div>
</header>
${section(L.summary, cv.objective ? `<p>${escapeHtml(cv.objective)}</p>` : "")}
${section(L.experience, experience)}
${section(L.skills, cv.skills?.length ? `<p>${cv.skills.map(escapeHtml).join(" · ")}</p>` : "")}
${section(L.projects, projects)}
${section(L.education, education)}
${section(L.certificates, certificates && `<ul>${certificates}</ul>`)}
${section(L.awards, awards && `<ul>${awards}</ul>`)}
${section(L.volunteering, volunteering && `<ul>${volunteering}</ul>`)}
</body>
</html>`;
};

/** Public paths of the generated PDFs (written by scripts/build-cv.js). */
export const CV_FILES = {
  en: "/cv/Ali-Hatem-Ramadan-Frontend-Developer-CV.pdf",
  ar: "/cv/Ali-Hatem-Ramadan-CV-AR.pdf",
};
