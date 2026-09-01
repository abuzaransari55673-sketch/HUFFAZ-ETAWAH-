/**
 * HUFFAZ ETAWAH - Bayanaat Service
 * Manages video library, intelligent YouTube URL extraction,
 * categories, searching, filtering, bookmarks, and recently watched history.
 */

const bayanService = {
  STORAGE_KEY: "huffaz_custom_bayanaat",
  BOOKMARKS_KEY: "huffaz_bookmarks",
  RECENT_KEY: "huffaz_recent_bayanaat",

  extractYouTubeId: function(urlOrId) {
    if (!urlOrId) return "dQw4w9WgXcQ";
    const str = urlOrId.trim();

    // Direct 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
      return str;
    }

    // YouTube watch URL
    const watchMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    // youtu.be short URL
    const shortMatch = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    // YouTube Shorts URL
    const shortsMatch = str.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];

    // YouTube Embed URL
    const embedMatch = str.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    return "dQw4w9WgXcQ";
  },

  getAllBayanaat: function() {
    try {
      const custom = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
      const defaultList = (typeof HUFFAZ_DATA !== "undefined" && HUFFAZ_DATA.bayanaat) || [];
      return [...custom, ...defaultList];
    } catch (e) {
      return (typeof HUFFAZ_DATA !== "undefined" && HUFFAZ_DATA.bayanaat) || [];
    }
  },

  addBayan: function(data) {
    const custom = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
    const videoId = this.extractYouTubeId(data.youtubeUrl || data.youtubeId);
    
    const newBayan = {
      id: "bayan-" + Date.now(),
      title: data.title.trim(),
      scholar: data.scholar || "Maulana Jarjees Ansari Hafizahullah",
      category: data.category || "Khaas Bayan",
      date: data.date || new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
      duration: data.duration || "40:00",
      youtubeId: videoId,
      youtubeUrl: "https://www.youtube.com/watch?v=" + videoId,
      thumbnail: data.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      views: "1.2K",
      description: data.description || "HUFFAZ ETAWAH Deen & Bayanaat official upload.",
      featured: Boolean(data.featured)
    };

    custom.unshift(newBayan);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(custom));

    if (window.analyticsService) {
      window.analyticsService.trackEvent("bayan_add", { content_title: newBayan.title });
    }

    return newBayan;
  },

  deleteBayan: function(id) {
    const custom = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
    const filtered = custom.filter(b => b.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  searchBayanaat: function(query = "", category = "All") {
    const list = this.getAllBayanaat();
    const q = query.trim().toLowerCase();

    return list.filter(b => {
      const matchCat = category === "All" || b.category === category;
      const matchQuery = !q || 
        b.title.toLowerCase().includes(q) || 
        b.scholar.toLowerCase().includes(q) || 
        b.description.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  },

  // Bookmarks
  getBookmarks: function() {
    try {
      return JSON.parse(localStorage.getItem(this.BOOKMARKS_KEY) || "[]");
    } catch (e) {
      return [];
    }
  },

  toggleBookmark: function(bayanId) {
    let bookmarks = this.getBookmarks();
    const exists = bookmarks.includes(bayanId);
    if (exists) {
      bookmarks = bookmarks.filter(id => id !== bayanId);
    } else {
      bookmarks.push(bayanId);
    }
    localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(bookmarks));

    if (window.analyticsService) {
      window.analyticsService.trackEvent("bookmark", { content_id: bayanId, state: !exists });
    }

    return !exists;
  },

  isBookmarked: function(bayanId) {
    return this.getBookmarks().includes(bayanId);
  },

  // Recently Watched
  recordWatched: function(bayan) {
    try {
      let recents = JSON.parse(localStorage.getItem(this.RECENT_KEY) || "[]");
      recents = recents.filter(r => r.id !== bayan.id);
      recents.unshift(bayan);
      if (recents.length > 10) recents.pop();
      localStorage.setItem(this.RECENT_KEY, JSON.stringify(recents));

      if (window.analyticsService) {
        window.analyticsService.trackEvent("bayan_play", {
          content_id: bayan.id,
          content_title: bayan.title,
          content_category: bayan.category
        });
      }
    } catch (e) {
      console.warn("Failed to record watched bayan:", e);
    }
  },

  getRecentWatched: function() {
    try {
      return JSON.parse(localStorage.getItem(this.RECENT_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
};

if (typeof window !== "undefined") {
  window.bayanService = bayanService;
}
