const DEFAULT_CONFIG = {
  offer: {
    campaignName: "Reward Center",
    offerUrl: "",
    buttonText: "Continue",
    redirectDelay: 300,
    enableRedirect: true
  },
  design: {
    primaryColor: "#7c93ff",
    secondaryColor: "#8fffd7",
    accentColor: "#ffffff",
    theme: "dark",
    borderRadius: 24,
    headingFont: "Inter",
    bodyFont: "Inter"
  },
  content: {
    logoText: "Reward Center",
    headline: "Discover a premium path to curated reward offers.",
    subtitle: "Reward Center presents a polished, trustworthy experience for accessing eligible promotional offers with clear terms, fast navigation, and privacy-first behavior.",
    trustBadges: ["Secure", "Transparent", "Premium"],
    heroCardTitle: "Why visitors stay engaged",
    heroCardCopy: "Minimal distractions, transparent messaging, and a focused CTA create a conversion-friendly journey.",
    features: [],
    benefits: [],
    steps: [],
    faq: [],
    footerText: "© 2026 Reward Center. All rights reserved.",
    privacyText: "",
    termsText: "",
    ctaTitle: "Ready to direct visitors with confidence?",
    ctaCopy: "Use the dashboard to update branding, content, tracking, and the destination URL in one place."
  },
  tracking: {
    tiktokPixel: "",
    facebookPixel: "",
    gaId: "",
    gtmId: "",
    clarityId: "",
    customScript: ""
  },
  seo: {
    title: "Reward Center",
    description: "",
    keywords: "",
    canonical: window.location.href,
    favicon: "assets/icons/icon.svg"
  },
  security: {
    maintenanceMode: false,
    cookieBanner: true,
    referrerPolicy: "strict-origin-when-cross-origin",
    csp: "default-src 'self' https:; img-src 'self' data: https:; script-src 'self' https: 'unsafe-inline'; style-src 'self' https: 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'none'"
  },
  media: {
    logoUrl: "",
    heroImageUrl: "",
    backgroundImageUrl: "",
    faviconUrl: "assets/icons/icon.svg"
  }
};

const state = {
  consent: false,
  config: DEFAULT_CONFIG
};

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

  return true;
}

function deepMerge(base, incoming) {
  const result = structuredClone(base);
  function merge(target, source) {
    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === "object" && !Array.isArray(value) && target[key] && typeof target[key] === "object") {
        merge(target[key], value);
      } else {
        target[key] = value;
      }
    }
  }
  merge(result, incoming || {});
  return result;
}

async function loadConfig() {
  const stored = localStorage.getItem("cpaLandingConfig");
  let baseConfig = DEFAULT_CONFIG;

  try {
    const response = await fetch("config.json", { cache: "no-store" });
    if (response.ok) {
      baseConfig = await response.json();
    }
  } catch (error) {
    baseConfig = DEFAULT_CONFIG;
  }

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return deepMerge(baseConfig, parsed);
    } catch (error) {
      return deepMerge(baseConfig, {});
    }
  }

  return deepMerge(baseConfig, {});
}

function setCookie(name, value, days) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((entry) => entry.startsWith(`${name}=`));
  if (!match) {
    return "";
  }
  return decodeURIComponent(match.split("=")[1]);
}

function getQueryParameter(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function showCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (banner) {
    banner.style.display = "flex";
  }
}

function hideCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (banner) {
    banner.style.display = "none";
  }
}

function resolveOfferTarget(target) {
  if (!target) {
    return "";
  }

  try {
    const parsed = new URL(target, window.location.origin);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch (error) {
    return "";
  }

  return "";
}

function applyMeta(config) {
  const title = config.seo?.title || config.offer?.campaignName || "Reward Center";
  document.title = title;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", config.seo?.description || "");
  }

  const keywordsMeta = document.querySelector('meta[name="keywords"]');
  if (keywordsMeta) {
    keywordsMeta.setAttribute("content", config.seo?.keywords || "");
  }

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute("href", config.seo?.canonical || window.location.href);
  }

  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.setAttribute("href", config.media?.faviconUrl || config.seo?.favicon || "assets/icons/icon.svg");
  }

  if (config.design?.theme) {
    document.documentElement.setAttribute("data-theme", config.design.theme);
  }

  document.documentElement.style.setProperty("--primary", config.design?.primaryColor || "#7c93ff");
  document.documentElement.style.setProperty("--accent", config.design?.accentColor || "#ffffff");
  document.documentElement.style.setProperty("--secondary", config.design?.secondaryColor || "#8fffd7");
  document.documentElement.style.setProperty("--radius", `${config.design?.borderRadius || 24}px`);
  document.documentElement.style.setProperty("--font-heading", config.design?.headingFont || "Inter");
  document.documentElement.style.setProperty("--font-body", config.design?.bodyFont || "Inter");
}

function renderContent(config) {
  const brandName = document.getElementById("brand-name");
  if (brandName) {
    brandName.textContent = config.content?.logoText || config.offer?.campaignName || "Reward Center";
  }

  const headline = document.getElementById("headline");
  if (headline) {
    headline.textContent = config.content?.headline || "Discover a premium path to curated reward offers.";
  }

  const subtitle = document.getElementById("subtitle");
  if (subtitle) {
    subtitle.textContent = config.content?.subtitle || "";
  }

  const heroCardTitle = document.getElementById("hero-card-title");
  if (heroCardTitle) {
    heroCardTitle.textContent = config.content?.heroCardTitle || "Why visitors stay engaged";
  }

  const heroCardCopy = document.getElementById("hero-card-copy");
  if (heroCardCopy) {
    heroCardCopy.textContent = config.content?.heroCardCopy || "";
  }

  const ctaTitle = document.getElementById("cta-title");
  if (ctaTitle) {
    ctaTitle.textContent = config.content?.ctaTitle || "Ready to direct visitors with confidence?";
  }

  const ctaCopy = document.getElementById("cta-copy");
  if (ctaCopy) {
    ctaCopy.textContent = config.content?.ctaCopy || "";
  }

  const footerText = document.getElementById("footer-text");
  if (footerText) {
    footerText.textContent = config.content?.footerText || "";
  }

  const privacyBody = document.getElementById("privacy-body");
  if (privacyBody) {
    privacyBody.textContent = config.content?.privacyText || "";
  }

  const termsBody = document.getElementById("terms-body");
  if (termsBody) {
    termsBody.textContent = config.content?.termsText || "";
  }

  const trustBadges = document.getElementById("trust-badges");
  if (trustBadges) {
    trustBadges.innerHTML = "";
    (config.content?.trustBadges || []).forEach((badge) => {
      const span = document.createElement("span");
      span.textContent = badge;
      trustBadges.appendChild(span);
    });
  }

  const benefitSnippets = document.getElementById("benefit-snippets");
  if (benefitSnippets) {
    benefitSnippets.innerHTML = "";
    (config.content?.benefits || []).slice(0, 3).forEach((item) => {
      const span = document.createElement("span");
      span.textContent = typeof item === "string" ? item : item.title;
      benefitSnippets.appendChild(span);
    });
  }

  const benefitsGrid = document.getElementById("benefits-grid");
  if (benefitsGrid) {
    benefitsGrid.innerHTML = "";
    (config.content?.benefits || []).forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";
      const title = typeof item === "string" ? item : item.title;
      const description = typeof item === "string" ? "" : item.description || "";
      card.innerHTML = `<h3>${title}</h3>${description ? `<p>${description}</p>` : ""}`;
      benefitsGrid.appendChild(card);
    });
  }

  const featuresGrid = document.getElementById("features-grid");
  if (featuresGrid) {
    featuresGrid.innerHTML = "";
    (config.content?.features || []).forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";
      const title = typeof item === "string" ? item : item.title;
      const description = typeof item === "string" ? "" : item.description || "";
      card.innerHTML = `<h3>${title}</h3>${description ? `<p>${description}</p>` : ""}`;
      featuresGrid.appendChild(card);
    });
  }

  const stepsGrid = document.getElementById("steps-grid");
  if (stepsGrid) {
    stepsGrid.innerHTML = "";
    (config.content?.steps || []).forEach((item) => {
      const step = document.createElement("article");
      step.className = "step";
      const title = typeof item === "string" ? item : item.title;
      const description = typeof item === "string" ? "" : item.description || "";
      step.innerHTML = `<h3>${title}</h3>${description ? `<p>${description}</p>` : ""}`;
      stepsGrid.appendChild(step);
    });
  }

  const faqList = document.getElementById("faq-list");
  if (faqList) {
    faqList.innerHTML = "";
    (config.content?.faq || []).forEach((item) => {
      const entry = document.createElement("article");
      entry.className = "faq-item";
      const question = typeof item === "string" ? item : item.question;
      const answer = typeof item === "string" ? "" : item.answer || "";
      entry.innerHTML = `<details><summary>${question}</summary><p>${answer}</p></details>`;
      faqList.appendChild(entry);
    });
  }

  const logo = document.getElementById("logo");
  if (logo) {
    if (config.media?.logoUrl) {
      logo.setAttribute("src", config.media.logoUrl);
      logo.setAttribute("alt", config.content?.logoText || config.offer?.campaignName || "logo");
    } else {
      logo.setAttribute("src", "assets/icons/icon.svg");
      logo.setAttribute("alt", config.content?.logoText || config.offer?.campaignName || "logo");
    }
  }

  const heroImage = document.getElementById("hero-image");
  if (heroImage) {
    if (config.media?.heroImageUrl) {
      heroImage.setAttribute("src", config.media.heroImageUrl);
      heroImage.setAttribute("alt", config.content?.heroCardTitle || "Hero illustration");
    } else {
      heroImage.setAttribute("src", "assets/images/og-image.svg");
      heroImage.setAttribute("alt", config.content?.heroCardTitle || "Hero illustration");
    }
  }

  document.querySelectorAll("[data-config-button]").forEach((button) => {
    if (button) {
      button.textContent = config.offer?.buttonText || "Continue";
      button.setAttribute("aria-label", config.offer?.buttonText || "Continue");
    }
  });
}

function applyTracking(config) {
  const existing = document.querySelectorAll('script[data-tracker]');
  existing.forEach((script) => script.remove());

  if (config.tracking?.customScript) {
    const script = document.createElement("script");
    script.setAttribute("data-tracker", "custom");
    script.textContent = config.tracking.customScript;
    document.head.appendChild(script);
  }

  if (config.tracking?.gaId) {
    const script = document.createElement("script");
    script.setAttribute("data-tracker", "ga");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.tracking.gaId}`;
    document.head.appendChild(script);
  }

  if (config.tracking?.gtmId) {
    const script = document.createElement("script");
    script.setAttribute("data-tracker", "gtm");
    script.textContent = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${config.tracking.gtmId}');`;
    document.head.appendChild(script);
  }

  if (config.tracking?.facebookPixel) {
    const script = document.createElement("script");
    script.setAttribute("data-tracker", "facebook");
    script.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${config.tracking.facebookPixel}');fbq('track','PageView');`;
    document.head.appendChild(script);
  }

  if (config.tracking?.tiktokPixel) {
    const script = document.createElement("script");
    script.setAttribute("data-tracker", "tiktok");
    script.textContent = `!function(w,d){w.TiktokAnalyticsObject='ttq';var ttq=w[ttq]||[];ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];ttq.setAndDefer=function(t,o){t[o]=function(){t.push([o].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++){ttq.setAndDefer(ttq,ttq.methods[i])}ttq.instance=function(){for(var e=ttq._i||[],n=0;n<e.length;n++){var t=e[n];ttq[t]=ttq._i[t].slice(0)}return ttq};ttq.load=function(e,n){var t='https://analytics.tiktok.com/i18n/pixel/events.js';ttq._i=ttq._i||[];ttq._i[e]=[],ttq._i[e].push(['page',n]);var o=document.createElement('script');o.type='text/javascript';o.async=true;o.src=t;document.getElementsByTagName('head')[0].appendChild(o)};ttq.load('${config.tracking.tiktokPixel}');}(window, document);`;
    document.head.appendChild(script);
  }

  if (config.tracking?.clarityId) {
    const script = document.createElement("script");
    script.setAttribute("data-tracker", "clarity");
    script.textContent = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, 'clarity', 'script', '${config.tracking.clarityId}');`;
    document.head.appendChild(script);
  }
}

function renderMaintenance(config) {
  if (!config.security?.maintenanceMode) {
    return;
  }

  document.body.innerHTML = `
    <main class="error-page">
      <div class="card">
        <h1>Maintenance</h1>
        <p>We are updating the experience. Please check back shortly.</p>
      </div>
    </main>`;
}

function setupCookieBanner(config) {
  const banner = document.getElementById("cookie-banner");
  if (!banner) {
    return;
  }

  if (!config.security?.cookieBanner) {
    banner.style.display = "none";
    return;
  }

  const consent = getCookie("reward-center-consent") || localStorage.getItem("reward-center-consent") || "";
  if (consent) {
    state.consent = consent === "accept";
    banner.style.display = "none";
  } else {
    banner.style.display = "flex";
  }

  document.querySelectorAll("[data-cookie-accept]").forEach((button) => {
    button.addEventListener("click", () => {
      state.consent = true;
      setCookie("reward-center-consent", "accept", 365);
      localStorage.setItem("reward-center-consent", "accept");
      banner.style.display = "none";
    });
  });

  document.querySelectorAll("[data-cookie-decline]").forEach((button) => {
    button.addEventListener("click", () => {
      state.consent = false;
      setCookie("reward-center-consent", "decline", 365);
      localStorage.setItem("reward-center-consent", "decline");
      banner.style.display = "none";
    });
  });
}

function bindRedirect(config) {
  const buttons = document.querySelectorAll("[data-config-button]");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (!config.offer?.offerUrl || !config.offer?.enableRedirect) {
        return;
      }
      event.preventDefault();
      const target = config.offer.offerUrl.startsWith("http") ? config.offer.offerUrl : `https://${config.offer.offerUrl}`;
      sessionStorage.setItem("pending-offer", target);
      window.location.assign(`redirect.html?next=${encodeURIComponent(target)}`);
    });
  });
}

function handleRedirectPage(config) {
  if (!window.location.pathname.includes("redirect")) {
    return;
  }

  const target = getQueryParameter("next") || config.offer?.offerUrl || "";
  const safeTarget = resolveOfferTarget(target);
  const redirectLink = document.getElementById("redirect-link");

  if (!safeTarget) {
    if (redirectLink) {
      redirectLink.href = "index.html";
      redirectLink.textContent = "Return home";
    }
    return;
  }

  const delay = Number(config.offer?.redirectDelay || 300);
  const message = document.querySelector(".redirect-card p");
  if (message) {
    message.textContent = `You are being safely redirected to the configured destination in ${delay}ms.`;
  }

  window.setTimeout(() => {
    window.location.replace(safeTarget);
  }, delay);
}

async function initialize() {
  if (!enforceLocalOnly()) {
    return;
  }

  if (isLocalAccess() && typeof window.ensureLocalAuth === "function") {
    const authorized = await window.ensureLocalAuth();
    if (!authorized) {
      return;
    }
  }

  const config = await loadConfig();
  state.config = config;

  renderMaintenance(config);
  applyMeta(config);
  renderContent(config);
  applyTracking(config);
  setupCookieBanner(config);
  bindRedirect(config);
  handleRedirectPage(config);

  document.body.classList.toggle("maintenance", Boolean(config.security?.maintenanceMode));
}

document.addEventListener("DOMContentLoaded", initialize);

window.addEventListener("beforeunload", () => {
  if (state.consent) {
    setCookie("reward-center-consent", "accept", 365);
  }
});

window.REWARD_CONFIG = DEFAULT_CONFIG;
