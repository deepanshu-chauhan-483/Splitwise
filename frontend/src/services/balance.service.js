import axios from "../api/axiosConfig";

const getOverall = () => axios.get("/balances");
const getGroup = (groupId) => axios.get(`/balances/group/${groupId}`);
const getGroupBalances = (groupId) => axios.get(`/balances/group/${groupId}`);

export default { getOverall, getGroup ,getGroupBalances};
