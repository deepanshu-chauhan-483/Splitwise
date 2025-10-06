import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import groupService from "../../services/group.service";

export default function GroupDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    groupService.getGroupById(id).then((res) => setGroup(res.data));
  }, [id]);

  const handleAddMember = async () => {
    const res = await groupService.addMember({ groupId: id, email });
    setGroup(res.data);
    setEmail("");
  };

  if (!group) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-bold">{group.name}</h2>
        <p className="text-gray-600">{group.description}</p>
        <h3 className="font-semibold mt-4 mb-2">Members:</h3>
        <ul className="list-disc ml-5 space-y-1 text-gray-700">
          {group.members.map((m) => (
            <li key={m._id}>{m.name} ({m.email})</li>
          ))}
        </ul>

        <div className="mt-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email to add"
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddMember}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}
