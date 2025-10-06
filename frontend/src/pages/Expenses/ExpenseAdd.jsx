import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense } from "../../store/slices/expensesSlice";
import { useNavigate } from "react-router-dom";

export default function ExpenseAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    splitType: "equal",
    participants: [user?.id],
    splitDetails: [],
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      amount: Number(form.amount),
      participants: [user.id], // For now only current user, extend later
      splitType: form.splitType,
    };
    dispatch(addExpense(payload));
    navigate("/expenses");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">Add Expense</h2>

        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          type="number"
          placeholder="Amount"
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="splitType"
          value={form.splitType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="equal">Equal</option>
          <option value="unequal">Unequal</option>
          <option value="percentage">Percentage</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
