"use client"

import { useMemo, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/slices/authSlice"

// tiny className joiner used as `cx` in the project
const cx = (...parts) => parts.filter(Boolean).join(" ")

const getInitials = (nameOrEmail = "") => {
  if (!nameOrEmail) return ""
  const parts = nameOrEmail.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Navbar() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const [open, setOpen] = useState(false)

  const initials = useMemo(() => getInitials(user?.name || user?.email), [user])

  const baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace("/api", "") : ""

  const navLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Groups", to: "/groups" },
    { label: "Expenses", to: "/expenses" },
    { label: "Balances", to: "/balances" },
    { label: "Users", to: "/users" },
    { label: "Profile", to: "/profile" },
  ]

  return (
    <header className="sticky top-0 z-40 bg-blue-600 text-white shadow">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
            <path d="M4 12c3.5-2.5 8.5-2.5 12 0M6 17c2.5-1.5 9.5-1.5 12 0M6 7c2.5 1.5 9.5 1.5 12 0" />
          </svg>
          Splitwise Clone
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-4 text-sm font-medium md:flex">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              className={({ isActive }) =>
                cx(
                  "rounded-md px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                  isActive ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10 hover:text-white",
                )
              }
              to={to}
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <div className="flex items-center gap-3 border-l border-white/20 pl-3">
              <img
                src={
                  user.avatarUrl
                    ? `${baseUrl}${user.avatarUrl}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || user.email,
                      )}&background=random`
                }
                alt="avatar"
                className="w-8 h-8 rounded-full border"
              />
              <span className="truncate max-w-[10rem] text-white/90">{user.name || user.email}</span>
              <button
                onClick={() => dispatch(logout())}
                className="ml-2 rounded-md border border-white/20 px-3 py-1.5 text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/auth/login"
                className="rounded-md px-3 py-1.5 text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="rounded-md bg-white/15 px-3 py-1.5 transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:hidden"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
            {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="bg-blue-700/95 border-t border-white/10 py-3 md:hidden">
          <div className="mx-4 flex flex-col gap-1">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cx(
                    "rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                    isActive ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10",
                  )
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/20 font-semibold">
                      {initials}
                    </div>
                    <span className="truncate max-w-[8rem] text-white/90">{user.name || user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      dispatch(logout())
                      setOpen(false)
                    }}
                    className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
