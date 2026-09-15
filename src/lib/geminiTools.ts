import { supabase } from "@/lib/supabase";

// --- Tool declarations Gemini sees ---

export const GEMINI_TOOLS = [
    {
        functionDeclarations: [
            {
                name: "search_destinations",
                description:
                    "Search real destinations in the app's database. Always use this before recommending a specific place by name — never recommend a destination you haven't found through this function.",
                parameters: {
                    type: "object",
                    properties: {
                        category: { type: "string", description: "e.g. Beach, Heritage, Adventure, Nature" },
                        region: { type: "string", description: "e.g. Cordillera, Palawan, Cebu" },
                        crowd_level: { type: "string", enum: ["low", "medium", "high"] },
                        keyword: { type: "string", description: "Free-text search on name or description" },
                    },
                },
            },
            {
                name: "list_saved_itineraries",
                description: "List the current user's saved trip itineraries (id, title, dates, travel type).",
                parameters: { type: "object", properties: {} },
            },
            {
                name: "get_itinerary_detail",
                description:
                    "Get the full day-by-day breakdown of one saved itinerary, including each stop's destination, activity, and cost. Call this before proposing any edit.",
                parameters: {
                    type: "object",
                    properties: {
                        itinerary_id: { type: "string" },
                    },
                    required: ["itinerary_id"],
                },
            },
            {
                name: "update_itinerary_stop",
                description:
                    "Edit one existing stop in a saved itinerary (change its activity description, cost, or which destination it is). Only call this after the user has clearly confirmed the specific change in this conversation.",
                parameters: {
                    type: "object",
                    properties: {
                        detail_id: { type: "string" },
                        destination_id: { type: "integer", description: "New destination id, if swapping the place" },
                        activity_description: { type: "string" },
                        estimated_cost: { type: "number" },
                    },
                    required: ["detail_id"],
                },
            },
            {
                name: "add_itinerary_stop",
                description:
                    "Add a new stop to a saved itinerary on a specific day. Only call this after the user has confirmed they want to add it.",
                parameters: {
                    type: "object",
                    properties: {
                        itinerary_id: { type: "string" },
                        day_number: { type: "integer" },
                        destination_id: { type: "integer" },
                        activity_description: { type: "string" },
                        estimated_cost: { type: "number" },
                    },
                    required: ["itinerary_id", "day_number", "destination_id", "activity_description"],
                },
            },
            {
                name: "remove_itinerary_stop",
                description:
                    "Remove a stop from a saved itinerary entirely. Only call this after the user has clearly confirmed they want it removed.",
                parameters: {
                    type: "object",
                    properties: {
                        detail_id: { type: "string" },
                    },
                    required: ["detail_id"],
                },
            },
        ],
    },
];

// --- Executors: actually run against Supabase, scoped to the signed-in user ---

async function searchDestinations(args: any) {
    let query = supabase
        .from("destinations")
        .select("destination_id, destination_name, region, category, crowd_level, description")
        .limit(10);

    if (args.category) query = query.ilike("category", `%${args.category}%`);
    if (args.region) query = query.ilike("region", `%${args.region}%`);
    if (args.crowd_level) query = query.eq("crowd_level", args.crowd_level);
    if (args.keyword) {
        query = query.or(
            `destination_name.ilike.%${args.keyword}%,description.ilike.%${args.keyword}%`
        );
    }

    const { data, error } = await query;
    if (error) return { error: error.message };
    return { destinations: data ?? [] };
}

async function listSavedItineraries(userId: string) {
    const { data, error } = await supabase
        .from("itineraries")
        .select("itinerary_id, title, start_date, end_date, travel_type, generated_by_ai")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) return { error: error.message };
    return { itineraries: data ?? [] };
}

async function getItineraryDetail(args: any) {
    const { data: itinerary, error: itinErr } = await supabase
        .from("itineraries")
        .select("*")
        .eq("itinerary_id", args.itinerary_id)
        .single();
    if (itinErr) return { error: itinErr.message };

    const { data: details, error: detailErr } = await supabase
        .from("itinerary_details")
        .select(
            "detail_id, destination_id, day_number, visit_order, activity_description, estimated_cost, destinations ( destination_name )"
        )
        .eq("itinerary_id", args.itinerary_id)
        .order("day_number", { ascending: true })
        .order("visit_order", { ascending: true });
    if (detailErr) return { error: detailErr.message };

    return {
        itinerary: {
            ...itinerary,
            stops: (details ?? []).map((d: any) => ({
                detail_id: d.detail_id,
                destination_id: d.destination_id,
                destination_name: d.destinations?.destination_name,
                day_number: d.day_number,
                visit_order: d.visit_order,
                activity_description: d.activity_description,
                estimated_cost: d.estimated_cost,
            })),
        },
    };
}

async function updateItineraryStop(args: any) {
    const updates: Record<string, any> = {};
    if (args.destination_id != null) updates.destination_id = args.destination_id;
    if (args.activity_description != null) updates.activity_description = args.activity_description;
    if (args.estimated_cost != null) updates.estimated_cost = args.estimated_cost;

    const { data, error } = await supabase
        .from("itinerary_details")
        .update(updates)
        .eq("detail_id", args.detail_id)
        .select()
        .single();

    if (error) return { error: error.message };
    return { updated: data };
}

async function addItineraryStop(args: any) {
    const { data: existing, error: countErr } = await supabase
        .from("itinerary_details")
        .select("visit_order")
        .eq("itinerary_id", args.itinerary_id)
        .eq("day_number", args.day_number)
        .order("visit_order", { ascending: false })
        .limit(1);
    if (countErr) return { error: countErr.message };

    const nextVisitOrder = (existing?.[0]?.visit_order ?? 0) + 1;

    const { data, error } = await supabase
        .from("itinerary_details")
        .insert({
            itinerary_id: args.itinerary_id,
            destination_id: args.destination_id,
            day_number: args.day_number,
            visit_order: nextVisitOrder,
            activity_description: args.activity_description,
            estimated_cost: args.estimated_cost ?? null,
        })
        .select()
        .single();

    if (error) return { error: error.message };
    return { added: data };
}

async function removeItineraryStop(args: any) {
    const { error } = await supabase.from("itinerary_details").delete().eq("detail_id", args.detail_id);
    if (error) return { error: error.message };
    return { removed: true };
}

export async function executeGeminiTool(name: string, args: any, userId: string) {
    switch (name) {
        case "search_destinations":
            return searchDestinations(args);
        case "list_saved_itineraries":
            return listSavedItineraries(userId);
        case "get_itinerary_detail":
            return getItineraryDetail(args);
        case "update_itinerary_stop":
            return updateItineraryStop(args);
        case "add_itinerary_stop":
            return addItineraryStop(args);
        case "remove_itinerary_stop":
            return removeItineraryStop(args);
        default:
            return { error: `Unknown tool: ${name}` };
    }
}