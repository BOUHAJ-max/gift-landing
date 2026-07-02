let currentConfig = null;

function parseNavLinks(value) {
  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map((item) => {
        if (typeof item === "string") {
          return { label: item, href: "#" };
        }
        return { label: item?.label || "Link", href: item?.href || "#" };
      });
  }

  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: label.trim() || "Link", href: rest.join(" ").trim() || "#" };
    });
}

function parseHeroStats(value) {
  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map((item) => {
        if (typeof item === "string") {
          return { value: item, label: "Highlight" };
        }
        return { value: item?.value || item?.label || "—", label: item?.label || item?.title || "Highlight" };
      });
  }

  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [valuePart, ...rest] = line.split("|");
      return { value: valuePart.trim() || "—", label: rest.join(" ").trim() || "Highlight" };
    });
}

function serializeNavLinks(items) {
  return (items || [])
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }
      return `${item?.label || ""}|${item?.href || ""}`.trim();
    })
    .filter(Boolean)
    .join("\n");
}

function serializeHeroStats(items) {
  return (items || [])
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }
      return `${item?.value || ""}|${item?.label || ""}`.trim();
    })
    .filter(Boolean)
    .join("\n");
}

function isLocalAccess() {
  const hostname = window.location.hostname;
  if (window.location.protocol === "file:") {
    return true;
  }

  return ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostname);
}

function enforceLocalOnly() {
  if (isLocalAccess()) {
    return true;
  }

  document.body.innerHTML = `
    <main style="min-height:100vh;display:grid;place-items:center;padding:2rem;background:#020617;color:#f8fafc;font-family:Inter,system-ui,sans-serif;">
      <section style="max-width:560px;padding:2rem;border-radius:24px;background:rgba(15,23,42,0.95);border:1px solid rgba(255,255,255,0.12);box-shadow:0 20px 60px rgba(0,0,0,0.35);">
        <h1 style="margin-top:0;">Local-only dashboard</h1>
        <p style="line-height:1.7;color:#cbd5e1;">This dashboard is intentionally restricted to localhost. It will not render on public hosts, GitHub Pages, or other remote environments.</p>
      </section>
    </main>`;

  return false;
}

function readFormValues() {
  return {
    offer: {
      campaignName: document.getElementById("campaignName").value,
      offerUrl: document.getElementById("offerUrl").value,
      country: document.getElementById("country").value,
      buttonText: document.getElementById("buttonText").value,
      redirectDelay: Number(document.getElementById("redirectDelay").value || 300),
      enableRedirect: document.getElementById("enableRedirect").checked
    },
    design: {
      primaryColor: document.getElementById("primaryColor").value,
      secondaryColor: document.getElementById("secondaryColor").value,
      accentColor: document.getElementById("accentColor").value,
      theme: document.getElementById("theme").value,
      buttonStyle: document.getElementById("buttonStyle").value,
      borderRadius: Number(document.getElementById("borderRadius").value || 24),
      headingFont: document.getElementById("headingFont").value,
      bodyFont: document.getElementById("bodyFont").value
    },
    content: {
      logoText: document.getElementById("logoText").value,
      headline: document.getElementById("headline").value,
      subtitle: document.getElementById("subtitle").value,
      eyebrow: document.getElementById("heroEyebrow").value,
      heroCardTitle: document.getElementById("heroCardTitle").value,
      heroCardCopy: document.getElementById("heroCardCopy").value,
      heroHighlights: document.getElementById("heroHighlights").value.split("\n").filter(Boolean),
      navLinks: parseNavLinks(document.getElementById("navLinks").value),
      heroStats: parseHeroStats(document.getElementById("heroStats").value),
      ctaTitle: document.getElementById("ctaTitle").value,
      ctaCopy: document.getElementById("ctaCopy").value,
      footerText: document.getElementById("footerText").value,
      trustBadges: document.getElementById("trustBadges").value.split("\n").filter(Boolean),
      features: document.getElementById("features").value.split("\n").filter(Boolean).map((line) => {
        const [title, ...rest] = line.split("|");
        return { title: title || "Feature", description: rest.join(" ").trim() || "Premium feature" };
      }),
      benefits: document.getElementById("benefits").value.split("\n").filter(Boolean).map((line) => ({ title: line, description: "" })),
      steps: document.getElementById("steps").value.split("\n").filter(Boolean).map((line) => {
        const [title, ...rest] = line.split("|");
        return { title: title || "Step", description: rest.join(" ").trim() || "" };
      }),
      faq: document.getElementById("faq").value.split("\n").filter(Boolean).map((line) => {
        const [question, ...rest] = line.split("|");
        return { question: question || "Question", answer: rest.join(" ").trim() || "Answer" };
      }),
      privacyText: document.getElementById("privacyText").value,
      termsText: document.getElementById("termsText").value
    },
    tracking: {
      tiktokPixel: document.getElementById("tiktokPixel").value,
      facebookPixel: document.getElementById("facebookPixel").value,
      gaId: document.getElementById("gaId").value,
      gtmId: document.getElementById("gtmId").value,
      clarityId: document.getElementById("clarityId").value,
      customScript: document.getElementById("customScript").value
    },
    seo: {
      title: document.getElementById("seoTitle").value,
      description: document.getElementById("seoDescription").value,
      keywords: document.getElementById("seoKeywords").value,
      canonical: document.getElementById("canonical").value,
      favicon: document.getElementById("faviconUrl").value
    },
    security: {
      maintenanceMode: document.getElementById("maintenanceMode").checked,
      cookieBanner: document.getElementById("cookieBanner").checked,
      referrerPolicy: document.getElementById("referrerPolicy").value,
      csp: "default-src 'self' https:; img-src 'self' data: https:; script-src 'self' https: 'unsafe-inline'; style-src 'self' https: 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'none'"
    },
    media: {
      logoUrl: document.getElementById("logoUrl").value,
      heroImageUrl: document.getElementById("heroImageUrl").value,
      backgroundImageUrl: document.getElementById("backgroundImageUrl").value,
      faviconUrl: document.getElementById("faviconUrl").value
    }
  };
}

function populateForm(config) {
  document.getElementById("campaignName").value = config.offer.campaignName || "";
  document.getElementById("offerUrl").value = config.offer.offerUrl || "";
  document.getElementById("country").value = config.offer.country || "";
  document.getElementById("buttonText").value = config.offer.buttonText || "";
  document.getElementById("redirectDelay").value = config.offer.redirectDelay || 300;
  document.getElementById("enableRedirect").checked = Boolean(config.offer.enableRedirect);
  document.getElementById("primaryColor").value = config.design.primaryColor || "#7c93ff";
  document.getElementById("secondaryColor").value = config.design.secondaryColor || "#8fffd7";
  document.getElementById("accentColor").value = config.design.accentColor || "#ffffff";
  document.getElementById("theme").value = config.design.theme || "dark";
  document.getElementById("buttonStyle").value = config.design.buttonStyle || "pill";
  document.getElementById("borderRadius").value = config.design.borderRadius || 24;
  document.getElementById("headingFont").value = config.design.headingFont || "Inter";
  document.getElementById("bodyFont").value = config.design.bodyFont || "Inter";
  document.getElementById("logoText").value = config.content.logoText || "";
  document.getElementById("headline").value = config.content.headline || "";
  document.getElementById("subtitle").value = config.content.subtitle || "";
  document.getElementById("heroEyebrow").value = config.content.eyebrow || config.content.heroEyebrow || "";
  document.getElementById("heroCardTitle").value = config.content.heroCardTitle || "";
  document.getElementById("heroCardCopy").value = config.content.heroCardCopy || "";
  document.getElementById("heroHighlights").value = (config.content.heroHighlights || []).join("\n");
  document.getElementById("navLinks").value = serializeNavLinks(config.content.navLinks || [
    { label: "Benefits", href: "#benefits" },
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" }
  ]);
  document.getElementById("heroStats").value = serializeHeroStats(config.content.heroStats || [
    { value: "100%", label: "Clear path to the offer" },
    { value: "24/7", label: "Responsive experience" }
  ]);
  document.getElementById("ctaTitle").value = config.content.ctaTitle || "";
  document.getElementById("ctaCopy").value = config.content.ctaCopy || "";
  document.getElementById("footerText").value = config.content.footerText || "";
  document.getElementById("trustBadges").value = (config.content.trustBadges || []).join("\n");
  document.getElementById("features").value = (config.content.features || []).map((item) => `${item.title}|${item.description}`).join("\n");
  document.getElementById("benefits").value = (config.content.benefits || []).map((item) => item.title || item).join("\n");
  document.getElementById("steps").value = (config.content.steps || []).map((item) => `${item.title}|${item.description}`).join("\n");
  document.getElementById("faq").value = (config.content.faq || []).map((item) => `${item.question}|${item.answer}`).join("\n");
  document.getElementById("logoUrl").value = config.media.logoUrl || "";
  document.getElementById("heroImageUrl").value = config.media.heroImageUrl || "";
  document.getElementById("backgroundImageUrl").value = config.media.backgroundImageUrl || "";
  document.getElementById("seoTitle").value = config.seo.title || "";
  document.getElementById("seoDescription").value = config.seo.description || "";
  document.getElementById("seoKeywords").value = config.seo.keywords || "";
  document.getElementById("canonical").value = config.seo.canonical || "";
  document.getElementById("faviconUrl").value = config.media.faviconUrl || config.seo.favicon || "";
  document.getElementById("tiktokPixel").value = config.tracking.tiktokPixel || "";
  document.getElementById("facebookPixel").value = config.tracking.facebookPixel || "";
  document.getElementById("gaId").value = config.tracking.gaId || "";
  document.getElementById("gtmId").value = config.tracking.gtmId || "";
  document.getElementById("clarityId").value = config.tracking.clarityId || "";
  document.getElementById("customScript").value = config.tracking.customScript || "";
  document.getElementById("privacyText").value = config.content.privacyText || "";
  document.getElementById("termsText").value = config.content.termsText || "";
  document.getElementById("maintenanceMode").checked = Boolean(config.security.maintenanceMode);
  document.getElementById("cookieBanner").checked = Boolean(config.security.cookieBanner);
  document.getElementById("referrerPolicy").value = config.security.referrerPolicy || "strict-origin-when-cross-origin";
}

function saveConfig() {
  const config = readFormValues();
  currentConfig = config;
  localStorage.setItem("cpaLandingConfig", JSON.stringify(config));
  alert("Settings saved locally.");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildExportHtml(config) {
  const title = escapeHtml(config.seo?.title || config.offer?.campaignName || "BOUHAJ Landing Builder");
  const headline = escapeHtml(config.content?.headline || "Premium landing experiences that convert");
  const subtitle = escapeHtml(config.content?.subtitle || "A polished, confident path to your next offer.");
  const eyebrow = escapeHtml(config.content?.eyebrow || "Secure • Transparent • Premium");
  const heroCardTitle = escapeHtml(config.content?.heroCardTitle || "Why it works");
  const heroCardCopy = escapeHtml(config.content?.heroCardCopy || "A calm, premium journey that guides visitors with clarity.");
  const ctaTitle = escapeHtml(config.content?.ctaTitle || "Ready to launch?");
  const ctaCopy = escapeHtml(config.content?.ctaCopy || "Use the configured CTA to move visitors with confidence.");
  const footerText = escapeHtml(config.content?.footerText || "© 2026 BOUHAJ Landing Builder");
  const trustBadges = (config.content?.trustBadges || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const heroHighlights = (config.content?.heroHighlights || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const navLinks = (config.content?.navLinks || []).map((item) => `<a href="${escapeHtml(item.href || item.url || "#")}">${escapeHtml(item.label || item.title || "Link")}</a>`).join("");
  const heroStats = (config.content?.heroStats || []).map((item) => `<div class="stat-card"><strong>${escapeHtml(item.value || item.label || "—")}</strong><span>${escapeHtml(item.label || item.title || "Highlight")}</span></div>`).join("");
  const benefits = (config.content?.benefits || []).map((item) => `<article class="card"><h3>${escapeHtml(item.title || item)}</h3>${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}</article>`).join("");
  const features = (config.content?.features || []).map((item) => `<article class="card"><h3>${escapeHtml(item.title || item)}</h3>${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}</article>`).join("");
  const steps = (config.content?.steps || []).map((item) => `<article class="step"><h3>${escapeHtml(item.title || item)}</h3>${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}</article>`).join("");
  const faq = (config.content?.faq || []).map((item) => `<article class="faq-item"><details><summary>${escapeHtml(item.question || item)}</summary><p>${escapeHtml(item.answer || "")}</p></details></article>`).join("");
  const primaryColor = config.design?.primaryColor || "#7c93ff";
  const secondaryColor = config.design?.secondaryColor || "#8fffd7";
  const accentColor = config.design?.accentColor || "#ffffff";
  const radius = config.design?.borderRadius || 24;
  const buttonText = escapeHtml(config.offer?.buttonText || "Continue");
  const buttonUrl = escapeHtml(config.offer?.offerUrl || "#contact");
  const theme = config.design?.theme || "dark";
  const buttonStyle = config.design?.buttonStyle || "pill";
  const ctaHref = buttonUrl.startsWith("http") ? buttonUrl : `#contact`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${escapeHtml(config.seo?.description || subtitle)}" />
    <meta name="referrer" content="${escapeHtml(config.security?.referrerPolicy || "strict-origin-when-cross-origin")}" />
    <style>
      :root {
        --primary:${primaryColor};
        --secondary:${secondaryColor};
        --accent:${accentColor};
        --radius:${radius}px;
        --bg:${theme === "light" ? "#f6f8ff" : "#050816"};
        --text:${theme === "light" ? "#0f172a" : "#f8fafc"};
        --muted:${theme === "light" ? "#475569" : "#cbd5e1"};
        --surface:${theme === "light" ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.08)"};
        --border:${theme === "light" ? "rgba(15,23,42,0.1)" : "rgba(255,255,255,0.16)"};
        --shadow:${theme === "light" ? "0 24px 70px rgba(15,23,42,0.12)" : "0 24px 70px rgba(7,11,20,0.32)"};
      }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: linear-gradient(135deg, var(--bg), #060b1f); color: var(--text); line-height: 1.65; }
      .container { width: min(1120px, calc(100% - 2rem)); margin: 0 auto; }
      .site-header { position: sticky; top: 0; backdrop-filter: blur(24px); background: rgba(5,8,22,0.72); border-bottom: 1px solid rgba(255,255,255,0.08); }
      .site-header .container { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; }
      .brand { display: inline-flex; align-items: center; gap: 0.75rem; font-weight: 700; color: #fff; }
      .brand-mark { width: 2.4rem; height: 2.4rem; border-radius: 999px; display: grid; place-items: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: #020617; font-weight: 800; }
      .button { display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem; border: 0; border-radius: ${buttonStyle === "rounded" ? "16px" : "999px"}; padding: 0.95rem 1.25rem; font-weight: 700; text-decoration: none; color: #fff; background: linear-gradient(135deg, var(--primary), #4f6dff); box-shadow: 0 18px 34px rgba(79,109,255,0.24); }
      .button.secondary { background: rgba(255,255,255,0.08); color: #fff; box-shadow: none; border: 1px solid rgba(255,255,255,0.16); }
      .hero { padding: 5rem 0 3rem; }
      .hero-grid { display: grid; gap: 2rem; align-items: center; }
      .eyebrow { display: inline-block; padding: 0.45rem 0.7rem; border-radius: 999px; background: rgba(124,147,255,0.16); color: #dbeafe; border: 1px solid rgba(124,147,255,0.24); margin-bottom: 1rem; }
      h1, h2, h3 { margin-top: 0; }
      h1 { font-size: clamp(2.2rem, 4vw, 3.8rem); line-height: 1.06; margin-bottom: 1rem; }
      .hero-copy p { color: var(--muted); font-size: 1.06rem; max-width: 60ch; }
      .hero-actions { display: flex; flex-wrap: wrap; gap: 0.85rem; margin-top: 1.4rem; }
      .trust-badges { display: flex; flex-wrap: wrap; gap: 0.65rem; margin-top: 1rem; }
      .trust-badges span { padding: 0.48rem 0.72rem; border-radius: 999px; background: rgba(124,147,255,0.16); color: #dbeafe; border: 1px solid rgba(124,147,255,0.24); }
      .hero-panel { padding: 1.3rem; background: linear-gradient(140deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04)); border: 1px solid rgba(255,255,255,0.16); border-radius: calc(var(--radius) + 6px); box-shadow: 0 34px 90px rgba(7,11,20,0.35); }
      .panel-card { padding: 1.2rem; border-radius: 20px; background: rgba(5,8,22,0.72); border: 1px solid rgba(255,255,255,0.12); }
      .panel-card p { color: var(--muted); }
      .section { padding: 3rem 0 0.8rem; }
      .section-header { margin-bottom: 1.4rem; max-width: 740px; }
      .cards, .features-grid, .steps, .testimonials, .faq-list { display: grid; gap: 1rem; }
      .card, .step, .testimonial, .faq-item { padding: 1.2rem; border-radius: var(--radius); background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow); }
      .card p, .step p, .testimonial p, .faq-item p { color: var(--muted); }
      .contact-card { padding: 1.4rem; border-radius: var(--radius); background: linear-gradient(135deg, rgba(124,147,255,0.18), rgba(143,255,215,0.11)); border: 1px solid rgba(255,255,255,0.16); }
      .site-footer { padding: 2rem 0 3rem; color: var(--muted); }
      .site-footer .container { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.8rem; }
      @media (min-width: 760px) { .hero-grid { grid-template-columns: 1.1fr 0.95fr; } .cards, .steps, .testimonials { grid-template-columns: repeat(3, minmax(0, 1fr)); } .features-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .faq-list { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    </style>
  </head>
  <body>
    <header class="site-header">
      <div class="container">
        <a class="brand" href="#top"><span class="brand-mark">B</span><span>${title}</span></a>
        <nav class="nav-links">${navLinks}</nav>
        <a class="button" href="${ctaHref}">${buttonText}</a>
      </div>
    </header>
    <main>
      <section class="hero" id="top">
        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="eyebrow">${eyebrow}</span>
            <h1>${headline}</h1>
            <p>${subtitle}</p>
            <div class="hero-actions">
              <a class="button" href="${ctaHref}">${buttonText}</a>
              <a class="button secondary" href="#how-it-works">See how it works</a>
            </div>
            <div class="hero-stats">${heroStats}</div>
            <div class="trust-badges">${trustBadges}</div>
          </div>
          <div class="hero-panel"><div class="panel-card"><h3>${heroCardTitle}</h3><p>${heroCardCopy}</p><ul class="panel-list">${heroHighlights}</ul></div></div>
        </div>
      </section>
      <section class="section" id="benefits"><div class="container"><div class="section-header"><h2>Built to earn trust quickly</h2></div><div class="cards">${benefits}</div></div></section>
      <section class="section" id="features"><div class="container"><div class="section-header"><h2>Everything is purpose-driven</h2></div><div class="features-grid">${features}</div></div></section>
      <section class="section" id="how-it-works"><div class="container"><div class="section-header"><h2>How the experience works</h2></div><div class="steps">${steps}</div></div></section>
      <section class="section" id="faq"><div class="container"><div class="section-header"><h2>Frequently asked questions</h2></div><div class="faq-list">${faq}</div></div></section>
      <section class="section" id="contact"><div class="container"><div class="contact-card"><h2>${ctaTitle}</h2><p>${ctaCopy}</p><div class="hero-actions"><a class="button" href="${ctaHref}">${buttonText}</a></div></div></div></section>
    </main>
    <footer class="site-footer"><div class="container"><p>${footerText}</p></div></footer>
  </body>
</html>`;
}

function exportConfig() {
  const config = readFormValues();
  const exportHtml = buildExportHtml(config);
  const htmlBlob = new Blob([exportHtml], { type: "text/html" });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  const htmlLink = document.createElement("a");
  htmlLink.href = htmlUrl;
  htmlLink.download = "bouhaj-landing-builder-export.html";
  htmlLink.click();
  URL.revokeObjectURL(htmlUrl);
}

function resetConfig() {
  if (confirm("Reset to default configuration?")) {
    localStorage.removeItem("cpaLandingConfig");
    location.reload();
  }
}

async function deployConfig() {
  saveConfig();
  const password = prompt("Enter your local password");
  const secret = prompt("Enter your local secret key");
  if (!password || !secret) {
    alert("Both fields are required.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        secret,
        config: currentConfig
      })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Publish failed");
    }
    alert(result.message || "Published successfully.");
  } catch (error) {
    alert(error.message || "Publish failed.");
  }
}

async function initDashboard() {
  if (!enforceLocalOnly()) {
    return;
  }

  const authorized = await window.ensureLocalAuth();
  if (!authorized) {
    return;
  }

  const response = await fetch("config.json", { cache: "no-store" });
  const defaultConfig = await response.json();
  const stored = localStorage.getItem("cpaLandingConfig");
  currentConfig = stored ? JSON.parse(stored) : defaultConfig;
  populateForm(currentConfig);
  document.getElementById("save-btn").addEventListener("click", saveConfig);
  document.getElementById("export-btn").addEventListener("click", exportConfig);
  document.getElementById("reset-btn").addEventListener("click", resetConfig);
  document.getElementById("deploy-btn").addEventListener("click", deployConfig);
}

document.addEventListener("DOMContentLoaded", initDashboard);
