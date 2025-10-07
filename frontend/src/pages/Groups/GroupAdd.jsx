"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { createGroup } from "../../store/slices/groupsSlice"
import { useNavigate } from "react-router-dom"

export default function GroupAdd() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", description: "" })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createGroup(form))
    navigate("/groups")
  }

  const inputClass =
    "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  const labelClass = "block text-sm font-medium text-slate-700"

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-4"
      >
        <h2 className="text-xl font-semibold text-slate-900">Create Group</h2>

        <div>
          <label htmlFor="name" className={labelClass}>
            Group Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Goa Trip"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short description"
            className={inputClass}
            rows={3}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 transition"
          >
            Create
          </button>
        </div>
      </form>
    </main>
  )
}
