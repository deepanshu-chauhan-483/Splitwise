import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Welcome, {user?.name || 'User'}</h2>
          <button onClick={() => dispatch(logout())} className="text-sm text-red-600">Logout</button>
        </div>
        <p className="text-sm">Email: {user?.email}</p>
        <p className="text-sm mt-2">This is a placeholder dashboard — auth is working if you see your name above.</p>
      </div>
    </div>
  );
}
