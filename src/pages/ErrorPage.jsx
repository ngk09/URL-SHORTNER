import React from "react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div style={{ textAlign: "center", padding: "60px", fontFamily: "Arial, sans-serif" }}>
      <h1>Oops! Page Not Found (404)</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
        Go Home
      </a>
    </div>
  );
}
