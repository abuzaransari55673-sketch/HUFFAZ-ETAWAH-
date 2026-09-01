/**
 * HUFFAZ ETAWAH - Deen & Bayanaat
 * Core Application Engine & PWA Controller
 * Comprehensive Free-First Production Module
 */

// Application State
const state = {
  activeScreen: "home",
  theme: localStorage.getItem("huffaz_theme") || "light",
  currentCity: JSON.parse(localStorage.getItem("huffaz_city")) || (typeof HUFFAZ_DATA !== "undefined" ? HUFFAZ_DATA.defaultPrayerTimes : {}),
  prayerTimes: (typeof HUFFAZ_DATA !== "undefined" ? HUFFAZ_DATA.defaultPrayerTimes : {}),
  bookmarks: JSON.parse(localStorage.getItem("huffaz_bookmarks")) || [],
  completedLessons: JSON.parse(localStorage.getItem("huffaz_completed_lessons")) || [],
  quizScore: parseInt(localStorage.getItem("huffaz_quiz_score") || "240", 10),
  quizStreak: parseInt(localStorage.getItem("huffaz_quiz_streak") || "3", 10),
  currentQuizIndex: 0,
  quizAnswered: false,
  allBayanaat: [],
  allQuizzes: [],
  activeWisdom: "ayat",
  authMode: "login", // 'login' or 'signup'
  selectedAnalyticsRange: "today"
};

// Initialize Application on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initSplashScreen();
  initTheme();
  initServiceWorker();
  initNetworkListeners();
  loadData();
  applyBranding();
  initNavigation();
  initHeroDates();
  initPrayerTimes();
  initBayanaatScreen();
  initQuizScreen();
  initTaleemScreen();
  initProfileScreen();
  initModals();
  initQiblaCompass();
  initAnalyticsAndPresence();

  // Setup interval for live prayer countdown
  setInterval(updatePrayerCountdown, 1000);
});

/* ==========================================================================
   1. 2-Second Professional Splash Screen
   ========================================================================== */
function initSplashScreen() {
  const splash = document.getElementById("splashScreen");
  if (!splash) return;

  // Apply branding to splash
  if (window.settingsService) {
    const branding = window.settingsService.getBranding();
    const splashName = document.getElementById("splashAppName");
    if (splashName) splashName.textContent = branding.appName || "HUFFAZ ETAWAH";
    const splashSub = document.getElementById("splashSubtitle");
    if (splashSub) splashSub.textContent = branding.appSubtitle || "Deen & Bayanaat";
    const splashTag = document.getElementById("splashTagline");
    if (splashTag) splashTag.textContent = branding.tagline || "Ilm • Ibadat • Tarbiyah";
    
    if (branding.logoUrl) {
      const img = document.getElementById("splashLogoImg");
      const svg = document.getElementById("splashDefaultSvg");
      if (img && svg) {
        img.src = branding.logoUrl;
        img.style.display = "block";
        svg.style.display = "none";
      }
    }
  }

  // 2-Second duration
  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => {
      splash.style.display = "none";
    }, 500);
  }, 2000);
}

function applyBranding() {
  if (window.settingsService) {
    window.settingsService.applyBrandingToDOM();
  }
}

/* ==========================================================================
   2. Theme & PWA Service Worker Initialization
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
      if (themeIcon) {
        themeIcon.textContent = state.theme === "dark" ? "light_mode" : "dark_mode";
      }
    });
  }
}

function initServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => {
        console.log("[PWA] Service Worker registered:", reg.scope);
      })
      .catch((err) => {
        console.warn("[PWA] Service Worker registration:", err);
      });
  }
}

function initNetworkListeners() {
  const offlineBanner = document.getElementById("offlineBanner");
  function updateOnlineStatus() {
    if (!offlineBanner) return;
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
   3. Data Loading & Local Merge
   ========================================================================== */
function loadData() {
  if (window.bayanService) {
    state.allBayanaat = window.bayanService.getAllBayanaat();
  } else {
    const localBayanaat = JSON.parse(localStorage.getItem("huffaz_custom_bayanaat") || "[]");
    state.allBayanaat = [...localBayanaat, ...(HUFFAZ_DATA.bayanaat || [])];
  }

  if (window.quizService) {
    state.allQuizzes = window.quizService.getAllQuizzes();
  } else {
    const localQuizzes = JSON.parse(localStorage.getItem("huffaz_custom_quizzes") || "[]");
    state.allQuizzes = [...localQuizzes, ...(HUFFAZ_DATA.quizzes || [])];
  }
}

/* ==========================================================================
   4. Navigation Routing
   ========================================================================== */
function initNavigation() {
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

  document.querySelectorAll(".screen-view").forEach((el) => {
    el.classList.remove("active");
  });
  const currentView = document.getElementById(`screen-${targetScreen}`);
  if (currentView) {
    currentView.classList.add("active");
  }

  document.querySelectorAll(".bottom-nav .nav-item").forEach((btn) => {
    if (btn.getAttribute("data-target") === targetScreen) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  if (window.analyticsService) {
    window.analyticsService.trackEvent(`${targetScreen}_view`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================================
   5. Date & Live Prayer Times Calculation
   ========================================================================== */
function initHeroDates() {
  const gregorianEl = document.getElementById("heroGregorianDate");
  const now = new Date();
  const options = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
  if (gregorianEl) {
    gregorianEl.textContent = now.toLocaleDateString("en-US", options);
  }

  const citySelect = document.getElementById("selectCityLocation");
  if (citySelect && typeof HUFFAZ_DATA !== "undefined" && HUFFAZ_DATA.citiesList) {
    citySelect.innerHTML = HUFFAZ_DATA.citiesList
      .map(
        (c) =>
          `<option value="${c.name}" ${c.name.includes(state.currentCity.city || "Etawah") ? "selected" : ""}>
          ${c.name} (${c.state || c.country})
        </option>`
      )
      .join("");
  }
}

function changeCityLocation(cityName) {
  if (typeof HUFFAZ_DATA === "undefined") return;
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
    const heroCity = document.getElementById("heroCityName");
    if (heroCity) heroCity.textContent = found.name.split(" ")[0];
    fetchPrayerTimes(found.lat, found.lng);
  }
}

function initPrayerTimes() {
  const cityBtn = document.getElementById("btnChangeLocation");
  if (cityBtn) {
    cityBtn.addEventListener("click", () => openModal("modalNamaz"));
  }

  const select = document.getElementById("selectCityLocation");
  if (select) {
    select.addEventListener("change", (e) => {
      changeCityLocation(e.target.value);
    });
  }

  fetchPrayerTimes(state.currentCity.latitude || 26.7769, state.currentCity.longitude || 79.0238);
}

function fetchPrayerTimes(lat, lng) {
  const today = new Date();
  const url = `https://api.aladhan.com/v1/timings/${Math.floor(today.getTime() / 1000)}?latitude=${lat}&longitude=${lng}&method=1&school=1`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.data && data.data.timings) {
        const t = data.data.timings;
        state.prayerTimes = {
          fajr: t.Fajr,
          sunrise: t.Sunrise,
          dhuhr: t.Dhuhr,
          asr: t.Asr,
          maghrib: t.Maghrib,
          isha: t.Isha
        };

        if (data.data.date && data.data.date.hijri) {
          const h = data.data.date.hijri;
          const hijriEl = document.getElementById("heroHijriDate");
          if (hijriEl) {
            hijriEl.textContent = `${h.day} ${h.month.en} ${h.year} AH`;
          }
        }

        renderPrayerModalTimes();
        updatePrayerCountdown();
      }
    })
    .catch((err) => {
      console.warn("Using offline prayer times:", err);
      renderPrayerModalTimes();
      updatePrayerCountdown();
    });
}

function renderPrayerModalTimes() {
  const p = state.prayerTimes;
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatTime12h(val);
  };
  setTxt("namazFajr", p.fajr);
  setTxt("namazSunrise", p.sunrise);
  setTxt("namazDhuhr", p.dhuhr);
  setTxt("namazAsr", p.asr);
  setTxt("namazMaghrib", p.maghrib);
  setTxt("namazIsha", p.isha);
}

function updatePrayerCountdown() {
  const now = new Date();
  const p = state.prayerTimes;
  if (!p || !p.fajr) return;

  const prayers = [
    { name: "Fajr", time: p.fajr },
    { name: "Sunrise (Ishraq)", time: p.sunrise },
    { name: "Dhuhr", time: p.dhuhr },
    { name: "Asr", time: p.asr },
    { name: "Maghrib", time: p.maghrib },
    { name: "Isha", time: p.isha }
  ];

  let nextPrayer = null;
  let nextDate = null;

  for (let item of prayers) {
    const [hrs, mins] = item.time.split(":").map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hrs, mins, 0, 0);

    if (prayerDate > now) {
      nextPrayer = item;
      nextDate = prayerDate;
      break;
    }
  }

  if (!nextPrayer) {
    nextPrayer = prayers[0];
    const [hrs, mins] = prayers[0].time.split(":").map(Number);
    nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    nextDate.setHours(hrs, mins, 0, 0);
  }

  const diffMs = nextDate - now;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

  const heroNextName = document.getElementById("heroNextPrayerName");
  if (heroNextName) heroNextName.textContent = nextPrayer.name;

  const heroNextTime = document.getElementById("heroNextPrayerTime");
  if (heroNextTime) heroNextTime.textContent = formatTime12h(nextPrayer.time);

  const heroRemaining = document.getElementById("heroPrayerRemaining");
  if (heroRemaining) {
    heroRemaining.textContent = `Baaqi: ${diffHrs > 0 ? diffHrs + "h " : ""}${diffMins}m ${diffSecs}s`;
  }
}

function formatTime12h(time24) {
  if (!time24) return "--:--";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  return `${h.toString().padStart(2, "0")}:${mStr} ${ampm}`;
}

/* ==========================================================================
   6. Bayanaat Screen & YouTube Integration
   ========================================================================== */
function initBayanaatScreen() {
  renderHomeLatestBayanaat();
  renderAllBayanaat();

  const searchInput = document.getElementById("bayanSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const activeTab = document.querySelector("#bayanCategoryTabs .chip-tab.active");
      const currentCat = activeTab ? activeTab.getAttribute("data-cat") : "All";
      filterAndRenderBayanaat(e.target.value, currentCat);
    });
  }

  const tabs = document.querySelectorAll("#bayanCategoryTabs .chip-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const cat = tab.getAttribute("data-cat");
      const query = searchInput ? searchInput.value : "";
      filterAndRenderBayanaat(query, cat);
    });
  });
}

function renderHomeLatestBayanaat() {
  const container = document.getElementById("homeLatestBayanaat");
  if (!container) return;

  const latest = state.allBayanaat.slice(0, 4);
  container.innerHTML = latest.map((b) => createBayanCardHtml(b)).join("");
}

function renderAllBayanaat() {
  const container = document.getElementById("allBayanaatContainer");
  if (!container) return;

  container.innerHTML = state.allBayanaat.map((b) => createBayanCardHtml(b)).join("");
}

function filterAndRenderBayanaat(query, category) {
  let filtered = [];
  if (window.bayanService) {
    filtered = window.bayanService.searchBayanaat(query, category);
  } else {
    filtered = state.allBayanaat.filter((b) => {
      const matchesCat = category === "All" || b.category === category;
      const matchesQ =
        !query ||
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.scholar.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQ;
    });
  }

  const container = document.getElementById("allBayanaatContainer");
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="admin-card text-center w-100" style="grid-column:1/-1; padding:30px 10px;">
        <span class="material-symbols-rounded" style="font-size:40px; color:var(--text-muted);">search_off</span>
        <p style="margin-top:8px; font-weight:700;">Koi Bayan nahi mila.</p>
        <span style="font-size:0.8rem; color:var(--text-muted);">Doosra search term ya category muntakhib karein.</span>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map((b) => createBayanCardHtml(b)).join("");
}

function createBayanCardHtml(b) {
  const isBookmarked = (window.bayanService && window.bayanService.isBookmarked(b.id)) || state.bookmarks.includes(b.id);
  const bookmarkIcon = isBookmarked ? "bookmark" : "bookmark_border";
  const bookmarkColor = isBookmarked ? "var(--gold)" : "inherit";

  return `
    <div class="bayan-card" data-id="${b.id}">
      <div class="bayan-thumbnail-wrap" onclick="playBayan('${b.id}')">
        <img src="${b.thumbnail || 'https://img.youtube.com/vi/' + (b.youtubeId || 'dQw4w9WgXcQ') + '/hqdefault.jpg'}" alt="${b.title}" class="bayan-thumb-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
        <div class="play-overlay-btn">
          <span class="material-symbols-rounded">play_arrow</span>
        </div>
        <span class="bayan-duration-badge">${b.duration}</span>
        <span class="bayan-category-badge">${b.category}</span>
      </div>
      <div class="bayan-info">
        <h3 class="bayan-title" onclick="playBayan('${b.id}')">${b.title}</h3>
        <div class="bayan-scholar">
          <span class="material-symbols-rounded" style="font-size:16px;">mic</span>
          <span>${b.scholar}</span>
        </div>
        <div class="bayan-meta-row">
          <div class="bayan-stats">
            <span>${b.views || '1.2K'} views</span>
            <span>•</span>
            <span>${b.date}</span>
          </div>
          <div class="bayan-actions">
            <button class="bayan-action-btn" title="Share Bayan" onclick="shareBayan('${b.id}', event)">
              <span class="material-symbols-rounded">share</span>
            </button>
            <button class="bayan-action-btn" title="Bookmark" onclick="toggleBookmarkBayan('${b.id}', event)">
              <span class="material-symbols-rounded" style="color:${bookmarkColor};">${bookmarkIcon}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function playBayan(bayanId) {
  const bayan = state.allBayanaat.find((b) => b.id === bayanId);
  if (!bayan) return;

  if (window.bayanService) {
    window.bayanService.recordWatched(bayan);
  }

  const container = document.getElementById("videoEmbedContainer");
  const titleEl = document.getElementById("modalVideoTitle");
  const scholarEl = document.getElementById("modalVideoScholar");
  const descEl = document.getElementById("modalVideoDesc");
  const watchOnYt = document.getElementById("btnWatchOnYoutube");

  if (titleEl) titleEl.textContent = bayan.title;
  if (scholarEl) scholarEl.textContent = `${bayan.scholar} • ${bayan.category} (${bayan.duration})`;
  if (descEl) descEl.textContent = bayan.description;

  const ytId = bayan.youtubeId || (window.bayanService ? window.bayanService.extractYouTubeId(bayan.youtubeUrl) : "dQw4w9WgXcQ");

  if (container) {
    container.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1" 
        title="${bayan.title}" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>`;
  }

  if (watchOnYt) {
    watchOnYt.href = bayan.youtubeUrl || `https://www.youtube.com/watch?v=${ytId}`;
  }

  openModal("modalVideoPlayer");
}

function toggleBookmarkBayan(bayanId, e) {
  if (e) e.stopPropagation();

  let isBookmarked = false;
  if (window.bayanService) {
    isBookmarked = window.bayanService.toggleBookmark(bayanId);
  } else {
    const idx = state.bookmarks.indexOf(bayanId);
    if (idx > -1) {
      state.bookmarks.splice(idx, 1);
    } else {
      state.bookmarks.push(bayanId);
      isBookmarked = true;
    }
    localStorage.setItem("huffaz_bookmarks", JSON.stringify(state.bookmarks));
  }

  state.bookmarks = (window.bayanService ? window.bayanService.getBookmarks() : state.bookmarks);
  renderAllBayanaat();
  renderHomeLatestBayanaat();
  renderBookmarkedList();
}

function shareBayan(bayanId, e) {
  if (e) e.stopPropagation();
  const bayan = state.allBayanaat.find((b) => b.id === bayanId);
  if (!bayan) return;

  const shareText = `*HUFFAZ ETAWAH - Bayanaat*\n\n*${bayan.title}*\nBy: ${bayan.scholar}\n\nDekhein: ${bayan.youtubeUrl || 'https://www.youtube.com/watch?v=' + bayan.youtubeId}`;

  if (navigator.share) {
    navigator
      .share({
        title: bayan.title,
        text: shareText,
        url: bayan.youtubeUrl
      })
      .catch((err) => console.log("Share dismissed"));
  } else {
    navigator.clipboard.writeText(shareText);
    alert("Bayan link copy ho gaya hai. WhatsApp ya social media par share karein!");
  }
}

/* ==========================================================================
   7. Quiz-e-Deen Screen & Scoring Engine
   ========================================================================== */
function initQuizScreen() {
  state.currentQuizIndex = 0;
  state.quizAnswered = false;
  loadCurrentQuiz();

  const scoreEl = document.getElementById("profileScoreVal");
  if (scoreEl) scoreEl.textContent = state.quizScore;
  const streakEl = document.getElementById("userStreakVal");
  if (streakEl) streakEl.textContent = state.quizStreak;
}

function loadCurrentQuiz() {
  if (state.allQuizzes.length === 0) return;

  state.quizAnswered = false;
  const q = state.allQuizzes[state.currentQuizIndex % state.allQuizzes.length];

  const catBadge = document.getElementById("quizCategoryBadge");
  if (catBadge) catBadge.textContent = q.category || "Deeniyat";

  const counter = document.getElementById("quizCounterText");
  if (counter) {
    counter.textContent = `Sawal ${(state.currentQuizIndex % state.allQuizzes.length) + 1} / ${state.allQuizzes.length}`;
  }

  const prog = document.getElementById("quizProgressFill");
  if (prog) {
    const pct = (((state.currentQuizIndex % state.allQuizzes.length) + 1) / state.allQuizzes.length) * 100;
    prog.style.width = `${pct}%`;
  }

  const qText = document.getElementById("quizQuestionText");
  if (qText) qText.textContent = q.question;

  const optionsContainer = document.getElementById("quizOptionsList");
  if (optionsContainer) {
    optionsContainer.innerHTML = q.options
      .map(
        (opt, idx) => `
        <button class="quiz-option-btn" onclick="selectQuizAnswer(${idx})">
          <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
          <span class="option-text">${opt}</span>
        </button>
      `
      )
      .join("");
  }

  const feedbackBox = document.getElementById("quizFeedbackBox");
  if (feedbackBox) feedbackBox.classList.remove("active");
}

function selectQuizAnswer(selectedIndex) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;

  const q = state.allQuizzes[state.currentQuizIndex % state.allQuizzes.length];
  const isCorrect = selectedIndex === q.correctAnswer;

  const optionBtns = document.querySelectorAll(".quiz-option-btn");
  optionBtns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correctAnswer) {
      btn.classList.add("correct");
    } else if (idx === selectedIndex && !isCorrect) {
      btn.classList.add("wrong");
    }
  });

  if (window.quizService) {
    const res = window.quizService.recordAnswer(isCorrect);
    state.quizScore = res.score;
    state.quizStreak = res.streak;
  } else {
    if (isCorrect) {
      state.quizScore += 10;
      state.quizStreak += 1;
    }
    localStorage.setItem("huffaz_quiz_score", state.quizScore.toString());
    localStorage.setItem("huffaz_quiz_streak", state.quizStreak.toString());
  }

  const streakEl = document.getElementById("userStreakVal");
  if (streakEl) streakEl.textContent = state.quizStreak;
  const leadScore = document.getElementById("leaderboardUserScore");
  if (leadScore) leadScore.textContent = `${state.quizScore} Pts`;
  const profScore = document.getElementById("profileScoreVal");
  if (profScore) profScore.textContent = state.quizScore;

  const feedbackBox = document.getElementById("quizFeedbackBox");
  const title = document.getElementById("quizFeedbackTitle");
  const exp = document.getElementById("quizFeedbackExplanation");
  const ref = document.getElementById("quizFeedbackReference");

  if (title) {
    title.innerHTML = isCorrect
      ? `<span class="material-symbols-rounded" style="color:var(--success);">check_circle</span> <span>MashaAllah! Sahi Jawab (+10 Pts)</span>`
      : `<span class="material-symbols-rounded" style="color:var(--error);">cancel</span> <span>Ghalat Jawab! Sahi jawab Option ${String.fromCharCode(65 + q.correctAnswer)} hai.</span>`;
  }

  if (exp) exp.textContent = q.explanation;
  if (ref) ref.textContent = `Mustanad Reference: ${q.reference}`;
  if (feedbackBox) feedbackBox.classList.add("active");
}

function loadNextQuestion() {
  state.currentQuizIndex = (state.currentQuizIndex + 1) % state.allQuizzes.length;
  loadCurrentQuiz();
}

/* ==========================================================================
   8. Deeni Taleem Screen & Asbaaq Reader
   ========================================================================== */
function initTaleemScreen() {
  const container = document.getElementById("taleemCategoriesContainer");
  if (!container || typeof HUFFAZ_DATA === "undefined") return;

  const categories = (window.taleemService && window.taleemService.getCategories()) || HUFFAZ_DATA.taleemCategories || [];

  container.innerHTML = categories
    .map((cat) => {
      const lessonsCount = cat.lessons ? cat.lessons.length : cat.totalLessons;
      return `
        <div class="taleem-card" onclick="openTaleemCategory('${cat.id}')">
          <div class="taleem-icon-wrap">
            <span class="material-symbols-rounded">${cat.icon}</span>
          </div>
          <div class="taleem-body">
            <div class="taleem-badge">${cat.badge}</div>
            <h3 class="taleem-title">${cat.title}</h3>
            <p class="taleem-desc">${cat.description}</p>
            <div class="taleem-progress-row">
              <span>${lessonsCount} Lessons</span>
              <span style="color:var(--gold-dark); font-weight:800;">Padhein &rarr;</span>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  updateTaleemProgressUI();
}

function updateTaleemProgressUI() {
  const completed = (window.taleemService && window.taleemService.getCompletedLessons()) || state.completedLessons;
  const profCompleted = document.getElementById("profileCompletedLessons");
  if (profCompleted) profCompleted.textContent = completed.length;
}

let activeLessonData = null;

function openTaleemCategory(catId) {
  if (typeof HUFFAZ_DATA === "undefined") return;
  const cat = HUFFAZ_DATA.taleemCategories.find((c) => c.id === catId);
  if (!cat || !cat.lessons || cat.lessons.length === 0) {
    alert("Is sabaq ka nisaab jald shaamil kiya ja raha hai.");
    return;
  }

  const lesson = cat.lessons[0];
  activeLessonData = { ...lesson, catTitle: cat.title };

  const titleEl = document.getElementById("lessonModalTitle");
  const catEl = document.getElementById("lessonModalCategory");
  const contentEl = document.getElementById("lessonModalContent");
  const rulesEl = document.getElementById("lessonModalRules");

  if (titleEl) titleEl.textContent = lesson.title;
  if (catEl) catEl.textContent = `${cat.title} • Sabaq`;
  if (contentEl) contentEl.textContent = lesson.content;
  if (rulesEl) rulesEl.innerHTML = `<b>Qawaid o Fazeelat:</b> ${lesson.rules}`;

  if (window.analyticsService) {
    window.analyticsService.trackEvent("taleem_open", { category: cat.title });
  }

  openModal("modalLessonReader");
}

function markLessonComplete() {
  if (!activeLessonData) return;

  if (window.taleemService) {
    window.taleemService.markLessonComplete(activeLessonData.id, activeLessonData.title);
  } else {
    if (!state.completedLessons.includes(activeLessonData.id)) {
      state.completedLessons.push(activeLessonData.id);
      localStorage.setItem("huffaz_completed_lessons", JSON.stringify(state.completedLessons));
    }
  }

  updateTaleemProgressUI();
  closeModal("modalLessonReader");
  alert("MashaAllah! Sabaq mukammal mark ho gaya hai.");
}

/* ==========================================================================
   9. HUFFAZ ETAWAH Kids Module
   ========================================================================== */
function openKidsModule() {
  if (window.analyticsService) {
    window.analyticsService.trackEvent("kids_open");
  }
  openModal("modalKids");
}

function openKidsSubModule(type) {
  closeModal("modalKids");
  if (type === "stories") {
    openTaleemCategory("islamic-stories");
  } else if (type === "manners") {
    openTaleemCategory("kids-learning");
  } else if (type === "duas") {
    openTaleemCategory("masnoon-duain");
  }
}

/* ==========================================================================
   10. Photo Gallery & Public Lightbox
   ========================================================================== */
function openPhotoGallery() {
  const container = document.getElementById("publicGalleryGrid");
  if (!container) return;

  const albums = (window.mediaService && window.mediaService.getAllAlbums()) || [];
  container.innerHTML = albums
    .map(
      (album) => `
      <div class="album-card" onclick="viewAlbumDetails('${album.id}')">
        <div class="album-thumb-wrap">
          <img src="${album.coverPhoto}" alt="${album.albumName}" class="album-thumb-img" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
          <span class="album-count-badge">${(album.photos && album.photos.length) || 1} Photos</span>
        </div>
        <div class="album-info">
          <div class="album-title">${album.albumName}</div>
          <div class="album-meta">${album.programName} • ${album.date}</div>
        </div>
      </div>
    `
    )
    .join("");

  if (window.analyticsService) {
    window.analyticsService.trackEvent("gallery_open");
  }

  openModal("modalGallery");
}

function viewAlbumDetails(albumId) {
  const albums = (window.mediaService && window.mediaService.getAllAlbums()) || [];
  const album = albums.find((a) => a.id === albumId);
  if (!album) return;

  alert(`${album.albumName}\n${album.programName} (${album.date})\n\n${album.description || 'HUFFAZ ETAWAH Official Album'}`);
}

/* ==========================================================================
   11. Authentication (Login / Signup / Profile)
   ========================================================================== */
function initProfileScreen() {
  const user = (window.authService && window.authService.getCurrentUser()) || {};
  const nameEl = document.getElementById("profileUserName");
  if (nameEl) nameEl.textContent = user.name || "Khadim-e-Deen";

  renderBookmarkedList();
  renderIslamicCalendarList();
}

function openAuthModal() {
  openModal("modalAuth");
}

function toggleAuthMode() {
  state.authMode = state.authMode === "login" ? "signup" : "login";
  const title = document.getElementById("authModalTitle");
  const prompt = document.getElementById("authTogglePrompt");
  const btn = document.getElementById("authToggleBtn");

  if (state.authMode === "signup") {
    if (title) title.textContent = "Naya Account Banayein";
    if (prompt) prompt.textContent = "Pehle se account hai?";
    if (btn) btn.textContent = "Login Karein";
  } else {
    if (title) title.textContent = "Talib-e-Ilm Login";
    if (prompt) prompt.textContent = "Naya account banayein?";
    if (btn) btn.textContent = "Sign Up Karein";
  }
}

function handleGoogleLogin() {
  if (window.authService) {
    const res = window.authService.loginWithGoogle();
    if (res.success) {
      initProfileScreen();
      closeModal("modalAuth");
      alert(`Khush Aamdeed, ${res.user.name}!`);
    }
  }
}

function handleEmailLogin(e) {
  e.preventDefault();
  const email = document.getElementById("authLoginEmail").value;
  const pass = document.getElementById("authLoginPassword").value;

  if (window.authService) {
    const res = window.authService.loginWithEmail(email, pass);
    if (res.success) {
      initProfileScreen();
      closeModal("modalAuth");
      alert(`Khush Aamdeed, ${res.user.name}!`);
    } else {
      alert(res.message);
    }
  }
}

function handlePhoneOtpClick() {
  if (window.authService) {
    const res = window.authService.requestPhoneOtp("+919876543210");
    alert(res.message);
  } else {
    alert("Phone verification is not configured yet.");
  }
}

function handleLogout() {
  if (window.authService) {
    window.authService.logout();
    initProfileScreen();
    alert("Aap kamyabi se logout ho chuke hain.");
  }
}

/* ==========================================================================
   12. Daily Wisdom & Islamic Calendar
   ========================================================================== */
function openWisdomModal(type) {
  state.activeWisdom = type;
  const daily = (window.settingsService && window.settingsService.getDailyContent()) || HUFFAZ_DATA.dailyContent || {};
  const data = daily[type] || {};

  const typeLabel = document.getElementById("wisdomTypeLabel");
  const arabicText = document.getElementById("wisdomArabicText");
  const transText = document.getElementById("wisdomTransliteration");
  const transLat = document.getElementById("wisdomTranslationText");
  const refText = document.getElementById("wisdomRefText");

  if (typeLabel) typeLabel.textContent = `AAJ KI ${type.toUpperCase()}`;
  if (arabicText) arabicText.textContent = data.arabic || "";
  if (transText) transText.textContent = data.transliteration || "";
  if (transLat) transLat.textContent = `"${data.urdu || data.english || ''}"`;
  if (refText) refText.textContent = data.reference || "";

  if (window.analyticsService) {
    window.analyticsService.trackEvent(`${type}_view`);
  }
}

function renderBookmarkedList() {
  const container = document.getElementById("profileBookmarksList");
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
  if (!container || typeof HUFFAZ_DATA === "undefined") return;

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
   13. Admin Management CMS & Analytics
   ========================================================================== */
function openAdminPortal() {
  renderAdminDashboardStats();
  switchAdminTab("dashboard");
  openModal("modalAdmin");
}

function switchAdminTab(tabName) {
  document.querySelectorAll(".admin-nav-tabs .admin-tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelectorAll(".admin-tab-pane").forEach((pane) => {
    pane.classList.remove("active");
  });

  const activePane = document.getElementById(`adminTab-${tabName}`);
  if (activePane) activePane.classList.add("active");

  const tabBtns = document.querySelectorAll(".admin-nav-tabs .admin-tab-btn");
  tabBtns.forEach((btn) => {
    if (btn.textContent.toLowerCase().includes(tabName)) {
      btn.classList.add("active");
    }
  });

  if (tabName === "dashboard") renderAdminDashboardStats();
  if (tabName === "analytics") filterAnalytics(state.selectedAnalyticsRange);
  if (tabName === "bayanaat") renderAdminBayanaatList();
  if (tabName === "quiz") renderAdminQuizzesList();
  if (tabName === "media") renderAdminMedia();
  if (tabName === "gallery") renderAdminAlbums();
  if (tabName === "daily") renderAdminDailyInputs();
  if (tabName === "branding") renderAdminBrandingInputs();
  if (tabName === "security") renderAdminUsersList();
}

function initAnalyticsAndPresence() {
  if (window.analyticsService) {
    window.analyticsService.init();
  }

  if (window.presenceService) {
    window.presenceService.init();
    window.presenceService.getOnlineStatus((status) => {
      const presenceText = document.getElementById("adminPresenceText");
      if (presenceText) {
        presenceText.textContent = status.text;
      }
    });
  }
}

function renderAdminDashboardStats() {
  const metrics = (window.analyticsService && window.analyticsService.getMetrics("all")) || {};
  const users = (window.authService && window.authService.getAllUsers()) || [];

  const setT = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setT("statDashUsers", users.length || 12);
  setT("statDashActive", metrics.activeToday || 3);
  setT("statDashBayanaat", state.allBayanaat.length);
  setT("statDashViews", metrics.totalBayanViews ? `${metrics.totalBayanViews} plays` : "1.2K");
  setT("statDashQuizzes", state.allQuizzes.length);
  setT("statDashLessons", 38);
}

function filterAnalytics(range) {
  state.selectedAnalyticsRange = range;
  document.querySelectorAll("#adminTab-analytics .chip-tab").forEach((btn) => {
    btn.classList.remove("active");
  });

  const activeBtn = document.getElementById(`btnFilter${range === "all" ? "All" : range === "today" ? "Today" : range === "7days" ? "7d" : "30d"}`);
  if (activeBtn) activeBtn.classList.add("active");

  const m = (window.analyticsService && window.analyticsService.getMetrics(range)) || {};

  const setT = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setT("anActiveUsers", range === "today" ? m.activeToday : range === "7days" ? m.active7Days : range === "30days" ? m.active30Days : m.totalUsers);
  setT("anAppOpens", m.totalAppOpens || 18);
  setT("anBayanPlays", m.totalBayanViews || 14);
  setT("anQuizAttempts", m.totalQuizAttempts || 22);

  // Popular Bayanaat List
  const popularContainer = document.getElementById("analyticsPopularBayanaatList");
  if (popularContainer && m.popularBayanaat) {
    popularContainer.innerHTML = m.popularBayanaat
      .map(
        (b) => `
        <div style="display:flex; justify-content:space-between; font-size:0.8rem; padding:6px 0; border-bottom:1px solid var(--border-light);">
          <span style="font-weight:700;">${b.title}</span>
          <span style="color:var(--primary); font-weight:800;">${b.views} views</span>
        </div>
      `
      )
      .join("");
  }

  // Feature usage list
  const featureContainer = document.getElementById("analyticsFeatureUsageList");
  if (featureContainer && m.featureUsage) {
    featureContainer.innerHTML = Object.keys(m.featureUsage)
      .map(
        (feat) => `
        <div style="display:flex; justify-content:space-between; font-size:0.8rem; padding:6px 0; border-bottom:1px solid var(--border-light);">
          <span>${feat}</span>
          <span style="color:var(--gold-dark); font-weight:800;">${m.featureUsage[feat]} interactions</span>
        </div>
      `
      )
      .join("");
  }
}

// Admin Bayanaat
function renderAdminBayanaatList() {
  const container = document.getElementById("adminBayanaatList");
  if (!container) return;

  container.innerHTML = state.allBayanaat
    .map(
      (b) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-md);">
        <div>
          <div style="font-weight:800; font-size:0.85rem;">${b.title}</div>
          <div style="font-size:0.72rem; color:var(--text-muted);">${b.scholar} • ${b.category}</div>
        </div>
        <button class="icon-btn" style="color:var(--error);" title="Delete" onclick="handleAdminDeleteBayan('${b.id}')">
          <span class="material-symbols-rounded" style="font-size:18px;">delete</span>
        </button>
      </div>
    `
    )
    .join("");
}

function handleAdminAddBayan(e) {
  e.preventDefault();
  const title = document.getElementById("adminBayanTitle").value;
  const scholar = document.getElementById("adminBayanScholar").value;
  const category = document.getElementById("adminBayanCat").value;
  const url = document.getElementById("adminBayanUrl").value;
  const duration = document.getElementById("adminBayanDuration").value;

  if (window.bayanService) {
    window.bayanService.addBayan({
      title,
      scholar,
      category,
      youtubeUrl: url,
      duration
    });
  }

  loadData();
  renderAllBayanaat();
  renderHomeLatestBayanaat();
  renderAdminBayanaatList();
  alert("Alhamdulillah! Naya Bayan publish ho gaya hai.");
}

function handleAdminDeleteBayan(id) {
  if (!confirm("Kya aap waqai yeh bayan delete karna chahte hain?")) return;
  if (window.bayanService) {
    window.bayanService.deleteBayan(id);
  }
  loadData();
  renderAllBayanaat();
  renderHomeLatestBayanaat();
  renderAdminBayanaatList();
}

// Admin Quiz
function renderAdminQuizzesList() {
  const container = document.getElementById("adminQuizzesList");
  if (!container) return;

  container.innerHTML = state.allQuizzes
    .map(
      (q) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-md);">
        <div>
          <div style="font-weight:800; font-size:0.85rem;">${q.question}</div>
          <div style="font-size:0.72rem; color:var(--text-muted);">${q.category} • Ref: ${q.reference}</div>
        </div>
        <button class="icon-btn" style="color:var(--error);" title="Delete" onclick="handleAdminDeleteQuiz('${q.id}')">
          <span class="material-symbols-rounded" style="font-size:18px;">delete</span>
        </button>
      </div>
    `
    )
    .join("");
}

function handleAdminAddQuiz(e) {
  e.preventDefault();
  const category = document.getElementById("adminQuizCat").value;
  const question = document.getElementById("adminQuizQ").value;
  const optA = document.getElementById("adminQuizA").value;
  const optB = document.getElementById("adminQuizB").value;
  const optC = document.getElementById("adminQuizC").value;
  const optD = document.getElementById("adminQuizD").value;
  const correct = document.getElementById("adminQuizCorrect").value;
  const exp = document.getElementById("adminQuizExp").value;
  const ref = document.getElementById("adminQuizRef").value;

  if (window.quizService) {
    window.quizService.addQuiz({
      category,
      question,
      options: [optA, optB, optC, optD],
      correctAnswer: correct,
      explanation: exp,
      reference: ref
    });
  }

  loadData();
  renderAdminQuizzesList();
  alert("Alhamdulillah! Naya Quiz sawal add ho gaya.");
}

function handleAdminDeleteQuiz(id) {
  if (!confirm("Kya aap yeh sawal delete karna chahte hain?")) return;
  if (window.quizService) {
    window.quizService.deleteQuiz(id);
  }
  loadData();
  renderAdminQuizzesList();
}

// Media Manager
function renderAdminMedia() {
  const filter = document.getElementById("adminMediaCategoryFilter");
  const cat = filter ? filter.value : "all";
  const container = document.getElementById("adminMediaGrid");
  if (!container || !window.mediaService) return;

  const items = window.mediaService.getAllMedia(cat);
  container.innerHTML = items
    .map(
      (m) => `
      <div class="media-item-card">
        <img src="${m.url}" alt="${m.name}" class="media-item-thumb" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'">
        <div style="font-size:0.75rem; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.name}</div>
        <div style="font-size:0.68rem; color:var(--text-muted);">${m.category} • ${m.date}</div>
        <button class="btn-outline" style="padding:4px 8px; font-size:0.7rem; color:var(--error); border-color:rgba(220,38,38,0.2);" onclick="handleAdminDeleteMedia('${m.id}')">Delete</button>
      </div>
    `
    )
    .join("");
}

function handleAdminAddMedia(e) {
  e.preventDefault();
  const name = document.getElementById("adminMediaName").value;
  const category = document.getElementById("adminMediaCategorySelect").value;
  const url = document.getElementById("adminMediaUrl").value;

  if (window.mediaService) {
    window.mediaService.addMedia({ name, category, url });
  }

  renderAdminMedia();
  alert("Media item kamyabi se save ho gaya.");
}

function handleAdminDeleteMedia(id) {
  if (window.mediaService) {
    window.mediaService.deleteMedia(id);
  }
  renderAdminMedia();
}

// Gallery Albums
function renderAdminAlbums() {
  const container = document.getElementById("adminAlbumsList");
  if (!container || !window.mediaService) return;

  const albums = window.mediaService.getAllAlbums();
  container.innerHTML = albums
    .map(
      (a) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-md);">
        <div>
          <div style="font-weight:800; font-size:0.85rem;">${a.albumName}</div>
          <div style="font-size:0.72rem; color:var(--text-muted);">${a.programName} • ${a.date}</div>
        </div>
        <button class="icon-btn" style="color:var(--error);" title="Delete" onclick="handleAdminDeleteAlbum('${a.id}')">
          <span class="material-symbols-rounded" style="font-size:18px;">delete</span>
        </button>
      </div>
    `
    )
    .join("");
}

function handleAdminAddAlbum(e) {
  e.preventDefault();
  const name = document.getElementById("adminAlbumName").value;
  const prog = document.getElementById("adminAlbumProgram").value;
  const desc = document.getElementById("adminAlbumDesc").value;
  const cover = document.getElementById("adminAlbumCover").value;
  const photosRaw = document.getElementById("adminAlbumPhotos").value;
  const photos = photosRaw ? photosRaw.split(",").map((p) => p.trim()) : [cover];

  if (window.mediaService) {
    window.mediaService.addAlbum({
      albumName: name,
      programName: prog,
      description: desc,
      coverPhoto: cover,
      photos: photos
    });
  }

  renderAdminAlbums();
  alert("Naya Album kamyabi se create ho gaya.");
}

function handleAdminDeleteAlbum(id) {
  if (!confirm("Kya aap yeh album delete karna chahte hain?")) return;
  if (window.mediaService) {
    window.mediaService.deleteAlbum(id);
  }
  renderAdminAlbums();
}

// Daily Content Inputs
function renderAdminDailyInputs() {
  if (!window.settingsService) return;
  const daily = window.settingsService.getDailyContent();

  if (daily.ayat) {
    const a = document.getElementById("adminDailyAyatArabic");
    const u = document.getElementById("adminDailyAyatUrdu");
    const r = document.getElementById("adminDailyAyatRef");
    if (a) a.value = daily.ayat.arabic || "";
    if (u) u.value = daily.ayat.urdu || "";
    if (r) r.value = daily.ayat.reference || "";
  }

  if (daily.hadith) {
    const a = document.getElementById("adminDailyHadithArabic");
    const u = document.getElementById("adminDailyHadithUrdu");
    const r = document.getElementById("adminDailyHadithRef");
    if (a) a.value = daily.hadith.arabic || "";
    if (u) u.value = daily.hadith.urdu || "";
    if (r) r.value = daily.hadith.reference || "";
  }

  if (daily.dua) {
    const a = document.getElementById("adminDailyDuaArabic");
    const u = document.getElementById("adminDailyDuaUrdu");
    const r = document.getElementById("adminDailyDuaRef");
    if (a) a.value = daily.dua.arabic || "";
    if (u) u.value = daily.dua.urdu || "";
    if (r) r.value = daily.dua.reference || "";
  }
}

function handleAdminSaveDailyContent(e, type) {
  e.preventDefault();
  if (!window.settingsService) return;

  if (type === "ayat") {
    window.settingsService.saveDailyContent("ayat", {
      arabic: document.getElementById("adminDailyAyatArabic").value,
      urdu: document.getElementById("adminDailyAyatUrdu").value,
      reference: document.getElementById("adminDailyAyatRef").value
    });
  } else if (type === "hadith") {
    window.settingsService.saveDailyContent("hadith", {
      arabic: document.getElementById("adminDailyHadithArabic").value,
      urdu: document.getElementById("adminDailyHadithUrdu").value,
      reference: document.getElementById("adminDailyHadithRef").value
    });
  } else if (type === "dua") {
    window.settingsService.saveDailyContent("dua", {
      arabic: document.getElementById("adminDailyDuaArabic").value,
      urdu: document.getElementById("adminDailyDuaUrdu").value,
      reference: document.getElementById("adminDailyDuaRef").value
    });
  }

  openWisdomModal(type);
  alert(`Daily ${type.toUpperCase()} kamyabi se update ho gayi.`);
}

// Branding Inputs
function renderAdminBrandingInputs() {
  if (!window.settingsService) return;
  const b = window.settingsService.getBranding();

  const name = document.getElementById("adminBrandName");
  const sub = document.getElementById("adminBrandSubtitle");
  const tag = document.getElementById("adminBrandTagline");
  const logo = document.getElementById("adminBrandLogo");
  const banner = document.getElementById("adminBrandBanner");

  if (name) name.value = b.appName;
  if (sub) sub.value = b.appSubtitle;
  if (tag) tag.value = b.tagline;
  if (logo) logo.value = b.logoUrl;
  if (banner) banner.value = b.homeBannerUrl;
}

function handleAdminSaveBranding(e) {
  e.preventDefault();
  if (!window.settingsService) return;

  const appName = document.getElementById("adminBrandName").value;
  const appSubtitle = document.getElementById("adminBrandSubtitle").value;
  const tagline = document.getElementById("adminBrandTagline").value;
  const logoUrl = document.getElementById("adminBrandLogo").value;
  const homeBannerUrl = document.getElementById("adminBrandBanner").value;

  window.settingsService.saveBranding({
    appName,
    appSubtitle,
    tagline,
    logoUrl,
    homeBannerUrl
  });

  alert("Branding settings har jagah apply ho gayi hain!");
}

// Users List
function renderAdminUsersList() {
  const container = document.getElementById("adminUsersList");
  if (!container || !window.authService) return;

  const users = window.authService.getAllUsers();
  container.innerHTML = users
    .map(
      (u) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-md);">
        <div>
          <div style="font-weight:800; font-size:0.85rem;">${u.name}</div>
          <div style="font-size:0.72rem; color:var(--text-muted);">${u.email} • Joined: ${u.joinedDate || '2026'}</div>
        </div>
        <span class="hijri-badge" style="font-size:0.7rem; text-transform:uppercase;">${u.role}</span>
      </div>
    `
    )
    .join("");
}

/* ==========================================================================
   14. Qibla Finder & Compass Sensor
   ========================================================================== */
function initQiblaCompass() {
  if (window.DeviceOrientationEvent) {
    window.addEventListener(
      "deviceorientationabsolute",
      (event) => handleCompassOrientation(event),
      true
    );
    window.addEventListener(
      "deviceorientation",
      (event) => handleCompassOrientation(event),
      true
    );
  }
}

function handleCompassOrientation(event) {
  let heading = null;
  if (event.webkitCompassHeading) {
    heading = event.webkitCompassHeading;
  } else if (event.alpha !== null) {
    heading = 360 - event.alpha;
  }

  if (heading !== null) {
    const dial = document.getElementById("compassDial");
    if (dial) {
      dial.style.transform = `rotate(${-heading}deg)`;
    }
  }
}

/* ==========================================================================
   15. Modals & Helpers
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

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Is browser mein Web Notifications ki sahulat dastyab nahi hai.");
    return;
  }

  Notification.requestPermission().then((perm) => {
    if (perm === "granted") {
      new Notification("HUFFAZ ETAWAH", {
        body: "Assalamu Alaikum! Notification settings active ho gayi hain.",
        icon: "./icons/icon.svg"
      });
      closeModal("modalNotifications");
    } else {
      alert("Notification permission nahi mili.");
    }
  });
}

function shareContent(type) {
  const daily = (window.settingsService && window.settingsService.getDailyContent()) || HUFFAZ_DATA.dailyContent || {};
  const data = daily[type] || {};

  const shareText = `*HUFFAZ ETAWAH - Aaj ki ${type.toUpperCase()}*\n\n${data.arabic || ''}\n\n"${data.urdu || ''}"\n\nReference: ${data.reference || ''}\n\nApp Download: https://huffazetawah.org`;

  if (navigator.share) {
    navigator
      .share({
        title: `HUFFAZ ETAWAH - Aaj ki ${type}`,
        text: shareText
      })
      .catch((err) => console.log("Share dismissed"));
  } else {
    navigator.clipboard.writeText(shareText);
    alert("Content copy ho gaya hai. WhatsApp ya Social media par share karein!");
  }
}
