"use client"

export default function ExpenseCard({ expense, onDelete }) {
  const { description, amount, paidBy, participants } = expense

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md flex items-center justify-between">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{description}</h3>
        <p className="text-sm text-slate-500">
          Paid by <span className="font-medium text-slate-700">{paidBy?.name}</span> • {participants.length} people
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm sm:text-base font-semibold text-blue-600">₹{amount}</span>
        <button
          onClick={() => onDelete(expense._id)}
          aria-label="Delete expense"
          className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
