// src/components/FileCase/steps/Step1UserInfo.jsx
import { useEffect, useState } from "react";

const Step1UserInfo = ({ data, update, onNext }) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    // Prefill from localStorage if available
    const storedUser = JSON.parse(localStorage.getItem("lexiverse_user")) || {};
    setUserInfo({
      name: storedUser.name || data.name || "",
      email: storedUser.email || data.email || "",
      phone: storedUser.phone || data.phone || "",
    });
  }, []);

  const handleChange = (e) => {
    setUserInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    update(userInfo);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm mb-1 text-yellow-400">Full Name</label>
        <input
          type="text"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-yellow-400">Email</label>
        <input
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-yellow-400">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={userInfo.phone}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div className="text-right">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1UserInfo;
