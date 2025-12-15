import type { Message } from '../types/chatTypes';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from "react-markdown";
import styles from '../../../styles/ChatMessageItem.module.css';

export default function ChatMessageItem({ message }: { message: Message }) {
    const isUser = message.role === 'user';


    return (
        <div className={styles.container} style={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
            <div className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                </ReactMarkdown>
            </div>
        </div>
    );
}