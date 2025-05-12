import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [username, setUsername] = useState("User");
  const [email, setEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUsername(storedUser.name || "User");
      setEmail(storedUser.email || "");
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-full h-20 bg-[#F9FAFB] px-6 flex items-center justify-between border-b border-gray-200 shadow-sm relative">
      {/* Welcome Message */}
      <div className="text-xl font-semibold text-[#1F2937] tracking-wide">
        Welcome back, <span className="text-[#FBBF24]">{username}</span>
      </div>

      {/* Right-side Icons */}
      <div className="flex items-center gap-6 text-[#1F2937]">
        {/* Notification */}
        <button className="relative hover:text-[#FBBF24] transition">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-2 bg-[#FBBF24] w-2 h-2 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="hover:text-[#FBBF24] transition">
          <FaCog size={20} />
        </button>

        {/* Profile Avatar */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 bg-[#1F2937] text-white rounded-full flex items-center justify-center font-semibold text-md shadow-md hover:scale-105 transition cursor-pointer"
          >
            {username.split(" ")[0][0]}
            {username.split(" ")[1]?.[0] || ""}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-xl shadow-lg w-64 py-4 px-5 z-50">
              <div className="mb-3">
                <p className="font-semibold text-lg text-[#1F2937]">{username}</p>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
              <hr className="my-2" />
              <button
                className="w-full text-left py-2 px-3 rounded hover:bg-gray-100 transition text-sm text-[#1F2937]"
                onClick={() => alert("Settings - coming soon")}
              >
                ⚙️ Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-3 mt-2 rounded hover:bg-red-100 transition text-sm text-red-600 font-medium"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
