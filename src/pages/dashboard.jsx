// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import supabase from "../db/supabase";
import useAuth from "../hooks/useAuth";
import QRCode from "qrcode";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [clicks, setClicks] = useState([]);

  const HOST_URL = "https://trimmr.vercel.app"; // Replace after deploy

  // Fetch URLs
  const fetchUrls = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("urls")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setUrls(data || []);
  };

  // Fetch Clicks
  const fetchClicks = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("clicks")
      .select("*, urls!inner(user_id,short_url)")
      .eq("urls.user_id", user.id);
    setClicks(data || []);
  };

  useEffect(() => {
    fetchUrls();
    fetchClicks();
  }, [user]);

  // Shorten URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    const code = Math.random().toString(36).substring(2, 8);
    const shortLink = `${HOST_URL}/${code}`;
    const qr = await QRCode.toDataURL(shortLink);

    const { error } = await supabase.from("urls").insert([
      {
        original_url: url,
        short_url: code,
        qr: qr,
        user_id: user.id,
        total_clicks: 0,
      },
    ]);

    if (!error) {
      setUrl("");
      fetchUrls();
    }
  };

  // Delete URL
  const handleDelete = async (id) => {
    await supabase.from("urls").delete().eq("id", id);
    fetchUrls();
    fetchClicks();
  };

  // Download QR
  const downloadQR = (qr, code) => {
    const link = document.createElement("a");
    link.href = qr;
    link.download = `qr-${code}.png`;
    link.click();
  };

  // 🔹 Analytics Data
  const deviceCounts = clicks.reduce(
    (acc, c) => {
      const device = /Mobi|Android/i.test(c.device) ? "Mobile" : "Desktop";
      acc[device] += 1;
      return acc;
    },
    { Desktop: 0, Mobile: 0 }
  );

  const urlClickCounts = urls.map(
    (u) => clicks.filter((c) => c.url_id === u.id).length
  );

  const locationCounts = clicks.reduce((acc, c) => {
    const loc = `${c.city || "Unknown"}, ${c.country || ""}`;
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Dashboard</h1>

      {/* Shorten Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="url"
          placeholder="Enter URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit">Shorten</button>
      </form>

      {/* URLs Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Short URL</th>
            <th>QR Code</th>
            <th>Total Clicks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((item) => (
            <tr key={item.id}>
              <td>
                <a
                  href={`${HOST_URL}/${item.short_url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {HOST_URL}/{item.short_url}
                </a>
              </td>
              <td>
                <img src={item.qr} alt="QR" width="80" />
              </td>
              <td>{item.total_clicks}</td>
              <td>
                <button onClick={() => downloadQR(item.qr, item.short_url)}>
                  Download QR
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Analytics Section */}
      <h2 style={{ marginTop: "40px" }}>📊 Analytics</h2>
      <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
        {/* Bar Chart - URL Clicks */}
        <div style={{ width: "400px" }}>
          <Bar
            data={{
              labels: urls.map((u) => u.short_url),
              datasets: [
                {
                  label: "Clicks per URL",
                  data: urlClickCounts,
                  backgroundColor: "#6e8efb",
                },
              ],
            }}
          />
        </div>

        {/* Pie Chart - Device Type */}
        <div style={{ width: "300px" }}>
          <Pie
            data={{
              labels: ["Desktop", "Mobile"],
              datasets: [
                {
                  label: "Device Type",
                  data: [deviceCounts.Desktop, deviceCounts.Mobile],
                  backgroundColor: ["#36A2EB", "#FF6384"],
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Location Bubbles */}
      <h3 style={{ marginTop: "40px" }}>🌎 Click Locations</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {Object.entries(locationCounts).map(([loc, count]) => (
          <div
            key={loc}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#6e8efb",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              textAlign: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            <small>{loc}</small>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
