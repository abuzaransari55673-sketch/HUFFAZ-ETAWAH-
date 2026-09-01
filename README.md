# HUFFAZ ETAWAH - Deen & Bayanaat
**Official Islamic Media & Educational Progressive Web Application (PWA) & Android App**

> **Tagline:** *Ilm • Ibadat • Tarbiyah*  
> **Mission:** Authentic Quran & Sunnah based Islamic media, Bayanaat, Jumma Khutbas, Deeni Taleem, Quranic Quizzes, and Children's Islamic learning platform.

---

## 🌟 Key Features & Capabilities

### 1. 🕌 Namaz Timings & Live Prayer Countdown
- **Automatic & Offline Fallback:** Accurate daily prayer times (Fajr, Sunrise/Tulu, Dhuhr, Asr, Maghrib, Isha) with live dynamic countdown to the next Salah.
- **Hijri Date Display:** Dynamic Islamic Hijri date and Gregorian date sync.
- **Location Switcher:** Pre-configured with Etawah (HQ), New Delhi, Lucknow, Kanpur, Agra, Mumbai, Hyderabad, Kolkata, Dubai, London, and international cities.
- **Free Public API Integration:** Integrates with Aladhan (No secret API keys needed) with built-in instant local calculation fallback when offline.

### 2. 🧭 Interactive Qibla Compass Finder
- **Real-time Orientation:** Utilizes device orientation sensors (`DeviceOrientationEvent` / `webkitCompassHeading`) to calculate the exact direction of the Holy Kaaba (Makkah).
- **Trigonometric Offline Engine:** Calculates Qibla degree azimuth offline from any latitude/longitude coordinates on earth using the Great-Circle formula.

### 3. 📹 Bayanaat & Video Media Library
- **Categorized Streaming:** Filter speeches and lectures by *Khaas Bayan*, *Jumma Khutba*, *Dars*, *Ijtima*, and *Islamic Shorts*.
- **YouTube Embed Player Modal:** Seamless embedded video streaming with direct YouTube watching link.
- **Instant Search:** Instant multi-field search across titles, scholars, and topics.
- **Bookmarks & Favorites:** Save bayanaat to local device storage to watch later.
- **Social Sharing:** One-tap Web Share API & clipboard copy for sharing Islamic reminders on WhatsApp, Telegram, and social media.

### 4. 🧠 Quiz-e-Deen (Islamic MCQ Engine)
- **Interactive Quran & Hadith Quizzes:** Multi-category questions (Quran, Seerah, Namaz, Ahadith, Prophets, Deeniyat).
- **Instant Feedback & Authentic References:** Real-time answer validation with detailed explanations and classical references (Sahih Bukhari, Sahih Muslim, Ibn Kathir, etc.).
- **Gamified Learning:** Score tracker (+10 pts per correct answer) and daily streak counter saved in local storage.

### 5. 📖 Deeni Taleem & Maktab Modules
- **Noorani Qaida & Tajweed:** Step-by-step Arabic letters, Harkat, Tanween, and Makharij rules.
- **Namaz ka Sunnat Tareeqa:** 4 Faraiz of Wudhu, 14 Faraiz of Salah, 5-time prayer rakats breakdown, Attahiyyaat & Durood Ibrahim.
- **6 Kalime:** Arabic text with Urdu translation and virtues.
- **Masnoon Duain:** Authentic daily supplications (Sleeping, Waking, Washroom, Home, etc.).
- **Muntakhab Ahadith:** Character building and Islamic ethics with authentic sanad.
- **Islamic Stories:** Inspiring stories of Prophets (Qasas-ul-Anbiya).
- **HUFFAZ ETAWAH Kids:** Interactive Islamic manners and child-friendly Aqeedah modules.
- **Lesson Progress Tracker:** Tracks and marks completed lessons.

### 6. 🛠️ Admin / Content Management Panel
- **Client-side CMS:** Easily add and publish new Bayanaat, Jumma Khutbas, YouTube Shorts, or Quiz questions directly from the app.
- **Local Persistence:** Data saved to `localStorage`, seamlessly merging with the master data catalog without requiring paid servers or databases.

### 7. 📱 PWA & Offline Support
- **Full PWA Compliance:** Installable on Android, iOS, Windows, Mac, and ChromeOS.
- **Service Worker:** Stale-While-Revalidate caching strategy ensures instantaneous loading and full offline usability.
- **Dark / Light Islamic Theme:** Centralized CSS custom properties with gold accents and deep emerald tones.

---

## 🚀 Technology Stack
- **Frontend:** HTML5, CSS3 (Material 3 & Islamic Aesthetic Variables), Modern JavaScript (ES6+)
- **Storage:** LocalStorage & Cache Storage API
- **PWA:** Web App Manifest & Service Worker
- **Android Container:** Kotlin, Android WebView container with hardware acceleration and edge-to-edge support.
- **APIs:** Zero-key, free public endpoints (Aladhan Prayer Times API) with offline math fallbacks.

---

## 📂 Project Architecture

```
├── index.html                   # Core PWA User Interface & Modal Shell
├── style.css                    # Islamic Design System (Theme, Typography, Layouts)
├── app.js                       # Application Controller, State & Event Engine
├── data.js                      # Master Content Store (Bayanaat, Quizzes, Taleem, Timings)
├── manifest.json                # PWA Manifest Configuration
├── service-worker.js            # Offline Caching & Assets Interceptor
├── icons/                       # Vector SVG & PNG App Icons
│   └── icon.svg                 # Custom Islamic Geometric & Quranic Vector Icon
├── metadata.json                # AI Studio Metadata
└── app/                         # Native Android Wrapper Module
    └── src/main/
        ├── assets/              # Offline Web Assets for Native Android Wrapper
        └── java/com/example/    # MainActivity & Android Native Engine
```

---

## 🔒 Privacy & Zero Paid API Guarantee
- **No Paid Gemini API or Backend Billing Required.**
- **No Firebase Paid Services Required.**
- **Zero API keys exposed in frontend code.**
- **Offline First:** All core learning, quiz, dua, and timing data works 100% offline.
