# 🌌 S A Sanush — Interactive 3D Portfolio

A premium, interactive personal portfolio website showcasing 3D WebGL scenes, a custom PWA application shell, keyboard command-palette navigation, and integrated EmailJS messaging.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=progressive-web-apps&logoColor=white)](https://web.dev/progressive-web-apps/)

---

## 🌟 Interactive Features & Architecture

This portfolio goes beyond the standard landing page, operating as a full-featured, glassmorphic application shell with high UX polish:

| Feature | Tech Details | Visual/UX Impact |
| :--- | :--- | :--- |
| **🎨 Dynamic Theme Switcher** | Synchronizes real-time CSS variables (`--y` design token) and **live Three.js materials** (floating objects, computer outline, ambient light). | Changes the entire site's accent glow (Yellow, Cyan, Emerald, Pink, Purple) instantly on click or text command. |
| **⌨️ Command Palette (Ctrl+K)** | Accessible via `Cmd + K` or navbar click. Built using custom event listeners and keyboard mappings. | Power-user navigation modal overlay to trigger actions, jump sections, open resume, or switch themes. |
| **🌐 3D Raycasting Hovers** | Custom Three.js pointer raycasters map canvas screen-space coordinates to 3D mesh matrices. | Hovering over the 3D computer/phone screen morphs the cursor into a `VIEW PROJECTS` badge; clicking scrolls to the project deck. |
| **🤖 AI Portfolio Chatbot** | Powered by Gemini API with structured markdown mapping and glassmorphic message bubble UI. | Answers questions about skills/credentials and generates **interactive, styled project cards** inline. |
| **📥 Twin FAB Dock** | Custom twin CSS keyframe pulse offsets synced on a fixed bottom viewport deck. | Harmoniuous twin floating buttons for the AI Chatbot and CV Resume download with interactive icon spins. |
| **📊 Glowing Developer Stats** | Custom grid layout with CSS amber filter glows, developer-centric metrics, and hover micro-animations. | Replaces generic stats with punchy metrics (e.g. *9-LLM JARVIS*, *NLP Recruitment Engine*). |
| **📬 EmailJS Integration** | Fully integrated `@emailjs/browser` SDK communicating client-side directly with the recipient's inbox. | Allows seamless email submission to `sasanush86@gmail.com` with real-time loaders and success states. |
| **📱 Offline PWA Support** | Service Worker caching structure (`sw.js`) and manifest metadata. | Instant subsequent load times and complete offline support for cached assets. |

---

## 🛠️ Technology Stack

* **Core Structure:** Semantic HTML5, CSS Variables, and Modular ES6+ JavaScript.
* **3D Graphics Engine:** Three.js (WebGL rendering engine with ambient/directional lights, custom physical materials, and fog effects).
* **Communication:** EmailJS SDK API.
* **Caching & Performance:** Service Worker API.

---

## 🚀 Getting Started

### Prerequisites

You need a simple local server to run this locally due to CORS rules regarding Service Workers and Three.js canvas components.

### Quick Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SA-Sanush/My-portfolio.git
   cd My-portfolio
   ```

2. **Configure your EmailJS keys:**
   Open `sanush_portfolio.js` and insert your credentials:
   ```javascript
   const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; 
   const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
   const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
   ```

3. **Run a local development server:**
   Using Node.js/npm:
   ```bash
   npm install
   npm run dev
   ```
   Or using Python:
   ```bash
   python3 -m http.server 3000
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## 📈 Social Proof & Achievements

* 🏆 **IBM watsonx Hackathon:** Recognized as Outstanding for project execution.
* 🎓 **IIT Kharagpur:** Elite certification in computer systems.
* 🧠 **MCA Candidate:** Master of Computer Applications student bridging design and software systems.

---

## 📄 License

This project is created for personal showcase and educational purposes. Feel free to explore the code!
