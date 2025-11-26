import { useRef, useEffect } from 'react';
import ChatMessageItem from './components/ChatMessageItem';
import type { Message } from './types/chatTypes';


export default function ChatContainer({ messages }: { messages: Message[] }) {
const listRef = useRef<HTMLDivElement | null>(null);


useEffect(() => {
if (!listRef.current) return;
// scroll to bottom when messages change
listRef.current.scrollTop = listRef.current.scrollHeight;
}, [messages]);


return (
<div ref={listRef} style={{ height: '60vh', overflowY: 'auto', padding: 12, background: '#fafafa' }}>
{messages.map((m) => (
<ChatMessageItem key={m.id} message={m} />
))}
</div>
);
}