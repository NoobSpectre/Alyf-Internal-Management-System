import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_DB_URL as string;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_DB_ANON_KEY as string;
export const supabaseBrowserClient = createBrowserClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    db: {
      schema: "public",
    },
  },
);