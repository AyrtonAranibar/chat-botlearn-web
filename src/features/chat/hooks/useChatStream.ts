import { useState, useCallback, useRef } from "react";
import type { Message } from "../types/chatTypes";
import { sendChatRequestStream } from "../../../api/chatApi";
import { chatConfig } from "../../../config/chatConfig";
import type { ChatRequest, ChatMessage } from '../../../api/chatApi';

export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (userContent: string) => {
    setError(null);

    // 1. guardar mensaje del usuario (Message para UI)
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userContent,
      timestamp: Date.now(),
    };

    setMessages((m) => [...m, userMessage]);

    // 2. preparar mensaje vacío del bot para stream (Message para UI)
    const assistantId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      },
    ]);

    // 3. construir ChatMessage para el payload (tipos exactos)
    const systemMessage: ChatMessage = {
      role: "system",
      content: chatConfig.botBehavior,
    };

    const userChatMessage: ChatMessage = {
      role: "user",
      content: userContent,
    };

    const payload: ChatRequest = {
      messages: [systemMessage, userChatMessage],
      max_tokens: chatConfig.maxTokens,
      temperature: chatConfig.temperature,
    };

    setStreaming(true);
    abortRef.current = new AbortController();

    try {
      // <-- pasamos abortRef.current.signal para permitir cancelación
      await sendChatRequestStream(payload, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg
          )
        );
      }, abortRef.current.signal);
    } catch (err: any) {
      setError(err.message ?? String(err));
      // opcional: añadir mensaje de error como respuesta del assistant
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Error: ${err.message ?? String(err)}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }, []);

  const stop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const reset = () => {
    setMessages([]);
    setError(null);
  };

  return { messages, streaming, error, send, stop, reset } as const;
}
