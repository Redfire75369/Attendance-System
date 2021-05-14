import {createClient} from "@supabase/supabase-js";
import getConfig from "next/config";

const {
	publicRuntimeConfig: {SUPABASE_URL},
	serverRuntimeConfig: {SUPABASE_ADMIN_KEY}
} = getConfig();

const supabase = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY);

export default supabase;
