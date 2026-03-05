import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";

const UserProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // We wrap fetchProfile in useCallback to ensure it's stable
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://lexiverse-backend.onrender.com/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      );

      const userData = res.data;
      if (userData.date_of_birth) {
        userData.date_of_birth = new Date(userData.date_of_birth)
          .toISOString()
          .split("T")[0];
      }
      setProfile(userData);
    } catch (error) {
      toast.error("Failed to fetch profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://lexiverse-backend.onrender.com/api/users/me",
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex bg-[#F9FAFB] h-screen">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col p-6">
        {" "}
        {/* ↓ Reduced padding */}
        <Header />
        <main className="flex-1 p-4 h-[75vh]">
          <h1 className="text-xl font-semibold text-[#1F2937] mb-4">
            My Profile
          </h1>

          {isLoading ? (
            <p className="text-center text-sm text-gray-500">
              Loading your profile...
            </p>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 max-w-4xl mx-auto flex flex-col max-h-[78vh]">
              {/* Scrollable content */}
              <div className="p-6 overflow-y-auto">
                {/* Profile header */}
                <div className="flex items-center gap-4 border-b pb-4 mb-6">
                  <div className="w-20 h-20 bg-[#1F2937] text-white rounded-full flex items-center justify-center text-3xl font-bold">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {profile.name}
                    </h2>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                  </div>
                </div>

                {/* Profile form */}
                <form
                  id="profile-form"
                  onSubmit={handleSubmit}
                  className="space-y-6 text-sm"
                >
                  {/* Personal Info */}
                  <section>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profile.name || ""}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Father's Name
                        </label>
                        <input
                          type="text"
                          name="father_name"
                          value={profile.father_name || ""}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={profile.date_of_birth || ""}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={profile.gender || ""}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Contact Info */}
                  <section>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">
                      Contact & Identity
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={profile.phone_number || ""}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1">
                          Aadhaar Card Number
                        </label>
                        <input
                          type="text"
                          name="aadhar_number"
                          value={profile.aadhar_number || ""}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div className="col-span-full">
                        <label className="block text-gray-600 mb-1">
                          Full Address
                        </label>
                        <textarea
                          name="address"
                          value={profile.address || ""}
                          onChange={handleChange}
                          rows="3"
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </div>
                  </section>
                </form>
              </div>

              {/* Sticky footer action button */}
              <div className="p-4 border-t mt-auto">
                <div className="text-right">
                  <button
                    type="submit"
                    form="profile-form"
                    disabled={isUpdating}
                    className="py-2 px-6 text-sm bg-[#1F2937] text-white font-semibold rounded-md shadow hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
