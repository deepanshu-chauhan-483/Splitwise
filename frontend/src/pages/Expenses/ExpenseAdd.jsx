import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense } from "../../store/slices/expensesSlice";
import { useNavigate, useParams } from "react-router-dom";
import groupService from "../../services/group.service";
import userService from "../../services/user.service";

export default function ExpenseAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groupId } = useParams(); // if adding within a group
  const { user } = useSelector((s) => s.auth);

  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    groupId: groupId || "",
    paidBy: user?._id,
    splitType: "equal",
    participants: [],
    splitDetails: [],
  });

  // 🔹 Fetch groups and members
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

  // 🔹 Handle participant toggle
  const toggleParticipant = (id) => {
    setForm((prev) => {
      const exists = prev.participants.includes(id);
      const participants = exists
        ? prev.participants.filter((p) => p !== id)
        : [...prev.participants, id];
      return { ...prev, participants };
    });
  };

  // 🔹 Handle split detail updates (for unequal/percentage)
  const handleSplitDetailChange = (id, value) => {
    setForm((prev) => {
      const details = prev.splitDetails.filter((d) => d.userId !== id);
      details.push({ userId: id, amount: Number(value) });
      return { ...prev, splitDetails: details };
    });
  };

  // 🔹 Auto-calculate equal split
  useEffect(() => {
    if (form.splitType === "equal" && form.participants.length > 0 && form.amount) {
      const share = Number(form.amount) / form.participants.length;
      const details = form.participants.map((id) => ({
        userId: id,
        amount: parseFloat(share.toFixed(2)),
      }));
      setForm((prev) => ({ ...prev, splitDetails: details }));
    }
  }, [form.splitType, form.participants, form.amount]);

  // 🔹 Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      description: form.description,
      amount: Number(form.amount),
      paidBy: form.paidBy,
      participants: form.participants,
      splitType: form.splitType,
      splitDetails: form.splitDetails,
      groupId: form.groupId || null,
    };
    dispatch(addExpense(payload));
    navigate("/expenses");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-xl max-w-2xl mx-auto space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Add New Expense</h2>

        {/* Description */}
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Expense description"
          className="w-full border p-2 rounded"
          required
        />

        {/* Amount */}
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          type="number"
          placeholder="Amount (₹)"
          className="w-full border p-2 rounded"
          required
        />

        {/* Group selection */}
        <select
          name="groupId"
          value={form.groupId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- No Group (Personal) --</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Paid By */}
        <select
          name="paidBy"
          value={form.paidBy}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        {/* Split Type */}
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

        {/* Participants */}
        <div className="space-y-1">
          <h3 className="font-semibold">Select Participants:</h3>
          <div className="grid grid-cols-2 gap-2">
            {members.map((m) => (
              <label
                key={m._id}
                className={`border p-2 rounded cursor-pointer ${
                  form.participants.includes(m._id)
                    ? "bg-green-100 border-green-600"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.participants.includes(m._id)}
                  onChange={() => toggleParticipant(m._id)}
                  className="mr-2"
                />
                {m.name}
              </label>
            ))}
          </div>
        </div>

        {/* Split Details */}
        {(form.splitType === "unequal" || form.splitType === "percentage") && (
          <div>
            <h3 className="font-semibold mt-4">
              {form.splitType === "unequal"
                ? "Enter individual amounts:"
                : "Enter percentage shares:"}
            </h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {form.participants.map((id) => {
                const u = members.find((x) => x._id === id);
                return (
                  <div key={id} className="flex items-center gap-2">
                    <label className="w-1/2">{u?.name}</label>
                    <input
                      type="number"
                      className="border p-1 rounded w-1/2"
                      onChange={(e) =>
                        handleSplitDetailChange(
                          id,
                          e.target.value || 0
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
