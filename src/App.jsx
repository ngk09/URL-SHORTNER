import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import LandingPage from "./pages/Landing";
import Dashboard from "./pages/dashboard";
import Auth from "./pages/Auth";
import RedirectLink from "./pages/redirect-link"; //  Fixed import to match file name
import ErrorPage from "./pages/ErrorPage";

// Layout & Components
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Router Setup
const router = createBrowserRouter([
  {
    path: "/",                   // Base path
    element: <AppLayout />,       // Main layout
    errorElement: <ErrorPage />,  // Handles route errors or 404
    children: [
      {
        index: true,              // Default child for "/"
        element: <LandingPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: ":id",               // Handles short URL redirection
        element: <RedirectLink />,
      },
      {
        path: "*",
        element: <ErrorPage />,    // Catch-all 404
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
