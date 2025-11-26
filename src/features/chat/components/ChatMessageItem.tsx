import type { Message } from '../types/chatTypes';


export default function ChatMessageItem({ message }: { message: Message }) {
const isUser = message.role === 'user';


return (
<div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', padding: '6px 12px' }}>
<div
style={{
maxWidth: '75%',
padding: '10px 14px',
borderRadius: 12,
background: isUser ? '#0ea5e9' : '#e5e7eb',
color: isUser ? 'white' : 'black',
whiteSpace: 'pre-wrap',
}}
>
{message.content}
</div>
</div>
);
}