// frontend/src/services/group.service.js
import axios from "../api/axiosConfig";

const createGroup = (data) => axios.post("/groups", data);
const getMyGroups = () => axios.get("/groups");
const getGroups = getMyGroups; // alias for different call-sites
const getGroupById = (id) => axios.get(`/groups/${id}`);
const addMember = (data) => axios.post("/groups/add-member", data);

export default { createGroup, getMyGroups, getGroups, getGroupById, addMember };
