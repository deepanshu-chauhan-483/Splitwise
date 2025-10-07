// frontend/src/services/expense.service.js
import axios from "../api/axiosConfig";

const createExpense = (data) => axios.post("/expenses", data);
const getAllExpenses = (params) => axios.get("/expenses", { params });
const getExpenseById = (id) => axios.get(`/expenses/${id}`);
const updateExpense = (id, data) => axios.put(`/expenses/${id}`, data);
const deleteExpense = (id) => axios.delete(`/expenses/${id}`);
const getGroupExpenses = (groupId) => axios.get(`/expenses/group/${groupId}`);

export default { createExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense, getGroupExpenses };
