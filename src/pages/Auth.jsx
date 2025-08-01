import React, { useState } from "react";
import Login from "../components/Login"; // ✅ Use default export with capital first letter
import Signup from "../components/Signup";

const Auth = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <>
      <style>
        {`
          .auth-page {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #001f4d;
            flex-direction: column;
            gap: 30px;
          }

          .auth-buttons {
            display: flex;
            gap: 30px;
          }

          .auth-btn {
            padding: 15px 40px;
            font-size: 1.3rem;
            font-weight: 600;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: white;
          }

          .login-btn {
            background-color: #007bff;
          }

          .login-btn:hover {
            background-color: #0056b3;
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
          }

          .signup-btn {
            background-color: #28a745;
          }

          .signup-btn:hover {
            background-color: #1e7e34;
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
          }
        `}
      </style>

      <div className="auth-page">
        {!activeComponent && (
          <>
            <h1 style={{ color: "white", fontSize: "2.5rem", marginBottom: "20px" }}>
              Welcome to Trimmr
            </h1>

            <div className="auth-buttons">
              <button
                className="auth-btn login-btn"
                onClick={() => setActiveComponent("login")}
              >
                Login
              </button>
              <button
                className="auth-btn signup-btn"
                onClick={() => setActiveComponent("signup")}
              >
                Sign Up
              </button>
            </div>
          </>
        )}

        {activeComponent === "login" && <Login />}
        {activeComponent === "signup" && <Signup />}
      </div>
    </>
  );
};

export default Auth;
