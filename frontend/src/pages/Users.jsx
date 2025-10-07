import React, { useEffect, useState } from "react";
import userService from "../services/user.service";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userService.getAllUsers().then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center space-y-2"
          >
            <img
              src={
                u.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  u.name
                )}&background=random`
              }
              alt={u.name}
              className="w-16 h-16 rounded-full"
            />
            <h3 className="font-semibold">{u.name}</h3>
            <p className="text-gray-500 text-sm">{u.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
