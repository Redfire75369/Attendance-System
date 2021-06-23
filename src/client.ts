/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {createClient} from "@supabase/supabase-js";
import getConfig from "next/config";

const {
	publicRuntimeConfig: {SUPABASE_URL, SUPABASE_ANON_KEY},
} = getConfig();

const anonSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default anonSupabase;
