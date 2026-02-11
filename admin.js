// =====================================================
// 🔥 ULTIMATE ADMIN PANEL JS - 100% FIXED & COLOR WORKING
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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;
let servicesData = {};
let projectsData = {};
let statsData = { yearsExp: 0, successRate: 0, projectsLive: 0 };
let educationData = [];
let certificationsData = [];

// ✅ EDUCATION DB PATHS
const EDUCATION_DB_PATH = 'portfolio/education';
const CERTIFICATIONS_DB_PATH = 'portfolio/certifications';

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initAuth();
  initNavigation();
  initMobileMenu();
  initTechPreview();
  
  // ✅ Load Education & Certifications data on admin load
  if (document.getElementById('educationItemsContainer')) {
    loadEducationAdmin();
    loadCertificationsAdmin();
  }

  const userPanelBtn = document.getElementById("goToUserPanel");
  if (userPanelBtn) {
    userPanelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open("./index.html", "_blank");
    });
  }
});

// ---------- Particles (DENSE & FAST STARS) ----------
function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Canvas Resize Logic (Apka wala hi rakha h taaki scroll pe kaam kare)
  function resizeCanvas() {
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    canvas.width  = window.innerWidth;
    canvas.height = docHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  // Scroll event hata diya kyunki docHeight baar baar change nahi hota, performance bachegi

  // 🔥 CONFIGURATION
  const STAR_COUNT = 800; // Pura bharne ke liye 120 se 800 kar diya
  const stars = [];

  // Stars Create Karo
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      // 🔥 SPEED: Pehle 0.4 thi, ab 1.0 se 3.0 ke beech hai (Tez)
      speed: Math.random() * 2.0 + 1.0, 
      // SIZE: Thoda variation
      size: Math.random() * 2.0 + 0.5,
      // OPACITY
      opacity: Math.random() * 0.7 + 0.3,
    });
  }

  function animate() {
    // 🔥 CLEAR SCREEN: Trails hatane ke liye clearRect use kiya (Clean Look)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Agar background color chahiye to ise uncomment karein:
    // ctx.fillStyle = "rgba(10, 14, 26, 1)";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      // Movement
      star.y += star.speed;
      
      // Reset agar niche chala jaye
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }

      // Draw Star
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 243, 255, ${star.opacity})`; // Cyan Color
      
      // Optional: Glow effect for big stars
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

// ---------- Auth (UNCHANGED) ----------
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
      loadAllData();
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
      return;
    }

    spinner.style.display = "inline-block";
    text.textContent = "";

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => {
        errorEl.innerHTML = (error.code || "auth/error") + "<br>" + (error.message || "");
      })
      .finally(() => {
        spinner.style.display = "none";
        text.textContent = "LOGIN";
      });
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.onclick = () => auth.signOut();
}

// ---------- Navigation (UNCHANGED) ----------
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

// ---------- Mobile menu (UNCHANGED) ----------
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

// ---------- Tech chips preview (UNCHANGED) ----------
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

// ---------- Stats / About (UNCHANGED) ----------
window.updateStat = async function (key) {
  if (!currentUser) return;
  const inputMap = { yearsExp: "statYearsExp", successRate: "statSuccessRate" };
  const inputId = inputMap[key];
  if (!inputId) return;

  const value = parseInt(document.getElementById(inputId).value) || 0;
  try {
    await db.ref("portfolio/stats/" + key).set(value);
    alert(key.replace(/[A-Z]/g, " ").trim() + " updated!");
  } catch {
    alert("Update failed!");
  }
};

window.updateAbout = async function () {
  if (!currentUser) return;
  const aboutTextEl = document.getElementById("aboutText");
  if (!aboutTextEl) return;
  const text = aboutTextEl.value.trim();
  if (!text) return alert("About text required!");

  const techStack = document.getElementById("techStack")
    .value.split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  try {
    await db.ref("portfolio/about").set({ text, techStack });
    alert("About updated!");
  } catch {
    alert("Update failed!");
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
    alert("Tech stack updated!");
  } catch {
    alert("Update failed!");
  }
};

// ---------- Forms (UNCHANGED) ----------
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
    if (!title || !desc) return alert("Title & description required!");
    data = { title, description: desc };
  } else {
    const title = document.getElementById("projectTitle").value.trim();
    if (!title) return alert("Title required!");
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
      alert("Updated successfully!");
    } else {
      await db.ref("portfolio/" + formType + "s").push(data);
      alert("Added successfully!");
    }
    window.hideForm(formType);
  } catch (e) {
    alert("Save failed! " + e.message);
  }
};

// =====================================================
// 🔥 FIXED: EDUCATION & CERTIFICATIONS FUNCTIONS
// =====================================================

// ✅ Add new education item
window.addEducationItem = function() {
  addEducationItemUI({}, educationData.length);
};

// ✅ Add new certification item  
window.addCertificationItem = function() {
  addCertificationItemUI({}, certificationsData.length);
};

// ✅ Delete education with confirmation
window.removeEducationItem = function(index) {
  if (!confirm("Delete this education item?")) return;
  
  const container = document.getElementById('educationItemsContainer');
  const item = document.getElementById(`education-${index}`);
  if (item) {
    item.remove();
    if (!container.querySelector('.admin-item')) {
      container.innerHTML = `
        <div class="admin-empty-state">
          <i class="fas fa-plus-circle"></i>
          <p>No education items added yet. Click "Add Education" to get started!</p>
        </div>
      `;
    }
    alert('✅ Education item removed!');
  }
};

// ✅ Delete certification with confirmation
window.removeCertificationItem = function(index) {
  if (!confirm("Delete this certification item?")) return;
  
  const container = document.getElementById('certificationItemsContainer');
  const item = document.getElementById(`certification-${index}`);
  if (item) {
    item.remove();
    if (!container.querySelector('.admin-item')) {
      container.innerHTML = `
        <div class="admin-empty-state">
          <i class="fas fa-certificate"></i>
          <p>No certifications added yet. Click "Add Certification" to get started!</p>
        </div>
      `;
    }
    alert('✅ Certification item removed!');
  }
};

// 🔥 FIXED: Save Education Data - COMPLETE STRUCTURE
window.saveEducationData = async function() {
  if (!currentUser) return;
  
  const items = [];
  document.querySelectorAll('#educationItemsContainer .admin-item').forEach(item => {
    const inputs = item.querySelectorAll('input');
    const title = inputs[0]?.value.trim();
    const icon = inputs[1]?.value.trim() || 'graduation-cap';
    
    if (title) {
      items.push({
        title,
        icon
      });
    }
  });

  try {
    await db.ref(EDUCATION_DB_PATH).set(items);
    showStatus('educationPreviewStatus', '✅ Education saved successfully!');
    alert('✅ Education updated successfully!');
  } catch (error) {
    alert('❌ Save failed: ' + error.message);
  }
};

// 🔥 FIXED: Save Certifications Data - COLOR PROPERLY SAVED
window.saveCertificationsData = async function() {
  if (!currentUser) return;
  
  const items = [];
  document.querySelectorAll('#certificationItemsContainer .admin-item').forEach(item => {
    const inputs = item.querySelectorAll('input');
    const select = item.querySelector('select');
    
    const title = inputs[0]?.value.trim();
    const color = select?.value || 'cyan'; // ✅ Color properly captured
    
    if (title) {
      items.push({
        title,
        color,  // ✅ This will save to Firebase & reflect in user panel
        year: '',    // Optional - add input if needed
        description: '', // Optional - add input if needed
        icon: 'certificate' // Optional - add input if needed
      });
    }
  });

  try {
    await db.ref(CERTIFICATIONS_DB_PATH).set(items);
    showStatus('educationPreviewStatus', '✅ Certifications saved successfully!'); // Note: Use certificationsPreviewStatus if separate
    alert('✅ Certifications updated successfully! Colors will reflect in user panel!');
  } catch (error) {
    alert('❌ Save failed: ' + error.message);
  }
};

// ✅ Helper function for status messages
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

// ✅ Load Education Admin Data - FIXED
async function loadEducationAdmin() {
  try {
    const snapshot = await db.ref(EDUCATION_DB_PATH).once('value');
    educationData = snapshot.val() || [];
    
    const container = document.getElementById('educationItemsContainer');
    if (!container) return;
    
    container.innerHTML = '';
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
    console.error('Error loading education:', error);
  }
}

// ✅ Load Certifications Admin Data - FIXED
async function loadCertificationsAdmin() {
  try {
    const snapshot = await db.ref(CERTIFICATIONS_DB_PATH).once('value');
    certificationsData = snapshot.val() || [];
    
    const container = document.getElementById('certificationItemsContainer');
    if (!container) return;
    
    container.innerHTML = '';
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
    console.error('Error loading certifications:', error);
  }
}

// 🔥 FIXED: Education Item UI - Perfect structure
function addEducationItemUI(data = {}, index) {
  const container = document.getElementById('educationItemsContainer');
  if (container.querySelector('.admin-empty-state')) {
    container.querySelector('.admin-empty-state').remove();
  }
  
  const itemDiv = document.createElement('div');
  itemDiv.className = 'admin-item';
  itemDiv.id = `education-${index}`;
  itemDiv.innerHTML = `
    <div class="admin-item-header">
      <span>Education #${index + 1}</span>
      <button class="btn-remove" onclick="removeEducationItem(${index})" title="Remove">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="admin-item-inputs">
      <input type="text" class="form-input" placeholder="Title (e.g., B.Tech Computer Science 2020-2023)" value="${data.title || ''}">
      <input type="text" class="form-input" placeholder="Icon (e.g., fa-graduation-cap, fa-laptop-code)" value="${data.icon || ''}">
    </div>
  `;
  container.appendChild(itemDiv);
}

// 🔥 FIXED: Certification Item UI - COLOR SELECT PROPERLY WORKS
function addCertificationItemUI(data = {}, index) {
  const container = document.getElementById('certificationItemsContainer');
  if (container.querySelector('.admin-empty-state')) {
    container.querySelector('.admin-empty-state').remove();
  }
  
  const itemDiv = document.createElement('div');
  itemDiv.className = 'admin-item';
  itemDiv.id = `certification-${index}`;
  itemDiv.innerHTML = `
    <div class="admin-item-header">
      <span>Certification #${index + 1}</span>
      <button class="btn-remove" onclick="removeCertificationItem(${index})" title="Remove">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="admin-item-inputs">
      <input type="text" class="form-input" placeholder="Certification Name (e.g., Full-Stack Web Development)" value="${data.title || ''}">
      <select class="form-select text-black bg-white" style="color: #000000;">
        <option value="cyan" ${data.color === 'cyan' ? 'selected' : ''}>Cyan</option>
        <option value="green" ${data.color === 'green' ? 'selected' : ''}>Green</option>
        <option value="orange" ${data.color === 'orange' ? 'selected' : ''}>Orange</option>
        <option value="purple" ${data.color === 'purple' ? 'selected' : ''}>Purple</option>
        <option value="blue" ${data.color === 'blue' ? 'selected' : ''}>Blue</option>
        <option value="pink" ${data.color === 'pink' ? 'selected' : ''}>Pink</option>
      </select>
    </div>
  `;
  container.appendChild(itemDiv);
}

// ---------- Data loading (UPDATED) ----------
function loadAllData() {
  loadStats();
  loadAbout();
  loadServices();
  loadProjects();
  loadEducationAdmin();
  loadCertificationsAdmin();
}

// ---------- Services/Projects (UNCHANGED) ----------
function loadServices() {
  db.ref("portfolio/services").on("value", (snap) => {
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
      </article>`).join("");

    updateDashboardCounters();
  });
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

function updateDashboardCounters() {
  const totalServicesEl = document.getElementById("totalServices");
  if (totalServicesEl) totalServicesEl.textContent = Object.keys(servicesData || {}).length;

  const totalProjectsEl = document.getElementById("totalProjects");
  if (totalProjectsEl) totalProjectsEl.textContent = Object.keys(projectsData || {}).length;
}

// ✅ Services/Projects edit/delete functions (UNCHANGED)
window.editService = function (id) {
  const service = servicesData[id];
  if (!service) return alert("Service not found!");
  showForm("service", true, { id, title: service.title, description: service.description });
};

window.editProject = function (id) {
  const project = projectsData[id];
  if (!project) return alert("Project not found!");
  showForm("project", true, {
    id, title: project.title, image: project.image, url: project.url,
    tags: project.tags || [], desc: project.desc
  });
};

window.deleteService = async function (id) {
  if (!confirm("Delete this service?")) return;
  try {
    await db.ref("portfolio/services/" + id).remove();
  } catch {
    alert("Delete failed!");
  }
};

window.deleteProject = async function (id) {
  if (!confirm("Delete this project?")) return;
  try {
    await db.ref("portfolio/projects/" + id).remove();
  } catch {
    alert("Delete failed!");
  }
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

console.log('✅ Admin Panel JS - 100% FIXED & READY!');
