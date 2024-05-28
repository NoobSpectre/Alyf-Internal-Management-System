"use client";

import { supabaseClient } from "@lib/supabase-client";
import { dataProvider as dataProviderSupabase } from "@refinedev/supabase";

export const dataProvider = dataProviderSupabase(supabaseClient);
