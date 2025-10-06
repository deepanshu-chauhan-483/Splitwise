import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector(state => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && <div className="text-red-600 mb-4">{typeof error === 'string' ? error : (error.message || JSON.stringify(error))}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full px-4 py-2 border rounded" />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required className="w-full px-4 py-2 border rounded" />
          <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded">{loading ? 'Logging in...' : 'Login'}</button>
        </form>

        <p className="mt-4 text-sm">Don't have an account? <Link to="/auth/signup" className="text-blue-600">Sign up</Link></p>
      </div>
    </div>
  );
}
