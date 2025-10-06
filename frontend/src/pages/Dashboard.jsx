import React from "react";
import Navbar from "../components/common/Navbar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name} 👋</h1>

        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <Link
            to="/expenses"
            className="bg-white p-6 rounded shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg mb-2 text-blue-600">
              View Expenses
            </h3>
            <p className="text-sm text-gray-600">
              See all your expenses and add new ones easily.
            </p>
          </Link>

          <Link
            to="/balances"
            className="bg-white p-6 rounded shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg mb-2 text-green-600">
              View Balances
            </h3>
            <p className="text-sm text-gray-600">
              Check who owes whom and settle up instantly.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
