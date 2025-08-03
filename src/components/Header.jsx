import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import supabase from "../db/supabase";

export default function Header() {
  const { user } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = "/auth"; // Redirect to login page
    } else {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav
      style={{
        background: "linear-gradient(90deg, #001f3f, #003366, #001f3f)",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 0 20px #00f7ff, 0 0 40px #00f7ff",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#00f7ff",
          textDecoration: "none",
          textShadow: "0 0 15px #00f7ff, 0 0 30px #00f7ff",
        }}
      >
        VV URL SHORTNER
      </Link>

      {/* Right Side: Login / Logout */}
      <div>
        {!user ? (
          <Link
            to="/auth"
            style={{
              padding: "10px 20px",
              background: "#00f7ff",
              color: "#000",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
              boxShadow: "0 0 20px #00f7ff, 0 0 40px #00f7ff",
            }}
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "#00f7ff",
              color: "#000",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 20px #00f7ff, 0 0 40px #00f7ff",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
