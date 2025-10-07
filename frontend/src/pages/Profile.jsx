"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Navigate } from "react-router-dom"
import userService from "../services/user.service"
import { setUser } from "../store/slices/authSlice"
import Navbar from "../components/common/Navbar"

export default function Profile() {
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const baseUrl = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
    : ""

  // Redirect if not logged in
  if (!user) return <Navigate to="/auth/login" replace />

  const handleAvatarUpload = async (e) => {
    e.preventDefault()
    if (!file) return alert("Select a file first")
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("avatar", file)
      const res = await userService.uploadAvatar(formData)
      dispatch(setUser(res.data.user))
      alert("Avatar updated successfully!")
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
      <Navbar />

      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          My Profile
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center space-y-6 transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
          <img
            src={
              user.avatarUrl
                ? `${baseUrl}${user.avatarUrl}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=random`
            }
            alt={user.name}
            className="w-28 h-28 rounded-full border-2 border-blue-400 object-cover"
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <form onSubmit={handleAvatarUpload} className="w-full max-w-sm flex flex-col gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700 hover:file:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload Avatar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
