/**
 * HUFFAZ ETAWAH - Firebase Configuration & Abstraction
 * Optional free-tier backend architecture.
 * Safe fallback if Firebase is not yet configured.
 */

const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const firebaseService = {
  isConfigured: function() {
    return Boolean(
      FIREBASE_CONFIG.apiKey && 
      FIREBASE_CONFIG.projectId && 
      typeof window.firebase !== "undefined"
    );
  },

  getSavedConfig: function() {
    try {
      const custom = localStorage.getItem("huffaz_firebase_config");
      if (custom) {
        return JSON.parse(custom);
      }
    } catch (e) {
      console.warn("Failed to parse stored Firebase config:", e);
    }
    return FIREBASE_CONFIG;
  },

  saveConfig: function(config) {
    try {
      localStorage.setItem("huffaz_firebase_config", JSON.stringify(config));
      return true;
    } catch (e) {
      console.error("Error saving Firebase config:", e);
      return false;
    }
  }
};

if (typeof window !== "undefined") {
  window.FIREBASE_CONFIG = FIREBASE_CONFIG;
  window.firebaseService = firebaseService;
}
