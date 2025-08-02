import React, { useState } from "react";
import supabase from "../db/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // 1️⃣ Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setMessage("✅ Signup successful! Check your email for verification.");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
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
      <form
        onSubmit={handleSignup}
        style={{
          background: "rgba(20, 20, 40, 0.9)",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 0 25px #ff758c, 0 0 50px #ff7eb3",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#fff",
            marginBottom: "20px",
            textShadow: "0 0 10px #ff758c, 0 0 20px #ff7eb3",
          }}
        >
          Neon Signup
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            margin: "10px 0",
            borderRadius: "10px",
            border: "2px solid #ff7eb3",
            background: "transparent",
            color: "white",
            outline: "none",
            boxShadow: "0 0 10px #ff7eb3",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            margin: "10px 0",
            borderRadius: "10px",
            border: "2px solid #ff758c",
            background: "transparent",
            color: "white",
            outline: "none",
            boxShadow: "0 0 10px #ff758c",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 20px #ff758c, 0 0 40px #ff7eb3",
            transition: "0.3s",
          }}
          onMouseOver={(e) =>
            (e.target.style.boxShadow =
              "0 0 30px #ff758c, 0 0 60px #ff7eb3")
          }
          onMouseOut={(e) =>
            (e.target.style.boxShadow =
              "0 0 20px #ff758c, 0 0 40px #ff7eb3")
          }
        >
          Sign Up
        </button>

        {message && (
          <p
            style={{
              marginTop: "15px",
              fontWeight: "bold",
              color: "#fff",
              textShadow: "0 0 10px #ff758c, 0 0 20px #ff7eb3",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
