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

        // 2️⃣ Get location (using ipinfo for better reliability)
        let city = "Unknown";
        let country = "Unknown";
        try {
          const res = await fetch("https://ipinfo.io/json?token=YOUR_TOKEN"); // replace YOUR_TOKEN
          if (res.ok) {
            const geo = await res.json();
            city = geo.city || "Unknown";
            country = geo.country || "Unknown";
          }
        } catch (err) {
          console.log("Location fetch failed:", err);
        }

        // 3️⃣ Log click in Supabase
        const { error: clickError } = await supabase.from("clicks").insert([
          {
            url_id: urlData.id,
            device: navigator.userAgent,
            city,
            country,
          },
        ]);

        if (clickError) console.error("Error logging click:", clickError);

        // 4️⃣ Increment total clicks
        const { error: updateError } = await supabase
          .from("urls")
          .update({ total_clicks: (urlData.total_clicks || 0) + 1 })
          .eq("id", urlData.id);

        if (updateError) console.error("Error updating clicks:", updateError);

        // 5️⃣ Redirect to original URL
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
