import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "U";
  const parts = String(nameOrEmail).trim().split(/\s+/);
  if (parts.length === 1) {
    const base = parts[0].split("@")[0] || parts[0];
    return base.slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);

  const initials = useMemo(() => getInitials(user?.name || user?.email), [user]);

  const navLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Groups", to: "/groups" },
    { label: "Expenses", to: "/expenses" },
    { label: "Balances", to: "/balances" },
    { label: "Users", to: "/users" },
    { label: "Profile", to: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-blue-600 text-white shadow">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-semibold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-md"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6"
          >
            <path d="M4 12c3.5-2.5 8.5-2.5 12 0M6 17c2.5-1.5 9.5-1.5 12 0M6 7c2.5 1.5 9.5 1.5 12 0" />
          </svg>
          Splitwise Clone
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cx(
                  "px-3 py-1.5 rounded-md transition-colors duration-150",
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                )
              }
            >
              {label}
            </NavLink>
          ))}

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-white/20">
              <div
                title={user?.name || user?.email}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold"
              >
                {initials}
              </div>
              <span className="truncate max-w-[10rem] text-white/90">
                {user?.name || user?.email}
              </span>
              <button
                onClick={() => dispatch(logout())}
                className="ml-2 rounded-md border border-white/20 px-3 py-1.5 text-white/90 hover:bg-white/10 transition"
              >
                Logout
              </button>
            </div>
          )}

          {!user && (
            <div className="flex gap-2">
              <Link
                to="/auth/login"
                className="px-3 py-1.5 rounded-md text-white/90 hover:bg-white/10 transition"
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="px-3 py-1.5 rounded-md bg-white/15 hover:bg-white/25 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6"
          >
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-blue-700/95 border-t border-white/10 py-3">
          <div className="mx-4 flex flex-col gap-1">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cx(
                    "rounded-md px-3 py-2 text-sm",
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10"
                  )
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="mt-3 border-t border-white/10 pt-3 flex items-center justify-between">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/20 font-semibold">
                      {initials}
                    </div>
                    <span className="truncate max-w-[8rem] text-white/90">
                      {user?.name || user?.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      dispatch(logout());
                      setOpen(false);
                    }}
                    className="text-sm px-3 py-1.5 border border-white/20 rounded-md hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={() => setOpen(false)}
                  className="text-sm px-3 py-1.5 border border-white/20 rounded-md hover:bg-white/10"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
