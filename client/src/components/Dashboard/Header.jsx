import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaCog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Header = () => {
  const [user, setUser] = useState(null); // Initialize user as null
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const userRes = await axios.get('http://localhost:5050/api/users/me', config);
          setUser(userRes.data);
          const countRes = await axios.get('http://localhost:5050/api/notifications/unread-count', config);
          setUnreadCount(countRes.data.count);
        } catch (error) {
          console.error("Failed to fetch header data.");
        }
      }
    };

    fetchData();
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    setShowDropdown(false);

    if (newState && unreadCount > 0) {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const res = await axios.get('http://localhost:5050/api/notifications', config);
        setNotifications(res.data);
        await axios.put('http://localhost:5050/api/notifications/mark-read', {}, config);
        setUnreadCount(0);
      } catch (error) {
        console.error("Failed to fetch notifications");
      }
    } else if (newState) {
        // Fetch notifications even if count is 0
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const res = await axios.get('http://localhost:5050/api/notifications', config);
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getUserInitials = () => {
    if (user && user.name) {
      const nameParts = user.name.split(" ");
      const firstInitial = nameParts[0][0];
      const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }
    return "U";
  };

  return (
    <div className="w-full h-20 bg-white px-6 flex items-center justify-between border-b border-gray-200 shadow-sm">
      {/* Welcome Message with safety check */}
      <div className="text-xl font-semibold text-[#1F2937]">
        Welcome back, <span className="text-[#FBBF24]">{user?.name || 'User'}</span>
      </div>

      {/* Right-side Icons container with ref for closing dropdowns */}
      <div ref={dropdownRef} className="flex items-center gap-6 text-[#1F2937]">
        {/* Notification Bell */}
        <div className="relative">
          <button onClick={handleBellClick} className="relative hover:text-[#FBBF24] transition">
            <FaBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white">{unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-xl w-80 z-50">
              <div className="p-3 font-bold border-b">Notifications</div>
              {notifications.length > 0 ? (
                notifications.map(notif => (
                  <Link to={notif.link || '#'} key={notif.id} onClick={() => setShowNotifications(false)} className={`block p-3 border-b hover:bg-gray-50 ${!notif.is_read ? 'bg-blue-50' : ''}`}>
                    <p className="text-sm text-gray-800">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                  </Link>
                ))
              ) : <p className="p-4 text-sm text-gray-500">No new notifications.</p>}
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button className="hover:text-[#FBBF24] transition">
          <FaCog size={20} />
        </button>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <div
            onClick={() => {
                setShowDropdown(!showDropdown);
                setShowNotifications(false);
            }}
            className="w-10 h-10 bg-[#1F2937] text-white rounded-full flex items-center justify-center font-semibold text-md shadow-md hover:scale-105 transition cursor-pointer"
          >
            {getUserInitials()}
          </div>
          {showDropdown && (
            <div className="absolute right-0 top-14 bg-white border rounded-xl shadow-lg w-64 py-4 px-5 z-50">
              <div className="mb-3">
                {/* Correctly display user data */}
                <p className="font-semibold text-lg text-[#1F2937]">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <hr className="my-2" />
              <button
                className="w-full text-left py-2 px-3 rounded hover:bg-gray-100 transition"
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