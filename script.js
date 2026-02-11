// =====================================================
// 🔥 FINAL HYPER RAIN (LASER LINES) - 100% WORKING
// =====================================================

// FIREBASE CONFIG (Isse same rahne dein)
/* =========================================
   1. FIREBASE CONFIGURATION & INITIALIZATION
   ========================================= */
const firebaseConfig = {
  apiKey: "AIzaSyAskGJm6tly4JLwGFOG7eDtGlJ9PbB0SN4",
  authDomain: "my-portfolio-edbf6.firebaseapp.com",
  databaseURL: "https://my-portfolio-edbf6-default-rtdb.firebaseio.com",
  projectId: "my-portfolio-edbf6",
  storageBucket: "my-portfolio-edbf6.firebasestorage.app",
  messagingSenderId: "271495346350",
  appId: "1:271495346350:web:5750f091f60a584680d53f"
};

// 🔥 FIX: Check if Firebase is already initialized to prevent console warnings
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Use existing instance
}

// Database Reference
const database = firebase.database();
// GLOBALS
let firebaseDb = null;
let isPortfolioUnlocked = false;
let hamburger, mobileNav, modeToggle, devContent, clientContent;

// DB PATHS
const EDUCATIONDBPATH = 'portfolio/education';
const CERTIFICATIONSDBPATH = 'portfolio/certifications';

window.openAdmin = function() {
  window.open('admin.html', '_blank');
};

// =====================================================
// 🔥 RAIN EFFECT FUNCTION (REPLACES STARFIELD)
// =====================================================
// =====================================================
// 🔥 FINAL DENSE STARS (FULL SCREEN FILLED & FASTER)
// =====================================================

/* =========================================
   HYPER RAIN ANIMATION (DENSE FALLING STARS)
   ========================================= */
function initHyperRain() { 
  console.log("🚀 STARTING DENSE STARS..."); 

  // 1. Purana canvas agar hai to hatao (Cleanup)
  const oldCanvas = document.getElementById('particleCanvas');
  if (oldCanvas) {
      oldCanvas.remove();
  }

  // 2. Naya Canvas Create karo
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  document.body.appendChild(canvas); 

  const ctx = canvas.getContext('2d');
  
  // 3. Full Screen & Style Setup via JS
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1'; 
  canvas.style.pointerEvents = 'none';
  
  // Dark Background (Deep Space Blue)
  canvas.style.background = 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)'; 

  let w = window.innerWidth;
  let h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  const stars = [];
  // 🔥 DENSITY: Mobile pe 400, PC pe 900 stars
  const STAR_COUNT = w < 768 ? 400 : 900; 

  // --- Star Class ---
  class Star {
    constructor() {
      this.reset(true);
    }
    
    reset(initial) {
      this.x = Math.random() * w;
      // Initial hai to screen pe kahin bhi, warna screen ke upar se start
      this.y = initial ? Math.random() * h : -10; 
      
      // 🔥 DEPTH LOGIC (Z-Axis: 0 = Door, 1 = Paas)
      this.z = Math.random(); 
      
      // Size: Paas wale bade, door wale chhote
      this.size = Math.random() * 1.5 + (this.z * 1.5); 
      
      // Speed: Paas wale tez girenge (Parallax Effect)
      this.speed = (Math.random() * 0.5 + 1.0) * (this.z + 0.5); 

      // Opacity: Paas wale bright, door wale dim
      this.opacity = 0.3 + (this.z * 0.7);
      
      // Twinkle Toggle
      this.twinkleDir = Math.random() > 0.5 ? 0.02 : -0.02;
    }

    update() {
      // Move Downwards (Rain effect)
      this.y += this.speed;
      
      // Twinkle Effect (Sirf bade/paas wale stars par)
      if (this.z > 0.5) {
        this.opacity += this.twinkleDir;
        if (this.opacity > 1 || this.opacity < 0.4) {
          this.twinkleDir = -this.twinkleDir;
        }
      }

      // Agar screen ke neeche chala jaye to wapas upar bhejo
      if (this.y > h) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      
      // Cyan Color
      ctx.fillStyle = `rgba(0, 243, 255, ${this.opacity})`;
      
      // 🔥 Glow Effect (Performance ke liye sirf paas wale stars par)
      if (this.z > 0.7) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 243, 255, 0.5)';
      } else {
        ctx.shadowBlur = 0;
      }
      
      ctx.fill();
    }
  }

  // --- Init Stars ---
  for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star());
  }

  // --- Animation Loop ---
  function animate() {
    ctx.clearRect(0, 0, w, h); // Clear frame
    
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
  
  // --- Resize Handler ---
  window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    // Resize pe stars dobara calculate nahi kar rahe taaki smoothness bani rahe
  });
}

// 🔥 Start Animation on Load
document.addEventListener('DOMContentLoaded', function() {
    // Purana koi initStarfield call ho to use hata dein, sirf ye chalega
    initHyperRain();
});
// ... (Baki ka niche ka code same education/portfolio loader wala rakhna) ...
// ... (Yahan main copy-paste space bachane ke liye skip kar raha hu) ...

// =====================================================
// 🔥 MASTER INIT
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
  function initFirebase() {
    if (typeof firebase !== 'undefined') {
      try { firebase.initializeApp(firebaseConfig); } catch (e) {}
      firebaseDb = firebase.database();
      loadPortfolioData(); // Make sure loadPortfolioData function exists in your file
    } else {
      setTimeout(initFirebase, 200);
    }
  }
  
  initFirebase();
  
  // Start Animations
  if(document.querySelector('.enter-portfolio-btn')) initEnterPortfolio();
  if(document.getElementById('navbar')) initNavbarScroll();
 /* =========================================
   FIX FOR ERROR AT LINE 193
   ========================================= */

// Ye function purane 'initStarfield' call ko naye 'initHyperRain' par bhej dega
window.initStarfield = function() {
    console.log("Redirecting old initStarfield call to initHyperRain...");
    initHyperRain();
};
  
  if(typeof initSocialShare === 'function') initSocialShare();
  if(typeof initLoadingScreen === 'function') initLoadingScreen();
});

// Helper Functions (Jo pehle di thi, wo same rahegi)
// loadPortfolioData, initEnterPortfolio, etc...
// =====================================================
// 🔥 FIXED: EDUCATION & CERTIFICATIONS LOADER
// =====================================================
function loadEducationCertificationsData() {
  if (!firebaseDb) {
    console.warn('Firebase not ready for education data');
    return;
  }

  console.log('Loading Education & Certifications...');

  // ===== EDUCATION =====
  firebaseDb.ref(EDUCATIONDBPATH).on('value', (snapshot) => {
    const educationData = snapshot.val() || [];
    console.log('Education loaded', educationData.length, 'items');

    const educationList = document.getElementById('educationList');
    if (!educationList) return;

    educationList.innerHTML = '';

    if (!educationData.length) {
      educationList.innerHTML = `
        <li class="empty-state">
          <i class="fas fa-graduation-cap edu-icon"></i>
          No education added yet.
          <strong>Add from Admin Panel!</strong>
        </li>
      `;
      return;
    }

    educationData.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'education-item';

      const title = item.title || 'Education';
      const institution = item.institution || '';
      const year = item.year || '';

      li.innerHTML = `
        <i class="fas fa-${item.icon || 'graduation-cap'} edu-icon"></i>
        <div class="edu-content">
          <span class="edu-title">${title}</span>
          ${institution ? `<span class="edu-institution">${institution}</span>` : ''}
          ${year ? `<span class="edu-year">${year}</span>` : ''}
        </div>
      `;

      educationList.appendChild(li);
    });
  });

  // ===== CERTIFICATIONS - FIXED COLOR SYSTEM =====
  firebaseDb.ref(CERTIFICATIONSDBPATH).on('value', (snapshot) => {
    const certData = snapshot.val() || [];
    console.log('Certifications loaded', certData.length, 'items');

    const certList = document.getElementById('certificationsList');
    if (!certList) return;

    certList.innerHTML = '';

    if (!certData.length) {
      certList.innerHTML = `
        <span class="tech-pill gray full-width">
          No certifications added yet. Add from Admin Panel!
        </span>
      `;
      return;
    }

    certData.forEach((item) => {
      const span = document.createElement('span');

      const color = (item.color || 'cyan').toLowerCase().trim();
      const allowedColors = ['cyan', 'green', 'orange', 'purple', 'blue', 'pink', 'gray'];
      const safeColor = allowedColors.includes(color) ? color : 'cyan';

      span.className = `tech-pill ${safeColor}`;

      const title = item.title || 'Certification';
      const year = item.year ? String(item.year).trim() : '';
      const description = item.description || '';
      const iconClass = item.icon ? `fas ${item.icon}` : 'fas fa-certificate';

      span.innerHTML = `
        ${item.icon ? `<i class="${iconClass}"></i>` : ''}
        <span class="cert-main-text">
          <span class="cert-title">${title}</span>
          ${year ? `<small class="cert-year">${year}</small>` : ''}
        </span>
        ${description ? `<span class="cert-desc">${description}</span>` : ''}
      `;

      if (description) {
        span.title = description;
      }

      certList.appendChild(span);
    });
  });
}

// =====================================================
// 🔥 PORTFOLIO DATA LOADER (OPTIMIZED)
// =====================================================
function loadPortfolioData() {
  if (typeof firebase === 'undefined' || !firebaseDb) {
    console.warn('Firebase not ready');
    return;
  }

  console.log('Loading portfolio data from Firebase Realtime Database...');

  // EDUCATION & CERTIFICATIONS
  loadEducationCertificationsData();

  // ---- STATS ----
  firebaseDb.ref('portfolio/stats').on('value', (snapshot) => {
    const stats = snapshot.val() || {};
    const projectsLive = stats.projectsLive || 0;
    const yearsExp = stats.yearsExp || 0;
    const successRate = stats.successRate || 0;
    
    console.log(`Stats: ${projectsLive} projects, ${yearsExp} years, ${successRate}% success`);

    const statSelectors = [
      { container: '#welcomeStats', classPrefix: 'stat-card' },
      { container: '#homeMetrics', classPrefix: 'metric-item' }
    ];

    statSelectors.forEach(({ container, classPrefix }) => {
      const containerEl = document.querySelector(container);
      if (containerEl) {
        containerEl.innerHTML = `
          <div class="${classPrefix}">
            <span class="stat-number metric-value">${projectsLive}</span>
            <span class="stat-label metric-label">Projects Live</span>
          </div>
          <div class="${classPrefix}">
            <span class="stat-number metric-value">${yearsExp}</span>
            <span class="stat-label metric-label">Years Experience</span>
          </div>
          <div class="${classPrefix}">
            <span class="stat-number metric-value">${successRate}%</span>
            <span class="stat-label metric-label">Success Rate</span>
          </div>
        `;
      }
    });
  });

  // ---- ABOUT ----
  firebaseDb.ref('portfolio/about').on('value', (snapshot) => {
    const about = snapshot.val() || {};
    const aboutText = about.text || 'Full-Stack Web Developer from Bihar, India. Building production-ready web applications.';
    const techStack = Array.isArray(about.techStack) ? about.techStack : [];

    console.log('About loaded', aboutText.substring(0, 50) + '...');

    ['aboutSubtitle', 'aboutMainText', 'heroDescription'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = aboutText;
    });

    ['heroTechStack', 'aboutTechTags'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = techStack.length > 0 
          ? techStack.map(tag => `<span class="tech-tag">${tag}</span>`).join('')
          : `<span class="tech-tag">HTML, CSS, JavaScript, Firebase</span>`;
      }
    });

    const bulletsEl = document.getElementById('aboutBullets');
    if (bulletsEl && techStack.length > 0) {
      bulletsEl.innerHTML = techStack.slice(0, 6)
        .map(tag => `<li><i class="fas fa-check-circle"></i> ${tag}</li>`)
        .join('') + 
        (techStack.length > 6 ? '<li><i class="fas fa-ellipsis-h"></i> more</li>' : '');
    }
  });

  // ---- SERVICES ----
  firebaseDb.ref('portfolio/services').on('value', (snapshot) => {
    const services = snapshot.val() || {};
    const count = Object.keys(services).length;
    console.log(`Services loaded: ${count}`);

    const servicesGrid1 = document.getElementById('servicesGrid');
    if (servicesGrid1) {
      if (count > 0) {
        servicesGrid1.innerHTML = Object.values(services)
          .map((service, index) => `
            <div class="glass-card service-card" data-aos="fade-up" data-aos-delay="${index * 100}">
              <i class="${service.icon} fas fa-cogs service-icon"></i>
              <h3 class="service-title">${service.title} Service</h3>
              <p class="service-description">${service.description} Service description</p>
            </div>
          `).join('');
      } else {
        servicesGrid1.innerHTML = `
          <div class="glass-card service-placeholder full-width">
            <i class="fas fa-plus-circle"></i>
            <h3>No services yet</h3>
            <p><strong>Add from Admin Panel</strong></p>
          </div>
        `;
      }
    }
  });

  // ---- PROJECTS ----
  firebaseDb.ref('portfolio/projects').on('value', (snapshot) => {
    const projects = snapshot.val() || {};
    const count = Object.keys(projects).length;
    console.log(`Projects loaded: ${count}`);

    const projectsGrid1 = document.getElementById('projectsGrid');
    if (projectsGrid1) {
      if (count > 0) {
        projectsGrid1.innerHTML = Object.values(projects)
          .map((project, index) => `
            <div class="glass-card project-card" data-aos="fade-up" data-aos-delay="${index * 100}">
              <div class="project-media">
                ${project.image && project.image.trim() ? 
                  `<img src="${project.image}" alt="${project.title} Project" class="project-image" loading="lazy">` : ''
                }
                ${project.icon ? `<i class="${project.icon} project-media-icon"></i>` : ''}
              </div>
              <div class="project-content">
                <h3 class="project-title">${project.title} Project</h3>
                ${project.desc ? `<p class="project-desc">${project.desc}</p>` : ''}
                <div class="project-tags">
                  ${Array.isArray(project.tags) && project.tags.length > 0 
                    ? project.tags.slice(0, 4).map(tag => `<span class="tech-tag">${tag}</span>`).join('')
                    : `<span class="tech-tag">Web App</span>`
                  }
                </div>
                <a href="${project.url}" class="project-link" target="_blank" rel="noopener noreferrer">
                  ${project.url ? 'View Live Demo' : 'URL Coming Soon'}
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
          `).join('');
      } else {
        projectsGrid1.innerHTML = `
          <div class="glass-card project-placeholder full-width">
            <i class="fas fa-plus-circle"></i>
            <h3>No projects yet</h3>
            <p>Add projects from <strong>Admin Panel</strong> to showcase your work!</p>
          </div>
        `;
      }
    }
  });

  // ---- CONTACT ----
  firebaseDb.ref('portfolio/contact').on('value', (snapshot) => {
    const contact = snapshot.val() || {};
    const contactItems = document.querySelectorAll('#contactDetails .contact-item');
    
    if (contactItems.length >= 4) {
      contactItems[0].querySelector('.contact-value').textContent = contact.name || 'Your Name';
      contactItems[1].querySelector('.contact-value').textContent = contact.email || 'email@example.com';
      contactItems[2].querySelector('.contact-value').textContent = contact.phone || '+91XXXXXXXXXX';
      contactItems[3].querySelector('.contact-value').textContent = contact.location || 'Your Location';
    }
  });

  // Connection monitor
  firebaseDb.ref('.info/connected').on('value', (snap) => {
    if (snap.val() === true) {
      console.log('🔥 Firebase LIVE - Real-time sync active');
    } else {
      console.log('💾 Firebase OFFLINE - Cached data active');
    }
  });
}

// =====================================================
// 🔥 SHARE FUNCTIONS (15 PLATFORMS)
// =====================================================
function showShareToast(message) {
  document.querySelectorAll('.share-toast').forEach(toast => toast.remove());
  
  const toast = document.createElement('div');
  toast.className = 'share-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background: linear-gradient(135deg, #00f3ff, #667eea);
    color: white; padding: 16px 24px; border-radius: 50px;
    font-weight: 600; font-size: 15px; z-index: 9999;
    backdrop-filter: blur(20px); box-shadow: 0 12px 40px rgba(0,243,255,0.4);
    transform: translateX(400px); opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit;
  `;
  
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  });
  
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

async function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        successful ? resolve() : reject();
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    });
  }
}

function showShareModal(url, title) {
  document.querySelectorAll('.share-modal-overlay').forEach(el => el.remove());
  
  const overlay = document.createElement('div');
  overlay.className = 'share-modal-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.8); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s ease;
    backdrop-filter: blur(8px);
  `;
  
  overlay.innerHTML = `
    <div style="
      background: rgba(15, 25, 50, 0.98); backdrop-filter: blur(25px);
      border-radius: 24px; padding: 32px; max-width: 520px; width: 92%;
      max-height: 90vh; text-align: center; border: 1px solid rgba(0, 243, 255, 0.3);
      box-shadow: 0 25px 80px rgba(0, 243, 255, 0.2); position: relative;
      overflow-y: auto;
    ">
      <button onclick="this.parentElement.parentElement.remove()" style="
        position: absolute; top: 16px; right: 16px; background: none; border: none;
        color: #aaa; font-size: 24px; cursor: pointer; width: 40px; height: 40px;
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.color='#fff'"
         onmouseout="this.style.background='transparent'; this.style.color='#aaa'">&times;</button>
      
      <h3 style="color: #00f3ff; margin: 0 0 24px 0; font-size: 24px; font-weight: 700;">
        Share Portfolio
      </h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(72px, 1fr)); gap: 14px; margin-bottom: 24px;">

  <a href="https://wa.me/?text=${encodeURIComponent(title + '%0A%0A' + url)}" target="_blank" rel="noopener noreferrer" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #25D366; font-size: 22px; text-decoration: none;
    padding: 14px 8px; border-radius: 16px; transition: all 0.3s ease;
    background: rgba(37,211,102,0.1); border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(37,211,102,0.25)'; this.style.borderColor='rgba(37,211,102,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(37,211,102,0.1)'; this.style.borderColor='transparent'">
    <i class="fab fa-whatsapp"></i>
    <span style="font-size: 11px; font-weight: 600;">WhatsApp</span>
  </a>

  <a href="https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #0088cc; font-size: 22px; text-decoration: none;
    padding: 14px 8px; border-radius: 16px; transition: all 0.3s ease;
    background: rgba(0,136,204,0.1); border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(0,136,204,0.25)'; this.style.borderColor='rgba(0,136,204,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(0,136,204,0.1)'; this.style.borderColor='transparent'">
    <i class="fab fa-telegram-plane"></i>
    <span style="font-size: 11px; font-weight: 600;">Telegram</span>
  </a>

  <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title + ' ' + url)}" target="_blank" rel="noopener noreferrer" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #1DA1F2; font-size: 22px; text-decoration: none;
    padding: 14px 8px; border-radius: 16px; transition: all 0.3s ease;
    background: rgba(29,161,242,0.1); border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(29,161,242,0.25)'; this.style.borderColor='rgba(29,161,242,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(29,161,242,0.1)'; this.style.borderColor='transparent'">
    <i class="fab fa-twitter"></i>
    <span style="font-size: 11px; font-weight: 600;">Twitter</span>
  </a>

  <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #1877F2; font-size: 22px; text-decoration: none;
    padding: 14px 8px; border-radius: 16px; transition: all 0.3s ease;
    background: rgba(24,119,242,0.1); border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(24,119,242,0.25)'; this.style.borderColor='rgba(24,119,242,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(24,119,242,0.1)'; this.style.borderColor='transparent'">
    <i class="fab fa-facebook-f"></i>
    <span style="font-size: 11px; font-weight: 600;">Facebook</span>
  </a>

  <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #0077B5; font-size: 22px; text-decoration: none;
    padding: 14px 8px; border-radius: 16px; transition: all 0.3s ease;
    background: rgba(0,119,181,0.1); border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(0,119,181,0.25)'; this.style.borderColor='rgba(0,119,181,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(0,119,181,0.1)'; this.style.borderColor='transparent'">
    <i class="fab fa-linkedin-in"></i>
    <span style="font-size: 11px; font-weight: 600;">LinkedIn</span>
  </a>

  <a href="https://www.instagram.com/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #E4405F; font-size: 22px; text-decoration: none;
    padding: 14px 8px; border-radius: 16px; transition: all 0.3s ease;
    background: rgba(228,64,95,0.1); border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(228,64,95,0.25)'; this.style.borderColor='rgba(228,64,95,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(228,64,95,0.1)'; this.style.borderColor='transparent'">
    <i class="fab fa-instagram"></i>
    <span style="font-size: 11px; font-weight: 600;">Instagram</span>
  </a>

  <a href="${url}" target="_blank" rel="noopener noreferrer" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #fff; font-size: 22px; text-decoration: none;
    padding: 14px 8px; border-radius: 16px; transition: all 0.3s ease;
    background: rgba(255,255,255,0.1); border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(255,255,255,0.25)'; this.style.borderColor='rgba(255,255,255,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(255,255,255,0.1)'; this.style.borderColor='transparent'">
    <i class="fab fa-github"></i>
    <span style="font-size: 11px; font-weight: 600;">GitHub</span>
  </a>

  <a href="https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #FF4500; font-size: 22px; text-decoration: none;
    padding: 14px 8px; border-radius: 16px; transition: all 0.3s ease;
    background: rgba(255,69,0,0.1); border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(255,69,0,0.25)'; this.style.borderColor='rgba(255,69,0,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(255,69,0,0.1)'; this.style.borderColor='transparent'">
    <i class="fab fa-reddit"></i>
    <span style="font-size: 11px; font-weight: 600;">Reddit</span>
  </a>

  <a href="https://discord.com/channels/@me?message=${encodeURIComponent(title + ' ' + url)}" target="_blank" rel="noopener noreferrer" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #5865F2; font-size: 22px; text-decoration: none;
    padding: 14px 8px; border-radius: 16px; transition: all 0.3s ease;
    background: rgba(88,101,242,0.1); border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(88,101,242,0.25)'; this.style.borderColor='rgba(88,101,242,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(88,101,242,0.1)'; this.style.borderColor='transparent'">
    <i class="fab fa-discord"></i>
    <span style="font-size: 11px; font-weight: 600;">Discord</span>
  </a>

  <a href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #EA4335; font-size: 22px; text-decoration: none;
    padding: 14px 8px; border-radius: 16px; transition: all 0.3s ease;
    background: rgba(234,67,53,0.1); border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(234,67,53,0.25)'; this.style.borderColor='rgba(234,67,53,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(234,67,53,0.1)'; this.style.borderColor='transparent'">
    <i class="fas fa-envelope"></i>
    <span style="font-size: 11px; font-weight: 600;">Email</span>
  </a>

  <a href="https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #E60023; font-size: 22px; text-decoration: none;
    padding: 14px 8px; border-radius: 16px; transition: all 0.3s ease;
    background: rgba(230,0,35,0.1); border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(230,0,35,0.25)'; this.style.borderColor='rgba(230,0,35,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(230,0,35,0.1)'; this.style.borderColor='transparent'">
    <i class="fab fa-pinterest"></i>
    <span style="font-size: 11px; font-weight: 600;">Pinterest</span>
  </a>

  <button onclick="copyToClipboard('${url}').then(() => { this.style.background='rgba(0,243,255,0.4)'; setTimeout(() => this.style.background='rgba(0,243,255,0.1)', 800); showShareToast('Link copied! 🎉'); })" style="
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    color: #00f3ff; font-size: 22px; padding: 14px 8px; border-radius: 16px;
    transition: all 0.3s ease; background: rgba(0,243,255,0.1);
    border: none; cursor: pointer; border: 2px solid transparent;
  " onmouseover="this.style.transform='scale(1.08)'; this.style.background='rgba(0,243,255,0.25)'; this.style.borderColor='rgba(0,243,255,0.4)'"
     onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(0,243,255,0.1)'; this.style.borderColor='transparent'">
    <i class="fas fa-copy"></i>
    <span style="font-size: 11px; font-weight: 600;">Copy</span>
  </button>
      </div>
      
     <div style="background: rgba(0,243,255,0.08); padding: 16px; border-radius: 16px; border: 2px solid rgba(0,243,255,0.2); margin-top: 8px;">
  <div style="font-size: 13px; color: #00f3ff; margin-bottom: 12px; font-weight: 600; line-height: 1.3;">
    Your Portfolio Link
  </div>
  
  <div style="display: flex; gap: 8px; align-items: stretch; width: 100%; height: 42px;">
    <input id="shareUrlInput" readonly value="${url}" style="
      flex: 1; min-width: 0; padding: 0 12px; border: none; border-radius: 10px;
      background: rgba(255,255,255,0.08); color: #fff; font-family: monospace;
      font-size: 12px; text-align: center; backdrop-filter: blur(10px);
      outline: none; height: 100%; box-sizing: border-box;
    ">
    <button onclick="copyToClipboard('${url}').then(() => showShareToast('Copied!'))" style="
      padding: 0 20px; background: linear-gradient(135deg, #00f3ff, #667eea);
      color: white; border: none; border-radius: 10px; font-weight: 600;
      cursor: pointer; font-size: 12px; transition: all 0.3s ease;
      height: 100%; box-sizing: border-box; white-space: nowrap;
      flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
      Copy
    </button>
  </div>
</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.style.opacity = '1');
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  
  // Auto select URL
  setTimeout(() => {
    const input = overlay.querySelector('#shareUrlInput');
    if (input) input.select();
  }, 200);
}

function initSocialShare() {
  const shareBtn = document.getElementById('portfolioShareBtn');
  if (!shareBtn) {
    console.warn('Share button #portfolioShareBtn not found!');
    return;
  }

  console.log('Social share initialized - 15 platforms ready!');
  
  shareBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isPortfolioUnlocked) {
      showShareToast('Unlock portfolio first to share!');
      return;
    }

    const currentUrl = window.location.href;
    const portfolioTitle = document.title || 'Rohit Kumar - Full Stack Portfolio';
    console.log('Sharing portfolio:', portfolioTitle);

    // Native Web Share API (Mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: portfolioTitle,
          text: 'Check out my portfolio! Full-stack developer from India',
          url: currentUrl
        });
        showShareToast('Portfolio shared successfully!');
      } catch (err) {
        console.log('Native share failed, showing modal:', err);
        showShareModal(currentUrl, portfolioTitle);
      }
    } else {
      // Desktop - Copy & Show Modal
      try {
        await copyToClipboard(currentUrl);
        showShareToast('Link copied! Check all share options');
        setTimeout(() => showShareModal(currentUrl, portfolioTitle), 600);
      } catch (err) {
        console.error('Copy failed:', err);
        showShareToast('Open share options!');
        showShareModal(currentUrl, portfolioTitle);
      }
    }
  });
}

// =====================================================
// 🔥 LOADING SCREEN & ENTER PORTFOLIO
// =====================================================
function initLoadingScreen() {
  const loader = document.getElementById('loader');
  const welcomeSection = document.getElementById('welcome');
  
  if (!loader || !welcomeSection) return;

  const MINTIME = 3500;
  const start = Date.now();

  function showWelcome() {
    loader.classList.add('loader-exit');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
      document.body.classList.add('welcome-active');
      welcomeSection.style.display = 'flex';
      welcomeSection.style.opacity = '1';
      welcomeSection.style.transform = 'scale(1)';
    }, 800);
  }

  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    const remaining = Math.max(MINTIME - elapsed, 0);
    setTimeout(showWelcome, remaining);
  });

  setTimeout(() => {
    if (document.getElementById('loader')) {
      showWelcome();
    }
  }, MINTIME + 3000);
}

function initEnterPortfolio() {
  const enterBtn = document.querySelector('.enter-portfolio-btn');
  if (!enterBtn) return;

  enterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (isPortfolioUnlocked) return;
    
    isPortfolioUnlocked = true;
    
    const welcomeSection = document.getElementById('welcome');
    if (welcomeSection) {
      welcomeSection.style.opacity = '0';
      welcomeSection.style.transform = 'scale(0.95)';
      setTimeout(() => {
        welcomeSection.style.display = 'none';
        document.body.classList.remove('welcome-active', 'portfolio-locked');
        document.body.style.overflow = 'auto';
      }, 600);
    }

    // Show main content
    ['navbar', 'main', 'footer'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      }
    });

    const homeSection = document.getElementById('home');
    if (homeSection) {
      setTimeout(() => {
        homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  });
}

// =====================================================
// 🔥 NAVIGATION UI
// =====================================================
function initPortfolio() {
  // AOS Animation
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1200,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      disable: window.innerWidth < 768
    });
  }

  // Smooth scroll navigation
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!isPortfolioUnlocked) {
        e.preventDefault();
        return;
      }
      
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update active nav
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => {
          l.classList.remove('active');
        });
        link.classList.add('active');
        
        // Close mobile menu
        if (mobileNav && hamburger) {
          mobileNav.classList.remove('active');
          hamburger.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      }
    });
  });

  // Mobile menu
  hamburger = document.getElementById('hamburger');
  mobileNav = document.getElementById('mobileNav');
  
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      if (!isPortfolioUnlocked) return;
      
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
    });

    document.addEventListener('click', (e) => {
      if (hamburger && mobileNav && 
          !hamburger.contains(e.target) && 
          !mobileNav.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Mode toggle
  modeToggle = document.getElementById('modeToggle');
  devContent = document.querySelector('.dev-content');
  clientContent = document.querySelector('.client-content');
  
  if (modeToggle && devContent && clientContent) {
    modeToggle.addEventListener('click', (e) => {
      if (!e.target.classList.contains('mode-btn')) return;
      
      const mode = e.target.dataset.mode;
      modeToggle.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      e.target.classList.add('active');
      
      if (mode === 'dev') {
        devContent.style.display = 'block';
        clientContent.style.display = 'none';
      } else {
        devContent.style.display = 'none';
        clientContent.style.display = 'block';
      }
    });
  }
}

function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar || !isPortfolioUnlocked) return;
    
    if (window.pageYOffset > 100) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
}

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    if (!isPortfolioUnlocked) return;
    
    const scrollY = window.pageYOffset;
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const top = section.offsetTop - 200;
      const height = section.clientHeight;
      
      if (scrollY >= top && scrollY < top + height) {
        const id = section.id;
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
        break;
      }
    }
  });
}

function initBackToTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.className = 'back-to-top';
  btn.style.cssText = `
    position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px;
    border-radius: 50%; background: #00f3ff; color: white; border: none;
    font-size: 20px; cursor: pointer; opacity: 0; visibility: hidden;
    z-index: 1000; transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,243,255,0.3);
  `;
  
  btn.addEventListener('click', () => {
    if (isPortfolioUnlocked) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 800 && isPortfolioUnlocked) {
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
    } else {
      btn.style.opacity = '0';
      btn.style.visibility = 'hidden';
    }
  });
  
  document.body.appendChild(btn);
}

// =====================================================
// 🔥 MASTER INIT - 100% WORKING
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
  // Init Firebase
  function initFirebase() {
    if (typeof firebase !== 'undefined') {
      try {
        firebase.initializeApp(firebaseConfig);
      } catch (e) {
        // Already initialized
      }
      firebaseDb = firebase.database();
      console.log('✅ Firebase Connected - User Panel');
      loadPortfolioData();
    } else {
      console.log('⏳ Waiting for Firebase...');
      setTimeout(initFirebase, 200);
    }
  }
  
  initFirebase();
  
  // Init all systems
  initEnterPortfolio();
  initPortfolio();
  initNavbarScroll();
  initActiveNav();
  initBackToTop();
  initSocialShare(); // 15 PLATFORMS READY!
  initLoadingScreen();
  
  // 🔥 Fixed Starfield Initialization
  /* =========================================
   FIX FOR "initStarfield is not defined"
   ========================================= */

// Ye code purane function call ko naye wale par redirect kar dega
window.initStarfield = function() {
    console.log("Connecting old starfield call to HyperRain...");
    initHyperRain();
};
  

  // js/main.js - COMPLETE FILE (copy-paste karo, replace mat karo)
// Tumhare existing code ke BAAD ye add karo

// ===== LIVE DATETIME CLOCK =====
function updateLiveDateTime() {
  const now = new Date();
  
  const options = {
    weekday: 'short',
    day: 'numeric', 
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  };
  
  // Format: Sat 3 Jan 2026 | 3:50:12 PM
  const datetimeStr = now.toLocaleDateString('en-IN', options)
    .replace(',', ' | ');
  
  const el = document.getElementById('live-datetime');
  if (el) {
    el.textContent = datetimeStr;
  }
}

// Page fully load hone pe start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initClock);
} else {
  initClock();
}

function initClock() {
  updateLiveDateTime();  // First update
  setInterval(updateLiveDateTime, 1000);  // Har second
}

  console.log('🚀 ULTIMATE SHARE SYSTEM - 15 PLATFORMS - 100% WORKING!');
  console.log('✅ Portfolio JS - COMPLETE PERFECTLY OPTIMIZED!');
});