// frontend/src/services/user.service.js
import axios from "../api/axiosConfig";

const getAllUsers = () => axios.get("/users");
const getUserById = (id) => axios.get(`/users/${id}`);

export default { getAllUsers, getUserById };
