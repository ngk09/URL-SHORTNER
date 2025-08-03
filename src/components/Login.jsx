import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../db/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else if (data?.user) {
      setMessage(`✅ Login Successful! Redirecting...`);
      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      setMessage("❌ Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(20, 20, 40, 0.9)",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 0 25px #6e8efb, 0 0 50px #a777e3",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            color: "#fff",
            textShadow: "0 0 10px #6e8efb, 0 0 20px #a777e3",
          }}
        >
          Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              margin: "10px 0",
              borderRadius: "10px",
              border: "2px solid #6e8efb",
              background: "transparent",
              color: "white",
              outline: "none",
              boxShadow: "0 0 10px #6e8efb",
            }}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              margin: "10px 0",
              borderRadius: "10px",
              border: "2px solid #a777e3",
              background: "transparent",
              color: "white",
              outline: "none",
              boxShadow: "0 0 10px #a777e3",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              background: "linear-gradient(90deg, #6e8efb, #a777e3)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 20px #6e8efb, 0 0 40px #a777e3",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.boxShadow =
                "0 0 30px #6e8efb, 0 0 60px #a777e3")
            }
            onMouseOut={(e) =>
              (e.target.style.boxShadow =
                "0 0 20px #6e8efb, 0 0 40px #a777e3")
            }
          >
            Login
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              fontWeight: "bold",
              color: "#fff",
              textShadow: "0 0 10px #6e8efb, 0 0 20px #a777e3",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
