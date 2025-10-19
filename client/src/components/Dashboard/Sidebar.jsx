// Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  FaGavel,
  FaFileAlt,
  FaBrain,
  FaRobot,
  FaChartPie,
  FaUserCog,
  FaSearch,
  FaHome,
} from "react-icons/fa";
import { GoLaw } from "react-icons/go";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, route: "/dashboard" },
  { name: "My Cases", icon: <FaGavel />, route: "/cases" },
  { name: "Find a Lawyer", icon: <FaSearch />, route: "/find-lawyer" }, // 👈 ADD THIS LINE
  { name: "Profile", icon: <FaUserCog />, route: "/profile" },
  { name: "Documents", icon: <FaFileAlt />, route: "/documents" },
  { name: "Research", icon: <FaBrain />, route: "/research" },
  { name: "AI Drafting", icon: <FaRobot />, route: "/drafting" },
  { name: "Analytics", icon: <FaChartPie />, route: "/analytics" },
];

const Sidebar = () => {
  return (
    <div className="w-64 py-6 px-2 h-screen bg-[#1F2937] text-white shadow-xl flex flex-col fixed top-0 left-0 z-50 border-r border-gray-700">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 text-[#FBBF24] text-xl m-5 font-serif font-semibold tracking-wide select-none">
        <GoLaw className="text-3xl" />
        <span>LexiVerse</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.route}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-lg mb-2 transition-all duration-200 ${
                isActive
                  ? "bg-[#FBBF24] text-black font-semibold"
                  : "hover:bg-[#374151] text-gray-300"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="text-sm text-gray-400 text-center mb-4 px-4">
        © {new Date().getFullYear()} LexiVerse
      </div>
    </div>
  );
};

export default Sidebar;
