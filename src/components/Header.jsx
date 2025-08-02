import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import supabase from "../db/supabase"; // ✅ import

import "../index.css";

const Header = () => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut(); // ✅ use imported supabase
    if (!error) {
      window.location.href = "/auth";
    } else {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="header">
      <Link to="/">
        <img src="/logo.jpeg" className="logo" alt="Trimmr Logo" />
      </Link>

      <div className="header-right">
        {!user ? (
          <Link to="/auth" className="btn primary">Login</Link>
        ) : (
          <div
            className="dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <img
              src="/default-avatar.png"
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/dashboard" className="dropdown-item">My Links</Link>
                <button onClick={handleLogout} className="dropdown-item">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
