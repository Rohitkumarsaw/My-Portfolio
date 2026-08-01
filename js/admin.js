// =====================================================
// 🔥 ULTIMATE ADMIN PANEL JS - PROJECTS MANUAL UPDATE VERSION
// =====================================================

// NO imports – compat SDK global "firebase" object use karega
const firebaseConfig = {
  apiKey: "AIzaSyAskGJm6tly4JLwGFOG7eDtGlJ9PbB0SN4",
  authDomain: "my-portfolio-edbf6.firebaseapp.com",
  databaseURL: "https://my-portfolio-edbf6-default-rtdb.firebaseio.com",
  projectId: "my-portfolio-edbf6",
  storageBucket: "my-portfolio-edbf6.firebasestorage.app",
  messagingSenderId: "271495346350",
  appId: "1:271495346350:web:5750f091f60a584680d53f",
};

// ✅ Safe Firebase init
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;
let servicesData = {};
let projectsData = {};
let statsData = { yearsExp: 0, successRate: 0, projectsLive: 0 };
let educationData = [];
let certificationsData = [];

// ✅ EDUCATION DB PATHS
const EDUCATION_DB_PATH = "portfolio/education";
const CERTIFICATIONS_DB_PATH = "portfolio/certifications";
const CONTACT_DB_PATH = "portfolio/contact";

// =====================================================
// 🔥 TOAST NOTIFICATION SYSTEM
// =====================================================
function escHTML(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showToast(message, type = "success", duration = 3500) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: "fa-check-circle",
    error: "fa-times-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };

  const titles = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
  };

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${titles[type] || "Info"}</div>
      <div class="toast-message">${escHTML(message)}</div>
    </div>
    <button class="toast-close" aria-label="Close"><i class="fas fa-times"></i></button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast--show"));

  const progress = toast.querySelector(".toast-progress");
  progress.style.animationDuration = duration + "ms";

  let timer = setTimeout(() => dismissToast(toast), duration);

  toast.querySelector(".toast-close").addEventListener("click", () => dismissToast(toast));
  toast.addEventListener("mouseenter", () => clearTimeout(timer));
  toast.addEventListener("mouseleave", () => {
    timer = setTimeout(() => dismissToast(toast), duration);
  });
}

function dismissToast(toast) {
  if (!toast || toast.classList.contains("toast--hide")) return;
  toast.classList.remove("toast--show");
  toast.classList.add("toast--hide");
  setTimeout(() => toast.remove(), 350);
}

// =====================================================
// 🔥 PREMIUM CONFIRM DIALOG
// =====================================================
function showConfirm(message, onConfirm, options = {}) {
  let overlay = document.getElementById("confirmOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "confirmOverlay";
    overlay.className = "confirm-overlay";
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeConfirm();
    });
  }

  overlay.innerHTML = `
    <div class="confirm-modal">
      <div class="confirm-icon"><i class="fas ${options.icon || "fa-trash-alt"}"></i></div>
      <h3 class="confirm-title">${escHTML(options.title || "Are you sure?")}</h3>
      <p class="confirm-message">${escHTML(message)}</p>
      <div class="confirm-actions">
        <button class="confirm-btn confirm-btn--cancel" id="confirmCancelBtn">${escHTML(options.cancelText || "Cancel")}</button>
        <button class="confirm-btn confirm-btn--ok" id="confirmOkBtn">${escHTML(options.okText || "Delete")}</button>
      </div>
    </div>
  `;
  overlay.classList.add("confirm-overlay--show");

  const okBtn = document.getElementById("confirmOkBtn");
  const cancelBtn = document.getElementById("confirmCancelBtn");

  okBtn.onclick = () => {
    closeConfirm();
    if (typeof onConfirm === "function") onConfirm();
  };
  cancelBtn.onclick = () => closeConfirm();
  okBtn.focus();

  const keyHandler = (e) => {
    if (e.key === "Escape") closeConfirm();
    if (e.key === "Enter") {
      closeConfirm();
      if (typeof onConfirm === "function") onConfirm();
    }
  };
  document.addEventListener("keydown", keyHandler);
  overlay._keyHandler = keyHandler;
}

function closeConfirm() {
  const overlay = document.getElementById("confirmOverlay");
  if (!overlay) return;
  overlay.classList.remove("confirm-overlay--show");
  setTimeout(() => {
    if (overlay) overlay.innerHTML = "";
  }, 250);
  if (overlay._keyHandler) {
    document.removeEventListener("keydown", overlay._keyHandler);
    overlay._keyHandler = null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initAuth();
  initNavigation();
  initMobileMenu();
  initTechPreview();
  initMaintenance();

  if (document.getElementById("educationItemsContainer")) {
    loadEducationAdmin();
    loadCertificationsAdmin();
  }

  if (document.getElementById("connect")) {
    loadConnectAdmin();
  }

  const userPanelBtn = document.getElementById("goToUserPanel");
  if (userPanelBtn) {
    userPanelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open("./index.html", "_blank");
    });
  }

  // Optional manual refresh button
  const refreshProjectsBtn = document.getElementById("refreshProjectsBtn");
  if (refreshProjectsBtn) {
    refreshProjectsBtn.addEventListener("click", refreshProjectsManually);
  }
});

// ---------- Particles ----------
function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    canvas.width = window.innerWidth;
    canvas.height = docHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const STAR_COUNT = 800;
  const stars = [];

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 2.0 + 1.0,
      size: Math.random() * 2.0 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      star.y += star.speed;

      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 243, 255, ${star.opacity})`;

      if (star.size > 1.5) {
        ctx.shadowBlur = 5;
        ctx.shadowColor = "rgba(0, 243, 255, 0.5)";
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ---------- Auth ----------
function initAuth() {
  const authScreen = document.getElementById("authScreen");
  const adminDashboard = document.getElementById("adminDashboard");
  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("password");
  const authForm = document.getElementById("authForm");
  const spinner = document.getElementById("authSpinner");
  const text = document.getElementById("authText");
  const errorEl = document.getElementById("authError");

  if (!authForm || !authScreen || !adminDashboard) return;

  auth.onAuthStateChanged((user) => {
    currentUser = user || null;
    if (user) {
      authScreen.style.display = "none";
      adminDashboard.style.display = "flex";
      document.getElementById("adminEmail").textContent = user.email || "";
      const mobEmail = document.getElementById("adminEmailMobile");
      if (mobEmail) mobEmail.textContent = user.email || "";
      loadAllData();
      showToast("Welcome back, Admin!", "success");
    } else {
      authScreen.style.display = "flex";
      adminDashboard.style.display = "none";
    }
  });

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passInput.value;
    errorEl.textContent = "";

    if (!email || !password) {
      errorEl.textContent = "Email and password required.";
      showToast("Email and password required!", "warning");
      return;
    }

    spinner.style.display = "inline-block";
    text.textContent = "";

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => {
        errorEl.innerHTML = (error.code || "auth/error") + "<br>" + (error.message || "");
        showToast("Login failed: " + (error.message || "Invalid credentials"), "error");
      })
      .finally(() => {
        spinner.style.display = "none";
        text.textContent = "LOGIN";
      });
  });

  const bindLogout = (btn) => {
    btn.onclick = () => {
      auth.signOut();
      showToast("Logged out successfully!", "info");
    };
  };
  const logoutBtns = document.querySelectorAll("#logoutBtn, #logoutBtnMobile");
  logoutBtns.forEach(bindLogout);
}

// ---------- Navigation ----------
function initNavigation() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.onclick = (e) => {
      const sectionId = item.dataset.section;
      if (!sectionId) return;

      e.preventDefault();
      document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));
      document.querySelectorAll(".admin-section").forEach((s) => s.classList.remove("active"));

      item.classList.add("active");
      const section = document.getElementById(sectionId);
      if (section) section.classList.add("active");
    };
  });
}

// ---------- Mobile menu ----------
function initMobileMenu() {
  const toggle = document.getElementById("mobileMenuToggle");
  const sidebar = document.getElementById("sidebar");
  const navLinks = document.querySelectorAll(".admin-nav .nav-item");
  if (!toggle || !sidebar) return;

  toggle.onclick = () => sidebar.classList.toggle("open");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) sidebar.classList.remove("open");
    });
  });
}

// ---------- Admin user relocate (header <-> sidebar) ----------
function relocateAdminUser() {
  // CSS-only approach: do elements hain (header + sidebar slot),
  // media queries unhe toggle karte hain - JS placement ki zarurat nahi.
}

// ---------- Tech preview ----------
function initTechPreview() {
  const input = document.getElementById("techStack");
  const container = document.getElementById("techPreview");
  if (!input || !container) return;

  const render = () => {
    const raw = input.value.split(",").map((t) => t.trim()).filter(Boolean);
    container.innerHTML = raw.map((t) => `<span class="tech-chip">${t}</span>`).join("");
  };

  render();
  input.addEventListener("input", render);
}

// ---------- Maintenance mode ----------
const MAINTENANCE_DB_PATH = "portfolio/maintenance";

function initMaintenance() {
  const enabledEl = document.getElementById("maintEnabled");
  if (!enabledEl) return;

  db.ref(MAINTENANCE_DB_PATH).on("value", (snapshot) => {
    const data = snapshot.val() || {};
    enabledEl.checked = !!data.enabled;
    document.getElementById("maintTitle").value = data.title || "Under Maintenance";
    document.getElementById("maintMessage").value =
      data.message || "We are working hard to make things even better. Please check back soon!";
    updateMaintUI(data.mode || "fullscreen", !!data.enabled);
  });

  enabledEl.addEventListener("change", () => {
    saveMaintenance();
  });
}

window.selectMaintMode = function (mode) {
  const enabled = document.getElementById("maintEnabled");
  updateMaintUI(mode, enabled.checked);
  saveMaintenance();
};

function updateMaintUI(mode, enabled) {
  document.querySelectorAll(".maint-mode").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  const badge = document.getElementById("maintStatusBadge");
  const text = document.getElementById("maintStatusText");
  const sub = document.getElementById("maintStatusSub");

  const modeLabels = { fullscreen: "Full Screen", banner: "Banner", popup: "Popup" };
  if (enabled) {
    badge.classList.add("on");
    badge.innerHTML = `<i class="fas fa-circle"></i> ON · ${modeLabels[mode] || mode}`;
    text.textContent = `Maintenance is ON (${modeLabels[mode] || mode})`;
    sub.textContent = "Visitors will see the maintenance notice.";
  } else {
    badge.classList.remove("on");
    badge.innerHTML = `<i class="fas fa-circle"></i> OFF`;
    text.textContent = "Maintenance is OFF";
    sub.textContent = "Website is fully live.";
  }
}

window.saveMaintenance = async function () {
  if (!currentUser) {
    showToast("Login required!", "warning");
    return;
  }

  const enabledEl = document.getElementById("maintEnabled");
  const modeEl = document.querySelector(".maint-mode.active") || document.querySelector(".maint-mode");
  const title = document.getElementById("maintTitle").value.trim() || "Under Maintenance";
  const message = document.getElementById("maintMessage").value.trim();

  const payload = {
    enabled: enabledEl.checked,
    mode: (modeEl && modeEl.dataset.mode) || "fullscreen",
    title,
    message,
    updatedAt: Date.now(),
  };

  try {
    await db.ref(MAINTENANCE_DB_PATH).set(payload);
    updateMaintUI(payload.mode, payload.enabled);
    const statusEl = document.getElementById("maintPreviewStatus");
    if (statusEl) {
      statusEl.innerHTML = `<span class="status-indicator success">✓ Maintenance saved${payload.enabled ? " — website is now in maintenance mode" : ""}.</span>`;
    }
    showToast(payload.enabled ? "Maintenance ON!" : "Maintenance OFF!", payload.enabled ? "warning" : "success");
  } catch {
    showToast("Save failed!", "error");
  }
};

// ---------- Stats / About ----------
window.updateStat = async function (key) {
  if (!currentUser) return;
  const inputMap = { yearsExp: "statYearsExp", successRate: "statSuccessRate" };
  const inputId = inputMap[key];
  if (!inputId) return;

  const value = parseInt(document.getElementById(inputId).value) || 0;
  try {
    await db.ref("portfolio/stats/" + key).set(value);
    showToast(key.replace(/[A-Z]/g, " ").trim() + " updated!", "success");
  } catch {
    showToast("Update failed!", "error");
  }
};

window.updateAbout = async function () {
  if (!currentUser) return;
  const aboutTextEl = document.getElementById("aboutText");
  if (!aboutTextEl) return;
  const text = aboutTextEl.value.trim();
  if (!text) return showToast("About text required!", "warning");

  const techStack = document.getElementById("techStack")
    .value.split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  try {
    await db.ref("portfolio/about").set({ text, techStack });
    showToast("About updated!", "success");
  } catch {
    showToast("Update failed!", "error");
  }
};

window.updateTech = async function () {
  if (!currentUser) return;
  const techStack = document.getElementById("techStack")
    .value.split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  try {
    await db.ref("portfolio/about/techStack").set(techStack);
    showToast("Tech stack updated!", "success");
  } catch {
    showToast("Update failed!", "error");
  }
};

// ---------- Forms ----------
window.showForm = function (formType, isEdit = false, data = null) {
  const serviceForm = document.getElementById("serviceForm");
  const projectForm = document.getElementById("projectForm");
  if (!serviceForm || !projectForm) return;

  serviceForm.style.display = "none";
  projectForm.style.display = "none";
  clearAllForms();

  const target = document.getElementById(formType + "Form");
  if (!target) return;

  target.style.display = "block";
  if (isEdit && data) populateForm(formType, data);
  target.scrollIntoView({ behavior: "smooth", block: "center" });
};

window.hideForm = function (formType) {
  const form = document.getElementById(formType + "Form");
  if (form) form.style.display = "none";
  clearAllForms();
};

function clearAllForms() {
  const ids = [
    "serviceId", "serviceTitle", "serviceDesc",
    "projectId", "projectTitle", "projectImage", "projectUrl", "projectTags", "projectDesc"
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function populateForm(formType, data) {
  if (formType === "service") {
    document.getElementById("serviceId").value = data.id || "";
    document.getElementById("serviceTitle").value = data.title || "";
    document.getElementById("serviceDesc").value = data.description || "";
  } else {
    document.getElementById("projectId").value = data.id || "";
    document.getElementById("projectTitle").value = data.title || "";
    document.getElementById("projectImage").value = data.image || "";
    document.getElementById("projectUrl").value = data.url || "";
    document.getElementById("projectTags").value = (data.tags || []).join(", ");
    document.getElementById("projectDesc").value = data.desc || "";
  }
}

window.saveItem = async function (formType) {
  if (!currentUser) return;

  const id = document.getElementById(formType + "Id").value;
  let data;

  if (formType === "service") {
    const title = document.getElementById("serviceTitle").value.trim();
    const desc = document.getElementById("serviceDesc").value.trim();
    if (!title || !desc) return showToast("Title & description required!", "warning");
    data = { title, description: desc };
  } else {
    const title = document.getElementById("projectTitle").value.trim();
    if (!title) return showToast("Title required!", "warning");
    data = {
      title,
      image: document.getElementById("projectImage").value.trim(),
      url: document.getElementById("projectUrl").value.trim(),
      tags: document.getElementById("projectTags")
        .value.split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      desc: document.getElementById("projectDesc").value.trim(),
    };
  }

  try {
    if (id) {
      await db.ref("portfolio/" + formType + "s/" + id).set(data);
      showToast("Updated successfully!", "success");
    } else {
      await db.ref("portfolio/" + formType + "s").push(data);
      showToast("Added successfully!", "success");
    }

    if (formType === "project") {
      await loadProjects();
    } else {
      loadServices();
    }

    window.hideForm(formType);
  } catch (e) {
    showToast("Save failed! " + e.message, "error");
  }
};

// =====================================================
// EDUCATION & CERTIFICATIONS
// =====================================================

window.addEducationItem = function () {
  addEducationItemUI({}, educationData.length);
};

window.addCertificationItem = function () {
  addCertificationItemUI({}, certificationsData.length);
};

window.removeEducationItem = function (index) {
  showConfirm(
    "This education item will be permanently removed from the list.",
    () => {
      const container = document.getElementById("educationItemsContainer");
      const item = document.getElementById(`education-${index}`);
      if (item) {
        item.remove();
        if (!container.querySelector(".edu-item")) {
          container.innerHTML = `
            <div class="admin-empty-state">
              <i class="fas fa-plus-circle"></i>
              <p>No education items added yet. Click "Add Education" to get started!</p>
            </div>
          `;
        }
        updateEducationCount();
        showToast("Education item removed!", "success");
      }
    },
    { title: "Delete Education?", icon: "fa-graduation-cap" }
  );
};

window.removeCertificationItem = function (index) {
  showConfirm(
    "This certification item will be permanently removed from the list.",
    () => {
      const container = document.getElementById("certificationItemsContainer");
      const item = document.getElementById(`certification-${index}`);
      if (item) {
        item.remove();
        if (!container.querySelector(".edu-item")) {
          container.innerHTML = `
            <div class="admin-empty-state">
              <i class="fas fa-certificate"></i>
              <p>No certifications added yet. Click "Add Certification" to get started!</p>
            </div>
          `;
        }
        updateCertificationCount();
        showToast("Certification item removed!", "success");
      }
    },
    { title: "Delete Certification?", icon: "fa-award" }
  );
};

function escAttr(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

window.saveEducationData = async function () {
  if (!currentUser) return;

  const items = [];
  document.querySelectorAll("#educationItemsContainer .edu-item").forEach(item => {
    const title = item.querySelector(".edu-title")?.value.trim();
    const institution = item.querySelector(".edu-institution")?.value.trim() || "";
    const year = item.querySelector(".edu-year")?.value.trim() || "";
    const icon = item.querySelector(".edu-icon")?.value.trim() || "graduation-cap";

    if (title) {
      items.push({ title, institution, year, icon });
    }
  });

  try {
    await db.ref(EDUCATION_DB_PATH).set(items);
    showStatus("educationPreviewStatus", "✅ Education saved successfully!");
    showToast("Education updated successfully!", "success");
  } catch (error) {
    showToast("Save failed: " + error.message, "error");
  }
};

window.saveCertificationsData = async function () {
  if (!currentUser) return;

  const items = [];
  document.querySelectorAll("#certificationItemsContainer .edu-item").forEach(item => {
    const title = item.querySelector(".cert-title")?.value.trim();
    const issuedBy = item.querySelector(".cert-issuer")?.value.trim() || "";
    const year = item.querySelector(".cert-year")?.value.trim() || "";
    const color = item.querySelector(".cert-color")?.value || "cyan";

    if (title) {
      items.push({
        title,
        color,
        year,
        description: issuedBy,
        icon: "certificate"
      });
    }
  });

  try {
    await db.ref(CERTIFICATIONS_DB_PATH).set(items);
    showStatus("educationPreviewStatus", "✅ Certifications saved successfully!");
    showToast("Certifications updated successfully!", "success");
  } catch (error) {
    showToast("Save failed: " + error.message, "error");
  }
};

function updateEducationCount() {
  const count = document.querySelectorAll("#educationItemsContainer .edu-item").length;
  const badge = document.getElementById("educationCount");
  if (badge) badge.textContent = count;
}

function updateCertificationCount() {
  const count = document.querySelectorAll("#certificationItemsContainer .edu-item").length;
  const badge = document.getElementById("certificationCount");
  if (badge) badge.textContent = count;
}

function showStatus(elementId, message) {
  const statusEl = document.getElementById(elementId);
  if (statusEl) {
    statusEl.innerHTML = `<span class="status-indicator success">${message}</span>`;
    setTimeout(() => {
      if (statusEl) {
        statusEl.innerHTML = '<span class="status-indicator loading">🔄 Preview will update automatically...</span>';
      }
    }, 3000);
  }
}

// =====================================================
// 🔥 LET'S CONNECT - CONTACT DETAILS
// =====================================================

function loadConnectAdmin() {
  loadContactAdmin();
}

async function loadContactAdmin() {
  try {
    const snapshot = await db.ref(CONTACT_DB_PATH).once("value");
    const c = snapshot.val() || {};
    const setVal = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) el.value = val || "";
    };
    setVal(".contact-name", c.name);
    setVal(".contact-email", c.email);
    setVal(".contact-phone", c.phone);
    setVal(".contact-location", c.location);
  } catch (error) {
    console.error("Error loading contact:", error);
  }
}

window.saveContactInfo = async function () {
  if (!currentUser) return;

  const data = {
    name: document.querySelector(".contact-name")?.value.trim() || "",
    email: document.querySelector(".contact-email")?.value.trim() || "",
    phone: document.querySelector(".contact-phone")?.value.trim() || "",
    location: document.querySelector(".contact-location")?.value.trim() || "",
  };

  try {
    await db.ref(CONTACT_DB_PATH).set(data);
    showToast("Contact info saved!", "success");
  } catch (error) {
    showToast("Save failed: " + error.message, "error");
  }
};

async function loadEducationAdmin() {
  try {
    const snapshot = await db.ref(EDUCATION_DB_PATH).once("value");
    educationData = snapshot.val() || [];

    const container = document.getElementById("educationItemsContainer");
    if (!container) return;

    container.innerHTML = "";
    if (educationData.length === 0) {
      container.innerHTML = `
        <div class="admin-empty-state">
          <i class="fas fa-plus-circle"></i>
          <p>No education items added yet. Click "Add Education" to get started!</p>
        </div>
      `;
      return;
    }

    educationData.forEach((item, index) => {
      addEducationItemUI(item, index);
    });
  } catch (error) {
    console.error("Error loading education:", error);
  }
}

async function loadCertificationsAdmin() {
  try {
    const snapshot = await db.ref(CERTIFICATIONS_DB_PATH).once("value");
    certificationsData = snapshot.val() || [];

    const container = document.getElementById("certificationItemsContainer");
    if (!container) return;

    container.innerHTML = "";
    if (certificationsData.length === 0) {
      container.innerHTML = `
        <div class="admin-empty-state">
          <i class="fas fa-certificate"></i>
          <p>No certifications added yet. Click "Add Certification" to get started!</p>
        </div>
      `;
      return;
    }

    certificationsData.forEach((item, index) => {
      addCertificationItemUI(item, index);
    });
  } catch (error) {
    console.error("Error loading certifications:", error);
  }
}

function addEducationItemUI(data = {}, index) {
  const container = document.getElementById("educationItemsContainer");
  if (!container) return;
  const emptyState = container.querySelector(".admin-empty-state");
  if (emptyState) emptyState.remove();

  const itemDiv = document.createElement("div");
  itemDiv.className = "edu-item";
  itemDiv.id = `education-${index}`;
  itemDiv.innerHTML = `
    <div class="edu-item-head">
      <span class="edu-item-index">${String(index + 1).padStart(2, "0")}</span>
      <div class="edu-item-head-label">
        <span class="edu-item-type">Education</span>
        <span class="edu-item-sub">Degree / Course</span>
      </div>
      <button class="btn-remove" onclick="removeEducationItem(${index})" title="Remove">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="edu-field-grid">
      <div class="edu-field edu-field--full">
        <label>Degree / Course *</label>
        <input type="text" class="edu-title" placeholder="e.g. B.Tech in Computer Science" value="${escAttr(data.title)}">
      </div>
      <div class="edu-field">
        <label>Institution</label>
        <input type="text" class="edu-institution" placeholder="e.g. Indian Institute of Technology" value="${escAttr(data.institution)}">
      </div>
      <div class="edu-field">
        <label>Duration / Year</label>
        <input type="text" class="edu-year" placeholder="e.g. 2020 - 2024" value="${escAttr(data.year)}">
      </div>
      <div class="edu-field">
        <label>FontAwesome Icon</label>
        <input type="text" class="edu-icon" placeholder="e.g. graduation-cap, laptop-code" value="${escAttr(data.icon)}">
      </div>
    </div>
  `;
  container.appendChild(itemDiv);
  updateEducationCount();
}

function addCertificationItemUI(data = {}, index) {
  const container = document.getElementById("certificationItemsContainer");
  if (!container) return;
  const emptyState = container.querySelector(".admin-empty-state");
  if (emptyState) emptyState.remove();

  const itemDiv = document.createElement("div");
  itemDiv.className = "edu-item";
  itemDiv.id = `certification-${index}`;
  itemDiv.innerHTML = `
    <div class="edu-item-head">
      <span class="edu-item-index">${String(index + 1).padStart(2, "0")}</span>
      <div class="edu-item-head-label">
        <span class="edu-item-type">Certification</span>
        <span class="edu-item-sub">Course / Badge</span>
      </div>
      <button class="btn-remove" onclick="removeCertificationItem(${index})" title="Remove">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="edu-field-grid">
      <div class="edu-field edu-field--full">
        <label>Certification Name *</label>
        <input type="text" class="cert-title" placeholder="e.g. Full-Stack Web Development" value="${escAttr(data.title)}">
      </div>
      <div class="edu-field">
        <label>Issued By</label>
        <input type="text" class="cert-issuer" placeholder="e.g. Coursera, Udemy, IBM" value="${escAttr(data.description)}">
      </div>
      <div class="edu-field">
        <label>Year</label>
        <input type="text" class="cert-year" placeholder="e.g. 2024" value="${escAttr(data.year)}">
      </div>
      <div class="edu-field">
        <label>Badge Color</label>
        <select class="cert-color">
          <option value="cyan" ${data.color === "cyan" ? "selected" : ""}>Cyan</option>
          <option value="green" ${data.color === "green" ? "selected" : ""}>Green</option>
          <option value="orange" ${data.color === "orange" ? "selected" : ""}>Orange</option>
          <option value="purple" ${data.color === "purple" ? "selected" : ""}>Purple</option>
          <option value="blue" ${data.color === "blue" ? "selected" : ""}>Blue</option>
          <option value="pink" ${data.color === "pink" ? "selected" : ""}>Pink</option>
        </select>
      </div>
    </div>
  `;
  container.appendChild(itemDiv);
  updateCertificationCount();
}

// ---------- Data loading ----------
function loadAllData() {
  loadStats();
  loadAbout();
  loadServices();
  loadProjects();
  loadEducationAdmin();
  loadCertificationsAdmin();
  loadConnectAdmin();
}

// ---------- Services ----------
function loadServices() {
  db.ref("portfolio/services").once("value").then((snap) => {
    servicesData = snap.val() || {};
    const list = document.getElementById("servicesList");
    if (!list) return;

    const entries = Object.entries(servicesData);
    if (!entries.length) {
      list.innerHTML = '<p class="empty-text">No services. Add your first service!</p>';
      updateDashboardCounters();
      return;
    }

    list.innerHTML = entries.map(([id, service]) => `
      <article class="service-card">
        <div class="service-top">
          <div class="service-icon"><i class="fas fa-cogs"></i></div>
          <div><h4 class="service-title">${service.title}</h4></div>
        </div>
        <p class="service-desc">${service.description || ""}</p>
        <div class="card-meta">
          <span class="tag-pill">Service</span>
          <div class="card-actions">
            <button class="edit-btn" onclick="editService('${id}')"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick="deleteService('${id}')"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </article>
    `).join("");

    updateDashboardCounters();
  });
}

// 🔥 PROJECTS MANUAL LOAD
async function loadProjects() {
  try {
    const snap = await db.ref("portfolio/projects").once("value");
    projectsData = snap.val() || {};

    const list = document.getElementById("projectsList");
    if (!list) return;

    const entries = Object.entries(projectsData);
    const liveCount = entries.length;

    const projLiveInput = document.getElementById("statProjectsLive");
    const totalProjects = document.getElementById("totalProjects");
    if (projLiveInput) projLiveInput.value = liveCount;
    if (totalProjects) totalProjects.textContent = liveCount;

    if (!entries.length) {
      list.innerHTML = '<p class="empty-text">No projects. Add your first project!</p>';
      updateDashboardCounters();
      return;
    }

    list.innerHTML = entries.map(([id, project]) => {
      const tags = Array.isArray(project.tags) ? project.tags : [];
      return `
        <article class="project-card">
          <div class="project-main">
            <div class="project-thumb">
              ${project.image
                ? `<img src="${project.image}" alt="Project" onerror="this.style.display='none';" />`
                : `<div class="project-placeholder"><i class="fas fa-project-diagram"></i></div>`}
            </div>
            <div class="project-body">
              <h4 class="project-title">${project.title || ""}</h4>
              ${project.desc ? `<p class="project-desc">${project.desc}</p>` : ""}
              ${tags.length ? `<div class="tag-row">${tags.map((t) => `<span class="tag-pill">${t}</span>`).join("")}</div>` : ""}
            </div>
          </div>
          <div class="card-meta">
            ${project.url
              ? `<a href="${project.url}" target="_blank" rel="noopener noreferrer" class="live-link">Live Demo <i class="fas fa-arrow-up-right-from-square"></i></a>`
              : "<span class='tag-pill'>Local Project</span>"}
            <div class="card-actions">
              <button class="edit-btn" onclick="editProject('${id}')"><i class="fas fa-edit"></i></button>
              <button class="delete-btn" onclick="deleteProject('${id}')"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </article>`;
    }).join("");

    updateDashboardCounters();
  } catch (error) {
    console.error("Error loading projects:", error);
    showToast("Projects load failed!", "error");
  }
}


  function loadProjects() {
  db.ref("portfolio/projects").on("value", (snap) => {
    projectsData = snap.val() || {};
    const list = document.getElementById("projectsList");
    if (!list) return;

    const entries = Object.entries(projectsData);
    const liveCount = entries.length;

    const projLiveInput = document.getElementById("statProjectsLive");
    const totalProjects = document.getElementById("totalProjects");

    if (projLiveInput) projLiveInput.value = liveCount;
    if (totalProjects) totalProjects.textContent = liveCount;

    db.ref("portfolio/stats/projectsLive").set(liveCount)
      .then(() => {
        console.log("✅ projectsLive auto-updated in Firebase:", liveCount);
      })
      .catch((error) => {
        console.error("❌ projectsLive update failed:", error);
      });

    if (!entries.length) {
      list.innerHTML = '<p class="empty-text">No projects. Add your first project!</p>';
      updateDashboardCounters();
      return;
    }

    list.innerHTML = entries.map(([id, project]) => {
      const tags = project.tags || [];
      return `
        <article class="project-card">
          <div class="project-main">
            <div class="project-thumb">
              ${project.image ? `<img src="${project.image}" alt="Project" onerror="this.style.display='none';" />` : `<div class="project-placeholder"><i class="fas fa-project-diagram"></i></div>`}
            </div>
            <div class="project-body">
              <h4 class="project-title">${project.title}</h4>
              ${project.desc ? `<p class="project-desc">${project.desc}</p>` : ""}
              ${tags.length ? `<div class="tag-row">${tags.map((t) => `<span class="tag-pill">${t}</span>`).join("")}</div>` : ""}
            </div>
          </div>
          <div class="card-meta">
            ${project.url ? `<a href="${project.url}" target="_blank" class="live-link">Live Demo <i class="fas fa-arrow-up-right-from-square"></i></a>` : "<span class='tag-pill'>Local Project</span>"}
            <div class="card-actions">
              <button class="edit-btn" onclick="editProject('${id}')"><i class="fas fa-edit"></i></button>
              <button class="delete-btn" onclick="deleteProject('${id}')"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </article>`;
    }).join("");

    updateDashboardCounters();
  });
}


// ✅ Manual refresh function
window.refreshProjectsManually = async function () {
  await loadProjects();
  showToast("Projects refreshed!", "success");
};

function updateDashboardCounters() {
  const totalServicesEl = document.getElementById("totalServices");
  if (totalServicesEl) totalServicesEl.textContent = Object.keys(servicesData || {}).length;

  const totalProjectsEl = document.getElementById("totalProjects");
  if (totalProjectsEl) totalProjectsEl.textContent = Object.keys(projectsData || {}).length;
}

// ✅ edit/delete
window.editService = function (id) {
  const service = servicesData[id];
  if (!service) return showToast("Service not found!", "warning");
  showForm("service", true, { id, title: service.title, description: service.description });
};

window.editProject = function (id) {
  const project = projectsData[id];
  if (!project) return showToast("Project not found!", "warning");
  showForm("project", true, {
    id,
    title: project.title,
    image: project.image,
    url: project.url,
    tags: project.tags || [],
    desc: project.desc
  });
};

window.deleteService = async function (id) {
  showConfirm(
    "This service will be permanently deleted from Firebase.",
    async () => {
      try {
        await db.ref("portfolio/services/" + id).remove();
        loadServices();
        showToast("Service deleted successfully!", "success");
      } catch {
        showToast("Delete failed!", "error");
      }
    },
    { title: "Delete Service?", icon: "fa-cogs" }
  );
};

window.deleteProject = async function (id) {
  showConfirm(
    "This project will be permanently deleted from Firebase.",
    async () => {
      try {
        await db.ref("portfolio/projects/" + id).remove();
        await loadProjects();
        showToast("Project deleted successfully!", "success");
      } catch {
        showToast("Delete failed!", "error");
      }
    },
    { title: "Delete Project?", icon: "fa-project-diagram" }
  );
};

function loadStats() {
  db.ref("portfolio/stats").on("value", (snap) => {
    statsData = snap.val() || { yearsExp: 0, successRate: 0, projectsLive: 0 };
    const years = statsData.yearsExp || 0;
    const success = statsData.successRate || 0;

    const yearsInput = document.getElementById("statYearsExp");
    const sucInput = document.getElementById("statSuccessRate");
    const yearsDash = document.getElementById("yearsExpDash");
    const sucDash = document.getElementById("successRateDash");

    if (yearsInput) yearsInput.value = years;
    if (sucInput) sucInput.value = success;
    if (yearsDash) yearsDash.textContent = years;
    if (sucDash) sucDash.textContent = success + "%";
  });
}

function loadAbout() {
  db.ref("portfolio/about").on("value", (snap) => {
    const about = snap.val() || {};
    const aboutText = document.getElementById("aboutText");
    const techInput = document.getElementById("techStack");
    if (aboutText) aboutText.value = about.text || "";
    if (techInput) {
      techInput.value = about.techStack ? about.techStack.join(", ") : "";
      const event = new Event("input");
      techInput.dispatchEvent(event);
    }
  });
}

console.log("✅ Admin Panel JS - PROJECTS MANUAL UPDATE VERSION READY!");