import { useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../db/supabase";

export default function RedirectLink() {
  const { id } = useParams();

  useEffect(() => {
    const redirect = async () => {
      // 1️⃣ Fetch the original URL
      const { data: urlData, error } = await supabase
        .from("urls")
        .select("*")
        .eq("short_url", id)
        .single();

      if (error || !urlData) {
        window.location.href = "/"; // Redirect home if short link not found
        return;
      }

      // 2️⃣ Detect Device
      const userAgent = navigator.userAgent;
      const isMobile = /Mobi|Android/i.test(userAgent);
      const deviceType = isMobile ? "Mobile" : "Desktop";

      // 3️⃣ Fetch IP location
      let city = "Unknown";
      let country = "Unknown";
      try {
        const res = await fetch("https://ipapi.co/json/");
        const info = await res.json();
        city = info.city || "Unknown";
        country = info.country_name || "Unknown";
      } catch (err) {
        console.warn("IP lookup failed:", err);
      }

      // 4️⃣ Insert Click Record
      await supabase.from("clicks").insert([
        {
          url_id: urlData.id,
          city,
          country,
          device: userAgent,
        },
      ]);

      // 5️⃣ Increment total clicks
      await supabase
        .from("urls")
        .update({ total_clicks: urlData.total_clicks + 1 })
        .eq("id", urlData.id);

      // 6️⃣ Redirect to original URL
      window.location.replace(urlData.original_url);
    };

    redirect();
  }, [id]);

  // Nothing to show because we redirect instantly
  return null;
}
