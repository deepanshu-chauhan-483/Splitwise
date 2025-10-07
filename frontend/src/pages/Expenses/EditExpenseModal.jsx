"use client";
import React, { useEffect, useState } from "react";
import groupService from "../../services/group.service";
import userService from "../../services/user.service";

export default function EditExpenseModal({ expense, onClose, onSave }) {
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    _id: expense._id,
    description: expense.description || "",
    amount: expense.amount || "",
    groupId: expense.groupId || "",
    paidBy: expense.paidBy || "",
    splitType: expense.splitType || "equal",
    participants: expense.participants || [],
    splitDetails: expense.splitDetails || [],
  });

  useEffect(() => {
    const load = async () => {
      const grpRes = await groupService.getGroups();
      setGroups(grpRes.data);
      const usrRes = await userService.getAllUsers();
      setUsers(usrRes.data);
    };
    load();
  }, []);

  useEffect(() => {
    if (form.groupId) {
      const g = groups.find((g) => g._id === form.groupId);
      if (g) setMembers(g.members);
    } else {
      setMembers(users);
    }
  }, [form.groupId, groups, users]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleParticipant = (id) => {
    setForm((prev) => {
      const exists = prev.participants.includes(id);
      const participants = exists
        ? prev.participants.filter((p) => p !== id)
        : [...prev.participants, id];
      return { ...prev, participants };
    });
  };

  const handleSplitDetailChange = (id, value) => {
    setForm((prev) => {
      const details = prev.splitDetails.filter((d) => d.userId !== id);
      details.push({ userId: id, amount: Number(value) });
      return { ...prev, splitDetails: details };
    });
  };

  useEffect(() => {
    if (form.splitType === "equal" && form.participants.length > 0 && form.amount) {
      const share = Number(form.amount) / form.participants.length;
      const details = form.participants.map((id) => ({
        userId: id,
        amount: Number.parseFloat(share.toFixed(2)),
      }));
      setForm((prev) => ({ ...prev, splitDetails: details }));
    }
  }, [form.splitType, form.participants, form.amount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure splitDetails.userId matches participants
    const validSplitDetails = form.splitDetails.map((s) => {
      if (!s.userId) return null;
      return s;
    }).filter(Boolean);
    onSave({ ...form, splitDetails: validSplitDetails });
  };

  const inputClass =
    "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-slate-700";
  const cardClass = "rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200";

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl max-w-3xl w-full mx-auto space-y-6 overflow-auto max-h-[90vh] p-6"
      >
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Edit Expense</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-red-500 font-medium hover:underline"
          >
            ×
          </button>
        </header>

        {/* Description, Amount, Group, PaidBy, SplitType */}
        <section className={cardClass}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g., Dinner at Bistro"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Amount (₹)</label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Group (optional)</label>
              <select
                name="groupId"
                value={form.groupId}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">No Group (Personal)</option>
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Paid By</label>
              <select
                name="paidBy"
                value={form.paidBy}
                onChange={handleChange}
                className={inputClass}
              >
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Split Type</label>
              <select
                name="splitType"
                value={form.splitType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="equal">Equal</option>
                <option value="unequal">Unequal</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
          </div>
        </section>

        {/* Participants */}
        <section className={cardClass}>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Select Participants</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {members.map((m) => {
              const active = form.participants.includes(m._id);
              return (
                <label
                  key={m._id}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleParticipant(m._id)}
                    className="sr-only"
                  />
                  {m.name}
                </label>
              );
            })}
          </div>
        </section>

        {/* Unequal / Percentage Split */}
        {(form.splitType === "unequal" || form.splitType === "percentage") && (
          <section className={cardClass}>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              {form.splitType === "unequal"
                ? "Enter individual amounts"
                : "Enter percentage shares"}
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {form.participants.map((id) => {
                const u = members.find((x) => x._id === id);
                const val = form.splitDetails.find((d) => d.userId === id)?.amount || "";
                return (
                  <div key={id}>
                    <label className={labelClass}>{u?.name}</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder={form.splitType === "percentage" ? "0 (%)" : "0.00"}
                      value={val}
                      onChange={(e) => handleSplitDetailChange(id, e.target.value || 0)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
