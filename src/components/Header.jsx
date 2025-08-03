import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import supabase from "../db/supabase";

export default function Header() {
  const { user } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = "/auth";
    } else {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav
      style={{
        background: "linear-gradient(90deg, #0f0c29, #302b63, #24243e)",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 0 20px #00f7ff, 0 0 40px #00d0ff",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo / Brand Name with BLUE NEON */}
      <Link
        to="/"
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#00f7ff", // Neon blue color
          textDecoration: "none",
          textShadow: `
            0 0 5px #00f7ff,
            0 0 10px #00f7ff,
            0 0 20px #00d0ff,
            0 0 40px #00d0ff
          `,
        }}
      >
        VV URL SHORTNER
      </Link>

      {/* Right Side Buttons */}
      <div>
        {!user ? (
          <Link
            to="/auth"
            style={{
              padding: "10px 20px",
              background: "linear-gradient(90deg, #00f7ff, #00d0ff)",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
              boxShadow: "0 0 15px #00f7ff, 0 0 30px #00d0ff",
            }}
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(90deg, #00f7ff, #00d0ff)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 15px #00f7ff, 0 0 30px #00d0ff",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
