import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import ExpensesList from "./pages/Expenses/ExpensesList";
import ExpenseAdd from "./pages/Expenses/ExpenseAdd";
import ExpenseDetails from "./pages/Expenses/ExpenseDetails";

import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/auth/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Default redirect to Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Expenses Routes */}
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <ExpensesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses/add"
        element={
          <ProtectedRoute>
            <ExpenseAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses/:id"
        element={
          <ProtectedRoute>
            <ExpenseDetails />
          </ProtectedRoute>
        }
      />

      {/* Auth */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />

      {/* 404 */}
      <Route path="*" element={<div className="p-8">404 - Not found</div>} />
    </Routes>
  );
}

