import { useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../db/supabase";

export default function Redirect() {
  const { code } = useParams();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!code) return;

      try {
        // 1️⃣ Fetch original URL
        const { data: urlData, error: urlError } = await supabase
          .from("urls")
          .select("*")
          .eq("short_url", code)
          .single();

        if (urlError || !urlData) {
          alert("URL not found!");
          return;
        }

        // 2️⃣ Log the click in background (no await for redirect to work fast)
        (async () => {
          try {
            let city = "Unknown";
            let country = "Unknown";

            // Geo info (optional)
            fetch("https://ipinfo.io/json?token=YOUR_REAL_TOKEN")
              .then((res) => res.json())
              .then(async (geo) => {
                city = geo.city || "Unknown";
                country = geo.country || "Unknown";

                // Insert into clicks table
                await supabase.from("clicks").insert([
                  {
                    url_id: urlData.id,
                    device: navigator.userAgent,
                    city,
                    country,
                  },
                ]);

                // Increment total_clicks atomically
                await supabase.rpc("increment_clicks", { url_id: urlData.id });
              });
          } catch (err) {
            console.warn("Analytics logging failed:", err);
          }
        })();

        // 3️⃣ Redirect immediately
        window.location.replace(urlData.original_url);

      } catch (err) {
        console.error("Unexpected error:", err);
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
