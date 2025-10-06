import axios from '../api/axiosConfig';

const signup = (data) => axios.post('/auth/signup', data);
const login = (data) => axios.post('/auth/login', data);
const getMe = () => axios.get('/auth/me');

export default { signup, login, getMe };
