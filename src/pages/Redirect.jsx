import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { code } = useParams();

  useEffect(() => {
    if (!code) return;

    // Redirect to serverless function
    const redirectUrl = `/api/redirect?code=${code}`;
    window.location.replace(redirectUrl);
  }, [code]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        background: "#121212",
        color: "white",
      }}
    >
      Redirecting...
    </div>
  );
}
