import { useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../db/supabase";

export default function Redirect() {
  const { code } = useParams(); // Matches route like /:code

  useEffect(() => {
    const handleRedirect = async () => {
      if (!code) {
        console.log("❌ No code found in URL params");
        return;
      }

      console.log("🔹 Starting redirect process for:", code);

      try {
        // 1️⃣ Fetch original URL
        const { data: urlData, error: urlError } = await supabase
          .from("urls")
          .select("*")
          .eq("short_url", code)
          .single();

        if (urlError || !urlData) {
          console.error("❌ URL not found!", urlError);
          alert("URL not found!");
          return;
        }

        console.log("✅ URL fetched:", urlData);

        // 2️⃣ Prepare REST RPC URL for increment_clicks
        const rpcUrl = `${supabase.supabaseUrl}/rest/v1/rpc/increment_clicks?apikey=${supabase.supabaseKey}`;
        const body = JSON.stringify({ url_id: urlData.id });

        // 3️⃣ Use navigator.sendBeacon for reliable click logging
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(rpcUrl, blob);

        // 4️⃣ Immediate redirect for the user
        window.location.replace(urlData.original_url);

      } catch (err) {
        console.error("❌ Fatal redirect error:", err);
      }
    };

    handleRedirect();
  }, [code]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        background: "#121212",
        color: "white",
      }}
    >
      Redirecting...
    </div>
  );
}
