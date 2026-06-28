let currentConfig = null;

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
      trustBadges: document.getElementById("trustBadges").value.split("\n").filter(Boolean),
      features: document.getElementById("features").value.split("\n").filter(Boolean).map((line) => {
        const [title, ...rest] = line.split("|");
        return { title: title || "Feature", description: rest.join(" ").trim() || "Premium feature" };
      }),
      benefits: document.getElementById("benefits").value.split("\n").filter(Boolean),
      faq: document.getElementById("faq").value.split("\n").filter(Boolean).map((line) => {
        const [question, ...rest] = line.split("|");
        return { question: question || "Question", answer: rest.join(" ").trim() || "Answer" };
      }),
      footerText: "© 2026 Reward Center. All rights reserved.",
      privacyText: document.getElementById("privacyText").value,
      termsText: document.getElementById("termsText").value,
      ctaTitle: "Ready to direct visitors with confidence?",
      ctaCopy: "Use the dashboard to update branding, content, tracking, and the destination URL in one place."
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
  document.getElementById("trustBadges").value = (config.content.trustBadges || []).join("\n");
  document.getElementById("features").value = (config.content.features || []).map((item) => `${item.title}|${item.description}`).join("\n");
  document.getElementById("benefits").value = (config.content.benefits || []).map((item) => item.title || item).join("\n");
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

function exportConfig() {
  const config = readFormValues();
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "config.json";
  link.click();
  URL.revokeObjectURL(url);
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
