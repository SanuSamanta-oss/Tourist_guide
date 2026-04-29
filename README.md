
# 🧭 WanderQuest — Treasure Hunt Travel Explorer
A treasure-hunt style web app that guides tourists through top destinations worldwide, offering rewards, verified local pricing to avoid scams, and on-demand local guide hiring.
## ✨ Features
- **🗺️ Interactive World Map** — Leaflet-powered map with 20+ destinations, category filters, and satellite/standard view toggle
- **🛰️ Satellite Zoom** — Click any pin to enlarge the satellite view of that exact location
- **🏆 Treasure Hunt** — Complete unique challenges at each destination to earn points and unlock badges
- **💰 Verified Local Pricing** — Compare real local prices vs inflated tourist prices with savings percentages
- **⚠️ Scam Alerts** — Destination-specific warnings about common tourist scams
- **👤 Local Guide Hiring** — Browse and hire verified local guides with ratings, languages, and transparent pricing
- **🎖️ Rewards Dashboard** — Track points, badges, visited places, and explorer rank
- **🌐 Multi-Language Support** — Full UI translation in 16 languages including English, Spanish, French, Hindi, Chinese, Japanese, Korean, Arabic, and more
- **✨ Premium Animations** — Particle effects, glassmorphism cards, smooth scroll animations, and micro-interactions
## 🚀 Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wanderquest.git
   cd wanderquest
   ```
2. Open `index.html` in your browser — no build step required!
   Or serve locally:
   ```bash
   npx serve .
   ```
3. Select your preferred language and start exploring!
## 📁 Project Structure
```
wanderquest/
├── index.html              # Main entry point
├── css/
│   └── style.css           # Complete styling with animations
├── js/
│   ├── destinations.js     # 20+ destination data with pricing & guides
│   ├── language.js         # Multi-language translation system (16 languages)
│   ├── map.js              # Leaflet map with satellite view
│   ├── features.js         # Treasure hunt, pricing, guides, rewards
│   └── app.js              # Main app orchestration & particles
└── README.md
```
## 🌐 Supported Languages
English, Español, Français, Deutsch, Italiano, Português, 中文, 日本語, 한국어, हिन्दी, العربية, Русский, ไทย, Türkçe, Bahasa Indonesia, Tiếng Việt
## 🛠️ Technologies
- **HTML5** — Semantic structure
- **CSS3** — Custom properties, glassmorphism, animations, responsive grid
- **JavaScript** — Vanilla ES6+ modules
- **Leaflet.js** — Interactive maps with satellite tiles (Esri)
- **Font Awesome** — Icons
- **Google Fonts** — Cinzel + Poppins typography
- **LocalStorage** — Persistent rewards & language preferences
## 📄 License
MIT License — feel free to use and modify!
