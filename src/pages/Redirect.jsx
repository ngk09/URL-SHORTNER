import { useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../db/supabase";

export default function Redirect() {
  const { id: code } = useParams(); // ✅ Fixed param name

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

        // 2️⃣ Immediate redirect
        window.location.href = urlData.original_url;

        // 3️⃣ Log analytics in background
        let city = "Unknown";
        let country = "Unknown";

        try {
          const res = await fetch(
            "https://ipinfo.io/json?token=YOUR_REAL_TOKEN" // ✅ Replace
          );
          if (res.ok) {
            const geo = await res.json();
            city = geo.city || "Unknown";
            country = geo.country || "Unknown";
          }
        } catch {}

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
