import { React, useState, useEffect } from "react";
import Header from "../components/Header";
import { Users, UserCheck, UserX } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

export default function Dashboard() {
  const [getUsers, setUsers] = useState([]);
  const totalUsers = getUsers.length;
  const activeUsers = activeCount();
  const inactiveUsers = totalUsers - activeCount();

  function Stat({ title, value, icon: Icon, gradient }) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl p-6">
        <div
          className={`absolute inset-0 opacity-10 bg-linear-to-br ${gradient}`}
        />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-4xl font-bold mt-1">{value}</p>
          </div>
          <div
            className={`p-4 rounded-xl text-white bg-linear-to-br ${gradient}`}
          >
            <Icon size={28} />
          </div>
        </div>
      </div>
    );
  }

  function activeCount() {
    return getUsers.filter((users) => users.status === 1).length;
  }

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/getUsers");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleActiveStatus = async (user) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: user.status === 1 ? "Deactivate this user?" : "Activate this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText:
        user.status === 1 ? "Yes, Deactivate" : "Yes, Activate",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/updateUserStatus/${user.id}`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) throw new Error("Failed to update status");
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: u.status === 1 ? 0 : 1 } : u
        )
      );
      fetchUser();
      Swal.fire("Success", "User status updated", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Unable to update status", "error");
    }
  };

  return (
    <div>
      <Header isAdmin={true} />
      <main className="flex-1 px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          <Stat
            title="Total Users"
            value={totalUsers}
            icon={Users}
            gradient="from-indigo-500 to-purple-500"
          />
          <Stat
            title="Active Users"
            value={activeUsers}
            icon={UserCheck}
            gradient="from-emerald-500 to-green-600"
          />
          <Stat
            title="Inactive Users"
            value={inactiveUsers}
            icon={UserX}
            gradient="from-rose-500 to-red-600"
          />
        </div>
        <section className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Registered Shopkeepers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="p-5 text-center">Email</th>
                  <th className="p-5 text-center">Phone</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  getUsers.map((users) => (
                    <tr key={users.id}>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900 text-center">
                        {users.email}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900 text-center">
                        {users.phone}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <span
                          className={`px-6 py-1 rounded-full text-xs font-semibold ${
                            users.status === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {users.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap flex items-center justify-center">
                        <button
                          type="button"
                          className={`flex items-center gap-2 text-white px-2 py-1 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-md cursor-pointer ${
                            users.status === 1
                              ? "bg-linear-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600"
                              : "bg-linear-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600"
                          }`}
                          onClick={() => handleActiveStatus(users)}
                        >
                          {users.status === 1 ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
