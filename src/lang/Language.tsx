export type AppLanguage = "en" | "fr" | "es" | "vi";

export type LoadingModeLabel = "Agentic" | "Fast" | "Balanced" | "Standard" | "Web Search";

export const LANGUAGE_DATA: Record<AppLanguage, {
  greeting: string;
  shortGreeting: string;
  tooltips: {
    newChat: string;
    summary: string;
    quiz: string;
    copyCode: string;
    copied: string;
  };
  ui: {
    // Quiz UI labels
    chat: string;
    jailbreakMessage: string;
    masteryDetected: string;
    masteryPopupExplain: string;
    masteryPopupYes: string;
    masteryPopuplLater: string;
    quizConfigTitle: string;
    difficultyLevel: string;
    difficultyOptions: string[];
    numberOfQuestions: string; // use {count}
    mixLabel: string; // use {mcq} and {open}
    startAssessment: string;
    generatingAssessment: string;
    failedToGenerateQuiz: string;
    mcqIncorrect: string; // use {answer} and {explanation}
    questionOf: string; // use {current} and {total}
    chatTooShortForQuiz: string;
    chooseTopic: string;
    chooseTopicPlaceholder: string;
    chooseTopicRequired: string;
    noQuizTopicsAvailable: string;
    updatingQuizConfig: string;
    answerPlaceholder: string;
    pressEnter: string;
    aiGrading: string;
    correctExclaim: string;
    notQuite: string;
    explainSelectionButton: string;
    followUpSelectionButton: string;
    explainSelectionPrompt: string;
    followUpSelectionPrompt: string;
    explainContext: string; // template for explain-in-chat context: {question},{answer},{result},{feedback}
    quizSummary: string; // template for summary: {score},{total},{level}
    askExplain: string;
    seeResults: string;
    nextQuestion: string;
    assessmentComplete: string;
    correctLabel: string;
    needsReview: string;
    addToMemory: string;
    takeAnother: string;
    memoryAdded: string;

    profile: string;
    logOut: string;
    noExistingChat: string;
    notEnoughHistory: string;
    apiKeyExpired: string;
    rateLimitError: string;
    rateLimitRetry: string;
    rateLimitSupport: string;
    genericError: string;
    retryButton: string;
    freeSessionLimit: string;
    freeSessionSupport: string;
    pleaseLogin: string;
    pleaseWait: string;
    failedToGenerateSummary: string;
    oracleOnline: string;
    thinking: string;
    syncError: string;
    oracleStatus: string;
    language: string;
    settings: string;
    email: string;
    apiKey: string;
    editApiKey: string;
    addApiKey: string;
    save: string;
    noApiKeyAdded: string;
    howToGetApiKey: string;
    modelAdaptationTooltip: string;
    modelAdaptation: string;
    modelAdaptationOff: string;
    modelAdaptationStandard: string;
    modelAdaptationAlways: string;
    invalidApiKeyFormat: string;
    failedToLoadApiKey: string;
    failedToSaveApiKey: string;
    noApiKeySetMessage: string;
    wipeProfile: string;
    wipeProfileConfirm: string;
    confirmReset: string;
    uploadFile: string;
    placeholderFull: string;
    placeholderMedium: string;
    placeholderShort: string;
    disclaimer: string;
    webSearchQuotaReached: string;
    webSearchFailedMessage: string;
    webSearchQuotaReachedMessage: string;
    dashboard: {
      title: string;
      subtitle: string;
      description: string;
      preparingSummary: string;
      downloadSummary: string;
      loadingMessages: string[];
      userData: string;
      name: string;
      defaultStudentName: string;
      academicLevel: string;
      academicLevelFallback: string;
      currentTopic: string;
      currentTopicFallback: string;
      learningLevel: string;
      learningLevelFallback: string;
      learningEfficiency: string;
      efficiencyShort: string;
      topicsLearned: string;
      topicsMastered: string;
      quizzesDone: string;
      strengths: string;
      strengthsEmpty: string;
      weaknesses: string;
      weaknessesEmpty: string;
      learningTopics: string;
      learningTopicsDescription: string;
      sessionTurnsTracked: string;
      noActiveHistory: string;
      topicMeta: string;
      topicMastered: string;
      topicInProgress: string;
      accuracyPending: string;
      openDetails: string;
      keyNotes: string;
      formulasAndCues: string;
      noFormulasYet: string;
      quizAttemptsRecorded: string;
      recommendedNextFocus: string;
      noTopicsYet: string;
      currentSummary: string;
      currentSummaryFallback: string;
      deleteTopic: string;
      deleteTopicConfirm: string; // use {topic}
      seeMore: string;
      seeLess: string;
      confidenceLevel: string;
      masteryStatus: string;
      masteryStatusMastered: string;
      masteryStatusInProgress: string;
      currentAccuracy: string;
      bestPracticeMode: string;
      recommendedFocusMastered: string;
      recommendedFocusNeedsFeynman: string;
      recommendedFocusLowAccuracy: string;
      recommendedFocusDefault: string;
      reportDocTitle: string;
      reportLevel: string;
      reportFocus: string;
      reportConfidence: string;
      reportCognitionLevel: string;
      reportInterests: string;
      reportSessionOverview: string;
      reportTopicsCovered: string;
      reportOverallAccuracy: string;
      reportAdaptiveInsights: string;
      reportStudyStyle: string;
      reportToneRecommendation: string;
      reportQuestionStyleRecommendation: string;
      reportTopicTag: string;
      reportCompletion: string;
      reportMastered: string;
      reportNeedsFeynman: string;
      reportMistakeLog: string;
      reportQuizPerformance: string;
      reportFormulas: string;
      reportTheories: string;
      reportKeyTakeaways: string;
      reportPracticalApplications: string;
      reportOverallSummary: string;
      reportOverallCompletion: string;
    };
    loadingModeLabels: Record<LoadingModeLabel, string>;
    exam: {
      examInstructions: string;
      questions: string;
      estimatedMarks: string;
      duration: string;
      helpLevel: string;
      instructions: string;
      back: string;
      startExam: string;
      timeRemaining: string;
      submit: string;
      submitting: string;
      navigator: string;
      multipleChoice: string;
      openResponse: string;
      flagged: string;
      unflag: string;
      flag: string;
      hint: string;
      showHint: string;
      hideHint: string;
      solution: string;
      specificHint: string;
      prev: string;
      next: string;
      typeAnswerHere: string;
      noActiveQuestion: string;
      youLeftExamWindow: string;
      resumeExam: string;
      submitExam: string;
      unansweredQuestions: string;
      flaggedQuestions: string;
      submitAnyway: string;
      cancel: string;
      confirmSubmit: string;
      examResults: string;
      score: string;
      percentage: string;
      estimatedGrade: string;
      summary: string;
      redoExam: string;
      exportToDocx: string;
      addToOracleMemory: string;
      reviewExam: string;
      backToResults: string;
      yourAnswer: string;
      correctAnswer: string;
      feedback: string;
      correct: string;
      partial: string;
      incorrect: string;
      unanswered: string;
      noAnswerSubmitted: string;
      noOfficialAnswer: string;
      resumeExamNotice: string;
      questionOf: string;
      youStillHave: string;
      questionPrefix: string;
      noAdditionalFeedback: string;
      noAnswerSubmittedFeedback: string;
      reportTitle: string;
      reportAnalyticsSummary: string;
      reportUsedMarkScheme: string;
      yes: string;
      no: string;
      reportQuestion: string;
    };
    examSetup: {
      defaultExamTitle: string;
      moduleSupertitle: string;
      moduleTitle: string;
      moduleDescription: string;
      reset: string;
      questionPaperTitle: string;
      questionPaperSubtitle: string;
      questionPaperBadge: string;
      noQuestionPaperSelected: string;
      questionPaperLoading: string;
      questionPaperLoaded: string; // use {count}
      questionPaperHint: string;
      chooseQuestionPaper: string;
      noFileChosen: string;
      markSchemeTitle: string;
      markSchemeSubtitle: string;
      markSchemeBadge: string;
      noMarkSchemeSelected: string;
      markSchemeLoading: string;
      markSchemeLoaded: string;
      markSchemeHint: string;
      chooseMarkScheme: string;
      sessionSetupTitle: string;
      sessionSetupDescription: string;
      durationLabel: string;
      duration15: string;
      duration30: string;
      duration45: string;
      duration60: string;
      helpLevelLabel: string;
      helpLevelNone: string;
      helpLevelGeneral: string;
      helpLevelSpecific: string;
      helpLevelSolution: string;
      gradingStyleLabel: string;
      gradingStyleDefault: string;
      snapshotTitle: string;
      snapshotFieldTitle: string;
      snapshotPendingTitle: string;
      snapshotFieldQuestions: string;
      snapshotFieldMarks: string;
      snapshotFieldDuration: string;
      snapshotMinutes: string;
      snapshotFieldHelpLevel: string;
      snapshotFieldGradingStyle: string;
      continueToInstructions: string;
      errorNoQuestionPaper: string;
      examRuntimeNotesTitle: string;
      examRuntimeNote1: string;
      examRuntimeNote2: string;
      examRuntimeNote3: string;
      resultSummaryNoQuestions: string;
      resultSummaryNotAnswered: string; // use {total}
      resultSummaryStrong: string; // use {score}, {total}
      resultSummaryCompetent: string; // use {score}, {total}
      resultSummaryNeedsReview: string; // use {score}, {total}
    };
  };
}> = {
  en: {
    greeting:
      "Welcome to the Universal Academic Oracle. From SATs and IELTS to University research and Industrial practices, I am here to guide your journey.\n\nBefore we begin, what should I call you, and what academic challenge are we tackling today?",
    shortGreeting:
      "Welcome to the Universal Academic Oracle. I am here to guide your academic journey.",
    tooltips: {
      newChat: "Start New Chat",
      summary: "Generate Summary Doc",
      quiz: "Mastery Quiz",
      copyCode: "Copy code",
      copied: "Copied",
    },
    ui: {
      chat: "Chat",
      jailbreakMessage: "I'm here to help with academic topics. I can't follow instructions that ask me to bypass my guidelines — but I'm happy to help you study, research, or learn something new! 📚",
      masteryDetected: "Mastery Detected!",
      masteryPopupExplain: "You've mastered the topic. Would you like to take a quick quiz to test your understanding and solidify your knowledge?",
      masteryPopupYes: "Yes, let's do it!",
      masteryPopuplLater: "Maybe later",
      quizConfigTitle: "Quiz Configuration",
      difficultyLevel: "Difficulty Level",
      difficultyOptions: ["Fundamental", "Intermediate", "Advanced"],
      numberOfQuestions: "Number of Questions: {count}",
      mixLabel: "Mix: {mcq}% MCQ / {open}% Open",
      startAssessment: "Start Assessment",
      generatingAssessment: "Generating your tailored assessment...",
      failedToGenerateQuiz: "Failed to generate quiz. Please try again.",
      mcqIncorrect: "Incorrect. The correct answer is {answer}. {explanation}",
      explainContext: "I am taking a quiz about our previous topic.\nQuestion: \"{question}\"\nMy Answer: \"{answer}\"\nResult: {result}\nFeedback received: \"{feedback}\"\n\nCan you explain this concept in more detail?",
      quizSummary: "Quiz Completed. Score: {score}/{total}. Difficulty: {level}.",
      chatTooShortForQuiz: "Not enough chat history or session memory to generate a quiz.",
      chooseTopic: "Choose Topic",
      chooseTopicPlaceholder: "Select a tracked topic",
      chooseTopicRequired: "Choose a topic before starting the quiz.",
      noQuizTopicsAvailable: "No tracked topics with usable data are available yet.",
      updatingQuizConfig: "Updating config...",
      questionOf: "Question {current} of {total}",
      answerPlaceholder: "Type your answer here...",
      pressEnter: "Press Enter to submit",
      aiGrading: "AI is grading your answer...",
      correctExclaim: "Correct!",
      notQuite: "Not quite right",
      explainSelectionButton: "Explain further",
      followUpSelectionButton: "Follow up",
      explainSelectionPrompt: "Explain this part more clearly and simply:\n\n\"{selection}\"",
      followUpSelectionPrompt: "Selected part:\n\"{selection}\"\n\nFollow-up question:\n{message}",
      askExplain: "Ask Oracle to explain in Chat",
      seeResults: "See Results",
      nextQuestion: "Next Question",
      assessmentComplete: "Assessment Complete",
      correctLabel: "Correct",
      needsReview: "Needs Review",
      addToMemory: "Add Results to Session Memory",
      takeAnother: "Take Another Quiz",
      memoryAdded: "Results added to your Session Memory! They will be included in your next Summary Doc.",

      profile: "Profile",
      logOut: "Log out",
      noExistingChat: "No existing chat or profile to reset.",
      notEnoughHistory: "Not enough chat history or student profile to generate a meaningful summary.",
      apiKeyExpired: "Your API Key has expired/malformed. Please check again.",
      rateLimitError: "You've hit the rate limit of the API Key.",
      rateLimitRetry: "Try again after {delay}",
      rateLimitSupport: "Support the project to unlock higher limits: Buy Me A Coffee. Thank you!",
      genericError: "There was an error processing your request. Please try again.",
      retryButton: "Retry",
      freeSessionLimit: "Free session limit reached 🚧\n\nCreate your own API key for unlimited access in Profile Page,\nor support on Buy Me A Coffee to keep Oracle running smoothly!",
      freeSessionSupport: "or support on Buy Me A Coffee to keep Oracle running smoothly!",
      pleaseLogin: "Please log in to generate summary document.",
      pleaseWait: "Please wait for the current operation to finish.",
      failedToGenerateSummary: "Failed to generate summary 😬",
      oracleOnline: "Oracle Online",
      thinking: "Thinking...",
      syncError: "Sync Error",
      oracleStatus: "Oracle Status",
      language: "Language",
      settings: "Settings",
      email: "Email",
      apiKey: "API Key",
      editApiKey: "Edit API Key",
      addApiKey: "Add API Key",
      save: "Save",
      noApiKeyAdded: "No API key added yet. Click the plus button to add one.",
      howToGetApiKey: "How to get an API key?",
      modelAdaptation: "Model Adaptation",
      modelAdaptationOff: "Off",
      modelAdaptationStandard: "Standard",
      modelAdaptationAlways: "Always",
      modelAdaptationTooltip: "Choose when to enable adaptive model routing. **Always**: race calls for fastest response. **Standard**: activates during high traffic. **Off**: disabled.",
      invalidApiKeyFormat: "Invalid API Key format.",
      failedToLoadApiKey: "Failed to load API key.",
      failedToSaveApiKey: "Failed to save API key.",
      noApiKeySetMessage: "No API Key set",
      wipeProfile: "Do you want to wipe your student profile as well? Click 'Cancel' to keep it.",
      wipeProfileConfirm: "Wipe Profile",
      confirmReset: "Are you sure you want to reset the chat?",
      uploadFile: "Upload from computer",
      placeholderFull: "Type your academic inquiry here…",
      placeholderMedium: "Type your academic question…",
      placeholderShort: "Ask a question…",
      disclaimer: "Academic Oracle may generate inaccurate or incomplete information. Verify all results independently before relying on them.",
      webSearchQuotaReached: "You have reached the Web Search quota. The model will fall back to knowledge from before 2024. Sorry for the inconvenience!",
      webSearchFailedMessage: "The required web search for this prompt could not be completed. Response generation has been stopped to avoid using incomplete live information. Please try again.",
      webSearchQuotaReachedMessage: "This prompt requires web search, but the web search quota has been reached. Response generation has been stopped to avoid using incomplete live information.",
      dashboard: {
        title: "Learning Dashboard",
        subtitle: "Session insight overview",
        description: "Track the learner profile, topic progress, weak spots, and next practice targets in one place.",
        preparingSummary: "Preparing Session Summary...",
        downloadSummary: "Download Session Summary",
        loadingMessages: ["Almost there", "Building insights", "Gathering analytics", "Preparing summary"],
        userData: "User Data",
        name: "Name",
        defaultStudentName: "Student",
        academicLevel: "Academic Level",
        academicLevelFallback: "Not set yet",
        currentTopic: "Current Topic",
        currentTopicFallback: "No topic tracked yet",
        learningLevel: "Learning Level",
        learningLevelFallback: "Still being inferred",
        learningEfficiency: "Learning Efficiency",
        efficiencyShort: "Efficiency",
        topicsLearned: "Topics Learned",
        topicsMastered: "Topics Mastered",
        quizzesDone: "Quizzes Done",
        strengths: "Strength Identified",
        strengthsEmpty: "Strength signals will appear here as Oracle gathers more session evidence.",
        weaknesses: "Weakness to Improve",
        weaknessesEmpty: "Improvement areas will populate here after more topic tracking or quiz feedback.",
        learningTopics: "Learning Topics",
        learningTopicsDescription: "Expand each topic to review tracked notes, quiz activity, and the next best practice direction.",
        sessionTurnsTracked: "{count} session turns tracked",
        noActiveHistory: "No active history yet",
        topicMeta: "{status} • {quizzes} quizzes • {accuracy}",
        topicMastered: "Mastered",
        topicInProgress: "Currently learning",
        accuracyPending: "Accuracy pending",
        openDetails: "Open details",
        keyNotes: "Key Notes",
        formulasAndCues: "Formulas / Recall Cues",
        noFormulasYet: "No specific formulas or correction cues have been captured for this topic yet.",
        quizAttemptsRecorded: "{count} quiz attempt(s) recorded.",
        recommendedNextFocus: "Recommended Next Focus / Practice",
        noTopicsYet: "Start a chat or complete a quiz to populate the dashboard with tracked learning topics.",
        currentSummary: "Current Summary",
        currentSummaryFallback: "Your current learning summary will appear here once Oracle has built enough durable learning memory.",
        deleteTopic: "Delete topic memory",
        deleteTopicConfirm: "Delete the stored memory for {topic}? This removes only that topic entry from Oracle Memory.",
        seeMore: "See more",
        seeLess: "See less",
        confidenceLevel: "Confidence level",
        masteryStatus: "Mastery status",
        masteryStatusMastered: "Mastered",
        masteryStatusInProgress: "In progress",
        currentAccuracy: "Current accuracy",
        bestPracticeMode: "Best practice mode",
        recommendedFocusMastered: "Apply this topic to mixed or real-world practice questions.",
        recommendedFocusNeedsFeynman: "Slow down and restate the concept in your own words before the next quiz.",
        recommendedFocusLowAccuracy: "Review the weak steps and do one focused practice round.",
        recommendedFocusDefault: "Keep reinforcing with short retrieval practice and one harder problem.",
        reportDocTitle: "Academic Oracle — Session Summary",
        reportLevel: "Level",
        reportFocus: "Focus",
        reportConfidence: "Confidence",
        reportCognitionLevel: "Cognition Level",
        reportInterests: "Interests",
        reportSessionOverview: "Session Overview",
        reportTopicsCovered: "Topics Covered",
        reportOverallAccuracy: "Overall Accuracy",
        reportAdaptiveInsights: "Adaptive Insights",
        reportStudyStyle: "Study Style",
        reportToneRecommendation: "Tone Recommendation",
        reportQuestionStyleRecommendation: "Question Style Recommendation",
        reportTopicTag: "Topic Tag",
        reportCompletion: "Completion",
        reportMastered: "Mastered",
        reportNeedsFeynman: "Needs Feynman Reinforcement",
        reportMistakeLog: "Mistake Log",
        reportQuizPerformance: "Quiz Performance",
        reportFormulas: "Formulas",
        reportTheories: "Theories",
        reportKeyTakeaways: "Key Takeaways",
        reportPracticalApplications: "Practical Applications",
        reportOverallSummary: "Overall Summary",
        reportOverallCompletion: "Overall Completion",
      },
      loadingModeLabels: {
        Agentic: "Agentic",
        Fast: "Fast",
        Balanced: "Balanced",
        Standard: "Standard",
        "Web Search": "Web Search",
      },
      exam: {
        examInstructions: "Exam Instructions",
        questions: "Questions",
        estimatedMarks: "Estimated Marks",
        duration: "Duration",
        helpLevel: "Help Level",
        instructions: "Instructions",
        back: "Back",
        startExam: "Start Exam",
        timeRemaining: "Time Remaining",
        submit: "Submit",
        submitting: "Submitting...",
        navigator: "Navigator",
        multipleChoice: "Multiple Choice",
        openResponse: "Open Response",
        flagged: "Flagged",
        unflag: "Unflag",
        flag: "Flag",
        hint: "Hint",
        showHint: "Show",
        hideHint: "Hide",
        solution: "Solution",
        specificHint: "Specific Hint",
        prev: "Prev",
        next: "Next",
        typeAnswerHere: "Type your answer here...",
        noActiveQuestion: "No active question loaded.",
        youLeftExamWindow: "You left the exam window.",
        resumeExam: "Resume Exam",
        submitExam: "Submit Exam?",
        unansweredQuestions: "unanswered questions",
        flaggedQuestions: "flagged questions",
        submitAnyway: "Submit anyway?",
        cancel: "Cancel",
        confirmSubmit: "Confirm Submit",
        examResults: "Exam Results",
        score: "Score",
        percentage: "Percentage",
        estimatedGrade: "Estimated Grade",
        summary: "Summary",
        redoExam: "Redo Exam",
        exportToDocx: "Export to Docx",
        addToOracleMemory: "Add to Oracle Memory",
        reviewExam: "Review Exam",
        backToResults: "Back to Results",
        yourAnswer: "Your Answer",
        correctAnswer: "Correct Answer",
        feedback: "Feedback",
        correct: "Correct",
        partial: "Partial",
        incorrect: "Incorrect",
        unanswered: "Unanswered",
        noAnswerSubmitted: "No answer submitted.",
        noOfficialAnswer: "No official correct answer was available for this question.",
        resumeExamNotice: "The timer was paused while the exam window was hidden. Acknowledge this notice to resume the exam.",
        questionOf: "Question {current} of {total}",
        youStillHave: "You still have:",
        questionPrefix: "Question",
        noAdditionalFeedback: "No additional feedback.",
        noAnswerSubmittedFeedback: "No answer was submitted for this question.",
        reportTitle: "Exam Result Report",
        reportAnalyticsSummary: "Analytics Summary",
        reportUsedMarkScheme: "Used Mark Scheme",
        yes: "Yes",
        no: "No",
        reportQuestion: "Question",
      },
      examSetup: {
        defaultExamTitle: 'Professional Exam Runtime',
        moduleSupertitle: 'Academic Oracle',
        moduleTitle: 'Professional Exam Module',
        moduleDescription: 'Upload source PDFs, prepare the exam session, and launch the multi-stage runtime without leaving this view.',
        reset: 'Reset',
        questionPaperTitle: 'Question paper',
        questionPaperSubtitle: 'Required. PDF only.',
        questionPaperBadge: 'Core input',
        noQuestionPaperSelected: 'No question paper selected',
        questionPaperLoading: 'Reading and structuring questions...',
        questionPaperLoaded: '{count} question item(s) loaded',
        questionPaperHint: 'Raw content is extracted first, then structured with Gemini',
        chooseQuestionPaper: 'Choose question paper',
        noFileChosen: 'No file chosen',
        markSchemeTitle: 'Mark scheme',
        markSchemeSubtitle: 'Optional. Used for grading priority.',
        markSchemeBadge: 'Optional',
        noMarkSchemeSelected: 'No mark scheme selected',
        markSchemeLoading: 'Reading mark scheme...',
        markSchemeLoaded: 'Attached to the structured exam payload',
        markSchemeHint: 'If missing, grading falls back to model judgment',
        chooseMarkScheme: 'Choose mark scheme',
        sessionSetupTitle: 'Session Setup',
        sessionSetupDescription: 'Prepare the runtime session before entering the instruction and exam stages.',
        durationLabel: 'Duration',
        duration15: '15 min',
        duration30: '30 min',
        duration45: '45 min',
        duration60: '60 min',
        helpLevelLabel: 'Help Level',
        helpLevelNone: 'Level 0 - None',
        helpLevelGeneral: 'Level 1 - General hint',
        helpLevelSpecific: 'Level 2 - Specific hint',
        helpLevelSolution: 'Level 3 - Solution',
        gradingStyleLabel: 'Grading Style',
        gradingStyleDefault: 'Default',
        snapshotTitle: 'Exam Snapshot',
        snapshotFieldTitle: 'Title',
        snapshotPendingTitle: 'Pending question paper',
        snapshotFieldQuestions: 'Questions',
        snapshotFieldMarks: 'Estimated marks',
        snapshotFieldDuration: 'Duration',
        snapshotMinutes: 'minutes',
        snapshotFieldHelpLevel: 'Help level',
        snapshotFieldGradingStyle: 'Grading style',
        continueToInstructions: 'Continue to Instructions',
        errorNoQuestionPaper: 'Upload and structure a question paper before continuing.',
        examRuntimeNotesTitle: 'Exam Runtime Notes',
        examRuntimeNote1: 'Upload a question paper PDF to structure the exam.',
        examRuntimeNote2: 'Upload a mark scheme PDF if you want grading to prioritize official marking guidance.',
        examRuntimeNote3: 'Choose duration and help level before starting.',
        resultSummaryNoQuestions: 'No graded questions are available.',
        resultSummaryNotAnswered: 'Test not answered. No responses were submitted, so this attempt was recorded as 0 out of {total} available marks.',
        resultSummaryStrong: 'Strong performance. You earned {score} out of {total} available marks.',
        resultSummaryCompetent: 'Competent result. You earned {score} out of {total} available marks, with some room to tighten consistency.',
        resultSummaryNeedsReview: 'The runtime is working, but this attempt needs review. You earned {score} out of {total} available marks.',
      },
    },
  },
  fr: {
    greeting:
      "Bienvenue dans l’Oracle Académique Universel. Des examens SAT et IELTS à la recherche universitaire et aux pratiques industrielles, je suis là pour guider votre parcours.\n\nAvant de commencer, comment dois-je vous appeler et quel défi académique abordons-nous aujourd’hui ?",
    shortGreeting:
      "Bienvenue dans l’Oracle Académique Universel. Je suis là pour guider votre parcours académique.",
    tooltips: {
      newChat: "Commencer une nouvelle discussion",
      summary: "Générer le résumé",
      quiz: "Quiz de Maîtrise",
      copyCode: "Copier le code",
      copied: "Copié",
    },
    ui: {
      chat: "Chat",
      jailbreakMessage: "Je suis là pour vous aider avec des sujets académiques. Je ne peux pas suivre des instructions qui me demandent de contourner mes directives — mais je serais ravi de vous aider à étudier, faire des recherches ou apprendre quelque chose de nouveau ! 📚",
      masteryDetected: "Maîtrise détectée !",
      masteryPopupExplain: "Vous avez maîtrisé le sujet. Souhaitez-vous faire un petit quiz pour tester votre compréhension et solidifier vos connaissances ?",
      masteryPopupYes: "Oui, faisons-le !",
      masteryPopuplLater: "Peut-être plus tard",
      quizConfigTitle: "Configuration du quiz",
      difficultyLevel: "Niveau de difficulté",
      difficultyOptions: ["Fondamental", "Intermédiaire", "Avancé"],
      numberOfQuestions: "Nombre de questions: {count}",
      mixLabel: "Mix : {mcq}% QCM / {open}% Ouvert",
      startAssessment: "Commencer l'évaluation",
      generatingAssessment: "Génération de l'évaluation personnalisée...",
      failedToGenerateQuiz: "Échec de la génération du quiz. Veuillez réessayer.",
      mcqIncorrect: "Incorrect. La bonne réponse est {answer}. {explanation}",
      questionOf: "Question {current} sur {total}",
      answerPlaceholder: "Tapez votre réponse ici...",
      pressEnter: "Appuyez sur Entrée pour soumettre",
      aiGrading: "L'IA évalue votre réponse...",
      correctExclaim: "Correct !",
      notQuite: "Pas tout à fait correct",
      explainContext: "Je fais un quiz sur notre sujet précédent.\nQuestion: \"{question}\"\nMa réponse: \"{answer}\"\nRésultat: {result}\nRetour reçu: \"{feedback}\"\n\nPeux-tu expliquer ce concept plus en détail ?",
      quizSummary: "Quiz terminé. Score : {score}/{total}. Difficulté : {level}.",
      chatTooShortForQuiz: "Historique de discussion ou mémoire de session insuffisant pour générer un quiz.",
      chooseTopic: "Choisir un sujet",
      chooseTopicPlaceholder: "Sélectionnez un sujet suivi",
      chooseTopicRequired: "Choisissez un sujet avant de démarrer le quiz.",
      noQuizTopicsAvailable: "Aucun sujet suivi avec des données exploitables n'est encore disponible.",
      updatingQuizConfig: "Mise a jour...",
      explainSelectionButton: "Expliquer davantage",
      followUpSelectionButton: "Suivi",
      explainSelectionPrompt: "Expliquez cette partie plus clairement et simplement :\n\n\"{selection}\"",
      followUpSelectionPrompt: "Partie selectionnee :\n\"{selection}\"\n\nQuestion de suivi :\n{message}",
      askExplain: "Demander à l'Oracle d'expliquer dans le chat",
      seeResults: "Voir les résultats",
      nextQuestion: "Question suivante",
      assessmentComplete: "Évaluation terminée",
      correctLabel: "Correct",
      needsReview: "À revoir",
      addToMemory: "Ajouter les résultats à la mémoire de session",
      takeAnother: "Refaire un quiz",
      memoryAdded: "Résultats ajoutés à votre mémoire de session ! Ils seront inclus dans votre prochain document de résumé.",

      profile: "Profil",
      logOut: "Se déconnecter",
      noExistingChat: "Pas de discussion existante ou de profil à réinitialiser.",
      notEnoughHistory: "Historique de discussion ou profil étudiant insuffisant pour générer un résumé significatif.",
      apiKeyExpired: "Votre clé API a expiré/est malformée. Veuillez vérifier à nouveau.",
      rateLimitError: "Vous avez atteint la limite de débit de la clé API.",
      rateLimitRetry: "Réessayez après {delay}",
      rateLimitSupport: "Soutenez le projet pour déverrouiller des limites plus élevées : Buy Me A Coffee. Merci !",
      genericError: "Une erreur s'est produite lors du traitement de votre demande. Veuillez réessayer.",
      retryButton: "Réessayer",
      freeSessionLimit: "Limite de session gratuite atteinte 🚧\n\nCréez votre propre clé API pour un accès illimité dans la page de profil,\nou soutenez-nous sur Buy Me A Coffee pour garder Oracle en bon état !",
      freeSessionSupport: "ou soutenez-nous sur Buy Me A Coffee pour garder Oracle en bon état !",
      pleaseLogin: "Veuillez vous connecter pour générer un document de résumé.",
      pleaseWait: "Veuillez attendre la fin de l'opération en cours.",
      failedToGenerateSummary: "Échec de la génération du résumé 😬",
      oracleOnline: "Oracle En ligne",
      thinking: "Réflexion en cours...",
      syncError: "Erreur de synchronisation",
      oracleStatus: "Statut d'Oracle",
      language: "Langue",
      settings: "Paramètres",
      email: "E-mail",
      apiKey: "Clé API",
      editApiKey: "Modifier la clé API",
      addApiKey: "Ajouter une clé API",
      save: "Enregistrer",
      noApiKeyAdded: "Aucune clé API ajoutée. Cliquez sur le bouton plus pour en ajouter une.",
      howToGetApiKey: "Comment obtenir une clé API ?",
      modelAdaptation: "Adaptation du modèle",
      modelAdaptationOff: "Désactivé",
      modelAdaptationStandard: "Standard",
      modelAdaptationAlways: "Toujours",
      modelAdaptationTooltip: "Choisissez quand activer le routage adaptatif du modèle. **Toujours** : course pour la réponse la plus rapide. **Standard** : s'active pendant les périodes de trafic élevé. **Désactivé** : désactivé.",
      invalidApiKeyFormat: "Format de clé API invalide.",
      failedToLoadApiKey: "Échec du chargement de la clé API.",
      failedToSaveApiKey: "Échec de l'enregistrement de la clé API.",
      noApiKeySetMessage: "Aucune clé API définie",
      wipeProfile: "Voulez-vous également effacer votre profil étudiant ? Cliquez sur « Annuler » pour le conserver.",
      wipeProfileConfirm: "Effacer le profil",
      confirmReset: "Êtes-vous sûr de vouloir réinitialiser le chat ?",
      uploadFile: "Télécharger depuis l'ordinateur",
      placeholderFull: "Entrez votre question académique ici…",
      placeholderMedium: "Entrez votre question académique…",
      placeholderShort: "Posez une question…",
      disclaimer: "Oracle Académique peut générer des informations inexactes ou incomplètes. Vérifiez tous les résultats indépendamment avant de vous y fier.",
      webSearchQuotaReached: "Vous avez atteint le quota de recherche Web. Le modèle reviendra à des connaissances antérieures à 2024. Désolé pour le désagrément !",
      webSearchFailedMessage: "La recherche Web requise pour cette demande n'a pas pu être effectuée. La génération de réponse a été interrompue afin d'éviter l'utilisation d'informations en direct incomplètes. Veuillez réessayer.",
      webSearchQuotaReachedMessage: "Cette demande nécessite une recherche Web, mais le quota de recherche Web est atteint. La génération de réponse a été interrompue afin d'éviter l'utilisation d'informations en direct incomplètes.",
      dashboard: {
        title: "Tableau d'apprentissage",
        subtitle: "Vue d'ensemble de la session",
        description: "Suivez le profil de l'apprenant, la progression des sujets, les points faibles et les prochaines cibles d'entraînement en un seul endroit.",
        preparingSummary: "Préparation du résumé de session...",
        downloadSummary: "Télécharger le résumé de session",
        loadingMessages: ["Presque prêt", "Création des analyses", "Collecte des données", "Préparation du résumé"],
        userData: "Données utilisateur",
        name: "Nom",
        defaultStudentName: "Étudiant",
        academicLevel: "Niveau académique",
        academicLevelFallback: "Pas encore défini",
        currentTopic: "Sujet actuel",
        currentTopicFallback: "Aucun sujet suivi pour le moment",
        learningLevel: "Niveau d'apprentissage",
        learningLevelFallback: "Encore en cours d'inférence",
        learningEfficiency: "Efficacité d'apprentissage",
        efficiencyShort: "Efficacité",
        topicsLearned: "Sujets appris",
        topicsMastered: "Sujets maîtrisés",
        quizzesDone: "Quiz effectués",
        strengths: "Forces identifiées",
        strengthsEmpty: "Les signes de points forts apparaîtront ici à mesure qu'Oracle recueille plus d'indices de session.",
        weaknesses: "Faiblesses à améliorer",
        weaknessesEmpty: "Les axes d'amélioration apparaîtront ici après davantage de suivi de sujets ou de retours de quiz.",
        learningTopics: "Sujets d'apprentissage",
        learningTopicsDescription: "Développez chaque sujet pour revoir les notes suivies, l'activité de quiz et la meilleure prochaine direction d'entraînement.",
        sessionTurnsTracked: "{count} tours de session suivis",
        noActiveHistory: "Aucun historique actif pour le moment",
        topicMeta: "{status} • {quizzes} quiz • {accuracy}",
        topicMastered: "Maîtrisé",
        topicInProgress: "En cours d'apprentissage",
        accuracyPending: "Précision en attente",
        openDetails: "Ouvrir les détails",
        keyNotes: "Notes clés",
        formulasAndCues: "Formules / Indices de rappel",
        noFormulasYet: "Aucune formule spécifique ni indice de correction n'a encore été capturé pour ce sujet.",
        quizAttemptsRecorded: "{count} tentative(s) de quiz enregistrée(s).",
        recommendedNextFocus: "Prochaine priorité / pratique recommandée",
        noTopicsYet: "Commencez une discussion ou terminez un quiz pour remplir le tableau de bord avec les sujets suivis.",
        currentSummary: "Résumé actuel",
        currentSummaryFallback: "Votre résumé d'apprentissage actuel apparaîtra ici une fois qu'Oracle aura construit une mémoire d'apprentissage suffisamment durable.",
        deleteTopic: "Supprimer la mémoire du sujet",
        deleteTopicConfirm: "Supprimer la mémoire enregistrée pour {topic} ? Cela retire uniquement cette entrée de sujet de la mémoire Oracle.",
        seeMore: "Voir plus",
        seeLess: "Voir moins",
        confidenceLevel: "Niveau de confiance",
        masteryStatus: "Statut de maîtrise",
        masteryStatusMastered: "Maîtrisé",
        masteryStatusInProgress: "En cours",
        currentAccuracy: "Précision actuelle",
        bestPracticeMode: "Meilleur mode de pratique",
        recommendedFocusMastered: "Appliquez ce sujet à des questions mixtes ou à des exercices proches du réel.",
        recommendedFocusNeedsFeynman: "Ralentissez et reformulez le concept avec vos propres mots avant le prochain quiz.",
        recommendedFocusLowAccuracy: "Revoyez les étapes faibles et faites une série d'exercices ciblés.",
        recommendedFocusDefault: "Continuez à renforcer avec une courte pratique de rappel et un exercice plus difficile.",
        reportDocTitle: "Oracle Académique — Résumé de session",
        reportLevel: "Niveau",
        reportFocus: "Priorité",
        reportConfidence: "Confiance",
        reportCognitionLevel: "Niveau de cognition",
        reportInterests: "Intérêts",
        reportSessionOverview: "Vue d'ensemble de la session",
        reportTopicsCovered: "Sujets abordés",
        reportOverallAccuracy: "Précision globale",
        reportAdaptiveInsights: "Analyses adaptatives",
        reportStudyStyle: "Style d'étude",
        reportToneRecommendation: "Recommandation de ton",
        reportQuestionStyleRecommendation: "Recommandation de style de question",
        reportTopicTag: "Étiquette du sujet",
        reportCompletion: "Complétion",
        reportMastered: "Maîtrisé",
        reportNeedsFeynman: "Nécessite un renforcement Feynman",
        reportMistakeLog: "Journal des erreurs",
        reportQuizPerformance: "Performance au quiz",
        reportFormulas: "Formules",
        reportTheories: "Théories",
        reportKeyTakeaways: "Points clés",
        reportPracticalApplications: "Applications pratiques",
        reportOverallSummary: "Résumé global",
        reportOverallCompletion: "Complétion globale",
      },
      loadingModeLabels: {
        Agentic: "Agentique",
        Fast: "Rapide",
        Balanced: "Équilibré",
        Standard: "Standard",
        "Web Search": "Recherche Web",
      },
      exam: {
        examInstructions: "Instructions de l'examen",
        questions: "Questions",
        estimatedMarks: "Points estimés",
        duration: "Durée",
        helpLevel: "Niveau d'aide",
        instructions: "Instructions",
        back: "Retour",
        startExam: "Commencer l'examen",
        timeRemaining: "Temps restant",
        submit: "Soumettre",
        submitting: "Soumission...",
        navigator: "Navigateur",
        multipleChoice: "Choix multiple",
        openResponse: "Réponse ouverte",
        flagged: "Signalé",
        unflag: "Retirer le signal",
        flag: "Signaler",
        hint: "Indice",
        showHint: "Afficher",
        hideHint: "Masquer",
        solution: "Solution",
        specificHint: "Indice spécifique",
        prev: "Préc",
        next: "Suiv",
        typeAnswerHere: "Tapez votre réponse ici...",
        noActiveQuestion: "Aucune question active chargée.",
        youLeftExamWindow: "Vous avez quitté la fenêtre d'examen.",
        resumeExam: "Reprendre l'examen",
        submitExam: "Soumettre l'examen ?",
        unansweredQuestions: "questions sans réponse",
        flaggedQuestions: "questions signalées",
        submitAnyway: "Soumettre quand même ?",
        cancel: "Annuler",
        confirmSubmit: "Confirmer la soumission",
        examResults: "Résultats de l'examen",
        score: "Score",
        percentage: "Pourcentage",
        estimatedGrade: "Note estimée",
        summary: "Résumé",
        redoExam: "Refaire l'examen",
        exportToDocx: "Exporter en Docx",
        addToOracleMemory: "Ajouter à la mémoire Oracle",
        reviewExam: "Réviser l'examen",
        backToResults: "Retour aux résultats",
        yourAnswer: "Votre réponse",
        correctAnswer: "Bonne réponse",
        feedback: "Retour",
        correct: "Correct",
        partial: "Partiel",
        incorrect: "Incorrect",
        unanswered: "Sans réponse",
        noAnswerSubmitted: "Aucune réponse soumise.",
        noOfficialAnswer: "Aucune réponse officielle disponible pour cette question.",
        resumeExamNotice: "Le minuteur a été mis en pause pendant que la fenêtre de l'examen était cachée. Acknowledge this notice to resume the exam.",
        questionOf: "Question {current} sur {total}",
        youStillHave: "Il vous reste encore :",
        questionPrefix: "Question",
        noAdditionalFeedback: "Aucun retour supplémentaire.",
        noAnswerSubmittedFeedback: "Aucune réponse n'a été soumise pour cette question.",
        reportTitle: "Rapport de résultat d'examen",
        reportAnalyticsSummary: "Résumé des analyses",
        reportUsedMarkScheme: "Barème utilisé",
        yes: "Oui",
        no: "Non",
        reportQuestion: "Question",
      },
      examSetup: {
        defaultExamTitle: 'Examen professionnel',
        moduleSupertitle: 'Oracle Académique',
        moduleTitle: 'Module d\'examen professionnel',
        moduleDescription: 'Téléchargez les PDF sources, préparez la session d\'examen et lancez l\'environnement multi-étapes sans quitter cette vue.',
        reset: 'Réinitialiser',
        questionPaperTitle: 'Sujet d\'examen',
        questionPaperSubtitle: 'Obligatoire. PDF uniquement.',
        questionPaperBadge: 'Entrée principale',
        noQuestionPaperSelected: 'Aucun sujet sélectionné',
        questionPaperLoading: 'Lecture et structuration des questions...',
        questionPaperLoaded: '{count} question(s) chargée(s)',
        questionPaperHint: 'Le contenu brut est extrait, puis structuré avec Gemini',
        chooseQuestionPaper: 'Choisir le sujet',
        noFileChosen: 'Aucun fichier choisi',
        markSchemeTitle: 'Barème de correction',
        markSchemeSubtitle: 'Optionnel. Utilisé pour la priorité de notation.',
        markSchemeBadge: 'Optionnel',
        noMarkSchemeSelected: 'Aucun barème sélectionné',
        markSchemeLoading: 'Lecture du barème...',
        markSchemeLoaded: 'Associé à la session d\'examen structurée',
        markSchemeHint: 'Sans barème, la notation repose sur le jugement du modèle',
        chooseMarkScheme: 'Choisir le barème',
        sessionSetupTitle: 'Configuration de la session',
        sessionSetupDescription: 'Préparez la session avant d\'accéder aux étapes d\'instruction et d\'examen.',
        durationLabel: 'Durée',
        duration15: '15 min',
        duration30: '30 min',
        duration45: '45 min',
        duration60: '60 min',
        helpLevelLabel: 'Niveau d\'aide',
        helpLevelNone: 'Niveau 0 - Aucun',
        helpLevelGeneral: 'Niveau 1 - Indice général',
        helpLevelSpecific: 'Niveau 2 - Indice spécifique',
        helpLevelSolution: 'Niveau 3 - Solution',
        gradingStyleLabel: 'Style de notation',
        gradingStyleDefault: 'Par défaut',
        snapshotTitle: 'Aperçu de l\'examen',
        snapshotFieldTitle: 'Titre',
        snapshotPendingTitle: 'En attente du sujet',
        snapshotFieldQuestions: 'Questions',
        snapshotFieldMarks: 'Points estimés',
        snapshotFieldDuration: 'Durée',
        snapshotMinutes: 'minutes',
        snapshotFieldHelpLevel: 'Niveau d\'aide',
        snapshotFieldGradingStyle: 'Style de notation',
        continueToInstructions: 'Passer aux instructions',
        errorNoQuestionPaper: 'Veuillez charger et structurer un sujet avant de continuer.',
        examRuntimeNotesTitle: 'Notes sur l\'environnement d\'examen',
        examRuntimeNote1: 'Téléchargez un PDF de sujet pour structurer l\'examen.',
        examRuntimeNote2: 'Téléchargez un PDF de barème si vous souhaitez que la notation privilégie les critères officiels.',
        examRuntimeNote3: 'Choisissez la durée et le niveau d\'aide avant de commencer.',
        resultSummaryNoQuestions: 'Aucune question notée n\'est disponible.',
        resultSummaryNotAnswered: 'Examen non répondu. Aucune réponse n\'a été soumise, cette tentative est enregistrée comme 0 sur {total} points disponibles.',
        resultSummaryStrong: 'Excellente performance. Vous avez obtenu {score} sur {total} points disponibles.',
        resultSummaryCompetent: 'Résultat compétent. Vous avez obtenu {score} sur {total} points disponibles, avec quelques marges de progression.',
        resultSummaryNeedsReview: 'L\'environnement fonctionne, mais cette tentative nécessite une révision. Vous avez obtenu {score} sur {total} points disponibles.',
      },
    },
  },
  es: {
    greeting:
      "Bienvenido al Oráculo Académico Universal. Desde SAT e IELTS hasta investigación universitaria y prácticas industriales, estoy aquí para guiar tu camino.\n\nAntes de comenzar, ¿cómo debo llamarte y qué desafío académico abordamos hoy?",
    shortGreeting:
      "Bienvenido al Oráculo Académico Universal. Estoy aquí para guiar tu camino académico.",
    tooltips: {
      newChat: "Iniciar nueva conversación",
      summary: "Generar resumen",
      quiz: "Cuestionario de Dominio",
      copyCode: "Copiar código",
      copied: "Copiado",
    },
    ui: {
      chat: "Chat",
      jailbreakMessage: "Estoy aquí para ayudarte con temas académicos. No puedo seguir instrucciones que me pidan saltarme mis directrices — ¡pero estaré encantado de ayudarte a estudiar, investigar o aprender algo nuevo! 📚",
      masteryDetected: "¡Dominio detectado!",
      masteryPopupExplain: "Has dominado el tema. ¿Te gustaría hacer un pequeño cuestionario para probar tu comprensión y solidificar tu conocimiento?",
      masteryPopupYes: "¡Sí, hagámoslo!",
      masteryPopuplLater: "Quizás más tarde",
      quizConfigTitle: "Configuración del cuestionario",
      difficultyLevel: "Nivel de dificultad",
      difficultyOptions: ["Fundamental", "Intermedio", "Avanzado"],
      numberOfQuestions: "Número de preguntas: {count}",
      mixLabel: "Mezcla: {mcq}% MCQ / {open}% Abierta",
      startAssessment: "Iniciar evaluación",
      generatingAssessment: "Generando tu evaluación personalizada...",
      failedToGenerateQuiz: "Error al generar el cuestionario. Por favor intenta de nuevo.",
      mcqIncorrect: "Incorrecto. La respuesta correcta es {answer}. {explanation}",
      questionOf: "Pregunta {current} de {total}",
      answerPlaceholder: "Escribe tu respuesta aquí...",
      pressEnter: "Presiona Enter para enviar",
      aiGrading: "La IA está calificando tu respuesta...",
      correctExclaim: "¡Correcto!",
      notQuite: "No es del todo correcto",
      explainContext: "Estoy haciendo un cuestionario sobre nuestro tema anterior.\nPregunta: \"{question}\"\nMi respuesta: \"{answer}\"\nResultado: {result}\nRetroalimentación recibida: \"{feedback}\"\n\n¿Puedes explicar este concepto con más detalle?",
      quizSummary: "Cuestionario completado. Puntuación: {score}/{total}. Dificultad: {level}.",
      chatTooShortForQuiz: "Historial de chat o memoria de sesión insuficiente para generar un cuestionario.",
      chooseTopic: "Elegir tema",
      chooseTopicPlaceholder: "Selecciona un tema registrado",
      chooseTopicRequired: "Elige un tema antes de iniciar el cuestionario.",
      noQuizTopicsAvailable: "Todavía no hay temas registrados con datos utilizables.",
      updatingQuizConfig: "Actualizando configuracion...",
      explainSelectionButton: "Explicar más",
      followUpSelectionButton: "Continuar",
      explainSelectionPrompt: "Explica esta parte con más claridad y sencillez:\n\n\"{selection}\"",
      followUpSelectionPrompt: "Parte seleccionada:\n\"{selection}\"\n\nPregunta de seguimiento:\n{message}",
      askExplain: "Pedirle al Oráculo que explique en el chat",
      seeResults: "Ver resultados",
      nextQuestion: "Siguiente pregunta",
      assessmentComplete: "Evaluación completada",
      correctLabel: "Correcto",
      needsReview: "Necesita repaso",
      addToMemory: "Agregar resultados a la memoria de sesión",
      takeAnother: "Hacer otro cuestionario",
      memoryAdded: "¡Resultados agregados a tu memoria de sesión! Se incluirán en tu próximo documento de resumen.",

      profile: "Perfil",
      logOut: "Cerrar sesión",
      noExistingChat: "No hay chat o perfil existente para reiniciar.",
      notEnoughHistory: "Historial de chat o perfil de estudiante insuficiente para generar un resumen significativo.",
      apiKeyExpired: "Tu clave API ha expirado/está malformada. Por favor revisa de nuevo.",
      rateLimitError: "Has alcanzado el límite de velocidad de la clave API.",
      rateLimitRetry: "Intenta de nuevo después de {delay}",
      rateLimitSupport: "Apoya el proyecto para desbloquear límites más altos: Buy Me A Coffee. ¡Gracias!",
      genericError: "Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.",
      retryButton: "Reintentar",
      freeSessionLimit: "Límite de sesión gratuita alcanzado 🚧\n\nCrea tu propia clave API para acceso ilimitado en la página de Perfil,\no apoya en Buy Me A Coffee para mantener Oracle funcionando sin problemas!",
      freeSessionSupport: "o apoya en Buy Me A Coffee para mantener Oracle funcionando sin problemas!",
      pleaseLogin: "Por favor inicia sesión para generar el documento de resumen.",
      pleaseWait: "Por favor espera a que se complete la operación actual.",
      failedToGenerateSummary: "Error al generar resumen 😬",
      oracleOnline: "Oracle En línea",
      thinking: "Pensando...",
      syncError: "Error de sincronización",
      oracleStatus: "Estado de Oracle",
      language: "Idioma",
      settings: "Ajustes",
      email: "Correo electrónico",
      apiKey: "Clave API",
      editApiKey: "Editar clave API",
      addApiKey: "Agregar clave API",
      save: "Guardar",
      noApiKeyAdded: "Ninguna clave API añadida. Haz clic en el botón más para agregar una.",
      howToGetApiKey: "¿Cómo obtener una clave API?",
      modelAdaptation: "Adaptación del modelo",
      modelAdaptationOff: "Desactivado",
      modelAdaptationStandard: "Estándar",
      modelAdaptationAlways: "Siempre",
      modelAdaptationTooltip: "Elige cuándo habilitar el enrutamiento adaptativo del modelo. **Siempre**: carrera para la respuesta más rápida. **Estándar**: se activa durante períodos de alto tráfico. **Desactivado**: deshabilitado.",
      invalidApiKeyFormat: "Formato de clave API inválido.",
      failedToLoadApiKey: "Error al cargar la clave API.",
      failedToSaveApiKey: "Error al guardar la clave API.",
      noApiKeySetMessage: "Sin clave API establecida",
      wipeProfile: "¿Deseas borrar también tu perfil de estudiante? Haz clic en 'Cancelar' para mantenerlo.",
      wipeProfileConfirm: "Borrar perfil",
      confirmReset: "¿Estás seguro de que deseas reiniciar el chat?",
      uploadFile: "Cargar desde la computadora",
      placeholderFull: "Escribe tu pregunta académica aquí…",
      placeholderMedium: "Escribe tu pregunta académica…",
      placeholderShort: "Haz una pregunta…",
      disclaimer: "Oracle Académico puede generar información inexacta o incompleta. Verifica todos los resultados de forma independiente antes de confiar en ellos.",
      webSearchQuotaReached: "Has alcanzado la cuota de búsqueda web. El modelo volverá a usar conocimiento anterior a 2024. ¡Perdón por las molestias!",
      webSearchFailedMessage: "No se pudo completar la búsqueda web requerida para esta solicitud. La generación de la respuesta se ha detenido para evitar el uso de información en vivo incompleta. Inténtalo de nuevo.",
      webSearchQuotaReachedMessage: "Esta solicitud requiere búsqueda web, pero se alcanzó la cuota de búsqueda web. La generación de la respuesta se ha detenido para evitar el uso de información en vivo incompleta.",
      dashboard: {
        title: "Panel de aprendizaje",
        subtitle: "Resumen de la sesión",
        description: "Sigue el perfil del estudiante, el progreso por temas, los puntos débiles y los próximos objetivos de práctica en un solo lugar.",
        preparingSummary: "Preparando el resumen de la sesión...",
        downloadSummary: "Descargar resumen de la sesión",
        loadingMessages: ["Ya casi", "Creando análisis", "Reuniendo datos", "Preparando resumen"],
        userData: "Datos del usuario",
        name: "Nombre",
        defaultStudentName: "Estudiante",
        academicLevel: "Nivel académico",
        academicLevelFallback: "Aún no definido",
        currentTopic: "Tema actual",
        currentTopicFallback: "Todavía no hay un tema registrado",
        learningLevel: "Nivel de aprendizaje",
        learningLevelFallback: "Todavía se está infiriendo",
        learningEfficiency: "Eficiencia de aprendizaje",
        efficiencyShort: "Eficiencia",
        topicsLearned: "Temas aprendidos",
        topicsMastered: "Temas dominados",
        quizzesDone: "Cuestionarios realizados",
        strengths: "Fortalezas identificadas",
        strengthsEmpty: "Las señales de fortaleza aparecerán aquí a medida que Oracle reúna más evidencia de la sesión.",
        weaknesses: "Debilidades a mejorar",
        weaknessesEmpty: "Las áreas de mejora aparecerán aquí después de más seguimiento de temas o retroalimentación de cuestionarios.",
        learningTopics: "Temas de aprendizaje",
        learningTopicsDescription: "Expande cada tema para revisar notas registradas, actividad de cuestionarios y la mejor siguiente dirección de práctica.",
        sessionTurnsTracked: "{count} turnos de sesión registrados",
        noActiveHistory: "No hay historial activo todavía",
        topicMeta: "{status} • {quizzes} cuestionarios • {accuracy}",
        topicMastered: "Dominado",
        topicInProgress: "Aprendiendo actualmente",
        accuracyPending: "Precisión pendiente",
        openDetails: "Abrir detalles",
        keyNotes: "Notas clave",
        formulasAndCues: "Fórmulas / Pistas de recuerdo",
        noFormulasYet: "Aún no se han registrado fórmulas específicas ni pistas de corrección para este tema.",
        quizAttemptsRecorded: "{count} intento(s) de cuestionario registrado(s).",
        recommendedNextFocus: "Siguiente enfoque / práctica recomendada",
        noTopicsYet: "Inicia un chat o completa un cuestionario para llenar el panel con temas de aprendizaje registrados.",
        currentSummary: "Resumen actual",
        currentSummaryFallback: "Tu resumen de aprendizaje actual aparecerá aquí una vez que Oracle haya construido memoria de aprendizaje suficientemente duradera.",
        deleteTopic: "Eliminar memoria del tema",
        deleteTopicConfirm: "¿Eliminar la memoria guardada de {topic}? Esto solo quita esa entrada de tema de la memoria de Oracle.",
        seeMore: "Ver más",
        seeLess: "Ver menos",
        confidenceLevel: "Nivel de confianza",
        masteryStatus: "Estado de dominio",
        masteryStatusMastered: "Dominado",
        masteryStatusInProgress: "En progreso",
        currentAccuracy: "Precisión actual",
        bestPracticeMode: "Mejor modo de práctica",
        recommendedFocusMastered: "Aplica este tema a preguntas mixtas o a ejercicios del mundo real.",
        recommendedFocusNeedsFeynman: "Baja el ritmo y reformula el concepto con tus propias palabras antes del próximo cuestionario.",
        recommendedFocusLowAccuracy: "Revisa los pasos débiles y haz una ronda de práctica enfocada.",
        recommendedFocusDefault: "Sigue reforzando con práctica breve de recuperación y un problema más difícil.",
        reportDocTitle: "Oráculo Académico — Resumen de la sesión",
        reportLevel: "Nivel",
        reportFocus: "Enfoque",
        reportConfidence: "Confianza",
        reportCognitionLevel: "Nivel de cognición",
        reportInterests: "Intereses",
        reportSessionOverview: "Resumen de la sesión",
        reportTopicsCovered: "Temas cubiertos",
        reportOverallAccuracy: "Precisión general",
        reportAdaptiveInsights: "Análisis adaptativos",
        reportStudyStyle: "Estilo de estudio",
        reportToneRecommendation: "Recomendación de tono",
        reportQuestionStyleRecommendation: "Recomendación de estilo de pregunta",
        reportTopicTag: "Etiqueta de tema",
        reportCompletion: "Cumplimiento",
        reportMastered: "Dominado",
        reportNeedsFeynman: "Necesita refuerzo Feynman",
        reportMistakeLog: "Registro de errores",
        reportQuizPerformance: "Rendimiento en cuestionarios",
        reportFormulas: "Fórmulas",
        reportTheories: "Teorías",
        reportKeyTakeaways: "Puntos clave",
        reportPracticalApplications: "Aplicaciones prácticas",
        reportOverallSummary: "Resumen general",
        reportOverallCompletion: "Cumplimiento general",
      },
      loadingModeLabels: {
        Agentic: "Agéntico",
        Fast: "Rápido",
        Balanced: "Equilibrado",
        Standard: "Estándar",
        "Web Search": "Búsqueda web",
      },
      exam: {
        examInstructions: "Instrucciones del examen",
        questions: "Preguntas",
        estimatedMarks: "Puntos estimados",
        duration: "Duración",
        helpLevel: "Nivel de ayuda",
        instructions: "Instrucciones",
        back: "Atrás",
        startExam: "Iniciar examen",
        timeRemaining: "Tiempo restante",
        submit: "Enviar",
        submitting: "Enviando...",
        navigator: "Navegador",
        multipleChoice: "Opción múltiple",
        openResponse: "Respuesta abierta",
        flagged: "Marcado",
        unflag: "Desmarcar",
        flag: "Marcar",
        hint: "Pista",
        showHint: "Mostrar",
        hideHint: "Ocultar",
        solution: "Solución",
        specificHint: "Pista específica",
        prev: "Ant",
        next: "Sig",
        typeAnswerHere: "Escribe tu respuesta aquí...",
        noActiveQuestion: "No hay pregunta activa cargada.",
        youLeftExamWindow: "Saliste de la ventana del examen.",
        resumeExam: "Reanudar examen",
        submitExam: "¿Enviar examen?",
        unansweredQuestions: "preguntas sin responder",
        flaggedQuestions: "preguntas marcadas",
        submitAnyway: "¿Enviar de todos modos?",
        cancel: "Cancelar",
        confirmSubmit: "Confirmar envío",
        examResults: "Resultados del examen",
        score: "Puntuación",
        percentage: "Porcentaje",
        estimatedGrade: "Calificación estimada",
        summary: "Resumen",
        redoExam: "Repetir examen",
        exportToDocx: "Exportar a Docx",
        addToOracleMemory: "Agregar a memoria Oracle",
        reviewExam: "Revisar examen",
        backToResults: "Volver a resultados",
        yourAnswer: "Tu respuesta",
        correctAnswer: "Respuesta correcta",
        feedback: "Retroalimentación",
        correct: "Correcto",
        partial: "Parcial",
        incorrect: "Incorrecto",
        unanswered: "Sin responder",
        noAnswerSubmitted: "No se envió ninguna respuesta.",
        noOfficialAnswer: "No había respuesta oficial disponible para esta pregunta.",
        resumeExamNotice: "El temporizador se pausó mientras la ventana del examen estaba oculta. Reconoce este aviso para reanudar el examen.",
        questionOf: "Pregunta {current} de {total}",
        youStillHave: "Aún te queda:",
        questionPrefix: "Pregunta",
        noAdditionalFeedback: "No hay retroalimentación adicional.",
        noAnswerSubmittedFeedback: "No se envió ninguna respuesta para esta pregunta.",
        reportTitle: "Informe de resultados del examen",
        reportAnalyticsSummary: "Resumen analítico",
        reportUsedMarkScheme: "Esquema de puntos usado",
        yes: "Sí",
        no: "No",
        reportQuestion: "Pregunta",
      },
      examSetup: {
        defaultExamTitle: 'Examen profesional',
        moduleSupertitle: 'Oráculo Académico',
        moduleTitle: 'Módulo de examen profesional',
        moduleDescription: 'Sube los PDFs fuente, prepara la sesión de examen y lanza el entorno de múltiples etapas sin salir de esta vista.',
        reset: 'Restablecer',
        questionPaperTitle: 'Papel de preguntas',
        questionPaperSubtitle: 'Obligatorio. Solo PDF.',
        questionPaperBadge: 'Entrada principal',
        noQuestionPaperSelected: 'Ningún papel de preguntas seleccionado',
        questionPaperLoading: 'Leyendo y estructurando preguntas...',
        questionPaperLoaded: '{count} pregunta(s) cargada(s)',
        questionPaperHint: 'El contenido bruto se extrae primero, luego se estructura con Gemini',
        chooseQuestionPaper: 'Elegir papel de preguntas',
        noFileChosen: 'Ningún archivo elegido',
        markSchemeTitle: 'Esquema de puntuación',
        markSchemeSubtitle: 'Opcional. Usado para prioridad de calificación.',
        markSchemeBadge: 'Opcional',
        noMarkSchemeSelected: 'Ningún esquema de puntuación seleccionado',
        markSchemeLoading: 'Leyendo esquema de puntuación...',
        markSchemeLoaded: 'Adjunto a la sesión de examen estructurada',
        markSchemeHint: 'Sin esquema, la calificación usa el juicio del modelo',
        chooseMarkScheme: 'Elegir esquema de puntuación',
        sessionSetupTitle: 'Configuración de sesión',
        sessionSetupDescription: 'Prepara la sesión antes de acceder a las etapas de instrucción y examen.',
        durationLabel: 'Duración',
        duration15: '15 min',
        duration30: '30 min',
        duration45: '45 min',
        duration60: '60 min',
        helpLevelLabel: 'Nivel de ayuda',
        helpLevelNone: 'Nivel 0 - Ninguno',
        helpLevelGeneral: 'Nivel 1 - Pista general',
        helpLevelSpecific: 'Nivel 2 - Pista específica',
        helpLevelSolution: 'Nivel 3 - Solución',
        gradingStyleLabel: 'Estilo de calificación',
        gradingStyleDefault: 'Predeterminado',
        snapshotTitle: 'Resumen del examen',
        snapshotFieldTitle: 'Título',
        snapshotPendingTitle: 'Esperando papel de preguntas',
        snapshotFieldQuestions: 'Preguntas',
        snapshotFieldMarks: 'Puntos estimados',
        snapshotFieldDuration: 'Duración',
        snapshotMinutes: 'minutos',
        snapshotFieldHelpLevel: 'Nivel de ayuda',
        snapshotFieldGradingStyle: 'Estilo de calificación',
        continueToInstructions: 'Continuar a instrucciones',
        errorNoQuestionPaper: 'Sube y estructura un papel de preguntas antes de continuar.',
        examRuntimeNotesTitle: 'Notas del entorno de examen',
        examRuntimeNote1: 'Sube un PDF de preguntas para estructurar el examen.',
        examRuntimeNote2: 'Sube un PDF de esquema de puntuación si quieres que la calificación priorice las guías oficiales.',
        examRuntimeNote3: 'Elige la duración y el nivel de ayuda antes de comenzar.',
        resultSummaryNoQuestions: 'No hay preguntas calificadas disponibles.',
        resultSummaryNotAnswered: 'Examen sin responder. No se enviaron respuestas, este intento se registró como 0 de {total} puntos disponibles.',
        resultSummaryStrong: 'Rendimiento sólido. Obtuviste {score} de {total} puntos disponibles.',
        resultSummaryCompetent: 'Resultado competente. Obtuviste {score} de {total} puntos disponibles, con algo de margen para mejorar la consistencia.',
        resultSummaryNeedsReview: 'El entorno funciona, pero este intento necesita revisión. Obtuviste {score} de {total} puntos disponibles.',
      },
    },
  },
  vi: {
    greeting:
      "Chào mừng bạn đến với Universal Academic Oracle. Từ SAT, IELTS đến nghiên cứu đại học và thực tiễn công nghiệp, tôi sẽ đồng hành cùng bạn.\n\nTrước khi bắt đầu, tôi nên gọi bạn là gì và thử thách học thuật hôm nay là gì?",
    shortGreeting:
      "Chào mừng bạn đến với Universal Academic Oracle. Tôi sẵn sàng hỗ trợ hành trình học tập của bạn.",
    tooltips: {
      newChat: "Bắt đầu cuộc trò chuyện mới",
      summary: "Tạo tài liệu tổng kết",
      quiz: "Bài kiểm tra thành thạo",
      copyCode: "Sao chép mã",
      copied: "Đã sao chép",
    },
    ui: {
      chat: "Trò chuyện",
      jailbreakMessage: "Mình ở đây để hỗ trợ các chủ đề học thuật. Mình không thể thực hiện các yêu cầu yêu cầu bỏ qua nguyên tắc hoạt động — nhưng mình rất sẵn lòng giúp bạn học, nghiên cứu hoặc khám phá điều gì đó mới! 📚",
      masteryDetected: "Phát hiện bạn đã thành thạo!",
      masteryPopupExplain: "Bạn đã thành thạo chủ đề này. Bạn có muốn làm một bài kiểm tra nhỏ để kiểm tra sự hiểu biết và củng cố kiến thức của mình không?",
      masteryPopupYes: "Vâng, hãy làm thôi!",
      masteryPopuplLater: "Để sau",
      quizConfigTitle: "Cấu hình bài kiểm tra",
      difficultyLevel: "Mức độ",
      difficultyOptions: ["Cơ bản", "Trung cấp", "Nâng cao"],
      numberOfQuestions: "Số câu hỏi: {count}",
      mixLabel: "Tỷ lệ: {mcq}% MCQ / {open}% Tự luận",
      startAssessment: "Bắt đầu bài đánh giá",
      generatingAssessment: "Đang tạo bài đánh giá phù hợp...",
      failedToGenerateQuiz: "Không thể tạo bài kiểm tra. Vui lòng thử lại.",
      mcqIncorrect: "Không đúng. Đáp án đúng là {answer}. {explanation}",
      questionOf: "Câu {current} / {total}",
      answerPlaceholder: "Nhập câu trả lời của bạn ở đây...",
      pressEnter: "Nhấn Enter để gửi",
      aiGrading: "AI đang chấm đáp án...",
      correctExclaim: "Đúng!",
      notQuite: "Chưa chính xác",
      explainContext: "Tôi đang làm một bài kiểm tra về chủ đề trước đó.\nCâu hỏi: \"{question}\"\nCâu trả lời của tôi: \"{answer}\"\nKết quả: {result}\nPhản hồi nhận được: \"{feedback}\"\n\nBạn có thể giải thích khái niệm này chi tiết hơn không?",
      quizSummary: "Hoàn thành bài kiểm tra. Điểm: {score}/{total}. Mức độ: {level}.",
      chatTooShortForQuiz: "Lịch sử trò chuyện hoặc bộ nhớ phiên không đủ để tạo bài kiểm tra.",
      chooseTopic: "Chọn chủ đề",
      chooseTopicPlaceholder: "Chọn một chủ đề đã được theo dõi",
      chooseTopicRequired: "Hãy chọn một chủ đề trước khi bắt đầu bài kiểm tra.",
      noQuizTopicsAvailable: "Chưa có chủ đề nào có đủ dữ liệu để tạo bài kiểm tra.",
      updatingQuizConfig: "Dang cap nhat cau hinh...",
      explainSelectionButton: "Giải thích thêm",
      followUpSelectionButton: "Hỏi tiếp",
      explainSelectionPrompt: "Giải thích phần này rõ ràng và đơn giản hơn:\n\n\"{selection}\"",
      followUpSelectionPrompt: "Phần đã chọn:\n\"{selection}\"\n\nCâu hỏi tiếp theo:\n{message}",
      askExplain: "Yêu cầu Oracle giải thích trong trò chuyện",
      seeResults: "Xem kết quả",
      nextQuestion: "Câu tiếp theo",
      assessmentComplete: "Hoàn thành bài đánh giá",
      correctLabel: "Đúng",
      needsReview: "Cần ôn lại",
      addToMemory: "Thêm kết quả vào Bộ nhớ phiên",
      takeAnother: "Làm bài kiểm tra khác",
      memoryAdded: "Kết quả đã được thêm vào Bộ nhớ phiên của bạn! Chúng sẽ được bao gồm trong tài liệu tóm tắt buổi học của bạn.",

      profile: "Hồ sơ",
      logOut: "Đăng xuất",
      noExistingChat: "Không có cuộc trò chuyện hoặc hồ sơ hiện có để đặt lại.",
      notEnoughHistory: "Lịch sử trò chuyện hoặc hồ sơ học sinh không đủ để tạo một bản tóm tắt có ý nghĩa.",
      apiKeyExpired: "Khóa API của bạn đã hết hạn/bị lỗi định dạng. Vui lòng kiểm tra lại.",
      rateLimitError: "Bạn đã đạt đến giới hạn tốc độ của khóa API.",
      rateLimitRetry: "Thử lại sau {delay}",
      rateLimitSupport: "Hỗ trợ dự án để mở khóa các giới hạn cao hơn: Buy Me A Coffee. Cảm ơn!",
      genericError: "Đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại.",
      retryButton: "Thử lại",
      freeSessionLimit: "Đã đạt giới hạn phiên miễn phí 🚧\n\nTạo khóa API của riêng bạn để truy cập không giới hạn tại Trang Hồ sơ,\nhoặc hỗ trợ trên Buy Me A Coffee để giữ Oracle hoạt động trơn tru!",
      freeSessionSupport: "hoặc hỗ trợ trên Buy Me A Coffee để giữ Oracle hoạt động trơn tru!",
      pleaseLogin: "Vui lòng đăng nhập để tạo tài liệu tóm tắt.",
      pleaseWait: "Vui lòng chờ cho đến khi thao tác hiện tại hoàn thành.",
      failedToGenerateSummary: "Không thể tạo bản tóm tắt 😬",
      oracleOnline: "Oracle Trực tuyến",
      thinking: "Đang suy nghĩ...",
      syncError: "Lỗi Đồng bộ",
      oracleStatus: "Trạng thái Oracle",
      language: "Ngôn ngữ",
      settings: "Cài Đặt",
      email: "Email",
      apiKey: "Khóa API",
      editApiKey: "Chỉnh sửa khóa API",
      addApiKey: "Thêm khóa API",
      save: "Lưu",
      noApiKeyAdded: "Chưa thêm khóa API. Nhấp vào nút cộng để thêm một cái.",
      howToGetApiKey: "Làm thế nào để có được khóa API?",
      modelAdaptation: "Điều chỉnh mô hình",
      modelAdaptationOff: "Tắt",
      modelAdaptationStandard: "Tiêu chuẩn",
      modelAdaptationAlways: "Luôn luôn",
      modelAdaptationTooltip: "Chọn khi nào bật định tuyến mô hình thích ứng. **Luôn luôn**: chạy đua để có phản hồi nhanh nhất. **Tiêu chuẩn**: kích hoạt trong thời gian cao điểm. **Tắt**: vô hiệu hóa.",
      invalidApiKeyFormat: "Định dạng khóa API không hợp lệ.",
      failedToLoadApiKey: "Không thể tải khóa API.",
      failedToSaveApiKey: "Không thể lưu khóa API.",
      noApiKeySetMessage: "Chưa đặt khóa API",
      wipeProfile: "Bạn có muốn xóa hồ sơ học sinh của mình không? Nhấp vào 'Hủy' để giữ nó.",
      wipeProfileConfirm: "Xóa hồ sơ",
      confirmReset: "Bạn có chắc chắn muốn đặt lại cuộc trò chuyện không?",
      uploadFile: "Tải lên từ máy tính",
      placeholderFull: "Nhập câu hỏi học tập của bạn tại đây…",
      placeholderMedium: "Nhập câu hỏi học tập của bạn…",
      placeholderShort: "Hỏi một câu hỏi…",
      disclaimer: "Academic Oracle có thể tạo ra thông tin không chính xác hoặc không đầy đủ. Xác minh tất cả kết quả độc lập trước khi dựa vào chúng.",
      webSearchQuotaReached: "Bạn đã đạt giới hạn tìm kiếm web. Mô hình sẽ quay về phần kiến thức trước năm 2024. Xin lỗi vì sự bất tiện này!",
      webSearchFailedMessage: "Không thể hoàn tất web search cần thiết cho yêu cầu này. Quá trình tạo phản hồi đã được dừng để tránh sử dụng thông tin thời gian thực chưa đầy đủ. Vui lòng thử lại.",
      webSearchQuotaReachedMessage: "Yêu cầu này cần web search, nhưng đã đạt giới hạn web search. Quá trình tạo phản hồi đã được dừng để tránh sử dụng thông tin thời gian thực chưa đầy đủ.",
      dashboard: {
        title: "Bảng điều khiển học tập",
        subtitle: "Tổng quan phiên học",
        description: "Theo dõi hồ sơ người học, tiến độ chủ đề, điểm yếu và mục tiêu luyện tập tiếp theo trong cùng một nơi.",
        preparingSummary: "Đang chuẩn bị bản tóm tắt phiên...",
        downloadSummary: "Tải bản tóm tắt phiên",
        loadingMessages: ["Sắp xong", "Đang tạo phân tích", "Đang gom dữ liệu", "Đang chuẩn bị tóm tắt"],
        userData: "Dữ liệu người dùng",
        name: "Tên",
        defaultStudentName: "Học viên",
        academicLevel: "Trình độ học thuật",
        academicLevelFallback: "Chưa được thiết lập",
        currentTopic: "Chủ đề hiện tại",
        currentTopicFallback: "Chưa có chủ đề nào được theo dõi",
        learningLevel: "Mức độ học tập",
        learningLevelFallback: "Vẫn đang được suy luận",
        learningEfficiency: "Hiệu quả học tập",
        efficiencyShort: "Hiệu quả",
        topicsLearned: "Chủ đề đã học",
        topicsMastered: "Chủ đề đã thành thạo",
        quizzesDone: "Bài kiểm tra đã làm",
        strengths: "Điểm mạnh đã nhận diện",
        strengthsEmpty: "Các tín hiệu về điểm mạnh sẽ xuất hiện ở đây khi Oracle thu thập thêm bằng chứng từ phiên học.",
        weaknesses: "Điểm yếu cần cải thiện",
        weaknessesEmpty: "Các điểm cần cải thiện sẽ xuất hiện ở đây sau khi có thêm theo dõi chủ đề hoặc phản hồi từ bài kiểm tra.",
        learningTopics: "Các chủ đề học tập",
        learningTopicsDescription: "Mở rộng từng chủ đề để xem ghi chú đã theo dõi, hoạt động kiểm tra và hướng luyện tập tiếp theo phù hợp nhất.",
        sessionTurnsTracked: "Đã theo dõi {count} lượt trong phiên",
        noActiveHistory: "Chưa có lịch sử hoạt động",
        topicMeta: "{status} • {quizzes} bài kiểm tra • {accuracy}",
        topicMastered: "Đã thành thạo",
        topicInProgress: "Đang học",
        accuracyPending: "Chưa có độ chính xác",
        openDetails: "Mở chi tiết",
        keyNotes: "Ghi chú chính",
        formulasAndCues: "Công thức / Gợi nhớ",
        noFormulasYet: "Chưa có công thức cụ thể hoặc gợi ý sửa lỗi nào được ghi lại cho chủ đề này.",
        quizAttemptsRecorded: "Đã ghi nhận {count} lần làm bài kiểm tra.",
        recommendedNextFocus: "Trọng tâm / luyện tập tiếp theo được đề xuất",
        noTopicsYet: "Hãy bắt đầu trò chuyện hoặc hoàn thành một bài kiểm tra để bảng điều khiển hiển thị các chủ đề đã theo dõi.",
        currentSummary: "Tóm tắt hiện tại",
        currentSummaryFallback: "Bản tóm tắt học tập hiện tại sẽ xuất hiện ở đây khi Oracle đã xây dựng đủ bộ nhớ học tập bền vững.",
        deleteTopic: "Xóa bộ nhớ chủ đề",
        deleteTopicConfirm: "Xóa bộ nhớ đã lưu cho {topic}? Thao tác này chỉ xóa mục chủ đề đó khỏi Oracle Memory.",
        seeMore: "Xem thêm",
        seeLess: "Thu gọn",
        confidenceLevel: "Mức độ tự tin",
        masteryStatus: "Trạng thái thành thạo",
        masteryStatusMastered: "Đã thành thạo",
        masteryStatusInProgress: "Đang tiến triển",
        currentAccuracy: "Độ chính xác hiện tại",
        bestPracticeMode: "Chế độ luyện tập phù hợp",
        recommendedFocusMastered: "Hãy áp dụng chủ đề này vào các câu hỏi tổng hợp hoặc bài tập gần với thực tế.",
        recommendedFocusNeedsFeynman: "Hãy chậm lại và diễn giải lại khái niệm bằng lời của bạn trước bài kiểm tra tiếp theo.",
        recommendedFocusLowAccuracy: "Ôn lại các bước còn yếu và làm một lượt luyện tập tập trung.",
        recommendedFocusDefault: "Tiếp tục củng cố bằng luyện tập gợi nhớ ngắn và một bài khó hơn.",
        reportDocTitle: "Academic Oracle — Tóm tắt phiên học",
        reportLevel: "Cấp độ",
        reportFocus: "Trọng tâm",
        reportConfidence: "Độ tự tin",
        reportCognitionLevel: "Mức độ nhận thức",
        reportInterests: "Sở thích",
        reportSessionOverview: "Tổng quan phiên học",
        reportTopicsCovered: "Các chủ đề đã học",
        reportOverallAccuracy: "Độ chính xác tổng thể",
        reportAdaptiveInsights: "Phân tích thích ứng",
        reportStudyStyle: "Phong cách học tập",
        reportToneRecommendation: "Đề xuất giọng điệu",
        reportQuestionStyleRecommendation: "Đề xuất kiểu câu hỏi",
        reportTopicTag: "Thẻ chủ đề",
        reportCompletion: "Hoàn thành",
        reportMastered: "Đã thành thạo",
        reportNeedsFeynman: "Cần củng cố Feynman",
        reportMistakeLog: "Nhật ký lỗi",
        reportQuizPerformance: "Kết quả kiểm tra",
        reportFormulas: "Công thức",
        reportTheories: "Lý thuyết",
        reportKeyTakeaways: "Kiến thức trọng tâm",
        reportPracticalApplications: "Ứng dụng thực tế",
        reportOverallSummary: "Tóm tắt tổng thể",
        reportOverallCompletion: "Hoàn thành tổng thể",
      },
      loadingModeLabels: {
        Agentic: "Tác vụ thông minh",
        Fast: "Nhanh",
        Balanced: "Cân bằng",
        Standard: "Tiêu chuẩn",
        "Web Search": "Tìm kiếm web",
      },
      exam: {
        examInstructions: "Hướng dẫn bài kiểm tra",
        questions: "Câu hỏi",
        estimatedMarks: "Điểm ước tính",
        duration: "Thời gian",
        helpLevel: "Mức hỗ trợ",
        instructions: "Hướng dẫn",
        back: "Quay lại",
        startExam: "Bắt đầu bài kiểm tra",
        timeRemaining: "Thời gian còn lại",
        submit: "Nộp bài",
        submitting: "Đang nộp...",
        navigator: "Điều hướng",
        multipleChoice: "Trắc nghiệm",
        openResponse: "Tự luận",
        flagged: "Đã đánh dấu",
        unflag: "Bỏ đánh dấu",
        flag: "Đánh dấu",
        hint: "Gợi ý",
        showHint: "Hiện",
        hideHint: "Ẩn",
        solution: "Giải pháp",
        specificHint: "Gợi ý cụ thể",
        prev: "Trước",
        next: "Sau",
        typeAnswerHere: "Nhập câu trả lời của bạn ở đây...",
        noActiveQuestion: "Không có câu hỏi nào đang hoạt động.",
        youLeftExamWindow: "Bạn đã rời khỏi cửa sổ bài kiểm tra.",
        resumeExam: "Tiếp tục bài kiểm tra",
        submitExam: "Nộp bài kiểm tra?",
        unansweredQuestions: "câu hỏi chưa trả lời",
        flaggedQuestions: "câu hỏi đã đánh dấu",
        submitAnyway: "Nộp bài dù còn câu chưa làm?",
        cancel: "Hủy",
        confirmSubmit: "Xác nhận nộp bài",
        examResults: "Kết quả bài kiểm tra",
        score: "Điểm",
        percentage: "Phần trăm",
        estimatedGrade: "Điểm ước tính",
        summary: "Tóm tắt",
        redoExam: "Làm lại bài kiểm tra",
        exportToDocx: "Xuất ra Docx",
        addToOracleMemory: "Thêm vào Bộ nhớ Oracle",
        reviewExam: "Xem lại bài kiểm tra",
        backToResults: "Quay lại kết quả",
        yourAnswer: "Câu trả lời của bạn",
        correctAnswer: "Đáp án đúng",
        feedback: "Phản hồi",
        correct: "Đúng",
        partial: "Một phần",
        incorrect: "Sai",
        unanswered: "Chưa trả lời",
        noAnswerSubmitted: "Không có câu trả lời nào được nộp.",
        noOfficialAnswer: "Không có đáp án chính thức nào cho câu hỏi này.",
        resumeExamNotice: "Đồng hồ đã được tạm dừng khi cửa sổ bài kiểm tra bị ẩn. Hãy xác nhận thông báo này để tiếp tục bài kiểm tra.",
        questionOf: "Câu hỏi {current} trên {total}",
        youStillHave: "Bạn vẫn còn:",
        questionPrefix: "Câu hỏi",
        noAdditionalFeedback: "Không có phản hồi bổ sung nào.",
        noAnswerSubmittedFeedback: "Không có câu trả lời nào được nộp cho câu hỏi này.",
        reportTitle: "Báo cáo kết quả kiểm tra",
        reportAnalyticsSummary: "Phân tích tổng quan",
        reportUsedMarkScheme: "Sử dụng đáp án chính thức",
        yes: "Có",
        no: "Không",
        reportQuestion: "Câu hỏi",
      },    
      examSetup: {
        defaultExamTitle: 'Bài kiểm tra chuyên nghiệp',
        moduleSupertitle: 'Academic Oracle',
        moduleTitle: 'Module kiểm tra chuyên nghiệp',
        moduleDescription: 'Tải lên các PDF nguồn, chuẩn bị phiên kiểm tra và khởi chạy môi trường đa giai đoạn mà không cần rời khỏi giao diện này.',
        reset: 'Đặt lại',
        questionPaperTitle: 'Đề thi',
        questionPaperSubtitle: 'Bắt buộc. Chỉ PDF.',
        questionPaperBadge: 'Đầu vào chính',
        noQuestionPaperSelected: 'Chưa chọn đề thi',
        questionPaperLoading: 'Đang đọc và cấu trúc câu hỏi...',
        questionPaperLoaded: 'Đã tải {count} câu hỏi',
        questionPaperHint: 'Nội dung thô được trích xuất trước, sau đó cấu trúc hóa với Gemini',
        chooseQuestionPaper: 'Chọn đề thi',
        noFileChosen: 'Chưa chọn tệp',
        markSchemeTitle: 'Đáp án / Thang điểm',
        markSchemeSubtitle: 'Tùy chọn. Dùng để ưu tiên chấm điểm.',
        markSchemeBadge: 'Tùy chọn',
        noMarkSchemeSelected: 'Chưa chọn thang điểm',
        markSchemeLoading: 'Đang đọc thang điểm...',
        markSchemeLoaded: 'Đã đính kèm vào phiên kiểm tra',
        markSchemeHint: 'Nếu thiếu, hệ thống sẽ chấm dựa trên phán đoán của mô hình',
        chooseMarkScheme: 'Chọn thang điểm',
        sessionSetupTitle: 'Cấu hình phiên',
        sessionSetupDescription: 'Chuẩn bị phiên trước khi vào giai đoạn hướng dẫn và kiểm tra.',
        durationLabel: 'Thời gian',
        duration15: '15 phút',
        duration30: '30 phút',
        duration45: '45 phút',
        duration60: '60 phút',
        helpLevelLabel: 'Mức hỗ trợ',
        helpLevelNone: 'Mức 0 - Không có',
        helpLevelGeneral: 'Mức 1 - Gợi ý chung',
        helpLevelSpecific: 'Mức 2 - Gợi ý cụ thể',
        helpLevelSolution: 'Mức 3 - Giải pháp',
        gradingStyleLabel: 'Kiểu chấm điểm',
        gradingStyleDefault: 'Mặc định',
        snapshotTitle: 'Tổng quan bài kiểm tra',
        snapshotFieldTitle: 'Tiêu đề',
        snapshotPendingTitle: 'Chờ đề thi',
        snapshotFieldQuestions: 'Số câu hỏi',
        snapshotFieldMarks: 'Điểm ước tính',
        snapshotFieldDuration: 'Thời gian',
        snapshotMinutes: 'phút',
        snapshotFieldHelpLevel: 'Mức hỗ trợ',
        snapshotFieldGradingStyle: 'Kiểu chấm điểm',
        continueToInstructions: 'Tiếp tục đến hướng dẫn',
        errorNoQuestionPaper: 'Vui lòng tải lên và cấu trúc đề thi trước khi tiếp tục.',
        examRuntimeNotesTitle: 'Lưu ý về môi trường kiểm tra',
        examRuntimeNote1: 'Tải lên PDF đề thi để cấu trúc bài kiểm tra.',
        examRuntimeNote2: 'Tải lên PDF thang điểm nếu bạn muốn chấm điểm ưu tiên theo hướng dẫn chính thức.',
        examRuntimeNote3: 'Chọn thời gian và mức hỗ trợ trước khi bắt đầu.',
        resultSummaryNoQuestions: 'Không có câu hỏi nào được chấm điểm.',
        resultSummaryNotAnswered: 'Bài kiểm tra chưa được trả lời. Không có câu nào được nộp, lần thử này được ghi nhận là 0 trên {total} điểm.',
        resultSummaryStrong: 'Kết quả xuất sắc. Bạn đạt {score} trên {total} điểm.',
        resultSummaryCompetent: 'Kết quả khá. Bạn đạt {score} trên {total} điểm, còn một số chỗ cần cải thiện.',
        resultSummaryNeedsReview: 'Hệ thống hoạt động, nhưng lần thử này cần xem lại. Bạn đạt {score} trên {total} điểm.',
      },
    },
  },
};
