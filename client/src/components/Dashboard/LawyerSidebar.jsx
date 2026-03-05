// // client/src/components/Dashboard/LawyerSidebar.jsx
// import React from "react";
// import { NavLink } from "react-router-dom";
// import { FaHome , FaUserTie, FaFolderOpen, FaDollarSign, FaGavel } from "react-icons/fa";

// const menuItems = [
//   { name: "Dashboard", icon: <FaHome />, route: "/lawyer/dashboard" },
//   { name: "My Profile", icon: <FaUserTie />, route: "/lawyer/profile" },
//   { name: "Case Requests", icon: <FaFolderOpen />, route: "/lawyer/requests" },
//   { name: "Active Cases", icon: <FaGavel />, route: "/lawyer/cases" }, // 👈 ADD THIS
//   { name: "Billing", icon: <FaDollarSign />, route: "/lawyer/billing" },
// ];

// const LawyerSidebar = () => {
//   return (
//     <div className="w-64 h-screen bg-[#1F2937] text-white flex flex-col">
//       <div className="flex items-center justify-center h-20 text-2xl font-bold text-[#FBBF24] tracking-wider border-b border-gray-700">
//         LexiVerse
//       </div>
//       <nav className="flex-1 px-4 py-6">
//         {menuItems.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.route}
//             className={({ isActive }) =>
//               `flex items-center gap-4 p-3 rounded-lg mb-2 transition-all duration-200 ${
//                 isActive
//                   ? "bg-[#FBBF24] text-black font-semibold"
//                   // Note: End=true for dashboard to not match all routes
//                   : "hover:bg-[#374151] text-gray-300"
//               }`
//             }
//             end={item.route.endsWith('dashboard')}
//           >
//             <span className="text-lg">{item.icon}</span>
//             <span className="text-md">{item.name}</span>
//           </NavLink>
//         ))}
//       </nav>
//       <div className="text-sm text-gray-400 text-center mb-4 px-4">
//         © {new Date().getFullYear()} LexiVerse for Professionals
//       </div>
//     </div>
//   );
// };

// export default LawyerSidebar;

import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserTie,
  FaFolderOpen,
  FaDollarSign,
  FaGavel,
} from "react-icons/fa";
import { GoLaw } from "react-icons/go";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, route: "/lawyer/dashboard" },
  { name: "My Profile", icon: <FaUserTie />, route: "/lawyer/profile" },
  { name: "Case Requests", icon: <FaFolderOpen />, route: "/lawyer/requests" },
  { name: "Active Cases", icon: <FaGavel />, route: "/lawyer/cases" },
  { name: "Billing", icon: <FaDollarSign />, route: "/lawyer/billing" },
];

const LawyerSidebar = () => {
  return (
    <div className="w-64 py-6 px-2 h-screen bg-[#1F2937] text-white shadow-xl flex flex-col border-r border-gray-700">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 text-[#FBBF24] text-xl m-5 font-serif font-semibold tracking-wide select-none">
        <GoLaw className="text-3xl" />
        <span>LexiVerse</span>
        <hr />
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
            end={item.route.endsWith("dashboard")}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="text-sm text-gray-400 text-center mb-4 px-4">
        © {new Date().getFullYear()} LexiVerse for Professionals
      </div>
    </div>
  );
};

export default LawyerSidebar;
