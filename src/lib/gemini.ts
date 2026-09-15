import { executeGeminiTool, GEMINI_TOOLS } from "@/lib/geminiTools";
import type { AIItineraryOption, ItineraryGenerationParams } from "@/types/itinerary";
import { TRAVELER_COUNT_BY_TYPE } from "@/types/itinerary";

const GEMINI_MODEL = "gemini-3.5-flash-lite";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const CHAT_SYSTEM_PROMPT = `You are LakbAI, a friendly, knowledgeable AI virtual tour guide inside a travel app focused on Philippine destinations.
You help users by:
- Answering tourism-related queries
- Recommending destinations based on their interests, budget, or travel style
- Providing information about landmarks and heritage sites
- Offering local travel tips (transport, weather, etiquette, best time to visit)
- Helping refine their saved travel itineraries

Rules:
1. Always call search_destinations before recommending a specific named place — never invent or recommend a destination you haven't retrieved this way.
2. If the user wants to change a saved itinerary, first call list_saved_itineraries (if you don't already know which one) then get_itinerary_detail to see its current stops before proposing anything.
3. Before calling update_itinerary_stop, add_itinerary_stop, or remove_itinerary_stop, clearly state the exact change you're about to make and wait for the user to confirm it in their next message — do not apply edits the user hasn't explicitly agreed to.
4. After a successful edit, briefly confirm what changed in plain language.
5. Keep replies conversational, warm, and concise. Use a friendly Filipino travel-guide tone. If you don't know something specific (e.g. current prices, exact schedules), say so honestly.`;

export interface GeminiChatTurn {
    role: "user" | "model";
    parts: { text: string }[];
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGemini(contents: any[], tools?: any[], attempt = 0): Promise<any> {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing EXPO_PUBLIC_GEMINI_API_KEY in .env");

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents,
            ...(tools ? { tools } : {}),
            systemInstruction: { role: "system", parts: [{ text: CHAT_SYSTEM_PROMPT }] },
            generationConfig: { temperature: 0.8, maxOutputTokens: 800 },
        }),
    });

    if (response.status === 429 && attempt < 2) {
        await delay(1000 * (attempt + 1));
        return callGemini(contents, tools, attempt + 1);
    }

    if (!response.ok) {
        const text = await response.text();
        if (response.status === 429) {
            throw new Error("Gemini is rate-limiting requests right now. Please wait 30-60 seconds and try again.");
        }
        throw new Error(text || `Gemini request failed (${response.status})`);
    }

    return response.json();
}

// Chat with tool-calling: lets Gemini query/edit real destinations & itineraries mid-conversation.
export async function sendMessageToGemini(
    history: GeminiChatTurn[],
    newMessage: string,
    userId: string
): Promise<string> {
    let contents: any[] = [...history, { role: "user", parts: [{ text: newMessage }] }];

    const MAX_TOOL_ROUNDS = 5;

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        const json = await callGemini(contents, GEMINI_TOOLS);
        const candidateContent = json.candidates?.[0]?.content;
        const parts = candidateContent?.parts ?? [];

        const functionCalls = parts.filter((p: any) => p.functionCall);

        if (functionCalls.length === 0) {
            const text = parts.find((p: any) => p.text)?.text;
            if (!text) throw new Error("Gemini returned an empty response");
            return text.trim();
        }

        // Model wants to call tools — append its turn first.
        contents = [...contents, { role: "model", parts }];

        // Execute each requested tool call against Supabase.
        const functionResponses = await Promise.all(
            functionCalls.map(async (p: any) => {
                const result = await executeGeminiTool(p.functionCall.name, p.functionCall.args ?? {}, userId);
                return {
                    functionResponse: {
                        name: p.functionCall.name,
                        response: result,
                    },
                };
            })
        );

        // Feed the results back in as role "user" — Gemini's REST API doesn't accept role "function".
        contents = [...contents, { role: "user", parts: functionResponses }];
    }

    throw new Error("LakbAI took too many steps to respond — please try rephrasing your request.");
}

// --- Itinerary generation (unchanged) ---

interface CandidateDestination {
    destination_id: number;
    destination_name: string;
    region: string;
    category: string;
    description: string;
}

const ITINERARY_RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        options: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    option_title: { type: "string" },
                    summary: { type: "string" },
                    days: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                day_number: { type: "integer" },
                                stops: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            destination_id: { type: "integer" },
                                            visit_order: { type: "integer" },
                                            estimated_travel_time: { type: "integer" },
                                            activity_description: { type: "string" },
                                            estimated_cost: { type: "number" },
                                        },
                                        required: ["destination_id", "visit_order", "activity_description", "estimated_cost"],
                                    },
                                },
                            },
                            required: ["day_number", "stops"],
                        },
                    },
                    quotation: {
                        type: "object",
                        properties: {
                            currency: { type: "string" },
                            per_traveler_cost: { type: "number" },
                            total_cost: { type: "number" },
                            breakdown: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: { category: { type: "string" }, amount: { type: "number" } },
                                    required: ["category", "amount"],
                                },
                            },
                        },
                        required: ["currency", "per_traveler_cost", "total_cost", "breakdown"],
                    },
                },
                required: ["option_title", "summary", "days", "quotation"],
            },
        },
    },
    required: ["options"],
};

function buildItineraryPrompt(
    params: ItineraryGenerationParams,
    dayCount: number,
    travelerCount: number,
    candidates: CandidateDestination[]
): string {
    return `You are LakbAI, an AI travel planner for Philippine trips. Generate exactly 3 distinct itinerary options as JSON matching the given schema.

Trip details:
- Dates: ${params.startDate} to ${params.endDate} (${dayCount} day${dayCount > 1 ? "s" : ""})
- Travel type: ${params.travelType} (~${travelerCount} traveler${travelerCount > 1 ? "s" : ""})
- Total budget ceiling: ₱${params.totalBudgetMax.toLocaleString()} for the whole trip (not per person)
- Interests: ${params.interests.length ? params.interests.join(", ") : "no strong preference"}
- Preferred activities: ${params.activities.length ? params.activities.join(", ") : "no strong preference"}

Rules:
1. You MUST only use destinations from this list — never invent a destination or destination_id. Pick the ones that best fit the interests and activities:
${candidates.map((c) => `- id=${c.destination_id} | ${c.destination_name} (${c.region}, ${c.category}): ${c.description}`).join("\n")}
2. Spread stops across all ${dayCount} day(s), with sensible visit_order per day.
3. estimated_cost is per stop, in Philippine pesos (entrance fees, food, activity cost — reasonable local estimates).
4. Each option's quotation.total_cost must stay at or under the ₱${params.totalBudgetMax.toLocaleString()} budget ceiling, and should be consistent with the ${travelerCount}-traveler count.
5. quotation.breakdown should itemize by category (e.g. "Entrance Fees", "Food & Dining", "Transportation", "Activities/Tours") summing to total_cost.
6. Make the 3 options genuinely different in pacing or focus (e.g. relaxed vs packed, budget-conscious vs mid-range), not near-duplicates.`;
}

export async function generateItineraryOptions(
    params: ItineraryGenerationParams,
    candidates: CandidateDestination[]
): Promise<AIItineraryOption[]> {
    if (candidates.length === 0) {
        throw new Error("No destinations available to build an itinerary from.");
    }

    const start = new Date(params.startDate + "T00:00:00");
    const end = new Date(params.endDate + "T00:00:00");
    const dayCount = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const travelerCount = TRAVELER_COUNT_BY_TYPE[params.travelType];

    const prompt = buildItineraryPrompt(params, dayCount, travelerCount, candidates);

    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing EXPO_PUBLIC_GEMINI_API_KEY in .env");

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 4000,
                responseMimeType: "application/json",
                responseSchema: ITINERARY_RESPONSE_SCHEMA,
            },
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Gemini request failed (${response.status})`);
    }

    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini returned an empty response");

    const parsed = JSON.parse(text) as { options: AIItineraryOption[] };
    if (!parsed.options?.length) throw new Error("Gemini returned no itinerary options");

    const candidateMap = new Map(candidates.map((c) => [c.destination_id, c]));

    return parsed.options.map((option) => ({
        ...option,
        days: option.days.map((day) => ({
            ...day,
            stops: day.stops
                .filter((stop) => candidateMap.has(stop.destination_id))
                .map((stop) => ({
                    ...stop,
                    destination_name: candidateMap.get(stop.destination_id)?.destination_name,
                })),
        })),
    }));
}