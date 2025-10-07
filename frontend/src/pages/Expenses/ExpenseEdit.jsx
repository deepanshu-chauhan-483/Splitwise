"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateExpense } from "../../store/slices/expensesSlice";
import { useNavigate, useParams } from "react-router-dom";
import groupService from "../../services/group.service";
import userService from "../../services/user.service";
import expenseService from "../../services/expense.service";

export default function ExpenseEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((s) => s.auth);

  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    groupId: "",
    paidBy: user?._id,
    splitType: "equal",
    participants: [],
    splitDetails: [],
  });

  // Load expense + groups + users
  useEffect(() => {
    const load = async () => {
      const [grpRes, usrRes, expenseRes] = await Promise.all([
        groupService.getGroups(),
        userService.getAllUsers(),
        expenseService.getExpenseById(id),
      ]);

      setGroups(grpRes.data);
      setUsers(usrRes.data);

      const e = expenseRes.data;
      setForm({
        description: e.description,
        amount: e.amount,
        groupId: e.groupId || "",
        paidBy: e.paidBy?._id || user?._id,
        splitType: e.splitType || "equal",
        participants: e.participants.map((p) => p._id),
        splitDetails: e.splitDetails.map((d) => ({
          userId: d.userId?._id || d.userId,
          amount: d.amount,
        })),
      });
    };
    load();
  }, [id]);

  // Update members based on group
  useEffect(() => {
    if (form.groupId) {
      const g = groups.find((g) => g._id === form.groupId);
      if (g) setMembers(g.members);
    } else {
      setMembers(users);
    }
  }, [form.groupId, groups, users]);

  // Handle form changes
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleParticipant = (id) => {
    setForm((prev) => {
      const exists = prev.participants.includes(id);
      const participants = exists ? prev.participants.filter((p) => p !== id) : [...prev.participants, id];
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

  // Recalculate equal split
  useEffect(() => {
    if (form.splitType === "equal" && form.participants.length > 0 && form.amount) {
      const share = Number(form.amount) / form.participants.length;
      const details = form.participants.map((id) => ({ userId: id, amount: Number.parseFloat(share.toFixed(2)) }));
      setForm((prev) => ({ ...prev, splitDetails: details }));
    }
  }, [form.splitType, form.participants, form.amount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateExpense({ ...form, _id: id }));
    navigate("/expenses");
  };

  const inputClass =
    "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-slate-700";
  const cardClass = "rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200";

  return (
    <main className="min-h-screen bg-slate-50">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Edit Expense</h2>
            <p className="text-slate-600 text-sm">Modify details and split among participants.</p>
          </div>
        </header>

        {/* Same UI as ExpenseAdd */}
        <section className={cardClass}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <input
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g., Dinner at Bistro"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className={labelClass}>
                Amount (₹)
              </label>
              <input
                id="amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                type="number"
                placeholder="0.00"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="groupId" className={labelClass}>
                Group (optional)
              </label>
              <select id="groupId" name="groupId" value={form.groupId} onChange={handleChange} className={inputClass}>
                <option value="">No Group (Personal)</option>
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="paidBy" className={labelClass}>
                Paid By
              </label>
              <select id="paidBy" name="paidBy" value={form.paidBy} onChange={handleChange} className={inputClass}>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="splitType" className={labelClass}>
                Split Type
              </label>
              <select
                id="splitType"
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

        {(form.splitType === "unequal" || form.splitType === "percentage") && (
          <section className={cardClass}>
            <h3 className="text-sm font-semibold text-slate-900">
              {form.splitType === "unequal" ? "Enter individual amounts" : "Enter percentage shares"}
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {form.participants.map((id) => {
                const u = members.find((x) => x._id === id);
                const value = form.splitDetails.find((d) => d.userId === id)?.amount || "";
                return (
                  <div key={id}>
                    <label className={labelClass}>{u?.name}</label>
                    <input
                      type="number"
                      className={inputClass}
                      placeholder={form.splitType === "percentage" ? "0 (%)" : "0.00"}
                      value={value}
                      onChange={(e) => handleSplitDetailChange(id, e.target.value || 0)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </main>
  );
}
