/**
 * HUFFAZ ETAWAH - Deeni Taleem & Asbaaq Service
 * Manages Islamic learning categories, lessons, completed progress,
 * and continuing education states.
 */

const taleemService = {
  COMPLETED_KEY: "huffaz_completed_lessons",

  getCategories: function() {
    return (typeof HUFFAZ_DATA !== "undefined" && HUFFAZ_DATA.taleemCategories) || [];
  },

  getCompletedLessons: function() {
    try {
      return JSON.parse(localStorage.getItem(this.COMPLETED_KEY) || "[]");
    } catch (e) {
      return [];
    }
  },

  isLessonCompleted: function(lessonId) {
    return this.getCompletedLessons().includes(lessonId);
  },

  markLessonComplete: function(lessonId, lessonTitle = "") {
    const completed = this.getCompletedLessons();
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      localStorage.setItem(this.COMPLETED_KEY, JSON.stringify(completed));

      if (window.analyticsService) {
        window.analyticsService.trackEvent("lesson_complete", { lesson_id: lessonId, title: lessonTitle });
      }
    }
    return completed;
  },

  getProgressSummary: function() {
    const categories = this.getCategories();
    let totalLessons = 0;
    categories.forEach(c => {
      totalLessons += (c.lessons ? c.lessons.length : c.totalLessons);
    });

    const completed = this.getCompletedLessons().length;
    const percentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

    return {
      total: totalLessons,
      completed: completed,
      percentage: percentage
    };
  }
};

if (typeof window !== "undefined") {
  window.taleemService = taleemService;
}
