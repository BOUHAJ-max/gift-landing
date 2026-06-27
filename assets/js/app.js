const CONFIG = {
  offerUrl: "",
  pageTitle: "Reward Center",
  buttonText: "Continue",
  trackingEnabled: false
};

const state = {
  consent: false
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getQueryParameter(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
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

function emitTracking(eventName) {
  if (!CONFIG.trackingEnabled) {
    return;
  }

  if (window.dataLayer) {
    window.dataLayer.push({ event: eventName });
  }

  if (window.gtag) {
    window.gtag("event", eventName);
  }

  if (window.fbq) {
    window.fbq("track", eventName);
  }

  if (window.tiktokTrack) {
    window.tiktokTrack(eventName);
  }
}

function applyConfig() {
  document.title = CONFIG.pageTitle;

  document.querySelectorAll("[data-config-button]").forEach((button) => {
    if (button) {
      button.textContent = CONFIG.buttonText;
      button.setAttribute("aria-label", CONFIG.buttonText);
    }
  });

  const brandName = document.querySelectorAll(".brand span:last-child");
  brandName.forEach((element) => {
    if (element && element.textContent.trim() === "Reward Center") {
      element.textContent = CONFIG.pageTitle;
    }
  });
}

function setupTracking() {
  if (!CONFIG.trackingEnabled) {
    return;
  }

  // Tracking placeholders only. Replace these with provider-specific implementation when IDs are available.
  // - TikTok Pixel: window.ttq = window.ttq || function() { ... };
  // - Meta Pixel: window.fbq('init', '<META_PIXEL_ID>');
  // - Google Analytics: window.gtag('config', '<GA_MEASUREMENT_ID>');
  // - Google Tag Manager: window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.fbq = window.fbq || function fbq() {
    window.dataLayer.push({ event: "facebook_pixel", args: arguments });
  };
  window.tiktokTrack = window.tiktokTrack || function tiktokTrack() {
    window.dataLayer.push({ event: "tiktok_pixel", args: arguments });
  };
}

function handleCookieChoice(choice) {
  state.consent = choice === "accept";
  setCookie("reward-center-consent", choice, 365);
  localStorage.setItem("reward-center-consent", choice);
  hideCookieBanner();
}

function initialize() {
  applyConfig();
  setupTracking();

  const consent = getCookie("reward-center-consent") || localStorage.getItem("reward-center-consent") || "";
  if (consent) {
    state.consent = consent === "accept";
    hideCookieBanner();
  } else {
    showCookieBanner();
  }

  document.querySelectorAll("[data-cookie-accept]").forEach((button) => {
    button.addEventListener("click", () => handleCookieChoice("accept"));
  });

  document.querySelectorAll("[data-cookie-decline]").forEach((button) => {
    button.addEventListener("click", () => handleCookieChoice("decline"));
  });

  document.querySelectorAll('a[href="redirect.html"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (CONFIG.offerUrl) {
        event.preventDefault();
        window.location.assign(`redirect.html?next=${encodeURIComponent(CONFIG.offerUrl)}`);
      }
    });
  });

  const nextTarget = getQueryParameter("next");
  if (window.location.pathname.includes("redirect")) {
    const target = nextTarget || CONFIG.offerUrl;
    const safeTarget = resolveOfferTarget(target);

    if (safeTarget) {
      emitTracking("offer_redirect");
      window.location.replace(safeTarget);
      return;
    }

    const redirectLink = document.getElementById("redirect-link");
    if (redirectLink) {
      redirectLink.href = "index.html";
      redirectLink.textContent = "Return home";
    }
  }
}

document.addEventListener("DOMContentLoaded", initialize);

window.addEventListener("beforeunload", () => {
  if (state.consent) {
    setCookie("reward-center-consent", "accept", 365);
  }
});

window.REWARD_CONFIG = CONFIG;
window.escapeHtml = escapeHtml;
