# 🌌 Solar System Explorer

**Solar System Explorer** is a 3D interactive simulation of our solar system, built with **Three.js** and enriched with beautiful textures, orbits, and motion. This project is intended for **educational and visual understanding**, not for precise scientific accuracy.

---

## 📸 Live Demo

🚀 [Click here to view the live project](https://pushu9387.github.io/solar-system-explorer/)

## 🚀 Project Overview

This web-based project helps you explore the solar system in a fun and engaging way. You can click on planets, hear descriptions, take a guided tour, view realistic orbital paths, and even visualize asteroid and Kuiper belts.

> I built this project over the course of **2 weeks** with the help of AI tools like **ChatGPT, Claude AI, and DeepSeek** for learning, debugging, and code enhancement. It is meant for personal learning and understanding of space visualization, not as an advanced simulation.

---

## 🎯 Features

- 🌍 Realistic planetary orbits (visualized, not to actual scale)
- 📦 Interactive click-to-view info panel for each planet
- 🔊 Voice narration using Web Speech API
- 🛰️ Moons with orbital motion
- ☄️ Asteroid Belt and Kuiper Belt with particle effects
- 🌗 Bloom effects and background stars
- 🔁 Auto-rotate and pause/resume control
- 🎙️ Voice control panel (Play / Pause / Stop)
- 📱 Responsive Design (Works on desktop and mobile)
- 🕹️ Full Guided Tour through all major planets
- 🌐 Fullscreen and VR toggle support (WebXR)

---

## 🧱 Project Structure

solar-system-explorer/
├── index.html # Main HTML file
├── css/
│ └── style.css # All styles
├── js/
│ ├── main.js # Core animation and app logic
│ └── core/ # Supporting Three.js shaders and libraries
│ ├── three.min.js
│ ├── orbitControls.js
│ ├── tween.umd.js
│ ├── GLTFLoader.js
│ ├── Lensflare.js
│ ├── EffectComposer.js
│ ├── UnrealBloomPass.js
│ └── other shader files...
├── public/
│ └── textures/ # All planet/star textures
│ ├── earth.jpg
│ ├── mars.jpg
│ ├── saturn.jpg
│ ├── asteroid.jpg
│ ├── kuiper.jpg
│ └── ...many more
├── README.md # This file!


---

## 🛠️ Technologies Used

- 🌐 **HTML/CSS/JS**
- 🌌 **Three.js** for 3D rendering
- 🎮 **orbitControls.js** for camera navigation
- ✨ **ShaderPass, Bloom, and Lensflare** for visual enhancements
- 🎭 **Tween.js** for smooth camera transitions
- 🗣️ **Web Speech API** for narration
- 📦 No framework (vanilla JS), npm not required

---

## 📦 How to Run

> No npm install or server setup required.

Just open the `index.html` in your browser:

1. Download or clone the repo
2. Navigate to the folder
3. Open `index.html` directly in Chrome or Firefox

✅ No build tools required — runs offline.

---

## 🎮 Controls

- **Click on any planet**: shows facts and speaks description
- **Use speed slider**: control orbit speed
- **Toggle asteroid/Kuiper belt**: from UI checkboxes
- **Start Tour**: auto-fly to each planet one by one
- **VR Mode**: if your device supports WebXR
- **Fullscreen**: click the button to go immersive
- **Voice Controls**: Play / Pause / Stop narration

---

## 📁 Textures Used

All textures are placed inside `public/textures/`, including:

- Planet maps: `earth.jpg`, `mars.jpg`, `jupiter.jpg`, etc.
- Extras: `asteroid.jpg`, `kuiper.jpg`, `lensflare.png`, `stars.jpg`, etc.
- Saturn and Uranus rings: transparent `.png` overlays

> All textures used are for educational purposes only.

---

## 🙋 About Me

I’m a student exploring **space visualization and web development**. This project was built over **2 weeks** with a lot of passion and help from:

- 🤖 **ChatGPT**
- 🤖 **Claude AI**
- 🤖 **DeepSeek AI**

They helped me understand, debug, and build many features while I kept learning and improving my JavaScript and 3D graphics skills.
