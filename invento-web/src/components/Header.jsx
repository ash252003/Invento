import React, { useState } from "react";
import logo from "../assets/Final Logo.png";
import { Menu, EllipsisVertical } from "lucide-react";
import Dropdown from "../components/Dropdown";

export default function Header({ openSidebar, isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isAdmin ? (
        <div className="w-full bg-gray-50 h-15 flex items-center relative">
          <div className="w-full mr-5 ml-5 h-10 flex justify-between items-center">
            <img className="w-25" src={logo} alt="Logo" />

            <div className="relative">
              <EllipsisVertical
                className="cursor-pointer"
                onClick={() => setIsOpen(prev => !prev)}
              />
              <Dropdown isOpen={isOpen} />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full bg-gray-50 h-15 flex items-center">
          <div className="w-40 ml-2 h-10 flex justify-around items-center">
            <Menu className="cursor-pointer" onClick={openSidebar} />
            <img className="w-25" src={logo} alt="Logo" />
          </div>
        </div>
      )}
    </>
  );
}
