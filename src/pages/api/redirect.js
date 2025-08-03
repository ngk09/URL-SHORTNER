import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service Role Key for guaranteed update
);

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing short code");
  }

  // 1️⃣ Fetch URL
  const { data: urlData, error: urlError } = await supabase
    .from("urls")
    .select("*")
    .eq("short_url", code)
    .single();

  if (urlError || !urlData) {
    return res.status(404).send("URL not found");
  }

  // 2️⃣ Increment clicks atomically
  await supabase.rpc("increment_clicks", { url_id: urlData.id });

  // 3️⃣ Redirect user
  res.writeHead(302, { Location: urlData.original_url });
  res.end();
}
