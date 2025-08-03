import React, { useState, useEffect } from "react";
import supabase from "../db/supabase";
import useAuth from "../hooks/useAuth";
import QRCode from "qrcode";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);

  const HOST_URL = window.location.origin;

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

  useEffect(() => {
    fetchUrls();
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
    const { error } = await supabase.from("urls").delete().eq("id", id);
    if (error) console.error("Delete failed:", error);
    fetchUrls();
  };

  const downloadQR = (qr, code) => {
    const link = document.createElement("a");
    link.href = qr;
    link.download = `qr-${code}.png`;
    link.click();
  };

  // Line Chart: Total Clicks per URL (use total_clicks directly)
  const lineChartData = {
    labels: urls.map((u) => u.short_url),
    datasets: [
      {
        label: "Total Clicks Per URL",
        data: urls.map((u) => u.total_clicks),
        borderColor: "#00f7ff",
        backgroundColor: "rgba(0, 247, 255, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#0a0a0a",
        color: "white",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#00f7ff", textShadow: "0 0 20px #00f7ff" }}>
        ⚡ My Neon Dashboard ⚡
      </h1>

      {/* Shorten Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <input
          type="url"
          placeholder="Enter URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{
            padding: "10px",
            width: "300px",
            border: "2px solid #00f7ff",
            background: "#111",
            color: "white",
            outline: "none",
            boxShadow: "0 0 10px #00f7ff",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#00f7ff",
            color: "#000",
            fontWeight: "bold",
            border: "none",
            boxShadow: "0 0 20px #00f7ff",
            cursor: "pointer",
          }}
        >
          Shorten
        </button>
      </form>

      {/* URLs Table */}
      <table
        style={{
          background: "#111",
          color: "white",
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 0 20px #00f7ff",
        }}
      >
        <thead>
          <tr style={{ background: "#00f7ff", color: "#000" }}>
            <th>Short URL</th>
            <th>QR Code</th>
            <th>Total Clicks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((item) => (
            <tr key={item.id} style={{ textAlign: "center" }}>
              <td>
                <a
                  href={`${HOST_URL}/${item.short_url}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#00f7ff", textShadow: "0 0 10px #00f7ff" }}
                >
                  {HOST_URL}/{item.short_url}
                </a>
              </td>
              <td>
                <img src={item.qr} alt="QR" width="80" />
              </td>
              <td>{item.total_clicks}</td>
              <td>
                <button
                  onClick={() => downloadQR(item.qr, item.short_url)}
                  style={{
                    marginRight: "10px",
                    padding: "5px 10px",
                    background: "#00f7ff",
                    color: "#000",
                    border: "none",
                    boxShadow: "0 0 10px #00f7ff",
                    cursor: "pointer",
                  }}
                >
                  Download QR
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    padding: "5px 10px",
                    background: "#ff005c",
                    color: "white",
                    border: "none",
                    boxShadow: "0 0 10px #ff005c",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Line Chart Only */}
      <h2 style={{ marginTop: "40px", color: "#00f7ff", textShadow: "0 0 15px #00f7ff" }}>
        📈 Total Clicks Analytics
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            width: "600px",
            background: "#111",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 20px #00f7ff",
          }}
        >
          <Line data={lineChartData} />
        </div>
      </div>
    </div>
  );
}
