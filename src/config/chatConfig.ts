export const chatConfig = {
  apiUrl: import.meta.env.VITE_API_URL,

  botRole: import.meta.env.VITE_BOT_ROLE ?? "system",
  botBehavior: import.meta.env.VITE_BOT_BEHAVIOR ?? "Eres un asistente util",
  botLanguage: import.meta.env.VITE_BOT_LANGUAGE ?? "Español",

  temperature: Number(import.meta.env.VITE_TEMPERATURE ?? 0.3),
  maxTokens: Number(import.meta.env.VITE_MAX_TOKENS ?? 512),

  showTypingEffect:
    (import.meta.env.VITE_SHOW_TYPING_EFFECT ?? "true") === "true",
};
