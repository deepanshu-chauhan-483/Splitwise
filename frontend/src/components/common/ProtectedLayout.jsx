import React from "react";
import Navbar from "./Navbar";

export default function ProtectedLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">{children}</div>
    </div>
  );
}
