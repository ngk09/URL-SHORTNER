import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <h2>Loading...</h2>;   // Wait while checking
  if (!user) return <Navigate to="/auth" />; // Redirect if not logged in

  return children; // Show the protected page
}
