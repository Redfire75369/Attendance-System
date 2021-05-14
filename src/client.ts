import {createClient} from "@supabase/supabase-js";
import getConfig from "next/config";

const {
	publicRuntimeConfig: {SUPABASE_URL, SUPABASE_ANON_KEY},
} = getConfig();

const anonSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default anonSupabase;
