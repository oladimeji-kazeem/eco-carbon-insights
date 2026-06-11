import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://uuksoxhcsgltsegpaece.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1a3NveGhjc2dsdHNlZ3BhZWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMjQ1NzcsImV4cCI6MjA5NjcwMDU3N30.SXNHo-PY7Q2BGoh9CRebUSg8NRjbJypK7-uBoMrxYOQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function makeAdmin() {
    console.log("Looking for user oladimeji@ubasify.com...");
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, email').eq('email', 'oladimeji@ubasify.com');

    if (pErr) {
        console.error("Error fetching profiles:", pErr.message);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.log("Could not find user oladimeji@ubasify.com in profiles.");
        console.log("Perhaps the first migration hasn't completed or the user hasn't signed up yet!");
        return;
    }

    const userId = profiles[0].id;
    console.log("Found user ID:", userId);

    console.log("Setting role to 'admin'...");
    const { error: rErr } = await supabase.from('user_roles').insert({
        user_id: userId,
        role: "admin"
    });

    if (rErr) {
        // maybe it already exists?
        console.log("Insert failed (maybe role exists?). Attempting update...", rErr.message);
        const { error: uErr } = await supabase.from('user_roles').update({ role: "admin" }).eq('user_id', userId);
        if (uErr) {
            console.error("Failed to update role:", uErr.message);
        } else {
            console.log("Successfully updated oladimeji@ubasify.com to admin!");
        }
    } else {
        console.log("Successfully made oladimeji@ubasify.com admin!");
    }
}

makeAdmin();
