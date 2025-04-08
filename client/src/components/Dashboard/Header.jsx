// Header.jsx
import React from "react";
import { FaBell, FaCog } from "react-icons/fa";

const Header = ({ username = "Adv. John Doe" }) => {
  return (
    <div className="w-full h-20 bg-[#F9FAFB] px-6 flex items-center justify-between border-b border-gray-200 shadow-sm ml-64">
      {/* Welcome Message */}
      <div className="text-xl font-semibold text-[#1F2937] tracking-wide">
        Welcome back, <span className="text-[#FBBF24]">{username}</span>
      </div>

      {/* Right-side Icons */}
      <div className="flex items-center gap-6 text-[#1F2937]">
        {/* Notification Icon */}
        <button className="relative hover:text-[#FBBF24] transition">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-2 bg-[#FBBF24] w-2 h-2 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="hover:text-[#FBBF24] transition">
          <FaCog size={20} />
        </button>

        {/* Profile Avatar */}
        <div className="w-10 h-10 bg-[#1F2937] text-white rounded-full flex items-center justify-center font-semibold text-md shadow-md hover:scale-105 transition">
          JD
        </div>
      </div>
    </div>
  );
};

export default Header;
