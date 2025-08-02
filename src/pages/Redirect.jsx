import { useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../db/supabase";

export default function Redirect() {
  const { code } = useParams();

  useEffect(() => {
    const handleRedirect = async () => {
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

        // 2️⃣ Get location (non-blocking)
        let city = "Unknown";
        let country = "Unknown";

        const fetchLocation = async () => {
          try {
            const res = await fetch(
              "https://ipinfo.io/json?token=YOUR_IPINFO_TOKEN"
            ); // ✅ Replace with your free ipinfo token
            if (res.ok) {
              const geo = await res.json();
              city = geo.city || "Unknown";
              country = geo.country || "Unknown";
            }
          } catch {
            console.log("⚠️ Location fetch failed, continuing redirect...");
          }
        };

        // Fetch location but don't wait to redirect
        fetchLocation().then(async () => {
          await supabase.from("clicks").insert([
            {
              url_id: urlData.id,
              device: navigator.userAgent,
              city,
              country,
            },
          ]);

          await supabase
            .from("urls")
            .update({ total_clicks: (urlData.total_clicks || 0) + 1 })
            .eq("id", urlData.id);
        });

        // 3️⃣ Immediate redirect
        window.location.href = urlData.original_url;
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
