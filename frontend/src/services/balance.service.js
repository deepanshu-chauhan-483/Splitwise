// frontend/src/services/balance.service.js
import axios from "../api/axiosConfig";

// 🔹 Get overall balances (all groups combined)
const getOverall = () => axios.get("/balances");

// 🔹 Get balances for a specific group
const getGroupBalances = (groupId) => axios.get(`/balances/group/${groupId}`);

// 🔹 Get suggested settlements for a group (from optimizer)
const getGroupSettlements = (groupId) => axios.get(`/settlements/group/${groupId}`);

// 🔹 Record a manual settlement (mark as settled)
const recordSettlement = (payload) => axios.post(`/settlements/record`, payload);

export default {
  getOverall,
  getGroupBalances,
  getGroupSettlements,
  recordSettlement,
};
