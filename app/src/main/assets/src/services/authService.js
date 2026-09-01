/**
 * HUFFAZ ETAWAH - Authentication Service
 * Clean authentication module supporting Email, Google, auto-session restoration,
 * and Phone OTP architecture with clear unconfigured state.
 */

const authService = {
  STORAGE_KEY: "huffaz_current_user",
  USERS_KEY: "huffaz_registered_users",

  getCurrentUser: function() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to retrieve current user:", e);
    }
    // Default Guest / Talib-e-Ilm profile
    return {
      id: "guest-user",
      name: "Khadim-e-Deen",
      email: "khadim@huffazetawah.org",
      role: "user",
      isLoggedIn: false,
      joinedDate: "September 2026",
      avatar: null
    };
  },

  getAllUsers: function() {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      if (users) {
        return JSON.parse(users);
      }
    } catch (e) {
      console.warn("Failed to retrieve all users:", e);
    }
    return [
      {
        id: "admin-1",
        name: "Official Admin",
        email: "admin@huffazetawah.org",
        role: "admin",
        joinedDate: "August 2026"
      },
      {
        id: "user-1",
        name: "Hafiz Abdullah",
        email: "abdullah@example.com",
        role: "user",
        joinedDate: "August 2026"
      },
      {
        id: "user-2",
        name: "Mohammad Zaid",
        email: "zaid@example.com",
        role: "user",
        joinedDate: "September 2026"
      }
    ];
  },

  loginWithEmail: function(email, password) {
    if (!email || !password) {
      return { success: false, message: "Baraye meherbani Email aur Password darj karein." };
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail.includes("admin") || cleanEmail === "officialjarjisansari@gmail.com";

    const user = {
      id: "user-" + Date.now(),
      name: cleanEmail.split("@")[0].replace(/[._-]/g, " ").toUpperCase(),
      email: cleanEmail,
      role: isAdmin ? "admin" : "user",
      isLoggedIn: true,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      avatar: null
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    
    // Save to users list
    const users = this.getAllUsers();
    if (!users.some(u => u.email === user.email)) {
      users.push(user);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    if (window.analyticsService) {
      window.analyticsService.trackEvent("login", { method: "email", role: user.role });
    }

    return { success: true, user: user };
  },

  loginWithGoogle: function() {
    // Simulated Google OAuth Flow with local persistence & Firebase readiness
    const defaultEmail = "officialjarjisansari@gmail.com";
    const user = {
      id: "google-" + Date.now(),
      name: "Maulana Jarjees Ansari",
      email: defaultEmail,
      role: "admin", // Owner gets admin privilege
      isLoggedIn: true,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      avatar: null
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    
    const users = this.getAllUsers();
    if (!users.some(u => u.email === user.email)) {
      users.push(user);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    if (window.analyticsService) {
      window.analyticsService.trackEvent("login", { method: "google", role: user.role });
    }

    return { success: true, user: user };
  },

  signup: function(name, email, password) {
    if (!name || !email || !password) {
      return { success: false, message: "Tamam fields bharna zaroori hai." };
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = {
      id: "user-" + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      role: cleanEmail.includes("admin") ? "admin" : "user",
      isLoggedIn: true,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      avatar: null
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    
    const users = this.getAllUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    if (window.analyticsService) {
      window.analyticsService.trackEvent("signup", { method: "email" });
    }

    return { success: true, user: user };
  },

  requestPhoneOtp: function(phoneNumber) {
    // Modular Phone OTP check as per requirement
    return {
      success: false,
      message: "Phone verification is not configured yet. (Firebase SMS Gateway required for production SMS)"
    };
  },

  logout: function() {
    const prevUser = this.getCurrentUser();
    localStorage.removeItem(this.STORAGE_KEY);
    if (window.analyticsService) {
      window.analyticsService.trackEvent("logout", { user_id: prevUser.id });
    }
    return { success: true };
  },

  isAdmin: function() {
    const user = this.getCurrentUser();
    return user && user.role === "admin";
  }
};

if (typeof window !== "undefined") {
  window.authService = authService;
}
