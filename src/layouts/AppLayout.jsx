import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function AppLayout() {
  return (
    <>
      <Header />   {/* Always visible */}
      <Outlet />    {/* Shows Landing / Dashboard / Auth */}
    </>
  );
}
