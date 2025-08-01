import React, { useState } from "react";
import supabase from "../db/supabase";
import QRCode from "qrcode";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Generate random short code
    const code = Math.random().toString(36).substring(2, 8);

    // 2️⃣ Generate QR Code as base64
    const qr = await QRCode.toDataURL(url);

    // 3️⃣ Save to Supabase
    const { data, error } = await supabase.from("urls").insert([
      {
        original_url: url,
        short_url: code,
        qr: qr,
        total_clicks: 0,
      },
    ]).select("*").single();

    if (!error) {
      setShortUrl(`${window.location.origin}/${code}`);
      setQrCode(qr);
      setUrl("");
    } else {
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter long URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit">Shorten</button>
      </form>

      {shortUrl && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Short URL:</strong> <a href={shortUrl}>{shortUrl}</a></p>
          <img src={qrCode} alt="QR Code" style={{ width: "150px" }} />
        </div>
      )}
    </div>
  );
}
