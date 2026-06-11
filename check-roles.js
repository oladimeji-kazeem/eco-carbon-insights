import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://uuksoxhcsgltsegpaece.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1a3NveGhjc2dsdHNlZ3BhZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMjQ1NzcsImV4cCI6MjA5NjcwMDU3N30.SXNHo-PY7Q2BGoh9CRebUSg8NRjbJypK7-uBoMrxYOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkRoles() {
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, email, display_name');
    if (pErr) {
        console.error("Error fetching profiles:", pErr.message);
    } else {
        console.log("--- PROFILES ---");
        console.log(profiles);
    }

    const { data: roles, error: rErr } = await supabase.from('user_roles').select('*');
    if (rErr) {
        console.error("Error fetching roles:", rErr.message);
    } else {
        console.log("--- ROLES ---");
        console.log(roles);
    }
}

checkRoles();
