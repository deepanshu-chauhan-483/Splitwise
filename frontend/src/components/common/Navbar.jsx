import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();

  return (
    <nav className="bg-blue-600 text-white py-3 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
        <Link to="/dashboard" className="font-bold text-lg">Splitwise Clone</Link>
        <div className="flex gap-4 text-sm">
          <Link to="/expenses" className="hover:underline">Expenses</Link>
          <Link to="/balances" className="hover:underline">Balances</Link>
          <button onClick={() => dispatch(logout())} className="hover:underline">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
