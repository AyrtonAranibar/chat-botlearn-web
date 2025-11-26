
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  max_tokens: number;
  temperature: number;
}


const API_URL = 'http://127.0.0.1:8002/api/v1/chat';

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
