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
        boxShadow: "0 0 20px #ff758c, 0 0 40px #ff7eb3",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo / Brand Name */}
      <Link
        to="/"
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#fff",
          textDecoration: "none",
          textShadow: "0 0 10px #ff758c, 0 0 20px #ff7eb3",
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
              background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
              boxShadow: "0 0 15px #ff758c, 0 0 30px #ff7eb3",
            }}
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 15px #ff758c, 0 0 30px #ff7eb3",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
