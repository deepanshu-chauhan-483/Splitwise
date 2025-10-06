import axios from "../api/axiosConfig";

const createExpense = (data) => axios.post("/expenses", data);
const getAllExpenses = () => axios.get("/expenses");
const getExpenseById = (id) => axios.get(`/expenses/${id}`);
const deleteExpense = (id) => axios.delete(`/expenses/${id}`);

export default { createExpense, getAllExpenses, getExpenseById, deleteExpense };
