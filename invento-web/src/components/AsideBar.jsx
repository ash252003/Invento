import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  BadgeIndianRupee,
  NotepadText,
  X,
  LogOut,
} from "lucide-react";
import Logo from "../assets/Final Logo.png";

export default function AsideBar({ isOpen, closeSidebar, active }) {
  const activeClass = "bg-blue-100 text-blue-700 shadow-md font-semibold";
  const normalClass = "hover:bg-gray-200 hover:shadow-lg";
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div
      className={`fixed top-0 left-0 w-72 h-screen bg-gray-50 shadow-xl transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-72"
      }`}
    >
      <aside className="h-full p-3 flex flex-col justify-between">
        <div>
          <div className="w-full flex justify-end items-center">
            <X
              className="hover:bg-gray-200 rounded-md hover:shadow-lg cursor-pointer"
              onClick={closeSidebar}
            />
          </div>
          <div className="w-full flex justify-center items-center mt-2 mb-4">
            <img className="w-25" src={Logo} alt="" />
          </div>
          <hr className="mb-4 border-b-gray-100" />
          <div
            className={`w-full flex justify-center items-center rounded-xl p-3 hover:duration-100 transform hover:-translate-y-0.5 ${
              active == "manage" ? activeClass : normalClass
            }`}
          >
            <Link className="flex w-full" to="/ManageProducts">
              <ShoppingBag className="mr-2.5" />
              <h1> Manage Products</h1>
            </Link>
          </div>
          <div
            className={`w-full mt-3 flex justify-center items-center rounded-xl p-3 hover:duration-100 transform hover:-translate-y-0.5 ${
              active == "billing" ? activeClass : normalClass
            }`}
          >
            <Link className="flex w-full" to="/Billing">
              <NotepadText className="mr-2.5" />
              <h1> Billing</h1>
            </Link>
          </div>
          <div
            className={`w-full mt-3 flex justify-center items-center rounded-xl p-3 hover:duration-100 transform hover:-translate-y-0.5 ${
              active == "sales" ? activeClass : normalClass
            }`}
          >
            <Link className="flex w-full" to="/Sales">
              <BadgeIndianRupee className="mr-2.5" />
              <h1> Sales Report</h1>
            </Link>
          </div>
        </div>
        <div>
          <div className="w-full mt-3 flex justify-center items-center rounded-xl p-3 hover:duration-100 transform hover:-translate-y-0.5 text-red-600 hover:bg-gray-200 hover:shadow-lg">
            <Link className="flex w-full" to="/">
              <LogOut className="mr-2.5" />
              <h1 onClick={handleLogout}> Logout</h1>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
