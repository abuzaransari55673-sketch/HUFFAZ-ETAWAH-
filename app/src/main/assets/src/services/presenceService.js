/**
 * HUFFAZ ETAWAH - Presence Service
 * Real presence tracking with Firebase RTDB when configured.
 * Shows 'Analytics not connected' when unconfigured (no fake numbers).
 */

const presenceService = {
  sessionId: "sess-" + Math.random().toString(36).substring(2, 9),

  init: function() {
    if (window.firebaseService && window.firebaseService.isConfigured()) {
      this.initFirebasePresence();
    }
  },

  initFirebasePresence: function() {
    try {
      // Connect to Firebase Realtime Database presence node
      const db = window.firebase.database();
      const myPresenceRef = db.ref("presence/" + this.sessionId);
      const connectedRef = db.ref(".info/connected");

      connectedRef.on("value", (snap) => {
        if (snap.val() === true) {
          myPresenceRef.onDisconnect().remove();
          myPresenceRef.set({
            online: true,
            lastSeen: window.firebase.database.ServerValue.TIMESTAMP
          });
        }
      });
    } catch (e) {
      console.warn("Firebase presence initialization failed:", e);
    }
  },

  getOnlineStatus: function(callback) {
    if (window.firebaseService && window.firebaseService.isConfigured()) {
      try {
        const db = window.firebase.database();
        const presenceRef = db.ref("presence");
        presenceRef.on("value", (snap) => {
          const val = snap.val();
          const count = val ? Object.keys(val).length : 1;
          callback({
            connected: true,
            count: count,
            text: count + " Users Online"
          });
        });
        return;
      } catch (e) {
        console.warn("Error fetching online presence:", e);
      }
    }

    // Unconfigured state fallback
    callback({
      connected: false,
      count: 0,
      text: "Analytics not connected"
    });
  }
};

if (typeof window !== "undefined") {
  window.presenceService = presenceService;
}
