export const chatConfig = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8002/api/v1/chat/completions",
  apiStreamUrl:
    import.meta.env.VITE_API_STREAM_URL ?? "http://127.0.0.1:8002/api/v1/chat/completions/stream",

  botRole: (import.meta.env.VITE_BOT_ROLE as "system" | "user" | "assistant") ?? "system",
  botBehavior: import.meta.env.VITE_BOT_BEHAVIOR ?? "Eres un asistente útil",
  botLanguage: import.meta.env.VITE_BOT_LANGUAGE ?? "Español",

  temperature: Number(import.meta.env.VITE_TEMPERATURE ?? 0.3),
  maxTokens: Number(import.meta.env.VITE_MAX_TOKENS ?? 512),

  showTypingEffect:
    (import.meta.env.VITE_SHOW_TYPING_EFFECT ?? "true") === "true",

  streamEnabled:
    (import.meta.env.VITE_STREAM_ENABLED ?? "true") === "true",

  streamRoutePath: "/stream",
};
