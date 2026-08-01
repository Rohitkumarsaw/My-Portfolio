<div align="center">

# ⚡ PortfolioCMS — Premium Developer Portfolio

### Rohit Kumar · Full-Stack Web Developer

A futuristic, glassmorphic **developer portfolio** with a real-time **admin panel**, Firebase-powered content management, and a built-in **maintenance mode** — all in pure HTML, CSS & JavaScript.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

</div>

---

## ✨ Features

| | |
|---|---|
| 🚀 | **Cinematic Loader** — animated rings, monogram & live progress percentage |
| 🌌 | **Particle Starfield** — real-time canvas background (`initHyperRain`) |
| 🔒 | **Locked Entry Screen** — portfolio unlocks with an animated "Enter Portfolio" gate |
| 🧊 | **Glassmorphism Navbar** — fixed header + smooth-scroll mobile menu |
| 🗄️ | **Firebase Realtime Database** — stats, about, services, projects & contact load live |
| 🛠️ | **Full Admin Panel** — manage everything from a premium auth-protected dashboard |
| 🔐 | **Firebase Email/Password Auth** — two-column premium login page |
| 🧰 | **Maintenance Mode** — toggle the whole site off with 3 display modes |
| 🎨 | **Fully Responsive** — desktop, tablet & mobile optimised |
| ✨ | **AOS Scroll Animations** + Font Awesome icons + Orbitron/Syncopate cyber fonts |

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Backend:** Firebase Auth + Firebase Realtime Database (compat SDK v10)
- **Icons & Fonts:** Font Awesome 6, Orbitron, Syncopate, Inter
- **Animations:** AOS (Animate On Scroll), custom CSS keyframes, Canvas API

---

## 📂 Folder Structure

```
my-portfolio/
├── index.html              # User-facing portfolio (entry point)
├── admin.html              # Admin panel (auth protected)
├── css/
│   ├── style.css           # User panel styles
│   └── admin.css           # Admin panel styles
├── js/
│   ├── script.js           # User panel logic + Firebase reads
│   └── admin.js            # Admin logic + Firebase writes
├── assets/
│   ├── images/             # Icons & profile photos
│   └── pdf/                # Resume download
├── notes/                  # Dev notes
└── old version/            # Previous flat-structure build (kept for reference)
```

---

## 🧰 Maintenance Mode

Put the entire website into maintenance mode in one click from the admin panel:

- **🔴 Full Screen** — entire site replaced by an animated maintenance screen
- **🟡 Banner** — sticky top strip, header/content auto-pushed below it
- **🪟 Popup** — dismissible maintenance popup over the live site

Toggle **ON/OFF** anytime; the message & title are fully editable. Stored live in Firebase under `portfolio/maintenance`.

---

## 🔧 Setup Guide

> You need a [Firebase](https://console.firebase.google.com) project with **Realtime Database** and **Email/Password Auth** enabled.

1. **Clone & open**
   ```bash
   git clone https://github.com/Rohitkumarsaw/My-Portfolio.git
   cd My-Portfolio
   ```

2. **Add your Firebase config** in both files:
   - `js/script.js`
   - `js/admin.js`

   Replace the `firebaseConfig` object with your own project's credentials.

3. **Enable services in Firebase Console**
   - *Authentication* → Sign-in method → **Email/Password**
   - *Realtime Database* → Create database → set rules (see below)

4. **Database structure** (all under `portfolio/`):
   ```
   portfolio/
   ├── stats/        # { yearsExp, successRate, projectsLive }
   ├── about/        # bio, skills, etc.
   ├── services/     # service cards
   ├── projects/     # project cards
   ├── education/    # timeline entries
   ├── contact/      # contact details
   └── maintenance/  # { enabled, mode, title, message }
   ```

5. **Run locally**
   ```bash
   python -m http.server 8123
   ```
   then open `http://127.0.0.1:8123` (serve over HTTP — Firebase Auth doesn't work from `file://`).

6. **Admin access** — open `admin.html`, sign in with a user you created in Firebase Auth.

---

## 🔐 Suggested Realtime DB Rules

```json
{
  "rules": {
    "portfolio": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

---

## 🚀 Deployment

Any static host works:

[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Firebase Hosting](https://img.shields.io/badge/Firebase_Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/docs/hosting)

Just upload the folder (or connect the repo) — no build step required.

---

## 🧑‍💻 Author

**Rohit Kumar** — Full-Stack Web Developer

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Rohitkumarsaw)

---

<div align="center">
  ⚡ Built with passion · HTML · CSS · JavaScript · Firebase
</div>
