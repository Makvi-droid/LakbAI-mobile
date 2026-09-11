import { sendMessageToGemini, type GeminiChatTurn } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import type { ChatMessageRow } from "@/types/chat";
import { useCallback, useEffect, useRef, useState } from "react";

export function useChatSession() {
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessageRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const userIdRef = useRef<string | null>(null);

    const init = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const {
                data: { user },
                error: userErr,
            } = await supabase.auth.getUser();
            if (userErr || !user) throw new Error("Not signed in");
            userIdRef.current = user.id;

            // Reuse the most recent session for this user, or create one
            const { data: existing, error: sessErr } = await supabase
                .from("chatbot_sessions")
                .select("session_id")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();
            if (sessErr) throw sessErr;

            let sid = existing?.session_id ?? null;

            if (!sid) {
                const { data: created, error: createErr } = await supabase
                    .from("chatbot_sessions")
                    .insert({ user_id: user.id })
                    .select("session_id")
                    .single();
                if (createErr) throw createErr;
                sid = created.session_id;
            }

            setSessionId(sid);

            const { data: msgs, error: msgErr } = await supabase
                .from("chat_messages")
                .select("*")
                .eq("session_id", sid)
                .order("created_at", { ascending: true });
            if (msgErr) throw msgErr;

            setMessages(msgs ?? []);
        } catch (e: any) {
            setError(e.message ?? "Failed to load chat");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        init();
    }, [init]);

    const sendMessage = useCallback(
        async (text: string) => {
            const trimmed = text.trim();
            if (!sessionId || !trimmed || sending) return;

            setSending(true);
            setError(null);

            // optimistic user bubble
            const tempId = Date.now();
            const optimisticMsg: ChatMessageRow = {
                message_id: tempId,
                session_id: sessionId,
                sender: "user",
                message_text: trimmed,
                created_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, optimisticMsg]);

            try {
                const { data: savedUserMsg, error: insertErr } = await supabase
                    .from("chat_messages")
                    .insert({ session_id: sessionId, sender: "user", message_text: trimmed })
                    .select()
                    .single();
                if (insertErr) throw insertErr;

                setMessages((prev) =>
                    prev.map((m) => (m.message_id === tempId ? savedUserMsg : m))
                );

                const history: GeminiChatTurn[] = messages.map((m) => ({
                    role: m.sender === "user" ? "user" : "model",
                    parts: [{ text: m.message_text }],
                }));

                const reply = await sendMessageToGemini(history, trimmed);

                const { data: savedBotMsg, error: botErr } = await supabase
                    .from("chat_messages")
                    .insert({ session_id: sessionId, sender: "bot", message_text: reply })
                    .select()
                    .single();
                if (botErr) throw botErr;

                setMessages((prev) => [...prev, savedBotMsg]);
            } catch (e: any) {
                setError(e.message ?? "Something went wrong. Please try again.");
                setMessages((prev) => prev.filter((m) => m.message_id !== tempId));
            } finally {
                setSending(false);
            }
        },
        [sessionId, messages, sending]
    );

    const startNewSession = useCallback(async () => {
        if (!userIdRef.current) return;
        setLoading(true);
        setError(null);
        try {
            const { data: created, error: createErr } = await supabase
                .from("chatbot_sessions")
                .insert({ user_id: userIdRef.current })
                .select("session_id")
                .single();
            if (createErr) throw createErr;
            setSessionId(created.session_id);
            setMessages([]);
        } catch (e: any) {
            setError(e.message ?? "Failed to start a new chat");
        } finally {
            setLoading(false);
        }
    }, []);

    return { messages, loading, sending, error, sendMessage, startNewSession };
}