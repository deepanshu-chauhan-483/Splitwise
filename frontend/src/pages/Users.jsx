import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import userService from "../services/user.service";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userService.getAllUsers().then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
      <Navbar />

      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          All Users
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((u) => {
            const baseUrl = import.meta.env.VITE_API_BASE_URL
              ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
              : "";
            return (
              <div
                key={u._id}
                className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center space-y-3 transition-transform transform hover:-translate-y-1 hover:shadow-2xl"
              >
                <img
                  src={
                    u.avatarUrl
                      ? `${baseUrl}${u.avatarUrl}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          u.name
                        )}&background=random`
                  }
                  alt={u.name}
                  className="w-20 h-20 rounded-full border-2 border-blue-400 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">{u.name}</h3>
                <p className="text-gray-500 text-sm truncate">{u.email}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
