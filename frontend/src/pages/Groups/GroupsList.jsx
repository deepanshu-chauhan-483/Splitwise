import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../store/slices/groupsSlice";
import GroupCard from "../../components/groups/GroupCard";
import { Link } from "react-router-dom";

export default function GroupsList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.groups);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Groups</h2>
        <Link
          to="/groups/add"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Group
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p>No groups yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {list.map((g) => (
            <GroupCard key={g._id} group={g} />
          ))}
        </div>
      )}
    </div>
  );
}
