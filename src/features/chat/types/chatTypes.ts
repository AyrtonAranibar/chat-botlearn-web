import type { ChatMessage } from "../../../api/chatApi";


export type Message = ChatMessage & { id: string; timestamp?: number };