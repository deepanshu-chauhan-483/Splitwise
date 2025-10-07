"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchGroups } from "../../store/slices/groupsSlice"
import GroupCard from "../../components/groups/GroupCard"
import { Link } from "react-router-dom"

export default function GroupsList() {
  const dispatch = useDispatch()
  const { list, loading } = useSelector((s) => s.groups)

  useEffect(() => {
    dispatch(fetchGroups())
  }, [dispatch])

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Your Groups</h2>
            <p className="text-slate-600 text-sm">Create and manage shared expense groups.</p>
          </div>
          <Link
            to="/groups/add"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 transition"
          >
            + Create Group
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-slate-600">Loading...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-10 text-center text-slate-600">
            No groups yet. Click "Create Group" to get started.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {list.map((g) => (
              <GroupCard key={g._id} group={g} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
