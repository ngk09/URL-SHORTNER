import { useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../db/supabase";

export default function Redirect() {
  const { code } = useParams();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!code) return;

      try {
        // 1️⃣ Fetch URL
        const { data: urlData, error: urlError } = await supabase
          .from("urls")
          .select("*")
          .eq("short_url", code)
          .single();

        if (urlError || !urlData) {
          alert("URL not found!");
          return;
        }

        // 2️⃣ Redirect first (non-blocking)
        window.location.replace(urlData.original_url);

        // 3️⃣ Log click in background
        // Use a Supabase function for atomic increment
        await supabase.rpc("increment_clicks", { url_id: urlData.id });

      } catch (err) {
        console.error("Redirect error:", err);
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
