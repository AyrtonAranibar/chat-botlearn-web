// src/pages/ChatStreamPage.tsx
import ChatContainer from "../features/chat/ChatContainer";
import ChatInput from "../components/ChatInput";
import Loader from "../components/Loader";
import { useChatStream } from "../features/chat/hooks/useChatStream";

export default function ChatStreamPage() {
  const { messages, streaming, error, send, stop, reset } = useChatStream();

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", display: "flex", flexDirection: "column", height: "80vh" }}>
      <header style={{ padding: 12, borderBottom: "1px solid #e5e7eb" }}>
        <h2>Chat (Streaming)</h2>
        <div style={{ marginTop: 8 }}>
          <button onClick={() => reset()} style={{ marginRight: 8 }}>
            Reset
          </button>
          <button onClick={() => stop()} disabled={!streaming}>
            Stop streaming
          </button>
        </div>
      </header>

      <ChatContainer messages={messages} />

      {streaming && <Loader />}

      {error && <div style={{ color: "red", padding: 8 }}>Error: {error}</div>}

      <ChatInput onSend={send} disabled={streaming} />
    </div>
  );
}
