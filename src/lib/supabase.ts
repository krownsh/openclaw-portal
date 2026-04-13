import { createClient } from "@supabase/supabase-js";

export function supabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("Missing env NEXT_PUBLIC_SUPABASE_URL");
  if (!anon) throw new Error("Missing env NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, anon);
}

export function contentTable(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_TABLE || "portal_content";
}

