import { useCallback, useState } from 'react';
import type { Message } from '../types/chatTypes';
import type { ChatRequest } from '../../../api/chatApi';
import { sendChatRequest } from '../../../api/chatApi';
import { chatConfig } from '../../../config/chatConfig';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (userContent: string) => {
    setError(null);

    const userMessage: Message = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 9),
      role: 'user',
      content: userContent,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const payload: ChatRequest = {
      messages: [
        { role: chatConfig.botRole, content: chatConfig.botBehavior },
        { role: 'user', content: userContent },
      ],
      max_tokens: chatConfig.maxTokens,
      temperature: chatConfig.temperature,
    };

    setLoading(true);

    try {
      const { text } = await sendChatRequest(payload);

      const assistantMessage: Message = {
        id: String(Date.now()) + Math.random().toString(36).slice(2, 9),
        role: 'assistant',
        content: text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errMsg = err.message ?? String(err);
      setError(errMsg);

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()) + Math.random().toString(36).slice(2, 9),
          role: 'assistant',
          content: `Error: ${errMsg}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, send, reset } as const;
}
