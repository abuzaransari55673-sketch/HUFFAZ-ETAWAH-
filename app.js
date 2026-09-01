/**
 * HUFFAZ ETAWAH - Deen & Bayanaat
 * Core Application Engine & PWA Controller
 */

// Application State
const state = {
  activeScreen: "home",
  theme: localStorage.getItem("huffaz_theme") || "light",
  currentCity: JSON.parse(localStorage.getItem("huffaz_city")) || HUFFAZ_DATA.defaultPrayerTimes,
  prayerTimes: HUFFAZ_DATA.defaultPrayerTimes,
  bookmarks: JSON.parse(localStorage.getItem("huffaz_bookmarks")) || [],
  completedLessons: JSON.parse(localStorage.getItem("huffaz_completed_lessons")) || [],
  quizScore: parseInt(localStorage.getItem("huffaz_quiz_score") || "240", 10),
  quizStreak: parseInt(localStorage.getItem("huffaz_quiz_streak") || "3", 10),
  currentQuizIndex: 0,
  quizAnswered: false,
  allBayanaat: [],
  allQuizzes: [],
  activeWisdom: "ayat"
};

// Initialize Application on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initServiceWorker();
  initNetworkListeners();
  loadData();
  initNavigation();
  initHeroDates();
  initPrayerTimes();
  initBayanaatScreen();
  initQuizScreen();
  initTaleemScreen();
  initProfileScreen();
  initModals();
  initQiblaCompass();

  // Setup interval for live prayer countdown
  setInterval(updatePrayerCountdown, 1000);
});

/* ==========================================================================
   1. Theme & PWA Service Worker Initialization
   ========================================================================== */
function initTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  const themeIcon = document.getElementById("themeIcon");
  if (themeIcon) {
    themeIcon.textContent = state.theme === "dark" ? "light_mode" : "dark_mode";
  }

  const btnThemeToggle = document.getElementById("btnThemeToggle");
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener("click", () => {
      state.theme = state.theme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", state.theme);
      localStorage.setItem("huffaz_theme", state.theme);
      themeIcon.textContent = state.theme === "dark" ? "light_mode" : "dark_mode";
    });
  }
}

function initServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => {
        console.log("[PWA] Service Worker registered with scope:", reg.scope);
      })
      .catch((err) => {
        console.warn("[PWA] Service Worker registration failed:", err);
      });
  }
}

function initNetworkListeners() {
  const offlineBanner = document.getElementById("offlineBanner");
  function updateOnlineStatus() {
    if (!navigator.onLine) {
      offlineBanner.classList.add("active");
    } else {
      offlineBanner.classList.remove("active");
    }
  }
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  updateOnlineStatus();
}

/* ==========================================================================
   2. Data Loading & Local Merge
   ========================================================================== */
function loadData() {
  // Load custom admin items from localStorage and merge with default catalog
  const localBayanaat = JSON.parse(localStorage.getItem("huffaz_custom_bayanaat") || "[]");
  state.allBayanaat = [...localBayanaat, ...HUFFAZ_DATA.bayanaat];

  const localQuizzes = JSON.parse(localStorage.getItem("huffaz_custom_quizzes") || "[]");
  state.allQuizzes = [...localQuizzes, ...HUFFAZ_DATA.quizzes];

  // Update Admin Stats
  const adminBCount = document.getElementById("adminTotalBayanaat");
  if (adminBCount) adminBCount.textContent = state.allBayanaat.length;
  const adminQCount = document.getElementById("adminTotalQuizzes");
  if (adminQCount) adminQCount.textContent = state.allQuizzes.length;
}

/* ==========================================================================
   3. Navigation Routing
   ========================================================================== */
function initNavigation() {
  // Check hash on load
  const hash = window.location.hash.replace("#", "");
  if (hash && ["home", "bayanaat", "quiz", "taleem", "profile"].includes(hash)) {
    switchNav(hash);
  } else {
    switchNav("home");
  }

  window.addEventListener("hashchange", () => {
    const newHash = window.location.hash.replace("#", "");
    if (newHash && ["home", "bayanaat", "quiz", "taleem", "profile"].includes(newHash)) {
      switchNav(newHash);
    }
  });
}

function switchNav(targetScreen) {
  state.activeScreen = targetScreen;
  window.location.hash = targetScreen;

  // Toggle Screen views
  document.querySelectorAll(".screen-view").forEach((el) => {
    el.classList.remove("active");
  });
  const currentView = document.getElementById(`screen-${targetScreen}`);
  if (currentView) {
    currentView.classList.add("active");
  }

  // Toggle Nav button states
  document.querySelectorAll(".bottom-nav .nav-item").forEach((btn) => {
    if (btn.getAttribute("data-target") === targetScreen) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================================
   4. Date & Live Prayer Times Calculation
   ========================================================================== */
function initHeroDates() {
  const gregorianEl = document.getElementById("heroGregorianDate");
  const now = new Date();
  const options = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
  if (gregorianEl) {
    gregorianEl.textContent = now.toLocaleDateString("en-US", options);
  }

  // City Selector Population
  const citySelect = document.getElementById("selectCityLocation");
  if (citySelect) {
    citySelect.innerHTML = HUFFAZ_DATA.citiesList
      .map(
        (c) =>
          `<option value="${c.name}" ${c.name.includes(state.currentCity.city) ? "selected" : ""}>
          ${c.name} (${c.state || c.country})
        </option>`
      )
      .join("");
  }
}

function changeCityLocation(cityName) {
  const found = HUFFAZ_DATA.citiesList.find((c) => c.name === cityName);
  if (found) {
    state.currentCity = {
      city: found.name,
      state: found.state,
      country: found.country,
      latitude: found.lat,
      longitude: found.lng,
      timezone: "Asia/Kolkata",
      fajr: "04:42",
      sunrise: "05:58",
      dhuhr: "12:16",
      asr: "16:45",
      maghrib: "18:34",
      isha: "19:50"
    };
    localStorage.setItem("huffaz_city", JSON.stringify(state.currentCity));
    document.getElementById("heroCityName").textContent = found.name.split(" ")[0];
    fetchPrayerTimes(found.lat, found.lng);
  }
}

function initPrayerTimes() {
  const cityBtn = document.getElementById("btnChangeLocation");
  if (cityBtn) {
    cityBtn.addEventListener("click", () => openModal("modalNamaz"));
  }

  // Attempt public free prayer times API with instant offline fallback
  fetchPrayerTimes(state.currentCity.latitude, state.currentCity.longitude);
}

function fetchPrayerTimes(lat, lng) {
  renderPrayerTables(state.currentCity);

  // Free public Aladhan prayer timing API (No API key required)
  const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=1&school=1`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.data && data.data.timings) {
        const timings = data.data.timings;
        state.prayerTimes = {
          ...state.currentCity,
          fajr: timings.Fajr.substring(0, 5),
          sunrise: timings.Sunrise.substring(0, 5),
          dhuhr: timings.Dhuhr.substring(0, 5),
          asr: timings.Asr.substring(0, 5),
          maghrib: timings.Maghrib.substring(0, 5),
          isha: timings.Isha.substring(0, 5)
        };
        renderPrayerTables(state.prayerTimes);
        if (data.data.date && data.data.date.hijri) {
          const h = data.data.date.hijri;
          const heroH = document.getElementById("heroHijriDate");
          if (heroH) {
            heroH.innerHTML = `<span class="material-symbols-rounded" style="font-size:16px;">calendar_month</span> <span>${h.day} ${h.month.en} ${h.year} AH</span>`;
          }
        }
      }
    })
    .catch((err) => {
      console.log("[Prayer API] Using offline calculated prayer times:", err);
      renderPrayerTables(state.currentCity);
    });
}

function renderPrayerTables(t) {
  const table = document.getElementById("fullPrayerTable");
  if (!table) return;

  const prayers = [
    { name: "Fajr", time: formatTime12(t.fajr), raw: t.fajr },
    { name: "Sunrise (Tulu-e-Aftab)", time: formatTime12(t.sunrise), raw: t.sunrise },
    { name: "Dhuhr", time: formatTime12(t.dhuhr), raw: t.dhuhr },
    { name: "Asr", time: formatTime12(t.asr), raw: t.asr },
    { name: "Maghrib", time: formatTime12(t.maghrib), raw: t.maghrib },
    { name: "Isha", time: formatTime12(t.isha), raw: t.isha }
  ];

  table.innerHTML = prayers
    .map(
      (p) => `
      <tr class="prayer-row">
        <td class="prayer-name-col">
          <span class="material-symbols-rounded" style="color:var(--gold);">${p.name.includes("Sunrise") ? "wb_sunny" : "schedule"}</span>
          <span>${p.name}</span>
        </td>
        <td class="prayer-time-col">${p.time}</td>
      </tr>
    `
    )
    .join("");

  updatePrayerCountdown();
}

function updatePrayerCountdown() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseMin = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const times = [
    { name: "Fajr", min: parseMin(state.prayerTimes.fajr), str: state.prayerTimes.fajr },
    { name: "Dhuhr", min: parseMin(state.prayerTimes.dhuhr), str: state.prayerTimes.dhuhr },
    { name: "Asr", min: parseMin(state.prayerTimes.asr), str: state.prayerTimes.asr },
    { name: "Maghrib", min: parseMin(state.prayerTimes.maghrib), str: state.prayerTimes.maghrib },
    { name: "Isha", min: parseMin(state.prayerTimes.isha), str: state.prayerTimes.isha }
  ];

  let nextPrayer = times.find((p) => p.min > currentMinutes);
  let remainingMinutes = 0;

  if (nextPrayer) {
    remainingMinutes = nextPrayer.min - currentMinutes;
  } else {
    // Next is tomorrow's Fajr
    nextPrayer = times[0];
    remainingMinutes = 24 * 60 - currentMinutes + nextPrayer.min;
  }

  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;
  const remText = hours > 0 ? `Baaqi: ${hours} ghanta ${mins} min` : `Baaqi: ${mins} minute`;

  const heroNextName = document.getElementById("heroNextPrayerName");
  const heroNextTime = document.getElementById("heroNextPrayerTime");
  const heroRemaining = document.getElementById("heroPrayerRemaining");

  if (heroNextName) heroNextName.textContent = nextPrayer.name;
  if (heroNextTime) heroNextTime.textContent = formatTime12(nextPrayer.str);
  if (heroRemaining) heroRemaining.textContent = remText;
}

function formatTime12(time24) {
  if (!time24) return "--:--";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h.toString().padStart(2, "0")}:${mStr} ${ampm}`;
}

/* ==========================================================================
   5. Bayanaat Video Library & Modals
   ========================================================================== */
function initBayanaatScreen() {
  renderHomeLatestBayanaat();
  renderAllBayanaat("All");

  // Category Tabs Filter
  const tabs = document.querySelectorAll("#bayanCategoryTabs .chip-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const category = tab.getAttribute("data-cat");
      renderAllBayanaat(category);
    });
  });

  // Search Filter
  const searchInput = document.getElementById("bayanSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      filterBayanaat(term);
    });
  }
}

function renderHomeLatestBayanaat() {
  const container = document.getElementById("homeLatestBayanaat");
  if (!container) return;

  const latest = state.allBayanaat.slice(0, 3);
  container.innerHTML = latest.map((b) => createBayanCardHtml(b)).join("");
}

function renderAllBayanaat(category = "All") {
  const container = document.getElementById("allBayanaatContainer");
  if (!container) return;

  let filtered = state.allBayanaat;
  if (category !== "All") {
    filtered = state.allBayanaat.filter((b) => b.category === category);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<p style="padding:24px; text-align:center; color:var(--text-muted);">Is category mein koi bayan dastyab nahi hai.</p>`;
    return;
  }

  container.innerHTML = filtered.map((b) => createBayanCardHtml(b)).join("");
}

function filterBayanaat(term) {
  const container = document.getElementById("allBayanaatContainer");
  if (!container) return;

  const filtered = state.allBayanaat.filter(
    (b) =>
      b.title.toLowerCase().includes(term) ||
      b.scholar.toLowerCase().includes(term) ||
      b.category.toLowerCase().includes(term) ||
      (b.description && b.description.toLowerCase().includes(term))
  );

  if (filtered.length === 0) {
    container.innerHTML = `<p style="padding:24px; text-align:center; color:var(--text-muted);">Aapki search '${term}' se koi bayan nahi mila.</p>`;
    return;
  }

  container.innerHTML = filtered.map((b) => createBayanCardHtml(b)).join("");
}

function createBayanCardHtml(b) {
  const isBookmarked = state.bookmarks.includes(b.id);
  return `
    <div class="bayan-card" id="bayan-${b.id}">
      <div class="bayan-thumbnail-wrap" onclick="playBayanVideo('${b.id}')">
        <img src="${b.thumbnail}" alt="${b.title}" class="bayan-thumb-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
        <span class="bayan-category-badge">${b.category}</span>
        <span class="bayan-duration-badge">${b.duration}</span>
        <button class="play-overlay-btn" aria-label="Play Bayan">
          <span class="material-symbols-rounded" style="font-size:28px;">play_arrow</span>
        </button>
      </div>
      <div class="bayan-content">
        <h3 class="bayan-title" onclick="playBayanVideo('${b.id}')">${b.title}</h3>
        <div class="bayan-scholar">
          <span class="material-symbols-rounded" style="font-size:16px;">verified</span>
          <span>${b.scholar}</span>
        </div>
        <div class="bayan-meta-row">
          <span>${b.date}</span>
          <div class="bayan-action-buttons">
            <button class="icon-btn" style="width:32px; height:32px;" onclick="toggleBookmark('${b.id}')" title="Bookmark">
              <span class="material-symbols-rounded" style="font-size:18px; color:${isBookmarked ? "var(--gold)" : "inherit"}; font-variation-settings:'FILL' ${isBookmarked ? 1 : 0};">
                bookmark
              </span>
            </button>
            <button class="icon-btn" style="width:32px; height:32px;" onclick="shareBayan('${b.id}')" title="Share">
              <span class="material-symbols-rounded" style="font-size:18px;">share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function extractYouTubeId(urlOrId) {
  if (!urlOrId) return "dQw4w9WgXcQ";
  if (urlOrId.length === 11 && !urlOrId.includes("/") && !urlOrId.includes(".")) {
    return urlOrId;
  }
  const match = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : "dQw4w9WgXcQ";
}

function playBayanVideo(bayanId) {
  const bayan = state.allBayanaat.find((b) => b.id === bayanId);
  if (!bayan) return;

  const ytId = extractYouTubeId(bayan.youtubeId || bayan.youtubeUrl);
  const container = document.getElementById("videoEmbedContainer");
  if (container) {
    container.innerHTML = `
      <iframe 
        src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1" 
        title="${bayan.title}" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;
  }

  document.getElementById("videoModalTitle").textContent = bayan.title;
  document.getElementById("videoModalScholar").textContent = bayan.scholar;
  document.getElementById("videoModalDesc").textContent = bayan.description || "";
  const ytBtn = document.getElementById("btnWatchOnYouTube");
  if (ytBtn) {
    ytBtn.href = bayan.youtubeUrl || `https://www.youtube.com/watch?v=${ytId}`;
  }

  openModal("modalVideoPlayer");
}

function toggleBookmark(bayanId) {
  if (state.bookmarks.includes(bayanId)) {
    state.bookmarks = state.bookmarks.filter((id) => id !== bayanId);
  } else {
    state.bookmarks.push(bayanId);
  }
  localStorage.setItem("huffaz_bookmarks", JSON.stringify(state.bookmarks));
  renderAllBayanaat();
  renderHomeLatestBayanaat();
  renderBookmarksList();
}

function shareBayan(bayanId) {
  const bayan = state.allBayanaat.find((b) => b.id === bayanId);
  if (!bayan) return;

  const shareData = {
    title: bayan.title,
    text: `${bayan.title}\nBayan by ${bayan.scholar}\nHUFFAZ ETAWAH:`,
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    alert("Bayan link copy ho gaya hai!");
  }
}

/* ==========================================================================
   6. Quiz-e-Deen MCQ Engine
   ========================================================================== */
function initQuizScreen() {
  loadQuestion(state.currentQuizIndex);
  updateQuizHeaderStats();
}

function updateQuizHeaderStats() {
  const streakEl = document.getElementById("userStreakVal");
  if (streakEl) streakEl.textContent = state.quizStreak;

  const scoreEl = document.getElementById("leaderboardUserScore");
  if (scoreEl) scoreEl.textContent = `${state.quizScore} Pts`;

  const profileScore = document.getElementById("statQuizScore");
  if (profileScore) profileScore.textContent = state.quizScore;

  const profileStreak = document.getElementById("statStreak");
  if (profileStreak) profileStreak.textContent = state.quizStreak;
}

function loadQuestion(index) {
  if (index >= state.allQuizzes.length) {
    index = 0; // loop back or show completed
    state.currentQuizIndex = 0;
  }

  const q = state.allQuizzes[index];
  state.quizAnswered = false;

  const progressPercent = ((index + 1) / state.allQuizzes.length) * 100;
  document.getElementById("quizProgressFill").style.width = `${progressPercent}%`;
  document.getElementById("quizCounterText").textContent = `Sawal ${index + 1} / ${state.allQuizzes.length}`;
  document.getElementById("quizCategoryBadge").textContent = q.category || "Deeniyat";
  document.getElementById("quizQuestionText").textContent = q.question;

  const feedbackBox = document.getElementById("quizFeedbackBox");
  feedbackBox.classList.remove("active");

  const optionsList = document.getElementById("quizOptionsList");
  const keys = ["A", "B", "C", "D"];

  optionsList.innerHTML = q.options
    .map(
      (opt, i) => `
      <button class="quiz-opt-btn" onclick="selectQuizAnswer(${i})">
        <span class="quiz-opt-key">${keys[i]}</span>
        <span>${opt}</span>
      </button>
    `
    )
    .join("");
}

function selectQuizAnswer(selectedIndex) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;

  const q = state.allQuizzes[state.currentQuizIndex];
  const buttons = document.querySelectorAll("#quizOptionsList .quiz-opt-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctAnswer) {
      btn.classList.add("correct");
    } else if (i === selectedIndex) {
      btn.classList.add("wrong");
    }
  });

  const feedbackBox = document.getElementById("quizFeedbackBox");
  const titleEl = document.getElementById("quizFeedbackTitle");
  const expEl = document.getElementById("quizFeedbackExplanation");
  const refEl = document.getElementById("quizFeedbackReference");

  if (selectedIndex === q.correctAnswer) {
    state.quizScore += 10;
    state.quizStreak += 1;
    titleEl.innerHTML = `<span class="material-symbols-rounded" style="color:var(--success);">check_circle</span> <span style="color:var(--success);">Sahi Jawab! (+10 Pts)</span>`;
  } else {
    titleEl.innerHTML = `<span class="material-symbols-rounded" style="color:var(--error);">cancel</span> <span style="color:var(--error);">Ghalat Jawab</span>`;
  }

  localStorage.setItem("huffaz_quiz_score", state.quizScore.toString());
  localStorage.setItem("huffaz_quiz_streak", state.quizStreak.toString());
  updateQuizHeaderStats();

  expEl.textContent = q.explanation;
  refEl.textContent = `Reference: ${q.reference}`;
  feedbackBox.classList.add("active");
}

function loadNextQuestion() {
  state.currentQuizIndex++;
  loadQuestion(state.currentQuizIndex);
}

/* ==========================================================================
   7. Deeni Taleem Modules
   ========================================================================== */
function initTaleemScreen() {
  const container = document.getElementById("taleemCategoriesContainer");
  if (!container) return;

  container.innerHTML = HUFFAZ_DATA.taleemCategories
    .map((cat) => {
      const completedCount = state.completedLessons.filter((id) => id.startsWith(cat.id)).length;
      const percent = Math.round((completedCount / cat.totalLessons) * 100) || 15;
      return `
        <div class="taleem-card" onclick="openTaleemCategory('${cat.id}')">
          <div class="taleem-icon-box">
            <span class="material-symbols-rounded">${cat.icon}</span>
          </div>
          <div class="taleem-info">
            <span class="taleem-badge">${cat.badge}</span>
            <h3 class="taleem-title">${cat.title}</h3>
            <p class="taleem-desc">${cat.description}</p>
            <div class="progress-track">
              <div class="progress-indicator" style="width: ${percent}%;"></div>
            </div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px; display:flex; justify-content:space-between;">
              <span>${cat.totalLessons} Asbaaq</span>
              <span>${percent}% Mukammal</span>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

let activeLessonId = null;

function openTaleemCategory(categoryId) {
  const cat = HUFFAZ_DATA.taleemCategories.find((c) => c.id === categoryId);
  if (!cat || !cat.lessons || cat.lessons.length === 0) return;

  const lesson = cat.lessons[0];
  activeLessonId = `${categoryId}-${lesson.id}`;

  document.getElementById("lessonModalTitle").textContent = lesson.title;
  document.getElementById("lessonModalCategory").textContent = cat.title;
  document.getElementById("lessonModalContent").textContent = lesson.content;
  document.getElementById("lessonModalRules").innerHTML = `<b>Tajweed &amp; Ahkaam:</b> ${lesson.rules || ""}`;

  openModal("modalLessonReader");
}

function markLessonComplete() {
  if (activeLessonId && !state.completedLessons.includes(activeLessonId)) {
    state.completedLessons.push(activeLessonId);
    localStorage.setItem("huffaz_completed_lessons", JSON.stringify(state.completedLessons));
    document.getElementById("statCompletedLessons").textContent = state.completedLessons.length;
  }
  closeModal("modalLessonReader");
  initTaleemScreen();
}

function openKidsModule() {
  openTaleemCategory("kids-learning");
}

/* ==========================================================================
   8. Daily Wisdom Widget (Ayat, Hadith, Dua)
   ========================================================================== */
function openWisdomModal(type) {
  state.activeWisdom = type;
  const content = HUFFAZ_DATA.dailyContent[type];
  if (!content) return;

  const typeLabels = {
    ayat: "AAJ KI AYAT",
    hadith: "AAJ KI HADITH",
    dua: "AAJ KI DUA"
  };

  document.getElementById("wisdomTypeLabel").textContent = typeLabels[type];
  document.getElementById("wisdomArabicText").textContent = content.arabic;
  document.getElementById("wisdomTransliteration").textContent = content.transliteration;
  document.getElementById("wisdomTranslationText").textContent = `"${content.urdu}"`;
  document.getElementById("wisdomRefText").textContent = content.reference;

  document.getElementById("dailyWisdomWidget").scrollIntoView({ behavior: "smooth" });
}

function shareContent(type) {
  const content = HUFFAZ_DATA.dailyContent[state.activeWisdom];
  const shareText = `${document.getElementById("wisdomTypeLabel").textContent}:\n${content.arabic}\n\n"${content.urdu}"\n\nReference: ${content.reference}\n\nHUFFAZ ETAWAH: ${window.location.href}`;

  if (navigator.share) {
    navigator.share({ title: "HUFFAZ ETAWAH", text: shareText }).catch(() => {});
  } else {
    navigator.clipboard.writeText(shareText);
    alert("Dua/Ayat text copy ho gaya hai!");
  }
}

/* ==========================================================================
   9. Qibla Finder with Device Compass & Mathematical Fallback
   ========================================================================== */
function initQiblaCompass() {
  const dial = document.getElementById("compassDial");
  const degText = document.getElementById("qiblaDegreeText");

  // Kaaba coordinates: 21.4225 N, 39.8262 E
  const userLat = state.currentCity.latitude || 26.7769;
  const userLng = state.currentCity.longitude || 79.0238;
  const qiblaAngle = calculateQiblaAngle(userLat, userLng);

  if (degText) {
    degText.textContent = `${Math.round(qiblaAngle)}° West (Makkah)`;
  }

  // Device orientation event listener
  if (window.DeviceOrientationEvent) {
    window.addEventListener(
      "deviceorientation",
      (event) => {
        let heading = null;
        if (event.webkitCompassHeading) {
          heading = event.webkitCompassHeading;
        } else if (event.alpha) {
          heading = 360 - event.alpha;
        }

        if (heading !== null && dial) {
          dial.style.transform = `rotate(${-heading + qiblaAngle}deg)`;
        }
      },
      true
    );
  }
}

function calculateQiblaAngle(lat, lng) {
  const phiK = (21.4225 * Math.PI) / 180.0;
  const lambdaK = (39.8262 * Math.PI) / 180.0;
  const phi = (lat * Math.PI) / 180.0;
  const lambda = (lng * Math.PI) / 180.0;

  const y = Math.sin(lambdaK - lambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  let qibla = (Math.atan2(y, x) * 180.0) / Math.PI;
  return (qibla + 360.0) % 360.0;
}

/* ==========================================================================
   10. Profile Screen & Bookmarks
   ========================================================================== */
function initProfileScreen() {
  renderBookmarksList();
  renderIslamicCalendarList();
}

function renderBookmarksList() {
  const container = document.getElementById("bookmarkedBayanaatList");
  if (!container) return;

  const bookmarkedBayans = state.allBayanaat.filter((b) => state.bookmarks.includes(b.id));

  if (bookmarkedBayans.length === 0) {
    container.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted); padding:10px 0;">Aapne abhi koi bayan bookmark nahi kiya hai.</p>`;
    return;
  }

  container.innerHTML = bookmarkedBayans.map((b) => createBayanCardHtml(b)).join("");
}

function renderIslamicCalendarList() {
  const container = document.getElementById("islamicEventsList");
  if (!container) return;

  container.innerHTML = HUFFAZ_DATA.islamicDates
    .map(
      (ev) => `
      <div class="prayer-row">
        <div class="prayer-name-col">
          <span class="material-symbols-rounded" style="color:var(--gold);">star</span>
          <div>
            <div style="font-weight:800; font-size:0.9rem;">${ev.event}</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">${ev.desc}</div>
          </div>
        </div>
        <span class="hijri-badge" style="font-size:0.72rem;">${ev.name}</span>
      </div>
    `
    )
    .join("");
}

/* ==========================================================================
   11. Admin Panel Form Handlers
   ========================================================================== */
function handleAdminAddBayan(e) {
  e.preventDefault();
  const title = document.getElementById("adminBayanTitle").value;
  const scholar = document.getElementById("adminBayanScholar").value;
  const category = document.getElementById("adminBayanCat").value;
  const url = document.getElementById("adminBayanUrl").value;
  const duration = document.getElementById("adminBayanDuration").value;

  const newBayan = {
    id: `bayan-${Date.now()}`,
    title: title,
    scholar: scholar,
    category: category,
    date: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" }),
    duration: duration || "35:00",
    youtubeId: extractYouTubeId(url),
    youtubeUrl: url,
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
    views: "1K",
    description: `Official Bayan by ${scholar}. Published on HUFFAZ ETAWAH.`
  };

  const localBayanaat = JSON.parse(localStorage.getItem("huffaz_custom_bayanaat") || "[]");
  localBayanaat.unshift(newBayan);
  localStorage.setItem("huffaz_custom_bayanaat", JSON.stringify(localBayanaat));

  state.allBayanaat.unshift(newBayan);
  renderAllBayanaat();
  renderHomeLatestBayanaat();
  closeModal("modalAdmin");
  alert("Alhamdulillah! Naya Bayan kamyabi se publish ho gaya hai.");
}

function handleAdminAddQuiz(e) {
  e.preventDefault();
  const question = document.getElementById("adminQuizQ").value;
  const optA = document.getElementById("adminQuizA").value;
  const optB = document.getElementById("adminQuizB").value;
  const optC = document.getElementById("adminQuizC").value;
  const optD = document.getElementById("adminQuizD").value;
  const correct = parseInt(document.getElementById("adminQuizCorrect").value, 10);
  const exp = document.getElementById("adminQuizExp").value;
  const ref = document.getElementById("adminQuizRef").value;

  const newQuiz = {
    id: `q-${Date.now()}`,
    category: "Deeniyat",
    question: question,
    options: [optA, optB, optC, optD],
    correctAnswer: correct,
    explanation: exp,
    reference: ref
  };

  const localQuizzes = JSON.parse(localStorage.getItem("huffaz_custom_quizzes") || "[]");
  localQuizzes.push(newQuiz);
  localStorage.setItem("huffaz_custom_quizzes", JSON.stringify(localQuizzes));

  state.allQuizzes.push(newQuiz);
  closeModal("modalAdmin");
  alert("Alhamdulillah! Naya Quiz sawal add ho gaya hai.");
}

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Is browser mein Web Notifications ki sahulat dastyab nahi hai.");
    return;
  }

  Notification.requestPermission().then((perm) => {
    if (perm === "granted") {
      new Notification("HUFFAZ ETAWAH", {
        body: "Assalamu Alaikum! Notification settings kamyabi se active ho gayi hain.",
        icon: "./icons/icon.svg"
      });
      closeModal("modalNotifications");
    } else {
      alert("Notification permission nahi mili.");
    }
  });
}

/* ==========================================================================
   12. Modal Utility Helpers
   ========================================================================== */
function initModals() {
  document.querySelectorAll(".modal-overlay").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        stopVideoEmbed();
      }
    });
  });

  const btnNotif = document.getElementById("btnNotifications");
  if (btnNotif) {
    btnNotif.addEventListener("click", () => openModal("modalNotifications"));
  }
}

function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add("active");
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    el.classList.remove("active");
    if (modalId === "modalVideoPlayer") {
      stopVideoEmbed();
    }
  }
}

function stopVideoEmbed() {
  const container = document.getElementById("videoEmbedContainer");
  if (container) container.innerHTML = "";
}
