export function normalizeSummary(raw: any) {
  return {
    profile: {
      name: raw?.profile?.name ?? "Student",
      level: raw?.profile?.level ?? "N/A",
      focus: raw?.profile?.focus ?? "N/A",
    },
    topics: Array.isArray(raw?.topics)
      ? raw.topics.map((t: any) => ({
          title: t?.title ?? "Untitled Topic",
          completion: t?.completion ?? "N/A",
          formulas: Array.isArray(t?.formulas) ? t.formulas : [],
          theories: Array.isArray(t?.theories) ? t.theories : [],
          key_points: Array.isArray(t?.key_points) ? t.key_points : [],
          // Added quiz_results normalization
          quiz_results: Array.isArray(t?.quiz_results) ? t.quiz_results : [],
        }))
      : [],
    overall_completion: raw?.overall_completion ?? "N/A",
  };
}
