// src/pages/RedirectLink.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../db/supabase";

export default function RedirectLink() {
  const { id } = useParams();

  useEffect(() => {
    const redirect = async () => {
      const { data: urlData, error } = await supabase
        .from("urls")
        .select("*")
        .eq("short_url", id)
        .single();

      if (error || !urlData) {
        window.location.href = "/"; 
        return;
      }

      // Increment clicks
      await supabase
        .from("urls")
        .update({ total_clicks: urlData.total_clicks + 1 })
        .eq("id", urlData.id);

      // Redirect to original
      window.location.replace(urlData.original_url);
    };

    redirect();
  }, [id]);

  return null;
}
