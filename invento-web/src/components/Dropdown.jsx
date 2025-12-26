import React from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Dropdown({ isOpen }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  if (!isOpen) return null;
  return (
    <>
      <div
        className="absolute right-full mr-2 top-1/2 -translate-y-1/2
                    w-28 rounded-xl bg-gray-50 shadow-lg border z-50"
        onClick={handleLogout}
      >
        <div className="px-4 py-2 cursor-pointer text-red-600">Logout</div>
      </div>
    </>
  );
}
