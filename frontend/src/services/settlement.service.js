import axios from "../api/axiosConfig";

const suggestForGroup = (groupId) => axios.get(`/settlements/group/${groupId}`);
const record = (data) => axios.post(`/settlements/record`, data);

export default { suggestForGroup, record };
