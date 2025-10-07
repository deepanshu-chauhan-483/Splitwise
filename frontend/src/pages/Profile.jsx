import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { user } = useSelector((s) => s.auth);

  if (!user)
    return (
      <div className="p-8 text-center text-gray-600">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-md text-center">
      <img
        src={
          user.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name
          )}&background=random`
        }
        alt={user.name}
        className="w-24 h-24 mx-auto rounded-full border-2 border-blue-500"
      />
      <h2 className="text-xl font-bold mt-4">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
      <hr className="my-4" />
      <div className="space-y-1 text-sm text-gray-700">
        <p>
          <strong>User ID:</strong> {user.id || user._id}
        </p>
        <p>
          <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
