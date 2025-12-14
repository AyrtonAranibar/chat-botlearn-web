import { chatConfig } from "../config/chatConfig";

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  max_tokens: number;
  temperature: number;
}


const API_URL = chatConfig.apiUrl!;

export async function sendChatRequest(payload: ChatRequest): Promise<{ raw: any; text: string }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Backend error ${res.status}: ${body}`);
  }


  const json = await res.json().catch(async () => {
    const txt = await res.text().catch(() => '');
    try {
      return JSON.parse(txt);
    } catch {
      return txt;
    }
  });


  function extractText(obj: any): string | undefined {
    if (!obj) return undefined;


    const c1 = obj?.choices?.[0]?.message?.content;
    if (typeof c1 === 'string' && c1.length) return c1;


    const c2 = obj?.choices?.[0]?.text;
    if (typeof c2 === 'string' && c2.length) return c2;


    if (typeof obj.content === 'string' && obj.content.length) {
      const maybe = obj.content.trim();
      if ((maybe.startsWith('{') || maybe.startsWith('[')) && (maybe.includes('"choices"') || maybe.includes('"message"'))) {
        try {
          const parsed = JSON.parse(maybe);
          return extractText(parsed) ?? maybe;
        } catch {
          return maybe;
        }
      }
      return maybe;
    }

    if (typeof obj === 'string' && obj.length) return obj;

    return undefined;
  }

  const text = extractText(json) ?? JSON.stringify(json);

  return { raw: json, text };
}

// ejemplo: src/api/chatApi.ts (snippet relevante)
export async function sendChatRequestStream(
  payload: ChatRequest,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
) {
  const response = await fetch(chatConfig.apiStreamUrl!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, stream: true }),
    signal, // <-- esto permite abortar el fetch
  });

  if (!response.ok) {
    const txt = await response.text().catch(() => "");
    throw new Error(`Backend error ${response.status}: ${txt}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });

      // evaluar y extraer chunks. Ajusta el parse según el formato del backend.
      const lines = text
          .split("\n")
          .filter((l) => l.startsWith("data: "));
      for (const line of lines) {
        // soporta formatos como "data: {...}" o directamente JSON chunks
        const raw = line.startsWith("data: ") ? line.slice(6) : line;
        if (raw === "[DONE]") return;
        try {
          const json = JSON.parse(raw);
          const delta = json?.choices?.[0]?.delta?.content ?? json?.choices?.[0]?.message?.content;
          if (delta) onChunk(delta);
        } catch {
          // si el chunk no es JSON, lo devolvemos tal cual
          onChunk(raw);
        }
      }
    }
  } finally {
    // cerrar reader si se abortó o terminó
    try {
      reader.releaseLock();
    } catch {}
  }
}
