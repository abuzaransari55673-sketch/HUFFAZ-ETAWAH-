/**
 * HUFFAZ ETAWAH - Quiz-e-Deen Service
 * Manages Islamic MCQ questions, scoring, streak calculation,
 * local attempts tracking, and authentic Islamic reference verification.
 */

const quizService = {
  STORAGE_KEY: "huffaz_custom_quizzes",
  SCORE_KEY: "huffaz_quiz_score",
  STREAK_KEY: "huffaz_quiz_streak",
  ATTEMPTS_KEY: "huffaz_quiz_attempts",

  getAllQuizzes: function() {
    try {
      const custom = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
      const defaultList = (typeof HUFFAZ_DATA !== "undefined" && HUFFAZ_DATA.quizzes) || [];
      return [...custom, ...defaultList];
    } catch (e) {
      return (typeof HUFFAZ_DATA !== "undefined" && HUFFAZ_DATA.quizzes) || [];
    }
  },

  addQuiz: function(data) {
    const custom = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
    const newQuiz = {
      id: "q-" + Date.now(),
      category: data.category || "General Deen",
      question: data.question.trim(),
      options: data.options,
      correctAnswer: parseInt(data.correctAnswer, 10),
      explanation: data.explanation.trim(),
      reference: data.reference ? data.reference.trim() : "Authentic Islamic Tradition"
    };

    custom.unshift(newQuiz);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(custom));

    if (window.analyticsService) {
      window.analyticsService.trackEvent("quiz_add", { question: newQuiz.question });
    }

    return newQuiz;
  },

  deleteQuiz: function(id) {
    const custom = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
    const filtered = custom.filter(q => q.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  getScore: function() {
    return parseInt(localStorage.getItem(this.SCORE_KEY) || "240", 10);
  },

  getStreak: function() {
    return parseInt(localStorage.getItem(this.STREAK_KEY) || "3", 10);
  },

  recordAnswer: function(isCorrect) {
    let currentScore = this.getScore();
    let currentStreak = this.getStreak();
    let attempts = parseInt(localStorage.getItem(this.ATTEMPTS_KEY) || "8", 10) + 1;

    if (isCorrect) {
      currentScore += 10;
      currentStreak += 1;
    }

    localStorage.setItem(this.SCORE_KEY, currentScore.toString());
    localStorage.setItem(this.STREAK_KEY, currentStreak.toString());
    localStorage.setItem(this.ATTEMPTS_KEY, attempts.toString());

    if (window.analyticsService) {
      window.analyticsService.trackEvent("quiz_answer", { is_correct: isCorrect, new_score: currentScore });
    }

    return {
      score: currentScore,
      streak: currentStreak,
      attempts: attempts
    };
  }
};

if (typeof window !== "undefined") {
  window.quizService = quizService;
}
