import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

// Load environmental variables directly for the backend script
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://uuksoxhcsgltsegpaece.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

if (!SUPABASE_KEY) {
    console.error("Missing Supabase Key");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
    console.log("Seeding dummy audit logs...");

    // Let's see if we have at least one user
    const { data: users, error: userErr } = await supabase.from('profiles').select('id').limit(1);
    const actorId = users && users.length > 0 ? users[0].id : null;

    const logsToInsert = Array.from({ length: 15 }).map((_, i) => ({
        action: `SYSTEM_MAINTENANCE_EVENT_${i + 1}`,
        actor_id: actorId, // Tie to the existing admin if possible, or leave null for 'System'
        meta: { note: "Dummy log for viewing in the System Console" }
    }));

    const { error } = await supabase.from("content_audit_log").insert(logsToInsert);

    if (error) {
        console.error("Error seeding logs:", error.message);
    } else {
        console.log("Successfully seeded 15 dummy audit logs!");
    }
}

seed();
