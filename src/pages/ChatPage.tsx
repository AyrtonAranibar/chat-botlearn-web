import ChatContainer from '../features/chat/ChatContainer';
import ChatInput from '../components/ChatInput';
import Loader from '../components/Loader';
import { useChat } from '../features/chat/hooks/useChat';


export default function ChatPage() {
const { messages, loading, error, send, reset } = useChat();


return (
<div style={{ maxWidth: 900, margin: '24px auto', display: 'flex', flexDirection: 'column', height: '80vh' }}>
<header style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
<h2>Chat</h2>
<button onClick={() => reset()} style={{ marginLeft: 8 }}>Reset</button>
</header>


<ChatContainer messages={messages} />


{loading && <Loader />}


{error && (
<div style={{ color: 'red', padding: 8 }}>
Error: {error}
</div>
)}


<ChatInput onSend={send} disabled={loading} />
</div>
);
}