import { useState } from 'react';


export default function ChatInput({ onSend, disabled }: { onSend: (text: string) => void; disabled?: boolean }) {
const [text, setText] = useState('');


const handleSend = () => {
if (!text.trim()) return;
onSend(text.trim());
setText('');
};


return (
<div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #e5e7eb' }}>
<input
value={text}
onChange={(e) => setText(e.target.value)}
onKeyDown={(e) => {
if (e.key === 'Enter' && !e.shiftKey) {
e.preventDefault();
handleSend();
}
}}
placeholder="Type a message..."
style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
disabled={disabled}
/>
<button onClick={handleSend} disabled={disabled || !text.trim()} style={{ padding: '8px 12px' }}>
Send
</button>
</div>
);
}