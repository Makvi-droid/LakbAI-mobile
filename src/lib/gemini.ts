const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

const SYSTEM_PROMPT = `You are LakbAI, a friendly, knowledgeable AI virtual tour guide inside a travel app focused on Philippine destinations.
You help users by:
- Answering tourism-related questions
- Recommending destinations based on their interests, budget, or travel style
- Sharing information about landmarks, heritage sites, and culture
- Giving practical local travel tips (transport, weather, etiquette, best time to visit)
- Helping refine or improve their travel itinerary

Keep replies conversational, warm, and concise (a few short paragraphs max unless asked for detail). Use a friendly Filipino travel-guide tone. If you don't know something specific (e.g. current prices, exact schedules), say so honestly and suggest how the user can verify it.`;

export interface GeminiChatTurn {
    role: "user" | "model";
    parts: { text: string }[];
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendMessageToGemini(
    history: GeminiChatTurn[],
    newMessage: string,
    attempt = 0
): Promise<string> {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("Missing EXPO_PUBLIC_GEMINI_API_KEY in .env");
    }

    const contents = [...history, { role: "user", parts: [{ text: newMessage }] }];

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents,
                systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
                generationConfig: { temperature: 0.8, maxOutputTokens: 800 },
            }),
        });

        if (response.status === 429 && attempt < 2) {
            await delay(1000 * (attempt + 1));
            return sendMessageToGemini(history, newMessage, attempt + 1);
        }

        if (!response.ok) {
            const text = await response.text();
            if (response.status === 429) {
                throw new Error(
                    "Gemini is rate-limiting requests right now. Please wait 30-60 seconds and try again."
                );
            }
            throw new Error(text || `Gemini request failed (${response.status})`);
        }

        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("Gemini returned an empty response");
        }

        return text.trim();
    } catch (error: any) {
        if (error?.message?.includes("rate-limiting")) {
            throw error;
        }
        throw error;
    }
}