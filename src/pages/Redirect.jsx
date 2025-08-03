import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import supabase from "../db/supabase";

export default function Redirect() {
  const { code } = useParams(); 
  const clickedRef = useRef(false); // ✅ Prevent double increment

  useEffect(() => {
    const handleRedirect = async () => {
      if (!code || clickedRef.current) return; // ✅ Already incremented
      clickedRef.current = true;

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

        // 2️⃣ Increment clicks
        const { error: updateError } = await supabase
          .from("urls")
          .update({ total_clicks: urlData.total_clicks + 1 })
          .eq("id", urlData.id);

        if (updateError) console.error("❌ Click increment failed:", updateError);
        else console.log("✅ Click incremented successfully");

        // 3️⃣ Redirect after increment
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
