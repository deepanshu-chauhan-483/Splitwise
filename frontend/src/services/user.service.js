import axios from "../api/axiosConfig";

const getAllUsers = () => axios.get("/users");
const getUserById = (id) => axios.get(`/users/${id}`);
const uploadAvatar = (formData) =>
  axios.post("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default { getAllUsers, getUserById, uploadAvatar };
