import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_KEY) {
  if (typeof window === "undefined") {
    console.log("Missing: SUPABASE_KEY");
  }
}

if (!process.env.SUPABASE_URL) {
  if (typeof window === "undefined") {
    console.log("Missing: SUPABASE_URL");
  }
}

export const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);
