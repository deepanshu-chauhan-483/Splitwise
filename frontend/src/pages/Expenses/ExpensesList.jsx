import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses, deleteExpense } from "../../store/slices/expensesSlice";
import ExpenseCard from "../../components/expenses/ExpenseCard";
import { Link } from "react-router-dom";

export default function ExpensesList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.expenses);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleDelete = (id) => dispatch(deleteExpense(id));

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Expenses</h2>
        <Link
          to="/expenses/add"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Expense
        </Link>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && list.length === 0 && <p>No expenses yet.</p>}

      <div className="space-y-3">
        {list.map((e) => (
          <ExpenseCard key={e._id} expense={e} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
