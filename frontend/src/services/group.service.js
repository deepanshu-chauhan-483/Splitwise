import axios from "../api/axiosConfig";

const createGroup = (data) => axios.post("/groups", data);
const getMyGroups = () => axios.get("/groups");
const getGroupById = (id) => axios.get(`/groups/${id}`);
const addMember = (data) => axios.post("/groups/add-member", data);

export default { createGroup, getMyGroups, getGroupById, addMember };
