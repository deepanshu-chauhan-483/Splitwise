// QuickAddExpenseModal.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addExpense } from "../../store/slices/expensesSlice";

export default function QuickAddExpenseModal({ open, onClose, groups = [] }) {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    splitType: "equal",
    participants: user ? [user.id] : [],
    splitDetails: [],
    groupId: ""
  });

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic payload
    const payload = {
      description: form.description,
      amount: Number(form.amount),
      participants: form.participants, // for now includes payer and maybe others
      splitType: form.splitType,
      splitDetails: form.splitDetails, // if empty and equal split, backend will calculate
      groupId: form.groupId || null
    };
    dispatch(addExpense(payload));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-md shadow">
        <h3 className="text-lg font-semibold mb-3">Quick Add Expense</h3>
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded mb-2" required />
        <input name="amount" value={form.amount} onChange={handleChange} type="number" placeholder="Amount" className="w-full border p-2 rounded mb-2" required />
        <select name="splitType" value={form.splitType} onChange={handleChange} className="w-full border p-2 rounded mb-2">
          <option value="equal">Equal</option>
          <option value="unequal">Unequal</option>
          <option value="percentage">Percentage</option>
        </select>

        <select name="groupId" value={form.groupId} onChange={handleChange} className="w-full border p-2 rounded mb-4">
          <option value="">-- No group (personal) --</option>
          {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-3 py-1 rounded border">Cancel</button>
          <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
        </div>
      </form>
    </div>
  );
}
