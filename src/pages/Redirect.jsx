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

        // 2️⃣ Immediate redirect for the user
        window.location.replace(urlData.original_url);

        // 3️⃣ Increment click count with slight delay to ensure request is sent
        setTimeout(async () => {
          try {
            const { data: rpcData, error: rpcError } = await supabase.rpc(
              "increment_clicks",
              { url_id: urlData.id }
            );

            if (rpcError) {
              console.error("❌ Click increment failed:", rpcError.message);
            } else {
              console.log("✅ Click incremented successfully:", rpcData);
            }
          } catch (err) {
            console.error("❌ Unexpected error updating click:", err);
          }
        }, 500); // 0.5 second delay to ensure browser doesn't cancel the request

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
