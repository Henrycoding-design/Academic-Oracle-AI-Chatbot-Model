export function normalizeSummary(raw: any) {
  return {
    profile: {
      name: raw?.profile?.name ?? "Student",
      level: raw?.profile?.level ?? "N/A",
      focus: raw?.profile?.focus ?? "N/A",
      confidence_level: raw?.profile?.confidence_level ?? "N/A",
      level_of_cognition: raw?.profile?.level_of_cognition ?? "N/A",
      interests: Array.isArray(raw?.profile?.interests) ? raw.profile.interests : [],
    },
    session_overview: {
      current_topic: raw?.session_overview?.current_topic ?? "N/A",
      topics_covered: raw?.session_overview?.topics_covered ?? 0,
      topics_mastered: raw?.session_overview?.topics_mastered ?? 0,
      quizzes_completed: raw?.session_overview?.quizzes_completed ?? 0,
      overall_accuracy: raw?.session_overview?.overall_accuracy ?? "N/A",
      learning_efficiency: raw?.session_overview?.learning_efficiency ?? "N/A",
      recommended_next_focus: raw?.session_overview?.recommended_next_focus ?? "N/A",
    },
    adaptive_insights: {
      strengths: Array.isArray(raw?.adaptive_insights?.strengths) ? raw.adaptive_insights.strengths : [],
      weaknesses: Array.isArray(raw?.adaptive_insights?.weaknesses) ? raw.adaptive_insights.weaknesses : [],
      study_style: raw?.adaptive_insights?.study_style ?? "N/A",
      tone_recommendation: raw?.adaptive_insights?.tone_recommendation ?? "N/A",
      question_style_recommendation: raw?.adaptive_insights?.question_style_recommendation ?? "N/A",
    },
    topics: Array.isArray(raw?.topics)
      ? raw.topics.map((t: any) => ({
          title: t?.title ?? "Untitled Topic",
          topic_tag: t?.topic_tag ?? t?.title ?? "Untitled Topic",
          mastered: t?.mastered ?? false,
          confidence_level: t?.confidence_level ?? "N/A",
          accuracy: t?.accuracy ?? "N/A",
          quizzes_done: t?.quizzes_done ?? 0,
          recommended_question_style: t?.recommended_question_style ?? "mixed",
          needs_feynman: t?.needs_feynman ?? false,
          completion: t?.completion ?? "N/A",
          formulas: Array.isArray(t?.formulas) ? t.formulas : [],
          theories: Array.isArray(t?.theories) ? t.theories : [],
          key_points: Array.isArray(t?.key_points) ? t.key_points : [],
          mistake_log: Array.isArray(t?.mistake_log) ? t.mistake_log : [],
          quiz_results: Array.isArray(t?.quiz_results) ? t.quiz_results : [],
          practical_applications: Array.isArray(t?.practical_applications) ? t.practical_applications : [],
          recommended_next_focus: Array.isArray(t?.recommended_next_focus) ? t.recommended_next_focus : [],
        }))
      : [],
    overall_completion: raw?.overall_completion ?? "N/A",
    overall_summary: raw?.overall_summary ?? raw?.overall_completion ?? "N/A",
  };
}
