import React from "react";
import { Link } from "react-router-dom";

export default function GroupCard({ group }) {
  return (
    <Link
      to={`/groups/${group._id}`}
      className="block bg-white p-4 rounded shadow hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-blue-600">{group.name}</h3>
      <p className="text-sm text-gray-600">{group.members.length} members</p>
    </Link>
  );
}
