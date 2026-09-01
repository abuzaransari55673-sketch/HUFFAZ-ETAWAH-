/**
 * HUFFAZ ETAWAH - Settings & Branding Service
 * Centralizes Admin branding configuration, daily content management,
 * and PWA metadata synchronization.
 */

const settingsService = {
  BRANDING_KEY: "huffaz_branding_config",
  DAILY_KEY: "huffaz_daily_content_config",
  SPLASH_DURATION: 2000,

  getDefaultBranding: function() {
    return {
      appName: "HUFFAZ ETAWAH",
      appSubtitle: "Deen & Bayanaat",
      tagline: "Ilm • Ibadat • Tarbiyah",
      logoUrl: "",
      iconUrl: "",
      homeBannerUrl: ""
    };
  },

  getBranding: function() {
    try {
      const stored = localStorage.getItem(this.BRANDING_KEY);
      if (stored) {
        return { ...this.getDefaultBranding(), ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("Failed to retrieve branding:", e);
    }
    return this.getDefaultBranding();
  },

  saveBranding: function(brandingData) {
    try {
      const current = this.getBranding();
      const updated = {
        ...current,
        appName: brandingData.appName ? brandingData.appName.trim() : current.appName,
        appSubtitle: brandingData.appSubtitle ? brandingData.appSubtitle.trim() : current.appSubtitle,
        tagline: brandingData.tagline ? brandingData.tagline.trim() : current.tagline,
        logoUrl: brandingData.logoUrl !== undefined ? brandingData.logoUrl.trim() : current.logoUrl,
        iconUrl: brandingData.iconUrl !== undefined ? brandingData.iconUrl.trim() : current.iconUrl,
        homeBannerUrl: brandingData.homeBannerUrl !== undefined ? brandingData.homeBannerUrl.trim() : current.homeBannerUrl
      };

      localStorage.setItem(this.BRANDING_KEY, JSON.stringify(updated));
      this.applyBrandingToDOM();

      if (window.analyticsService) {
        window.analyticsService.trackEvent("branding_update", { app_name: updated.appName });
      }

      return { success: true, data: updated };
    } catch (e) {
      console.error("Failed to save branding:", e);
      return { success: false, message: e.message };
    }
  },

  applyBrandingToDOM: function() {
    const b = this.getBranding();

    // 1. Update Header Title & Subtitle
    const brandTitles = document.querySelectorAll(".brand-title");
    brandTitles.forEach(el => { el.textContent = b.appName; });

    const brandSubtitles = document.querySelectorAll(".brand-subtitle");
    brandSubtitles.forEach(el => { el.textContent = b.appSubtitle; });

    // 2. Update Document Title
    document.title = `${b.appName} - ${b.appSubtitle}`;

    // 3. Update Logos across DOM
    const logoContainers = document.querySelectorAll(".logo-placeholder");
    logoContainers.forEach(container => {
      if (b.logoUrl) {
        container.innerHTML = `<img src="${b.logoUrl}" alt="${b.appName}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;" onerror="this.onerror=null; this.parentElement.innerHTML='<svg viewBox=\\'0 0 512 512\\'><path d=\\'M 256 120 C 230 150, 190 190, 190 260 L 322 260 C 322 190, 282 150, 256 120 Z\\'/></svg>';">`;
      }
    });

    // 4. Update Splash Elements if present
    const splashName = document.getElementById("splashAppName");
    if (splashName) splashName.textContent = b.appName;

    const splashSub = document.getElementById("splashSubtitle");
    if (splashSub) splashSub.textContent = b.appSubtitle;

    const splashTag = document.getElementById("splashTagline");
    if (splashTag) splashTag.textContent = b.tagline;

    const splashLogo = document.getElementById("splashLogoImg");
    if (splashLogo && b.logoUrl) {
      splashLogo.src = b.logoUrl;
      splashLogo.style.display = "block";
    }
  },

  // Daily Islamic Content Management
  getDailyContent: function() {
    try {
      const stored = localStorage.getItem(this.DAILY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to retrieve daily content:", e);
    }
    return (typeof HUFFAZ_DATA !== "undefined" && HUFFAZ_DATA.dailyContent) || {};
  },

  saveDailyContent: function(type, contentObj) {
    try {
      const current = this.getDailyContent();
      current[type] = { ...current[type], ...contentObj };
      localStorage.setItem(this.DAILY_KEY, JSON.stringify(current));

      if (window.analyticsService) {
        window.analyticsService.trackEvent("daily_content_update", { type: type });
      }

      return { success: true, data: current };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
};

if (typeof window !== "undefined") {
  window.settingsService = settingsService;
}
