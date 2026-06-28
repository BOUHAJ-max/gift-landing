(function () {
  const AUTH_STORAGE_KEY = "reward-center-auth";
  const PASSWORD_STORAGE_KEY = "reward-center-password";
  const SECRET_STORAGE_KEY = "reward-center-secret";

  function isLocalHostname() {
    const hostname = window.location.hostname;
    if (window.location.protocol === "file:") {
      return true;
    }

    return ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostname);
  }

  function setAuthGranted() {
    window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
  }

  function clearAuthGranted() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }

  function createGate(onSuccess) {
    if (document.getElementById("local-auth-overlay")) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = "local-auth-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Local access gate");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483647";
    overlay.style.display = "grid";
    overlay.style.placeItems = "center";
    overlay.style.padding = "1.25rem";
    overlay.style.background = "rgba(2, 6, 23, 0.94)";
    overlay.style.backdropFilter = "blur(10px)";

    const hasExistingValues = Boolean(window.localStorage.getItem(PASSWORD_STORAGE_KEY) && window.localStorage.getItem(SECRET_STORAGE_KEY));

    overlay.innerHTML = `
      <div style="width:min(100%, 500px);background:rgba(15, 23, 42, 0.98);border:1px solid rgba(255,255,255,0.16);border-radius:28px;padding:1.75rem;box-shadow:0 25px 80px rgba(0,0,0,0.45);color:#f8fafc;">
        <p style="margin:0 0 0.3rem;font-size:0.78rem;letter-spacing:0.24em;text-transform:uppercase;color:#8b5cf6;">Private access</p>
        <h1 style="margin:0 0 0.6rem;font-size:1.7rem;">${hasExistingValues ? "Unlock private workspace" : "Create private access"}</h1>
        <p style="margin:0 0 1.25rem;line-height:1.7;color:#cbd5e1;">This workspace stays local-only. ${hasExistingValues ? "Enter your saved credentials to continue." : "Set your own private password and secret key for this machine."}</p>
        <form id="local-auth-form" style="display:grid;gap:0.85rem;">
          <label style="display:grid;gap:0.35rem;font-size:0.95rem;">
            <span>${hasExistingValues ? "Password" : "Create password"}</span>
            <input id="local-auth-password" type="password" autocomplete="current-password" required style="padding:0.8rem 0.9rem;border-radius:14px;border:1px solid rgba(255,255,255,0.16);background:#0f172a;color:#fff;" />
          </label>
          <label style="display:grid;gap:0.35rem;font-size:0.95rem;">
            <span>${hasExistingValues ? "Secret key" : "Create secret key"}</span>
            <input id="local-auth-secret" type="password" autocomplete="one-time-code" required style="padding:0.8rem 0.9rem;border-radius:14px;border:1px solid rgba(255,255,255,0.16);background:#0f172a;color:#fff;" />
          </label>
          <button type="submit" style="margin-top:0.3rem;padding:0.85rem 1rem;border:none;border-radius:999px;background:linear-gradient(135deg,#8b5cf6,#4f46e5);color:white;font-weight:700;cursor:pointer;">${hasExistingValues ? "Unlock" : "Save private credentials"}</button>
        </form>
        <p id="local-auth-error" style="margin:0.9rem 0 0;color:#fda4af;min-height:1.2rem;"></p>
      </div>`;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    const form = document.getElementById("local-auth-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const password = document.getElementById("local-auth-password").value;
      const secret = document.getElementById("local-auth-secret").value;
      const error = document.getElementById("local-auth-error");

      if (!password || !secret) {
        error.textContent = "Both fields are required.";
        return;
      }

      if (!hasExistingValues) {
        window.localStorage.setItem(PASSWORD_STORAGE_KEY, password);
        window.localStorage.setItem(SECRET_STORAGE_KEY, secret);
        setAuthGranted();
        overlay.remove();
        document.body.style.overflow = "";
        onSuccess();
        return;
      }

      const storedPassword = window.localStorage.getItem(PASSWORD_STORAGE_KEY);
      const storedSecret = window.localStorage.getItem(SECRET_STORAGE_KEY);
      if (password === storedPassword && secret === storedSecret) {
        setAuthGranted();
        overlay.remove();
        document.body.style.overflow = "";
        onSuccess();
      } else {
        error.textContent = "Incorrect password or secret key.";
      }
    });
  }

  window.ensureLocalAuth = function () {
    return new Promise((resolve) => {
      if (!isLocalHostname()) {
        resolve(false);
        return;
      }

      const granted = window.localStorage.getItem(AUTH_STORAGE_KEY) || window.sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (granted === "true") {
        resolve(true);
        return;
      }

      createGate(() => resolve(true));
    });
  };

  window.clearLocalAuth = function () {
    clearAuthGranted();
    window.localStorage.removeItem(PASSWORD_STORAGE_KEY);
    window.localStorage.removeItem(SECRET_STORAGE_KEY);
  };
})();
