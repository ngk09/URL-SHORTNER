import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Button = ({ text = "Login" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/auth"); // Navigate to /auth on click
  };

  return (
    <button className="btn login" onClick={handleClick}>
      {text}
    </button>
  );
};

export default Button;
