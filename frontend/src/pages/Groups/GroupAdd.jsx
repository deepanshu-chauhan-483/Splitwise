import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createGroup } from "../../store/slices/groupsSlice";
import { useNavigate } from "react-router-dom";

export default function GroupAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createGroup(form));
    navigate("/groups");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">Create Group</h2>
        <input
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Group Name"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description (optional)"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create
        </button>
      </form>
    </div>
  );
}
