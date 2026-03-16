export type AppLanguage = "en" | "fr" | "es" | "vi";

export const LANGUAGE_DATA: Record<AppLanguage, {
  greeting: string;
  shortGreeting: string;
  tooltips: {
    newChat: string;
    summary: string;
    quiz: string;
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
    answerPlaceholder: string;
    pressEnter: string;
    aiGrading: string;
    correctExclaim: string;
    notQuite: string;
    explainSelectionButton: string;
    explainSelectionPrompt: string;
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
    uploadFile: string;
    placeholderFull: string;
    placeholderMedium: string;
    placeholderShort: string;
    disclaimer: string;
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
      questionOf: "Question {current} of {total}",
      answerPlaceholder: "Type your answer here...",
      pressEnter: "Press Enter to submit",
      aiGrading: "AI is grading your answer...",
      correctExclaim: "Correct!",
      notQuite: "Not quite right",
      explainSelectionButton: "Explain further",
      explainSelectionPrompt: "Explain this part more clearly and simply:\n\n\"{selection}\"",
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
      uploadFile: "Upload from computer",
      placeholderFull: "Type your academic inquiry here…",
      placeholderMedium: "Type your academic question…",
      placeholderShort: "Ask a question…",
      disclaimer: "Academic Oracle may generate inaccurate or incomplete information. Verify all results independently before relying on them.",
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
      explainSelectionButton: "Expliquer davantage",
      explainSelectionPrompt: "Expliquez cette partie plus clairement et simplement :\n\n\"{selection}\"",
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
      uploadFile: "Télécharger depuis l'ordinateur",
      placeholderFull: "Entrez votre question académique ici…",
      placeholderMedium: "Entrez votre question académique…",
      placeholderShort: "Posez une question…",
      disclaimer: "Oracle Académique peut générer des informations inexactes ou incomplètes. Vérifiez tous les résultats indépendamment avant de vous y fier.",
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
      explainSelectionButton: "Explicar más",
      explainSelectionPrompt: "Explica esta parte con más claridad y sencillez:\n\n\"{selection}\"",
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
      uploadFile: "Cargar desde la computadora",
      placeholderFull: "Escribe tu pregunta académica aquí…",
      placeholderMedium: "Escribe tu pregunta académica…",
      placeholderShort: "Haz una pregunta…",
      disclaimer: "Oracle Académico puede generar información inexacta o incompleta. Verifica todos los resultados de forma independiente antes de confiar en ellos.",
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
      explainSelectionButton: "Giải thích thêm",
      explainSelectionPrompt: "Giải thích phần này rõ ràng và đơn giản hơn:\n\n\"{selection}\"",
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
      uploadFile: "Tải lên từ máy tính",
      placeholderFull: "Nhập câu hỏi học tập của bạn tại đây…",
      placeholderMedium: "Nhập câu hỏi học tập của bạn…",
      placeholderShort: "Hỏi một câu hỏi…",
      disclaimer: "Academic Oracle có thể tạo ra thông tin không chính xác hoặc không đầy đủ. Xác minh tất cả kết quả độc lập trước khi dựa vào chúng.",
    },
  },
};
