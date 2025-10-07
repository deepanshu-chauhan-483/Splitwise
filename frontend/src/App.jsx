import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import ExpensesList from "./pages/Expenses/ExpensesList";
import ExpenseAdd from "./pages/Expenses/ExpenseAdd";
import ExpenseDetails from "./pages/Expenses/ExpenseDetails";
import Balances from "./pages/Balances";
import GroupsList from "./pages/Groups/GroupsList";
import GroupAdd from "./pages/Groups/GroupAdd";
import GroupDetails from "./pages/Groups/GroupDetails";
import ProtectedLayout from "./components/common/ProtectedLayout";
import Users from "./pages/Users";
import Profile from "./pages/Profile";

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
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* Expenses Routes */}
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ExpensesList />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses/add"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ExpenseAdd />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses/:id"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <ExpenseDetails />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/balances"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Balances />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <GroupsList />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/add"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <GroupAdd />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:id"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <GroupDetails />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Auth */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />

      {/* 404 */}
      <Route path="*" element={<div className="p-8">404 - Not found</div>} />
    </Routes>
  );
}
