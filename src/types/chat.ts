export interface ChatMessageRow {
    message_id: number;
    session_id: number;
    sender: "user" | "bot";
    message_text: string;
    created_at: string;
}

export interface ChatbotSessionRow {
    session_id: number;
    user_id: string;
    summary: string | null;
    created_at: string;
}